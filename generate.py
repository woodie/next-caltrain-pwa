#!/usr/bin/env python3
"""
generate.py

Generates schedule CSV files in data/ directly from Caltrain's published
GTFS feed, using the partridge library:
  - weekday_north.csv, weekday_south.csv
  - weekend_north.csv, weekend_south.csv
  - holiday_north.csv, holiday_south.csv

This replaces the manual process of hand-transcribing these schedules from
Caltrain's website/timetables into CSVs (see docs/ROADMAP.md). holiday_*.csv
was hand-maintained from Caltrain's published holiday timetable PDF until
2026-06; GTFS's holiday/modified-schedule service had a confirmed data
problem (a spurious stop_times row at Tamien on Local trips - see below)
that's now filtered out here, so this script writes holiday_*.csv directly
like the other schedules. A handful of remaining GTFS-vs-PDF discrepancies
(wrong dates/times on specific trips) are tracked in docs/HOLIDAY.md for
reporting to Caltrain, rather than blocking on hand-maintaining the CSVs.

The feed also attaches a stop_times.txt row at Tamien to many ordinary
Local trips that never run the South County branch - this represents a
real, Caltrain-surfaced rider transfer (get off one train, get onto
another), not an actual stop on those trips. Since this app only shows
departure times and not transfer/connection detail, build_columns() drops
those rows; see resolve_branch_filter().
"""

import csv
import functools
import os
import subprocess
from collections import Counter, defaultdict

import partridge as ptg


GTFS_SOURCE = 'http://data.trilliumtransit.com/gtfs/caltrain-ca-us/caltrain-ca-us.zip'

# calendar_dates-only services with at least this many trips are treated as
# the holiday/modified schedule. This excludes one-off single-trip overlays
# (e.g. World Cup specials) that also show up as calendar_dates-only.
HOLIDAY_MIN_TRIPS = 10

# A station the Connector route serves is treated as a major shared hub
# (exempt from the South County branch filter below) if more than this
# fraction of same-direction non-Connector trips also stop there. San Jose
# Diridon, where the Connector route ends, is served by ~98-100% of
# same-direction trips; Tamien - the one branch station that's NOT
# exclusive to the Connector route - by ~44-45%. (Comparing against
# same-direction trips, rather than all trips in the feed, matters because
# each physical platform's stop_id is direction-specific.)
HUB_STOP_THRESHOLD = 0.5


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


def resolve_branch_filter(feed):
    """
    Resolve which trips are genuine South County Connector workings, and
    which stations should only ever show a stop for those trips.

    The Connector route is the only one that physically runs the Gilroy -
    San Martin - Morgan Hill - Blossom Hill - Capitol - Tamien branch.
    Caltrain's GTFS feed also attaches a stop_times.txt row at Tamien to
    many ordinary Local trips that never run the branch - this represents
    the scheduled VTA/walk transfer connection at Tamien (riders do get off
    one train and onto another there), not an actual stop on those trips'
    own pattern, and no field distinguishes it from a real stop.

    We filter it out generically rather than hardcoding Tamien's stop_id:
    any station the Connector route serves that ISN'T also a major shared
    hub most same-direction trips in the feed stop at (e.g. San Jose
    Diridon, where the Connector terminates) should only appear on
    Connector trips themselves. Concretely, of the Connector's own stops,
    the ones serving at most HUB_STOP_THRESHOLD of same-direction
    non-Connector trips are branch-only; trips not on the Connector route
    get those stop_times rows dropped (see build_columns).
    """
    route_id = None
    for _, row in feed.routes.iterrows():
        desc = '%s %s' % (row.get('route_desc', ''), row.get('route_short_name', ''))
        if 'south county' in desc.lower():
            route_id = row['route_id']
            break
    if route_id is None:
        return frozenset(), frozenset()

    trip_route = dict(zip(feed.trips['trip_id'], feed.trips['route_id']))
    trip_dir = dict(zip(feed.trips['trip_id'], feed.trips['direction_id']))
    branch_trip_ids = {tid for tid, rid in trip_route.items() if rid == route_id}

    non_connector_dir_counts = Counter(
        trip_dir[tid] for tid, rid in trip_route.items() if rid != route_id)

    branch_stop_ids = set()
    nonconnector_stop_dirs = defaultdict(Counter)
    nonconnector_stop_trips = defaultdict(set)
    for trip_id, stop_id in zip(feed.stop_times['trip_id'], feed.stop_times['stop_id']):
        sid = int(stop_id)
        if trip_id in branch_trip_ids:
            branch_stop_ids.add(sid)
        else:
            nonconnector_stop_dirs[sid][trip_dir[trip_id]] += 1
            nonconnector_stop_trips[sid].add(trip_id)

    branch_only_stop_ids = set()
    for sid in branch_stop_ids:
        dirs = nonconnector_stop_dirs.get(sid)
        if not dirs:
            branch_only_stop_ids.add(sid)  # no non-Connector trip ever touches it
            continue
        majority_dir = dirs.most_common(1)[0][0]
        denom = non_connector_dir_counts.get(majority_dir, 0)
        frac = (len(nonconnector_stop_trips[sid]) / denom) if denom else 0
        if frac <= HUB_STOP_THRESHOLD:
            branch_only_stop_ids.add(sid)

    return frozenset(branch_trip_ids), frozenset(branch_only_stop_ids)


def build_columns(feed, service_id, stations, strip_m=False,
                   branch_trip_ids=frozenset(), branch_only_stop_ids=frozenset()):
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

    branch_trip_ids/branch_only_stop_ids (see resolve_branch_filter) drop
    the synthetic Tamien-transfer stop_times row that the feed attaches to
    non-Connector trips, so it doesn't show up as a fake stop.
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

    if branch_only_stop_ids:
        is_branch_only_stop = stf['stop_id'].isin(branch_only_stop_ids)
        is_branch_trip = stf['trip_id'].isin(branch_trip_ids)
        stf = stf[~is_branch_only_stop | is_branch_trip]

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


def build_csv_rows(feed, service_id, direction, stations, labels, strip_m=False,
                    branch_trip_ids=frozenset(), branch_only_stop_ids=frozenset()):
    """Build the full row matrix (header + one row per station) for one service/direction."""
    col_order, trip_name, time_at = build_columns(
        feed, service_id, stations, strip_m=strip_m,
        branch_trip_ids=branch_trip_ids, branch_only_stop_ids=branch_only_stop_ids)

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
    branch_trip_ids, branch_only_stop_ids = resolve_branch_filter(feed)

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
                stations[direction], stations['labels'], strip_m=strip_m,
                branch_trip_ids=branch_trip_ids, branch_only_stop_ids=branch_only_stop_ids)
            path = 'data/%s_%s.csv' % (schedule, direction)
            write_csv(path, rows)
            print('wrote', path)


if __name__ == '__main__':
    main()
