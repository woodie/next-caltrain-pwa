#!/usr/bin/env python3
"""
scrape.py

Scrapes Caltrain's own route-explorer widget (HTML, not GTFS) and writes
weekday/weekend schedules to underscore-prefixed shadow files:
  data/_weekday_north.csv, data/_weekday_south.csv
  data/_weekend_north.csv, data/_weekend_south.csv

These are a comparison/diagnostic pair against generate.py's GTFS-based
weekday_*.csv/weekend_*.csv - the same underscore-shadow convention
generate.py uses for holiday (see its docstring and docs/COWORK.md). Diff
the two sources against each other; this script never overwrites the
canonical, GTFS-sourced files.
"""

import bootstrap_venv

bootstrap_venv.ensure_venv(__file__)

import csv
import os
import subprocess
from bs4 import BeautifulSoup


def main():
    fetch_schedule_data()
    parse_schedule_data('weekday', 'north')
    parse_schedule_data('weekday', 'south')
    parse_schedule_data('weekend', 'north')
    parse_schedule_data('weekend', 'south')


def fetch_schedule_data():
    schedule_url = 'https://www.caltrain.com/?active_tab=route_explorer_tab'
    basedir = os.getcwd()
    subprocess.call(['mkdir', '-p', 'data'])
    os.chdir('data')
    subprocess.call(['curl', '-o', 'schedule.htm', schedule_url])
    os.chdir(basedir)


def _other_schedule(td, schedule):
    if not td.has_attr('data-route-id'):
        return True
    if schedule == 'weekday':
        return True if td['data-route-id'] == 'Local Weekend' else False
    elif schedule == 'weekend':
        return True if td['data-route-id'] != 'Local Weekend' else False


def parse_schedule_data(schedule, direction):
    with open('data/schedule.htm') as f:
        soup = BeautifulSoup(f, 'html.parser')
    tbl = soup.findAll('table', {'data-direction': "%sbound" % direction})[0]
    # parse train ids
    thead = tbl.select_one('tr')
    header = ['']
    for td in thead.select('td'):
        if _other_schedule(td, schedule):
            continue
        train_id = td.text
        if len(train_id) == 3:
            header.append(train_id)
    # parse stop times
    tbody = tbl.select_one('tbody')
    rows = []
    for tr in tbody.select('tr'):
        if not tr.has_attr('data-stop-id'):
            continue
        cols = tr.select('td')
        row = []
        row.append(_parse_stop(cols[1].text))
        times = tr.select('th')
        for td in tr.select('td'):
            if _other_schedule(td, schedule):
                continue
            row.append(_parse_time(td.text))
        if len(row) < len(header):
            row.extend([None] * (len(header) - len(row)))
        rows.append(row[0:len(header)])
    with open('data/_%s_%s.csv' % (schedule, direction), mode='w') as out_file:
        csv_writer = csv.writer(
            out_file,
            delimiter=',',
            quotechar='"',
            quoting=csv.QUOTE_MINIMAL,
            lineterminator="\n")
        csv_writer.writerow(header)
        for row in rows:
            csv_writer.writerow(row)


def _parse_stop(text):
    text = text.replace('Departs ', '').replace('Arrives ', '')
    text = text.replace("South San", "So San")
    text = text.replace("Avenue", "Ave")
    text = text.replace(" Caltrain Station", "")
    text = text.replace(" Station", "")
    return text.replace(u'\xa0', u' ')


def _parse_time(text):
    if ':' not in text:
        return ''
    h, m = text.strip().split(':')
    if 'p' in m and int(h) < 12:
        h = str(int(h) + 12)
    elif 'a' in m and int(h) == 12:
        h = str(int(h) + 12)
    elif 'a' in m and int(h) < 3:
        h = str(int(h) + 24)
    return '%s:%s:00' % (h, m[0:2])


if __name__ == "__main__":
    main()
