# Roadmap — next-caltrain-pwa

**Status:** local generate/validate/test pipeline is done (plain python
scripts run directly, plus `npm run build`/`npm test` — see
docs/COWORK.md and docs/PUBLISHING.md). Still missing: `data/` date folders
and the date-gated auto-deploy script.

## Repo mission shift

This repo is moving from "KaiOS PWA that happens to host `schedule.json`" to
the canonical validate-and-publish tool for the schedule consumed by
`next-caltrain-swift` and `next-caltrain-kotlin`. The PWA (`webapp/`) isn't
becoming legacy — it stays live at https://next-caltrain-pwa.appspot.com/ and
is itself part of the validate-and-publish job: browsing it against a
candidate `schedule.json` is the manual/visual way to sanity-check a schedule
before it goes out to all three clients.

**Update (2026-06-18):** done. The CSV → `schedule.json` converter moved from
`next-caltrain-swift/tools/convert_schedule.py` into this repo as
`update_json.py`, alongside a new `validate_schedule.py`. It turned out not
to be truly redundant with `update_pwa.py` — they produce different
artifacts (`webapp/schedule.json` vs `src/@caltrainServiceData.js`) for
different consumers (iOS/Android at runtime vs. the PWA's own build) — but
both now run from the same generate sequence (see docs/PUBLISHING.md), so
the two can't drift out of sync. `next-caltrain-swift/docs/GIT_WORKFLOW.md`
points here instead of carrying its own copy of the script.

## Schedule pipeline modernization

### Background

Caltrain publishes a GTFS feed but doesn't validate it — it has been mangled
in the past, causing silent breakage. As a workaround, `update_pwa.py` was switched
to parsing hand-maintained CSVs scraped from the Caltrain website. Humans at
Caltrain review and update the website, making it the authoritative source, but
scraping is brittle and could break without warning.

**Update (2026-06):** `generate.py` now parses GTFS directly (via partridge)
for all six CSVs. Weekday/weekend were verified byte-for-byte identical to
the scraped versions they replaced, and `scrape.py` is obsolete for those
two. Holiday turned out differently — see the 2026-06-18 update below. A
validation layer (catching a bad feed before it reaches users) is still
needed for all three schedules.

**Update (2026-06-18), corrected:** a `resolve_branch_filter()` function was
added and briefly shipped in `generate.py` that dropped the stop_times row
at Tamien from ordinary Local trips not on the South County Connector
route, on the theory that the row was a synthetic "transfer marker" (every
instance was stop_sequence 1, exactly 6 minutes before San Jose Diridon,
and Tamien was served by an oddly low ~44-45% of same-direction
non-Connector trips vs. ~98-100% for a real hub like Diridon). That
reasoning was wrong: cross-checking against Caltrain's currently-published
weekday and weekend timetable PDFs (media/36422, media/36421) showed every
one of those "spurious" Tamien times is a genuine, scheduled stop - some
Local trains really do originate/terminate at Tamien. The filter had been
silently deleting real data from `weekday_*.csv`/`weekend_*.csv` (it had
also been applied to `holiday_*.csv` the day before, see below). It's been
fully removed; `weekday_*.csv`/`weekend_*.csv`/`holiday_*.csv` and
`test/CaltrainService.test.js` are all back to treating every GTFS
stop_times row as real. **Lesson, recorded in `generate.py`'s docstring
too: an internally-consistent statistical pattern in GTFS data is not, by
itself, evidence a row is synthetic. Check Caltrain's own published
timetable before writing code that discards GTFS data as a "phantom" or
"bug" - and check it separately for each schedule type, since weekday,
weekend, and holiday schedules can legitimately differ.** On that note: the
same check against the holiday/modified-schedule PDF (media/36013)
suggests holiday's Tamien-on-Local-trips rows really are absent from that
PDF, unlike weekday/weekend - see docs/HOLIDAY.md item 4 (one of four
known GTFS-vs-PDF discrepancies on holiday, alongside a wrong calendar
date, wrong Diridon times, and a misattributed College Park stop). Given
that, holiday went back to being hand-maintained: `data/holiday_north.csv`/
`data/holiday_south.csv` are the canonical, PDF-transcribed files again, and
`generate.py` writes its GTFS-parsed holiday output to the
underscore-prefixed `data/_holiday_north.csv`/`data/_holiday_south.csv`
instead - a comparison/diagnostic pair, not something the pipeline ships.
This is the general policy now: GTFS is the default source for every
schedule, but if its output for a given schedule doesn't match Caltrain's
published PDF, that output gets the `_` prefix rather than overwriting the
canonical file, so the mismatch stays visible and there's a ready-made diff
for reporting it to Caltrain. Weekday/weekend don't need this treatment -
they match their PDFs - so they're still written straight to the canonical
names.

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

- ~~`parse_gtfs.py`~~ — done, exists as `generate.py` in the repo root; uses
  [partridge](https://pypi.org/project/partridge/) to load the GTFS zip and
  produce all six CSVs (weekday/weekend/holiday) that the rest of the
  pipeline expects. Not yet wired into a date-folder/auto-deploy pipeline.
- ~~`convert_schedule.py`~~ — done, exists as `update_json.py` in the repo
  root (moved from `next-caltrain-swift/tools/`); produces
  `webapp/schedule.json` from the six CSVs.
- ~~`validate.py`~~ — done, exists as `validate_schedule.py` in the repo
  root; checks a candidate `schedule.json` for structural problems (missing
  keys, empty weekday/weekend tables, stop/time-array length mismatches,
  out-of-range times) and diffs it against the version committed at HEAD so
  a human can eyeball stop/trip-count changes before publishing.
- `deploy.py` — still to add: wraps the date-gate logic, the generate and
  validate sequence above (see docs/PUBLISHING.md), and `npm run deploy`;
  safe to run from cron just after 2am daily. (All the scripts above live
  flat at the repo root, matching
  `generate.py`/`update_pwa.py`/`scrape.py` — not under a `tools/`
  subdirectory.)

### Open questions

- **GTFS lead time**: how many days before the effective date does Caltrain
  publish the updated GTFS? This determines how much runway there is to catch
  validation failures before go-live. Worth asking Caltrain's developer
  resources contact directly. `feed_info.txt`'s `feed_start_date` /
  `feed_end_date` give the *service* date range, not the publish date — see
  the resolved item below for what we found instead.

**Resolved, 2026-06-18 — feed build timestamp:** `feed_info.txt`'s
`feed_version` field carries Trillium's own build timestamp for the feed
(e.g. `UTC: 10-Jun-2026 22:25`), confirmed against the per-file timestamps
inside the zip itself (`unzip` preserves these — `stop_times.txt` showed
`2026-06-10 22:30`, 5 minutes after `feed_version`). `generate.py` now
parses this into `data/feed_version.json`, and `update_json.py`/
`update_pwa.py` use it for `scheduleDate` instead of local CSV mtimes — see
docs/COWORK.md "Published endpoint". This fixed a real annoyance: every
local generate rerun was bumping `scheduleDate` (producing a spurious
one-line diff in `webapp/schedule.json` and `src/@caltrainServiceData.js`)
even when Caltrain hadn't published anything new.
- **Holiday schedule**: answered — Caltrain does encode holiday service in
  GTFS (`calendar_dates.txt`), but GTFS's holiday output doesn't match
  Caltrain's published Modified Schedule PDF closely enough to trust (four
  discrepancies tracked in docs/HOLIDAY.md, including a holiday-specific
  Tamien/Local one found 2026-06-18). So unlike weekday/weekend,
  `holiday_north.csv`/`holiday_south.csv` are hand-maintained from the PDF
  again; `generate.py` writes the GTFS-parsed version to
  `_holiday_north.csv`/`_holiday_south.csv` as a comparison file, pending a
  report to Caltrain rather than a code fix.

### Deployment infrastructure

No new infrastructure needed once `deploy.py` exists:
- A development machine (or Raspberry Pi) can run it via cron just after 2am.
- It calls `npm run deploy`, which pushes to App Engine; `schedule.json` is
  served from the CDN at essentially zero cost.
- iOS and Android clients fetch once per schedule-day (2am boundary) — no
  changes needed on the client side.
