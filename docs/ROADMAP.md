# Roadmap — next-caltrain-pwa

**Status:** not started. `data/` is still flat (no date folders), and none of
the `tools/` scripts below exist yet.

## Repo mission shift

This repo is moving from "KaiOS PWA that happens to host `schedule.json`" to
the canonical validate-and-publish tool for the schedule consumed by
`next-caltrain-swift` and `next-caltrain-kotlin`. The PWA (`webapp/`) isn't
becoming legacy — it stays live at https://next-caltrain-pwa.appspot.com/ and
is itself part of the validate-and-publish job: browsing it against a
candidate `schedule.json` is the manual/visual way to sanity-check a schedule
before it goes out to all three clients.

One concrete consequence: `next-caltrain-swift/tools/convert_schedule.py`
currently does the real CSV → `schedule.json` conversion and writes directly
into this repo's `webapp/schedule.json` — this repo's own `update_pwa.py` does
the same job redundantly. Consolidating on one implementation here, so this
repo is the single source of truth for producing and validating
`schedule.json`, is part of this shift. Open question: whether swift's script
gets deleted once the GTFS pipeline below replaces it, or kept as a thin
wrapper that calls into this repo.

## Schedule pipeline modernization

### Background

Caltrain publishes a GTFS feed but doesn't validate it — it has been mangled
in the past, causing silent breakage. As a workaround, `update_pwa.py` was switched
to parsing hand-maintained CSVs scraped from the Caltrain website. Humans at
Caltrain review and update the website, making it the authoritative source, but
scraping is brittle and could break without warning.

**Update (2026-06):** `generate.py` now parses GTFS directly (via partridge)
for all six CSVs, including holiday — `scrape.py` and the hand-maintained
holiday CSVs are obsolete. Weekday/weekend were already verified
byte-for-byte identical to the scraped versions. Holiday needed one fix
first: the feed attached a spurious stop_times row at Tamien (and the other
South County branch stations) to ordinary Local trips that don't run the
branch — this is `generate.py`'s `resolve_branch_filter()`/`build_columns()`
filtering it out generically (by route, not a hardcoded station list) rather
than something to report to Caltrain, since it represents a real rider
transfer this app simply doesn't display. A handful of smaller GTFS-vs-PDF
discrepancies remain (wrong dates/times on specific trips) — tracked in
docs/HOLIDAY.md for reporting to Caltrain rather than blocking the switch.
A validation layer (catching a bad feed before it reaches users) is still
needed for all three schedules.

### Target workflow

When Caltrain announces a new schedule:

1. Download the updated GTFS zip from the Caltrain developer resources page.
2. Run the parser (`generate.py`, partridge-based) against the zip.
3. Validate the output — sanity-check stop counts, trip counts, and diff
   against the current `schedule.json` to catch anomalies, and browse the
   candidate file in the PWA (`webapp/`) itself as a manual/visual check.
4. If valid, place the generated CSVs (or directly the `schedule.json`) in a
   date-named folder: `data/YYYY-MM-DD/` where the date is the schedule's
   effective date.
5. On the effective date, just after 2am, the deploy script finds the folder,
   confirms the date matches today, generates `schedule.json`, and deploys to
   App Engine.

### Date-named data folders

```
data/
  2026-01-31/    ← current (already deployed)
  2027-01-31/    ← next (waiting for effective date)
```

The deploy script logic:
- Find the most recent `data/YYYY-MM-DD/` folder.
- If folder date == today → parse, validate, deploy.
- Otherwise → print "Next schedule deploys on YYYY-MM-DD, X days away" and exit.

This makes the folder name the single source of truth for when a schedule goes
live — no separate config needed.

### Tools to add

- ~~`tools/parse_gtfs.py`~~ — done, exists as `generate.py` in the repo root;
  uses [partridge](https://pypi.org/project/partridge/) to load the GTFS zip
  and produce all six CSVs (weekday/weekend/holiday) that the rest of the
  pipeline expects. Not yet wired into a date-folder/auto-deploy pipeline.
- `tools/validate.py` — compares a candidate `schedule.json` against the
  current deployed one; flags missing stops, missing trips, or implausible
  changes in trip count.
- `tools/deploy.py` — wraps the date-gate logic, parse, validate, and
  `npm run deploy`; safe to run from cron just after 2am daily.

### Open questions

- **GTFS lead time**: how many days before the effective date does Caltrain
  publish the updated GTFS? This determines how much runway there is to catch
  validation failures before go-live. Worth asking Caltrain's developer
  resources contact directly. The `feed_info.txt` file inside the zip may also
  carry `feed_start_date` / `feed_end_date` as a clue.
- **Holiday schedule**: answered — Caltrain does encode holiday service in
  GTFS (`calendar_dates.txt`); the worst problem (spurious Tamien/branch
  stops on Local trips) is now filtered out generically in `generate.py`,
  so `holiday_north.csv`/`holiday_south.csv` are GTFS-generated like the
  other four CSVs as of 2026-06-17. A few smaller discrepancies against
  Caltrain's published Modified Schedule PDF remain (see docs/HOLIDAY.md)
  and are pending a report to Caltrain rather than a code fix.

### Deployment infrastructure

No new infrastructure needed once `tools/deploy.py` exists:
- A development machine (or Raspberry Pi) can run it via cron just after 2am.
- It calls `npm run deploy`, which pushes to App Engine; `schedule.json` is
  served from the CDN at essentially zero cost.
- iOS and Android clients fetch once per schedule-day (2am boundary) — no
  changes needed on the client side.
