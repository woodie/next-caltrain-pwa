#!/usr/bin/env python3

import csv
import json
import os
from collections import OrderedDict



def xstr(s): return s or ''


def main():
    stops = parse_station_data()
    times = parse_web_schedule_data(stops)
    write_schedule_data(times, stops)


def parse_station_data():
    """
    Derive station order + labels directly from data/weekday_{north,south}.csv.
    Those CSVs (produced by generate.py, or hand-maintained) already list every
    station in the canonical physical travel order for each direction, with
    blank cells for stations a given trip doesn't serve - so there's no need
    to fetch GTFS separately just to get the station list.
    """
    _stops = {'north': [], 'south': [], 'labels': {}}
    next_id = 0
    for direction in ['north', 'south']:
        with open('data/weekday_%s.csv' % direction, 'r', encoding=None) as stopsFile:
            stopsReader = csv.reader(stopsFile)
            next(stopsReader, None)  # header row (trip ids)
            for row in stopsReader:
                if not row or not row[0]:
                    continue
                stop_name = row[0]
                if stop_name == 'Shuttle Bus' or stop_name == 'SamTrans Bus Bridge':
                    continue
                stop_id = next_id
                next_id += 1
                _stops['labels'][stop_id] = stop_name
                _stops[direction].append(stop_id)
    return _stops


def parse_web_schedule_data(stops):
    _times = {'weekday': {'north': OrderedDict(), 'south': OrderedDict()},
              'weekend': {'north': OrderedDict(), 'south': OrderedDict()},
              'holiday': {'north': OrderedDict(), 'south': OrderedDict()}}
    for direction in ['north', 'south']:
        for schedule in ['weekday', 'weekend', 'holiday']:
            filename = 'data/%s_%s.csv' % (schedule, direction)
            with open(filename, 'r', encoding=None) as modFile:
                labels = []
                for stop_id in stops[direction]:
                    labels.append(stops['labels'][stop_id])
                modReader = csv.reader(modFile)
                header = next(modReader, None)
                for train in header[1:]:
                    if len(train) < 3:  # ignore missing trains on reduced schedule
                        continue
                    _times[schedule][direction][train] = [
                        None] * len(stops[direction])
                for row in modReader:
                    station = row[0]
                    if station == 'Shuttle Bus' or station == 'SamTrans Bus Bridge':
                        continue
                    station_x = labels.index(station)
                    for i in range(1, len(header)):
                        if len(row) - 1 < i or row[i] == '':
                            continue
                        trip_id = header[i]
                        parts = row[i].split(':')
                        departure = int(parts[0]) * 60 + int(parts[1])
                        _times[schedule][direction][trip_id][station_x] = str(
                            departure)
        modFile.close()
    return _times


def write_schedule_data(times, stops):
    with open('src/@caltrainServiceData.js', 'w') as f:
        f.write("var caltrainServiceData = {\n")
        creation = schedule_date_ms()
        for direction in ['north', 'south']:
            f.write("\n  %sStops: [" % (direction))
            f.write("\n    '")
            labels = []
            for stop_id in stops[direction]:
                labels.append(stops['labels'][stop_id])
            f.write("','".join(labels))
            f.write("'],\n")
            for schedule in ['weekday', 'weekend', 'holiday']:
                comma = ''
                f.write("\n  %s%s: {" % (direction, schedule.capitalize()))
                for trip_id in times[schedule][direction]:
                    f.write('%s\n    %s: [' % (comma, str(trip_id)))
                    f.write(
                        ','.join(map(xstr, times[schedule][direction][trip_id])))
                    f.write(']')
                    comma = ','
                f.write('},\n')
        f.write("\n  scheduleDate: %d\n" % creation)
        f.write('\n};\n')
        f.write('export { caltrainServiceData };\n')


def newest_data_mtime():
    """
    Epoch-ms timestamp of the most recently updated schedule CSV, shown in
    the app as the date the schedule data is "as of". Fallback only - see
    schedule_date_ms() below for the preferred source. This changes on
    every generate.py run regardless of whether the schedule actually
    changed, since generate.py rewrites all six CSVs fresh each time.
    """
    newest = 0
    for schedule in ['weekday', 'weekend', 'holiday']:
        for direction in ['north', 'south']:
            stat = os.stat('data/%s_%s.csv' % (schedule, direction))
            newest = max(newest, stat.st_mtime)
    return int(newest * 1000)


def schedule_date_ms():
    """Preferred source for scheduleDate: Caltrain/Trillium's own GTFS feed
    build timestamp (data/feed_version.json, written by generate.py - see
    its twin function in update_json.py / docs/COWORK.md for why), rather
    than local CSV mtimes that change on every run with no real data change.

    Used to also fold in holiday_*.csv's filesystem mtime, since that file
    is hand-maintained rather than GTFS-derived. Dropped: git checkout/reset
    stamps mtimes with "now" regardless of content, so that fold-in made
    scheduleDate change on every fresh checkout too - the same instability
    this function exists to avoid, just from a different trigger. A
    holiday-only PDF edit (no GTFS feed change) now won't bump scheduleDate
    until the next real feed update; that's an acceptable trade for
    "rerunning/checking out the pipeline with nothing changed never
    produces a diff."

    Falls back fully to newest_data_mtime() if feed_version.json is missing.
    """
    feed_ms = None
    if os.path.exists('data/feed_version.json'):
        try:
            with open('data/feed_version.json') as f:
                feed_ms = json.load(f)['feedVersionMs']
        except Exception as e:
            print('WARNING: could not read data/feed_version.json (%s)' % e)
    if feed_ms is None:
        return newest_data_mtime()
    return feed_ms


if __name__ == "__main__":
    main()
