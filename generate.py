#!/usr/bin/env python3
"""
generate.py

Generates schedule CSV files in data/ directly from Caltrain's published
GTFS feed, using the partridge library:
  - weekday_north.csv, weekday_south.csv
  - weekend_north.csv, weekend_south.csv
  - _holiday_north.csv, _holiday_south.csv

This replaces the manual process of hand-transcribing these schedules from
Caltrain's website/timetables into CSVs (see docs/ROADMAP.md) - except where
GTFS doesn't match Caltrain's own published PDF timetable closely enough to
trust. Policy: GTFS is the source of truth by default, but if the generated
schedule for a service doesn't match the published PDF, write it to an
underscore-prefixed shadow file instead of the canonical name. That (1)
keeps a visibly-wrong file from silently shipping and (2) gives us a
GTFS-vs-PDF diff to use when reporting the discrepancy to Caltrain.

holiday is currently the one case where this applies: weekday_*.csv and
weekend_*.csv are written straight from GTFS (verified against
media/36422 and media/36421 - see the CAUTION note below). holiday_*.csv
remains hand-maintained from Caltrain's Modified Schedule PDF (media/36013)
because GTFS disagrees with it on several specific trips - see
docs/HOLIDAY.md. This script writes GTFS's holiday output to
_holiday_north.csv/_holiday_south.csv (not the canonical holiday_*.csv
names) purely as a comparison/diagnostic artifact: re-diff it against the
hand-maintained holiday_*.csv whenever the GTFS feed changes, to see if
Caltrain has fixed the underlying data yet.

CAUTION - lesson learned 2026-06-18, do not repeat this mistake:
A previous version of this script (2026-06-17 to 2026-06-18) included a
resolve_branch_filter() function that dropped the stop_times row at Tamien
from ordinary Local trips that never run the South County Connector branch.
The reasoning was that this row looked synthetic: it was always
stop_sequence 1, always exactly 6 minutes before San Jose Diridon, and
Tamien was otherwise served by a small minority of same-direction trips
(~44-45%, versus ~98-100% for a real shared hub like San Jose Diridon).
That pattern is real, but the conclusion drawn from it was wrong - it was
never checked against what Caltrain actually publishes.

When it finally was checked against Caltrain's current, officially
published weekday and weekend timetable PDFs (caltrain.com/media/36422 and
/36421), every single one of those "spurious" Tamien times for ordinary
Local trips turned out to be a genuine, scheduled stop - i.e. some Local
trains really do originate/terminate at Tamien, one stop south of San Jose
Diridon. The filter had been silently deleting real schedule data from
weekday_*.csv and weekend_*.csv. It has been removed (see git history for
resolve_branch_filter() if you need to look at it again).

The takeaway: an internally-consistent statistical pattern in GTFS data
(uniform offsets, low coverage fraction, etc.) is not, by itself, evidence
that a row is a bug or a "phantom" marker. Caltrain's own published
timetable is the ground truth - check it first, for every schedule type
this might affect (weekday/weekend/holiday can legitimately differ from
each other), before writing code that discards GTFS rows as synthetic.

For the curious: cross-checking the *holiday/modified-schedule* GTFS the
same way against Caltrain's Modified Schedule PDF (media/36013) suggests
the Tamien rows attached to ordinary Local trips there genuinely are absent
from the published PDF (unlike weekday/weekend) - i.e. there's a real,
holiday-specific GTFS data problem (one of several - see docs/HOLIDAY.md).
We are NOT writing a code-level filter to patch GTFS's holiday output (same
reasoning as above - we're not confident enough to guess at the fix); we're
using the _holiday_*.csv shadow-file mechanism described up top instead,
which is a data-flagging convention, not a heuristic that touches the data.
"""

import csv
import functools
import os
import subprocess

import partridge as ptg


GTFS_SOURCE = 'http://data.trilliumtransit.com/gtfs/caltrain-ca-us/caltrain-ca-us.zip'

# calendar_dates-only services with at least this many trips are treated as
# the holiday/modified schedule. This excludes one-off single-trip overlays
# (e.g. World Cup specials) that also show up as calendar_dates-only.
HOLIDAY_MIN_TRIPS = 10


def fetch_gtfs():
    """Download and expand the GTFS feed (mirrors update_pwa.py's old fetch_schedule_data())."""
    basedir = os.getcwd()
    subprocess.call(['mkdir', '-p', 'downloads'])
    os.chdir('downloads')
    subprocess.call(['rm', '-f', 'CT-GTFS.zip'])
    subprocess.call(['curl', '-o', 'CT-GTFS.zip', GTFS_SOURCE])
    os.chdir(basedir)
    subprocess.call(['mkdir', '-p', 'CT-GTFS'])
    os.chdir('CT-GTFS')
    subprocess.call(['unzip', '-o', '-j', '../downloads/CT-GTFS.zip'])
    os.chdir(basedir)


def station_lists(feed):
    """Build station lists/labels (mirrors update_pwa.py's old parse_station_data())."""
    extra = ['Caltrain', 'Station']
    north, south, labels = [], [], {}
    for _, row in feed.stops.iterrows():
        raw_id = row['stop_id']
        if not str(raw_id).isdigit():
            continue  # skip malformed stops
        stop_id = int(raw_id)
        if stop_id > 70400:
            continue  # skip fake stops
        stop_name = ' '.join(w for w in row['stop_name'].split() if w not in extra)
        stop_name = stop_name.replace('South San', 'So San')
        stop_name = stop_name.replace('Avenue', 'Ave')
        if stop_name == 'Atherton':
            continue  # should be dropped from GTFS
        stop_name = stop_name.replace(' Northbound', '')
        stop_name = stop_name.replace(' Southbound', '')
        labels[stop_id] = stop_name
        if stop_id % 2 == 1:
            north.insert(0, stop_id)
        else:
            south.append(stop_id)
    return {'north': north, 'south': south, 'labels': labels}


