#!/usr/bin/env python3
"""Sanity-check a candidate schedule.json before it's committed/published.

Two kinds of checks:

1. Structural (fatal) - things that would mean update_json.py produced a
   broken file: missing keys, empty weekday/weekend tables, a trip whose
   time array doesn't have one entry per stop in its direction, out-of-range
   time values.

2. Comparative (informational only) - diffs against the schedule.json
   currently committed at HEAD, so a human can eyeball whether a stop list
   or trip count changed by more than expected before publishing. Schedule
   content changing is the entire point of running this, so these are
   reported, not treated as failures.

Usage:
    python3 validate_schedule.py
    python3 validate_schedule.py path/to/candidate.json
"""

import json
import subprocess
import sys
from pathlib import Path

DIRECTIONS = ["north", "south"]
SCHEDULES = ["Weekday", "Weekend", "Holiday"]

# Generous bounds: 0 = midnight, times past midnight (e.g. a 1:30am owl
# trip) are stored as minutes > 1440. 1800 minutes = 6am two days later,
# which is far past anything Caltrain would ever run.
MIN_MINUTES = 0
MAX_MINUTES = 1800


def load(path):
    with open(path) as f:
        return json.load(f)


def load_head_version(path):
    """Best-effort: the same file as committed at HEAD, for comparison. None if unavailable."""
    try:
        out = subprocess.run(
            ['git', 'show', 'HEAD:%s' % path], capture_output=True, check=True, text=True)
        return json.loads(out.stdout)
    except Exception:
        return None


def check_structure(data, errors, warnings):
    required_keys = (
        ['specialDates', 'scheduleDate'] +
        ['%sStops' % d for d in DIRECTIONS] +
        ['%s%s' % (d, s) for d in DIRECTIONS for s in SCHEDULES])
    for key in required_keys:
        if key not in data:
            errors.append('missing top-level key: %s' % key)
    if errors:
        return  # no point checking further structure if keys are missing

    stop_counts = {}
    for d in DIRECTIONS:
        stops = data['%sStops' % d]
        if not stops:
            errors.append('%sStops is empty' % d)
        stop_counts[d] = len(stops)

    for d in DIRECTIONS:
        for s in SCHEDULES:
            table = data['%s%s' % (d, s)]
            if not table:
                if s == 'Holiday':
                    warnings.append('%s%s has no trips (ok if no holiday is upcoming)' % (d, s))
                else:
                    errors.append('%s%s has no trips' % (d, s))
                continue
            expected_len = stop_counts[d]
            for trip_id, times in table.items():
                if len(times) != expected_len:
                    errors.append(
                        '%s%s trip %s has %d time entries, expected %d (one per %s stop)' % (
                            d, s, trip_id, len(times), expected_len, d))
                for t in times:
                    if t is not None and not (MIN_MINUTES <= t <= MAX_MINUTES):
                        errors.append(
                            '%s%s trip %s has an out-of-range time: %r' % (d, s, trip_id, t))


def check_against_head(data, head, warnings):
    if head is None:
        warnings.append('no committed webapp/schedule.json at HEAD to diff against (first run?)')
        return

    for d in DIRECTIONS:
        key = '%sStops' % d
        old, new = head.get(key, []), data.get(key, [])
        if old != new:
            added = [s for s in new if s not in old]
            removed = [s for s in old if s not in new]
            msg = '%s changed (%d -> %d stops)' % (key, len(old), len(new))
            if added:
                msg += '; added: %s' % ', '.join(added)
            if removed:
                msg += '; removed: %s' % ', '.join(removed)
            warnings.append(msg)

    for d in DIRECTIONS:
        for s in SCHEDULES:
            key = '%s%s' % (d, s)
            old_trips = set(head.get(key, {}).keys())
            new_trips = set(data.get(key, {}).keys())
            added = sorted(new_trips - old_trips, key=lambda x: (len(x), x))
            removed = sorted(old_trips - new_trips, key=lambda x: (len(x), x))
            if added or removed:
                msg = '%s trip count %d -> %d' % (key, len(old_trips), len(new_trips))
                if added:
                    msg += '; added trips: %s' % ', '.join(added)
                if removed:
                    msg += '; removed trips: %s' % ', '.join(removed)
                warnings.append(msg)


def main():
    candidate_path = sys.argv[1] if len(sys.argv) > 1 else 'webapp/schedule.json'
    if not Path(candidate_path).exists():
        print('ERROR: %s does not exist (run npm run convert first)' % candidate_path)
        sys.exit(1)

    data = load(candidate_path)
    head = load_head_version(candidate_path)

    errors, warnings = [], []
    check_structure(data, errors, warnings)
    if not errors:
        check_against_head(data, head, warnings)

    if warnings:
        print('Notes (%d):' % len(warnings))
        for w in warnings:
            print('  - %s' % w)
    if errors:
        print('FAILED (%d):' % len(errors))
        for e in errors:
            print('  - %s' % e)
        sys.exit(1)

    print('OK: %s passed structural checks.' % candidate_path)


if __name__ == '__main__':
    main()
