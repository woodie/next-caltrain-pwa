#!/usr/bin/env python3
"""Convert Caltrain schedule CSVs to compact JSON for the iOS/Android apps.

Times are stored as minutes since midnight (e.g. 5:52 = 352).
Times past midnight use values > 1440 (e.g. 24:05 = 1445).
Missing stops are null.

This lives in next-caltrain-pwa (rather than next-caltrain-swift, where it
used to live) because this repo is the canonical source for the schedule
CSVs (see generate.py) and is becoming the single publish point for
schedule.json — see docs/ROADMAP.md "Repo mission shift". Run it via
`npm run convert`, or as part of the full pipeline via `npm run schedule`
(see docs/COWORK.md).

Usage:
    python3 update_json.py
    python3 update_json.py <data_dir> <output_file>
"""

import csv
import json
import re
import sys
from datetime import date
from pathlib import Path

CSV_FILES = [
    "weekday_north.csv",
    "weekday_south.csv",
    "weekend_north.csv",
    "weekend_south.csv",
    "holiday_north.csv",
    "holiday_south.csv",
]

def load_special_dates(data_dir):
    """Parse special dates from holiday_service.js in data_dir."""
    today = date.today().isoformat()
    js_file = data_dir / "holiday_service.js"
    special = {}
    with open(js_file) as f:
        for line in f:
            line = line.strip()
            if line.startswith("//") or line.startswith("/*"):
                continue
            m = re.match(r"'(\d{4}-\d{2}-\d{2})':\s*(\d+),?\s*(?://.*)?$", line)
            if m and m.group(1) >= today:
                special[m.group(1)] = int(m.group(2))
    return special

def time_to_minutes(t):
    if not t or not t.strip():
        return None
    parts = t.strip().split(":")
    return int(parts[0]) * 60 + int(parts[1])


def read_csv(path):
    with open(path, newline="") as f:
        rows = list(csv.reader(f))
    train_ids = [int(x) for x in rows[0][1:] if x.strip()]
    stations = []
    trains = {tid: [] for tid in train_ids}
    for row in rows[1:]:
        if not row or not row[0].strip():
            continue
        station = row[0].strip()
        stations.append(station)
        times = row[1:]
        for i, tid in enumerate(train_ids):
            val = times[i] if i < len(times) else ""
            trains[tid].append(time_to_minutes(val))
    return stations, trains


def latest_mtime_ms(data_dir):
    """Return the most recent mtime (in epoch ms) among the schedule CSVs.

    Mirrors the PWA's `scheduleDate` field, which uses the GTFS
    stop_times.txt mtime as a freshness/version marker.
    """
    latest = 0.0
    for name in CSV_FILES:
        path = data_dir / name
        if path.exists():
            latest = max(latest, path.stat().st_mtime)
    return int(latest * 1000)


def main():
    data_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("data")
    out_file = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("webapp/schedule.json")

    special_dates = load_special_dates(data_dir)
    print(f"Loaded {len(special_dates)} special dates from holiday_service.js")

    north_stations, weekday_north = read_csv(data_dir / "weekday_north.csv")
    south_stations, weekday_south = read_csv(data_dir / "weekday_south.csv")
    _, weekend_north = read_csv(data_dir / "weekend_north.csv")
    _, weekend_south = read_csv(data_dir / "weekend_south.csv")
    _, holiday_north = read_csv(data_dir / "holiday_north.csv")
    _, holiday_south = read_csv(data_dir / "holiday_south.csv")

    schedule_date = latest_mtime_ms(data_dir)

    schedule = {
        "specialDates": special_dates,
        "northStops": north_stations,
        "southStops": south_stations,
        "northWeekday":  {str(k): v for k, v in weekday_north.items()},
        "northWeekend":  {str(k): v for k, v in weekend_north.items()},
        "northHoliday":  {str(k): v for k, v in holiday_north.items()},
        "southWeekday":  {str(k): v for k, v in weekday_south.items()},
        "southWeekend":  {str(k): v for k, v in weekend_south.items()},
        "southHoliday":  {str(k): v for k, v in holiday_south.items()},
        "scheduleDate": schedule_date,
    }

    out_file.parent.mkdir(parents=True, exist_ok=True)
    with open(out_file, "w") as f:
        json.dump(schedule, f, separators=(",", ":"))

    size = out_file.stat().st_size
    print(f"Written to {out_file} ({size:,} bytes)")
    print(f"scheduleDate: {schedule_date}")


if __name__ == "__main__":
    main()
