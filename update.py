#!/usr/bin/env python3

import csv
import os
import time
import subprocess
from collections import OrderedDict

saturday_trip_ids = [421,480,481,484] # Saturday Only

xstr = lambda s: s or ''

def main():
  fetch_schedule_data()
  stops = parse_station_data()
  #times = parse_gtfs_schedule_data(stops)
  times = parse_web_schedule_data(stops)
  write_schedule_data(times, stops)

def fetch_schedule_data():
  source = 'http://data.trilliumtransit.com/gtfs/caltrain-ca-us/caltrain-ca-us.zip'
  basedir = os.getcwd()
  subprocess.call(['mkdir', '-p', 'downloads'])
  os.chdir('downloads')
  subprocess.call(['rm', 'CT-GTFS.zip'])
  subprocess.call(['curl', '-o', 'CT-GTFS.zip', source])
  os.chdir(basedir)
  subprocess.call(['mkdir', '-p', 'CT-GTFS'])
  os.chdir('CT-GTFS')
  subprocess.call(['unzip', '-o', '-j', '../downloads/CT-GTFS.zip'])
  os.chdir(basedir)

def parse_station_data():
  _stops = {'north':[], 'south':[], 'labels':{}}
  extra = ['Caltrain', 'Station']
  with open('CT-GTFS/stops.txt', 'r', encoding=None) as stopsFile:
    stopsReader = csv.reader(stopsFile)
    header = next(stopsReader, None)
    stop_id_x = header.index('stop_id')
    stop_name_x = header.index('stop_name')
    for row in stopsReader:
      if not row[stop_id_x].isdigit():
        continue # skip malformed stops
      stop_id = int(row[stop_id_x])
      if (stop_id > 70400):
        continue # skip fake stops
      stop_name = ' '.join(i for i in row[stop_name_x].split() if i not in extra)
      stop_name = stop_name.replace("South San", "So San")
      stop_name = stop_name.replace("Avenue", "Ave")
      if stop_name == 'Atherton':
        continue # should be dropped from GTFS
      stop_name = stop_name.replace(" Northbound", "")
      stop_name = stop_name.replace(" Southbound", "")
      _stops['labels'][stop_id] = stop_name
      if (stop_id % 2 == 1):
        _stops['north'].insert(0, stop_id)
      else:
        _stops['south'].append(stop_id)
  return _stops

def parse_web_schedule_data(stops):
  _times = {'weekday':{'north':OrderedDict(), 'south':OrderedDict()},
            'weekend':{'north':OrderedDict(), 'south':OrderedDict()},
            'modified':{'north':OrderedDict(), 'south':OrderedDict()}}
  for direction in ['north', 'south']:
    for schedule in ['weekday', 'weekend', 'modified']:
      filename = 'data/%s_%s.csv' % (schedule, direction)
      with open(filename, 'r', encoding=None) as modFile:
        labels = []
        for stop_id in stops[direction]:
          labels.append(stops['labels'][stop_id])
        modReader = csv.reader(modFile)
        header = next(modReader, None)
        for train in header[1:]:
          if len(train) < 3: # ignore missing trains on reduced schedule
            continue
          _times[schedule][direction][train] = [None] * len(stops[direction])
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
            _times[schedule][direction][trip_id][station_x] = str(departure)
    modFile.close()
  return _times

def parse_gtfs_schedule_data(stops):
  _times = {'weekday':{'north':OrderedDict(), 'south':OrderedDict()},
            'weekend':{'north':OrderedDict(), 'south':OrderedDict()},
            'modified':{'north':OrderedDict(), 'south':OrderedDict()}}
  for direction in ['north', 'south']:
    filename = 'data/modified_%s.csv' % direction
    schedule = 'modified'
    try:
      with open(filename, 'r') as modFile:
        labels = []
        for stop_id in stops[direction]:
          labels.append(stops['labels'][stop_id])
        modReader = csv.reader(modFile)
        header = next(modReader, None)
        for train in header[1:]:
          _times[schedule][direction][train] = [None] * len(stops[direction])
        for row in modReader:
          station = row[0]
          if station == 'Shuttle Bus':
            continue
          station_x = labels.index(station)
          for i in range(1, len(header)):
            if row[i] == '':
              continue
            trip_id = header[i]
            parts = row[i].split(':')
            departure = int(parts[0]) * 60 + int(parts[1])
            _times[schedule][direction][trip_id][station_x] = str(departure)
    finally:
      modFile.close()
  with open('CT-GTFS/stop_times.txt', 'r') as timesFile:
    timesReader = csv.reader(timesFile)
    header = next(timesReader, None)
    trip_id_x = header.index('trip_id')
    stop_id_x = header.index('stop_id')
    departure_x = header.index('departure_time')
    sortedLines = sorted(timesReader, key=lambda row: int(row[departure_x].replace(':','')))
    for row in sortedLines:
      # continue # until GTFS is back
      try:
        trip_id = int(row[trip_id_x])
      except:
        continue
      stop_id = int(row[stop_id_x])
      hour = int(row[departure_x][0:-6])
      minute = int(row[departure_x][-5:-3])
      departure = str(hour * 60 + minute)
      direction = 'north' if (stop_id % 2 == 1) else 'south'
      schedule = 'weekday' if (trip_id < 400) else 'weekend'
      if (trip_id < 800 and trip_id > 500):
        continue # skip special times
      if (trip_id not in _times[schedule][direction]):
        _times[schedule][direction][trip_id] = [None] * len(stops[direction])
      _times[schedule][direction][trip_id][stops[direction].index(stop_id)] = departure
  return _times

def write_schedule_data(times, stops):
  with open('src/@caltrainServiceData.js', 'w') as f:
    f.write("var caltrainServiceData = {\n")
    f.write("\n  saturdayTripIds: [%s],\n" % ','.join(map(str, saturday_trip_ids)))
    stat = os.stat('CT-GTFS/stop_times.txt')
    creation = 0
    creation = int(stat.st_mtime * 1000)
    for direction in ['north', 'south']:
      f.write("\n  %sStops: [" % (direction))
      f.write("\n    '")
      labels = []
      for stop_id in stops[direction]:
        labels.append(stops['labels'][stop_id])
      f.write("','".join(labels))
      f.write("'],\n")
      for schedule in ['weekday', 'weekend', 'modified']:
        comma = ''
        f.write("\n  %s%s: {" % (direction, schedule.capitalize()))
        for trip_id in times[schedule][direction]:
          f.write('%s\n    %s: [' % (comma, str(trip_id)))
          f.write(','.join(map(xstr, times[schedule][direction][trip_id])))
          f.write(']')
          comma = ','
        f.write('},\n')
    f.write("\n  scheduleDate: %d\n" % creation)
    f.write('\n};\n')
    f.write('export { caltrainServiceData };\n')

if __name__ == "__main__":
    main()
