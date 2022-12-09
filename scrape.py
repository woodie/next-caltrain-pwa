#!/usr/bin/env python3

import csv
import os
import subprocess
from bs4 import BeautifulSoup

def main():
  fetch_schedule_data()
  parse_schedule_data('weekday','north')
  parse_schedule_data('weekday','south')
  parse_schedule_data('weekend','north')
  parse_schedule_data('weekend','south')

def fetch_schedule_data():
  schedule_url = 'https://www.caltrain.com/?active_tab=route_explorer_tab'
  # weekday_url = 'https://www.caltrain.com/?active_tab=route_explorer_tab&service=weekday'
  # weekend_url = 'https://www.caltrain.com/?active_tab=route_explorer_tab&service=weekend'
  basedir = os.getcwd()
  subprocess.call(['mkdir', '-p', 'data'])
  os.chdir('data')
  subprocess.call(['curl', '-o', 'schedule.htm', schedule_url])
  # subprocess.call(['curl', '-o', 'weekday.htm', weekday_url])
  # subprocess.call(['curl', '-o', 'weekend.htm', weekend_url])
  os.chdir(basedir)

def _other_schedule(td, schedule):
  return False # for now
  if not td.has_attr('data-route-id'):
    return True
  if schedule == 'weekday':
    return True if td['data-route-id'] == 'L2' else False
  elif schedule == 'weekend':
    return True if td['data-route-id'] != 'L2' else False

def parse_schedule_data(schedule, direction):
  # with open('data/%s.htm' % schedule) as f:
  with open('data/schedule.htm') as f:
    soup = BeautifulSoup(f, 'html.parser')
  # tbl = soup.findAll('table', {'data-direction' : "%sbound" % direction})[0]
  if schedule == 'weekday':
    tbl = soup.findAll('table', {'class' : "%sB_TT" % direction[0:1].upper()})[0]
  elif direction == 'north':
    tbl = soup.find('table', {'alt' : 'Weekday Northbound service', 'border' : '1'})
  else:
    tbl = soup.find('table', {'alt' : 'Weekday Southbound service', 'border' : '1'})
  # parse train ids
  if schedule == 'weekday':
    thead = tbl.select_one('tr')
  else:
    thead = tbl.select_one('tbody').select_one('tr')
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
    #if not tr.has_attr('data-stop-id'):
    #  continue
    if schedule == 'weekday':
      head = tr.select('th')
    else:
      head = tr.select('td')
    row = []
    if len(head) < 2:
      continue
    if head[1].text in ['Train #', 'Service Type']:
      continue
    row.append(_parse_stop(head[1].text))
    for td in tr.select('td'):
      if _other_schedule(td, schedule):
        continue
      if td.has_attr('style') and schedule == 'weekend':
        continue
      row.append(_parse_time(td.text))
    if len(row) < len(header):
      row.extend([None] * (len(header) - len(row)))
    rows.append(row[0:len(header)])
  with open('data/%s_%s.csv' % (schedule, direction), mode='w') as out_file:
    csv_writer = csv.writer(out_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
    csv_writer.writerow(header)
    for row in rows:
      csv_writer.writerow(row)

def _parse_stop(text):
  text = text.replace('Departs ', '').replace('Arrives ', '')
  text = text.replace("South San", "So San")
  text = text.replace("S. San", "So San")
  text = text.replace("Avenue", "Ave")
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