def fmt_time(seconds):
    """Format seconds-since-midnight as H:MM:00, matching the hand-maintained CSVs."""
    seconds = int(seconds)
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    return '%d:%02d:00' % (hours, minutes)


def resolve_service_ids(feed):
    """Resolve weekday/weekend/holiday service_ids generically (no hardcoded literals)."""
    weekday_id = None
    weekend_id = None
    for _, row in feed.calendar.iterrows():
        if int(row['monday']) == 1:
            weekday_id = row['service_id']
        elif int(row['saturday']) == 1:
            weekend_id = row['service_id']

    calendar_ids = set(feed.calendar['service_id'])
    trip_counts = feed.trips.groupby('service_id').size()
    holiday_id = None
    for service_id, count in trip_counts.items():
        if service_id in calendar_ids:
            continue  # already a regular weekday/weekend service
        if count >= HOLIDAY_MIN_TRIPS:
            holiday_id = service_id
            break

    return weekday_id, weekend_id, holiday_id


def build_columns(feed, service_id, stations, strip_m=False):
    """
    Compute, for one service and one direction's station list:
      - col_order: trip_ids in the correct left-to-right column order
      - trip_name: trip_id -> column header label
      - time_at: trip_id -> {stop_id: departure_time_in_seconds}

    Column order is determined by a pairwise comparator: walk the canonical
    station list (in physical travel order) and, at the first station both
    trips actually serve, compare their times there (earlier wins). If two
    trips never share a station, fall back to comparing trip numbers. This
    correctly handles both ordinary express/local overtakes (compared at
    their shared origin) and South County "connector" trips that only serve
    a partial segment of the route (compared at whichever station they
    first share with the other trip, not a single fixed anchor).

    Note: this used to also drop stop_times rows at Tamien for trips not on
    the South County Connector route, on the theory that those rows were a
    synthetic "transfer marker" rather than a real stop. That turned out to
    be wrong - see the module docstring above - so every stop_times row the
    feed provides is kept here, unfiltered.
    """
    stop_ids = set(stations)
    trips = feed.trips[feed.trips['service_id'] == service_id]

    trip_name = {}
    for _, row in trips.iterrows():
        name = str(row['trip_short_name'])
        if strip_m and name.startswith('M'):
            name = name[1:]
        trip_name[row['trip_id']] = name

    stf = feed.stop_times[feed.stop_times['trip_id'].isin(trip_name.keys())].copy()
    stf['stop_id'] = stf['stop_id'].astype(int)
    stf = stf[stf['stop_id'].isin(stop_ids)]

    keep_tids = list(stf['trip_id'].unique())

    time_at = {tid: {} for tid in keep_tids}
    for _, row in stf.iterrows():
        time_at[row['trip_id']][row['stop_id']] = row['departure_time']

    def first_common_times(a, b):
        ta, tb = time_at[a], time_at[b]
        for sid in stations:
            if sid in ta and sid in tb:
                return ta[sid], tb[sid]
        return None

    def cmp_trips(a, b):
        common = first_common_times(a, b)
        if common is not None:
            ta, tb = common
            if ta != tb:
                return -1 if ta < tb else 1
        na, nb = trip_name[a], trip_name[b]
        try:
            return (int(na) > int(nb)) - (int(na) < int(nb))
        except ValueError:
            return (na > nb) - (na < nb)

    col_order = sorted(keep_tids, key=functools.cmp_to_key(cmp_trips))
    return col_order, trip_name, time_at


def build_csv_rows(feed, service_id, direction, stations, labels, strip_m=False):
    """Build the full row matrix (header + one row per station) for one service/direction."""
    col_order, trip_name, time_at = build_columns(
        feed, service_id, stations, strip_m=strip_m)

    rows = [[''] + [trip_name[tid] for tid in col_order]]
    for sid in stations:
        row = [labels[sid]]
        for tid in col_order:
            t = time_at[tid].get(sid)
            row.append(fmt_time(t) if t is not None else '')
        rows.append(row)
    return rows


def write_csv(path, rows):
    with open(path, 'w', newline='') as f:
        w = csv.writer(f, lineterminator='\n')
        for row in rows:
            w.writerow(row)


def main():
    fetch_gtfs()
    feed = ptg.load_feed('CT-GTFS')
    stations = station_lists(feed)
    weekday_id, weekend_id, holiday_id = resolve_service_ids(feed)

    jobs = [
        ('weekday', weekday_id, False),
        ('weekend', weekend_id, False),
        ('holiday', holiday_id, True),
    ]

    for schedule, service_id, strip_m in jobs:
        if service_id is None:
            print('WARNING: could not resolve service_id for %s; skipping' % schedule)
            continue
        for direction in ['north', 'south']:
            rows = build_csv_rows(
                feed, service_id, direction,
                stations[direction], stations['labels'], strip_m=strip_m)
            # holiday_*.csv is hand-maintained from Caltrain's published PDF
            # (see docs/HOLIDAY.md for why GTFS isn't trusted outright here);
            # write GTFS's version to the underscore-prefixed shadow name so
            # it doesn't overwrite the canonical file, but is still around
            # to diff against next time the feed changes. See the policy
            # note in this module's docstring.
            if schedule == 'holiday':
                path = 'data/_holiday_%s.csv' % direction
            else:
                path = 'data/%s_%s.csv' % (schedule, direction)
            write_csv(path, rows)
            print('wrote', path)


if __name__ == '__main__':
    main()
