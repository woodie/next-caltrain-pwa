# Publishing a schedule update

A step-by-step runbook for generating, validating, and publishing the
schedule data consumed by the PWA itself and by the iOS (`next-caltrain-swift`)
and Android (`next-caltrain-kotlin`) apps. For the *why* behind any of these
steps — repo architecture, holiday schedule history,
known GTFS-vs-PDF discrepancies — see `docs/COWORK.md`, `docs/HOLIDAY.md`,
and `docs/ROADMAP.md`. This doc is just the *how*.

## When to use this

- Caltrain has published an updated GTFS feed (new weekday/weekend
  schedule, fare change, etc.).
- Caltrain has published a new "Modified Schedule" PDF covering upcoming
  holidays (e.g. a new media/##### link on caltrain.com/schedules).
- You want to re-check whether a previously-reported GTFS discrepancy
  (see `docs/HOLIDAY.md`) has been fixed upstream.

## Prerequisites

- Repo checked out locally, `npm install` run at least once.
- Python 3 with `partridge` installed (`pip install partridge`).
- `gcloud` authenticated against the `next-caltrain-pwa` GCP project, only
  needed for the publish step (`gcloud auth login`).
- Network access to `data.trilliumtransit.com` (GTFS source).

## 1. Generate

Run these in order:

```bash
python3 generate.py
python3 update_json.py
```

| Step | Command | Produces |
|---|---|---|
| 1 | `python3 generate.py` | `data/weekday_*.csv`, `data/weekend_*.csv`, `data/holiday_*.csv`, and `data/feed_version.json` (the feed's own build timestamp, used for `scheduleDate` — see `docs/COWORK.md` "Published endpoint") |
| 2 | `python3 update_json.py` | `feed/schedule.json` |

`generate.py` and `update_json.py` are plain python scripts, also available
as `npm run generate` and `npm run convert`; `npm run schedule` runs both
plus `validate_schedule.py` (step 2 below) in order, stopping at the first
failure. Pass flags through with `--`, e.g. `npm run generate -- --force`.
There's no rebuild step: the PWA, like the iOS/Android clients, fetches
`/feed/schedule.json` at runtime, so every client reads the same file.

This pipeline only ever touches `feed/schedule.json`. There's a second,
separate file — `webapp/schedule.json` — that this pipeline does **not**
write to; it's a deliberately frozen copy for the iOS 1.0 App Store review
build. See [Schedule JSON URLs](#schedule-json-urls) below for the full
picture of both files and both URLs.

This does **not** commit, push, or deploy anything — that's manual, see
Publish below. Validate next (see below) before publishing.

**Holiday dates come from two places.** `generate.py` writes the holiday
timetable from GTFS, but the days it runs come from the hand-maintained
`data/holiday_service.js` (from
https://www.caltrain.com/schedules/holiday-service-schedules). `generate.py`
prints a `WARNING` for each GTFS holiday date that file doesn't mark
Modified, and each Modified date in GTFS's range that GTFS lacks. Decide
which side is right, fix `holiday_service.js` if it's ours, and add it to
`docs/HOLIDAY.md` if it's Caltrain's.

## 2. Validate

Run these in order:

```bash
python3 validate_schedule.py
npm test
```

**Structural + diff check:**
`validate_schedule.py` flags missing keys, empty weekday/weekend tables,
stop/time-array length mismatches, and out-of-range times; also diffs
`feed/schedule.json` against the version currently committed at HEAD
so you can eyeball stop/trip-count changes.

**Test suite:**
`npm test` runs the Vitest unit tests against the routing logic in
`src/`. All tests should pass, in any time zone.

Beyond these two commands, also do these manual checks before publishing:

**Spot-check with `jq`:**
```bash
jq '.northStops | length' feed/schedule.json
jq '.northWeekday | to_entries | map(.value | length) | unique' feed/schedule.json
```
The second command should return a single number — every trip's time array
should be the same length as the stop list. More than one distinct value
means a row is malformed.

**Visual check — browse the PWA against the candidate schedule:**
```bash
npm run server
open http://localhost:8000/
```
The local server serves the candidate `feed/schedule.json` at the same path
the PWA fetches in production, so browsing it locally is a manual/visual
sanity check before anything ships. (Opening `webapp/index.html` directly
from disk won't work — the PWA can't fetch the feed over `file://`.)
Check a few known trips/stations you can verify against the source PDF or
timetable by eye.

**If holiday changed:** check a few trains against Caltrain's current
Modified Schedule PDF, linked from the holiday page. Old PDFs are all over
the web, so check its date first (see `docs/HOLIDAY.md`).

## 3. Publish

Once the diff looks right:

```bash
git add data/ feed/schedule.json
git commit -m "Update schedule: <describe what changed>"
git push
npm run deploy
```

`npm run deploy` runs `gcloud app deploy app.yaml --quiet`, which ships the
static `webapp/` and `feed/schedule.json` to App Engine immediately — there's no date gate yet (planned, see
`docs/ROADMAP.md`).

**What "publish" means for each consumer:**
- **PWA** (`next-caltrain-pwa`): fetches `/feed/schedule.json` on launch
  (keeping the last good copy in `localStorage` for offline use), so it
  picks up the new schedule on its next launch after deploy.
- **iOS / Android (new versions)**: these apps fetch `/feed/schedule.json`
  at runtime — no app release or store submission needed to ship a
  schedule update. They pick up the new file on their next fetch
  (`next-caltrain-swift` fetches once per schedule-day, around the 2am
  boundary).
- **iOS 1.0 (in App Store review)**: fetches the legacy `/schedule.json`
  URL, which serves `webapp/schedule.json` — a separate, frozen file this
  pipeline never touches. This routine publish flow has no effect on it.
  See [Schedule JSON URLs](#schedule-json-urls) for the full picture.

## Schedule JSON URLs

There are **two distinct files**, each served at its own URL:

- **`feed/schedule.json`** → **`/feed/schedule.json`** — the live file,
  regenerated by this pipeline (`update_json.py`, Generate step 2 above). Its
  `scheduleDate` tracks the current GTFS feed's `feed_version`. Point all
  new app versions here.
- **`webapp/schedule.json`** → **`/schedule.json`** (legacy URL) — a
  hand-frozen copy, not touched by `update_json.py` or any pipeline step.
  Its `scheduleDate` is hardcoded to Jan 31, 2026 (`1769860800000`, noon
  UTC — chosen so it renders as Jan 31 in any US timezone, since
  `GoodTimes.dateString()` formats in local time), matching the
  schedule-effective date Caltrain publishes at caltrain.com/status. This
  exists solely for the iOS 1.0 build submitted for App Store review on
  2026-06-17, which reads this exact URL at runtime (hardcoded fallback in
  `CaltrainSchedule.swift`, default in `schedule-endpoint.env`). Apple's
  reviewers fetch it directly during review, and any already-installed 1.0
  app keeps depending on it until the user updates. **Do not change
  `webapp/schedule.json`'s content** until no shipped app build relies on
  it anymore — newer app versions (Swift and Kotlin) have been switched to
  `/feed/schedule.json` instead, so this only matters for the 1.0 build.
  Once that's no longer in the wild, delete `webapp/schedule.json` and the
  `/schedule.json` handler in `app.yaml`.

**Why `feed/` and not `data/`:** `.gcloudignore` excludes the repo-root
`data/` pipeline directory (CSVs, `feed_version.json`) from deploys. An
earlier attempt put `schedule.json` at `webapp/data/schedule.json`; that
directory name matched `.gcloudignore`'s `data` pattern too (unanchored
gitignore-style patterns match at any depth, not just the repo root), so
the file silently never made it into the deployed bundle and
`/data/schedule.json` 404'd in production while the old `/schedule.json`
kept serving a stale, previously-deployed copy. Fixed by anchoring the
ignore pattern to `/data` (root only) and moving the live file to `feed/`,
a name that doesn't collide. Don't reintroduce a directory literally named
`data` anywhere under the deploy path. (Neither `feed/` nor `webapp/` is
excluded, so both `feed/schedule.json` and `webapp/schedule.json` deploy
correctly.)

Both handlers carry `expiration: "10m"` in `app.yaml`. That's a deliberate
middle ground: leaving `expiration` unset defaults to a much longer and
unpredictable App Engine cache lifetime — what caused a multi-hour stale
schedule display after a same-day deploy. `expiration: "0s"` would eliminate
that risk but also gives up CDN caching, which is nearly free and worth
keeping. Ten minutes bounds the worst case ("published at 2:05am, how long
could an edge keep serving the old file") without sending every request to
origin.

`scheduleDate` inside the JSON is cosmetic only — it drives the "Schedule
data: <date>" line on each app's About screen and nothing else (no
cache-validity logic, no trip-table selection, no risk of a crash or a
wrong-schedule fallback at any value). `validate_schedule.py` still rejects
implausible values (before 2020, or more than 30 days in the future) as a
circuit breaker — but per design, a future-dated value is never treated as
"newer, therefore more trustworthy"; see `check_schedule_date()` in that
script. This applies to both files — run it against `webapp/schedule.json`
too if you ever touch that file.

## Rollback

If a bad schedule ships:

```bash
git revert <bad-commit-sha>
npm run deploy
```

This restores the previous `feed/schedule.json` and
redeploys. It does not touch `webapp/schedule.json`, which isn't part of
this pipeline. Since clients fetch their schedule JSON at runtime rather
than bundling it, a rollback takes effect on their next fetch with no app
update required.

## Escalation / when GTFS doesn't match Caltrain's PDF

Don't write a heuristic filter to "fix" GTFS data based on a pattern you
notice in the data alone — see the cautionary note in `generate.py`'s
docstring for why that went wrong once already. Instead:

1. Confirm the mismatch against Caltrain's actual published PDF timetable
   (not assumption or memory).
   Make sure that PDF is the current one; stale timetables are everywhere.
2. Document it for reporting to Caltrain (`docs/HOLIDAY.md` for holiday).
3. If you're confident GTFS is wrong, write the PDF's version to the
   canonical CSV by hand, and the GTFS output to an `_`-prefixed file so
   the difference stays visible.
