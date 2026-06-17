#!/usr/bin/env python3
"""
generate.py

Generates schedule CSV files in data/ directly from Caltrain's published
GTFS feed, using the partridge library:
  - weekday_north.csv, weekday_south.csv
  - weekend_north.csv, weekend_south.csv
  - _holiday_north.csv, _holiday_south.csv (shadow files only - see below)

This replaces the manual process of hand-transcribing the weekday/weekend
schedules from Caltrain's website/timetables into those CSVs (see
docs/ROADMAP.md).

holiday_north.csv/holiday_south.csv are NOT written by this script. The
GTFS feed's holiday/modified-schedule service has known discrepancies
against Caltrain's published holiday timetable PDF (see docs/CLAUDE.md), so
those two files remain hand-maintained and authoritative. This script writes
its GTFS-derived holiday output to the underscore-prefixed _holiday_*.csv
files instead, so the two can be diffed and the discrepancy tracked over
time without risking the authoritative files.
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
    col_order, trip_name, time_at = build_columns(feed, service_id, stations, strip_m=strip_m)

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
            if schedule == 'holiday':
                # holiday_north.csv/holiday_south.csv remain hand-maintained and
                # authoritative (see docs/CLAUDE.md); write the GTFS-derived
                # version to a shadow file instead, for ongoing comparison.
                path = 'data/_holiday_%s.csv' % direction
            else:
                path = 'data/%s_%s.csv' % (schedule, direction)
            write_csv(path, rows)
            print('wrote', path)


if __name__ == '__main__':
    main()
