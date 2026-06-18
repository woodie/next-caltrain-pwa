# Publishing a schedule update

A step-by-step runbook for generating, validating, and publishing the
schedule data consumed by the PWA itself and by the iOS (`next-caltrain-swift`)
and Android (`next-caltrain-kotlin`) apps. For the *why* behind any of these
steps — repo architecture, the holiday hand-maintained/shadow-file split,
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
python3 update_pwa.py
npm run build
python3 update_json.py
```

| Step | Command | Produces |
|---|---|---|
| 1 | `python3 generate.py` | `data/weekday_*.csv`, `data/weekend_*.csv`, a GTFS comparison pair `data/_holiday_*.csv` (not shipped — see below), and `data/feed_version.json` (the feed's own build timestamp, used for `scheduleDate` — see `docs/COWORK.md` "Published endpoint") |
| 2 | `python3 update_pwa.py` | `src/@caltrainServiceData.js` |
| 3 | `npm run build` | `webapp/script.js` (bakes in step 2's data) |
| 4 | `python3 update_json.py` | `feed/schedule.json` |

`generate.py`, `update_pwa.py`, and `update_json.py` are plain python
scripts, run directly — they're not wrapped in `package.json` since they're
not npm/node concerns. `npm run build` is the one step that's genuinely an
npm task (babel transpile). Both the PWA bundle and `schedule.json` come out
of this same sequence, from the same source CSVs, so they can't drift out
of sync with each other.

This pipeline only ever touches `feed/schedule.json`. There's a second,
separate file — `webapp/schedule.json` — that this pipeline does **not**
write to; it's a deliberately frozen copy for the iOS 1.0 App Store review
build. See [Schedule JSON URLs](#schedule-json-urls) below for the full
picture of both files and both URLs.

This does **not** commit, push, or deploy anything — that's manual, see
Publish below. Validate next (see below) before publishing.

**holiday is different from weekday/weekend.** `data/holiday_north.csv`/
`data/holiday_south.csv` are hand-maintained, transcribed from Caltrain's
published Modified Schedule PDF, and `generate.py` does not overwrite them.
If you're updating the holiday schedule (new PDF published), do it by hand:

1. Fetch the new PDF from caltrain.com/schedules (modified schedule link).
2. Transcribe station list, train numbers, and every departure time into
   `data/holiday_north.csv`/`data/holiday_south.csv`, matching the format
   of the existing rows (`H:MM:00`, blank cells for stops not served).
3. Re-run the Generate sequence above so the rest of the pipeline picks up
   the new holiday CSVs.
4. Diff the new `data/_holiday_*.csv` (GTFS's parse of the same service)
   against your hand-transcribed files. Matches confirm you transcribed
   correctly; mismatches are either a transcription slip (fix it) or a
   genuine GTFS data problem worth adding to `docs/HOLIDAY.md`.

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
`npm test` runs the existing Jest unit tests against the routing logic in
`src/`. All tests should pass except the known, pre-existing, unrelated
`GoodTimes.dateString()` UTC failure (tracked separately, not
schedule-data-related).

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
open webapp/index.html
```
The PWA bundle (`webapp/script.js`) was just rebuilt from the same data, so
browsing it locally is a manual/visual sanity check before anything ships.
Check a few known trips/stations you can verify against the source PDF or
timetable by eye.

**If you touched holiday:** confirm `data/_holiday_*.csv` vs.
`data/holiday_*.csv` differences are understood (expected discrepancies
already in `docs/HOLIDAY.md`, or new ones worth adding there) — see step 4
under Generate above.

## 3. Publish

Once the diff looks right:

```bash
git add data/ src/@caltrainServiceData.js webapp/script.js feed/schedule.json
git commit -m "Update schedule: <describe what changed>"
git push
npm run deploy
```

`npm run deploy` runs `gcloud app deploy app.yaml --quiet`, which ships the
static `webapp/` (including `schedule.json`) and the Ruby backend to App
Engine immediately — there's no date gate yet (planned, see
`docs/ROADMAP.md`).

**What "publish" means for each consumer:**
- **PWA** (`next-caltrain-pwa`): the new `webapp/script.js` (with data
  baked in via `update_pwa.py`) goes live at
  https://next-caltrain-pwa.appspot.com/ immediately on deploy.
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
  regenerated by this pipeline (`update_json.py`, step 4 above). Its
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

This restores the previous `feed/schedule.json` (and PWA bundle) and
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
2. If it's holiday, it likely belongs in `docs/HOLIDAY.md` as a known
   discrepancy, with the GTFS value shipped to `data/_holiday_*.csv` (not
   the canonical file) so it stays visible.
3. If it's weekday/weekend and GTFS doesn't match the PDF, apply the same
   policy: keep the GTFS file from overwriting a trustworthy canonical
   source, prefix the GTFS output with `_`, and document the discrepancy
   for reporting to Caltrain.
