# Working with next-caltrain-pwa

This repo started as a Caltrain schedule PWA for KaiOS phones and is also
becoming the canonical tool for validating and publishing the schedule used
by the iOS (`next-caltrain-swift`) and Android (`next-caltrain-kotlin`)
sibling apps — see ROADMAP.md "Repo mission shift". The PWA itself
(`webapp/`) isn't going away or becoming legacy: it stays live at
https://next-caltrain-pwa.appspot.com/, and browsing it against a candidate
`schedule.json` is itself the manual/visual validation step before that
schedule gets published.

The published `feed/schedule.json` (served at `/feed/schedule.json`) is
fetched at runtime by the PWA and by the iOS and Android clients alike —
`src/ScheduleFeed.js` loads it on launch and keeps the last good copy in
`localStorage` for offline use. It's generated from six CSVs in `data/` —
four GTFS-generated, two (`holiday_*.csv`) hand-maintained — by the
generate sequence (see "Schedule data pipeline" below). Until 2026-10-20
the PWA instead baked the same CSVs into its bundle via `update_pwa.py` →
`src/@caltrainServiceData.js`; both were dropped so every client reads one
file, and so the PWA picks up a schedule update without a rebuild.

For the step-by-step procedure to generate, validate, and publish a
schedule update, see `docs/PUBLISHING.md`. This doc (COWORK.md) covers the
*why* — architecture, history, and known data issues; PUBLISHING.md covers
the *how*.

## Repo structure

- `webapp/` — the PWA itself (HTML/JS/CSS, deployed to App Engine as static
  files, live at https://next-caltrain-pwa.appspot.com/); also serves
  `schedule.json` to the iOS/Android clients; doubles as the manual
  validation tool — browse it against a candidate schedule before
  publishing (see ROADMAP.md)
- `src/` — JS source including `CaltrainService.js`, the reference routing
  implementation, and `ScheduleFeed.js`, which fetches `/feed/schedule.json`
- `feed/` — `schedule.json`, the live published schedule (see
  `feed/README.md`)
- `data/` — schedule CSVs, flat (not yet organized into date folders — see
  ROADMAP.md); `weekday_*.csv`/`weekend_*.csv` are GTFS-generated,
  `holiday_*.csv` is hand-maintained from Caltrain's PDF (see "Schedule
  data pipeline" below)
- `generate.py` — generates `weekday_*.csv`/`weekend_*.csv` from Caltrain's
  GTFS feed via partridge, plus a GTFS-parsed `_holiday_*.csv` comparison
  pair (not shipped — see "Holiday schedule" below) and
  `data/feed_version.json` (the feed's own build timestamp, used for
  `scheduleDate` — see "Published endpoint" below)
- `update_json.py` — parses the CSVs and produces `feed/schedule.json`,
  fetched at runtime by the PWA and the iOS/Android clients (moved here from
  `next-caltrain-swift/tools/convert_schedule.py` — see "Schedule data
  pipeline" below)
- `validate_schedule.py` — sanity-checks a candidate `feed/schedule.json`
  (structure, stop/trip counts) before it's committed
- `app.yaml` — App Engine config; static files only (`webapp/` and
  `feed/schedule.json`), no backend. The Ruby/Sinatra backend that once
  served `/alerts` and `/delays` was removed on 2026-10-20.

## Schedule data pipeline

See `docs/PUBLISHING.md` for the full step-by-step runbook (generate,
validate, publish, rollback). This section is the architecture summary.

### Current approach
Two stages, each a short sequence of plain python scripts, also wrapped as
npm scripts (`npm run generate`, `convert`, `validate`, or `npm run
schedule` for all three in order):

**Generate:**
1. `generate.py` — GTFS feed → `weekday_*.csv`/`weekend_*.csv` in `data/`,
   plus a GTFS-parsed `_holiday_*.csv` comparison pair (`holiday_*.csv`
   itself stays hand-maintained — see "Holiday schedule" below) and
   `data/feed_version.json` (the feed's build timestamp, used for
   `scheduleDate`)
2. `update_json.py` — the six canonical CSVs → `feed/schedule.json`

**Validate:**
1. `validate_schedule.py` — structural sanity check of `feed/schedule.json`,
   plus a diff against the version currently committed at HEAD for human review
2. `npm test` — Vitest unit tests against the routing logic in `src/`

It stops there — nothing is committed, pushed, or deployed automatically.
Review the diff (`git diff`, `git status`), commit, then deploy manually
(`npm run deploy`, see "Deploying" below) when ready.

Weekday/weekend were verified byte-for-byte identical to the hand-maintained
versions they replaced. A `resolve_branch_filter()` step was briefly added
and applied to all six CSVs on 2026-06-17/18 on the theory that GTFS
attached a synthetic Tamien stop to some Local trips - that theory was
wrong (see ROADMAP.md's 2026-06-18 update and the cautionary note in
`generate.py`'s docstring), so it's been removed; weekday/weekend are back
to using every stop_times row GTFS provides, unfiltered. Holiday took a
different path - briefly GTFS-generated like the other four, then reverted
back to hand-maintained once a holiday-specific GTFS-vs-PDF mismatch turned
up (see "Holiday schedule" below).

There's no `data/YYYY-MM-DD/` folder structure yet and no automated, date-gated
deploy — that's planned (see ROADMAP.md) but not built.

`update_json.py` used to live in `next-caltrain-swift` as
`tools/convert_schedule.py`, and was the script actually used in the
documented cross-repo publish workflow (see swift's `docs/GIT_WORKFLOW.md`,
now updated). It moved here as of 2026-06-18, since this repo is the
canonical source for the CSVs it reads — see ROADMAP.md "Repo mission
shift". Since 2026-10-20 it's the only output of the pipeline — the PWA
reads the same `feed/schedule.json` the iOS/Android clients do.

### Holiday schedule: hand-maintained again, with a GTFS shadow file
Caltrain publishes a "Modified Schedule" timetable PDF covering a handful of
upcoming holiday/modified-schedule days at a time (e.g.
https://www.caltrain.com/media/36013/, covering Nov 28 2025, Dec 24 2025, and
Jan 19 2026). `holiday_north.csv`/`holiday_south.csv` are hand-maintained
against this PDF (by having AI transcribe it exactly — station list, train
numbers, every departure time) and are the canonical files the pipeline
ships. Briefly, on 2026-06-17, these were switched to being written
directly by `generate.py` from GTFS, like weekday/weekend — but GTFS's
holiday output disagrees with the published PDF on four specific points
(see docs/HOLIDAY.md), so as of 2026-06-18 the canonical files are
hand-maintained again.

`generate.py` still parses holiday from GTFS, but writes that output to
`data/_holiday_north.csv`/`data/_holiday_south.csv` instead of the
canonical names — an underscore-prefixed comparison/diagnostic pair, not
something any downstream script reads. This is the general policy for any
schedule type where GTFS doesn't match Caltrain's published PDF: write the
GTFS output to an `_`-prefixed shadow file rather than overwriting the
canonical one, so the discrepancy (1) stays visible and (2) has a ready
diff to hand to Caltrain when reporting it. Weekday/weekend don't need this
— they match their PDFs — so `generate.py` writes them straight to the
canonical names.

The four known discrepancies — wrong Diridon times on a few specific trips,
a College Park stop attached to the wrong trip number, a wrong date in
`calendar_dates.txt` for one holiday, and a Tamien stop attached to
ordinary Local trips that the published PDF doesn't show (found
2026-06-18) — are documented with specifics in docs/HOLIDAY.md, for
reporting to Caltrain.

### Target approach (see ROADMAP.md)
The remaining gap is the date-folder/auto-deploy pipeline and a validation
layer described in ROADMAP.md — the GTFS parsing itself is done for all
three schedules.

### Published endpoint
`https://next-caltrain-pwa.appspot.com/feed/schedule.json` (the legacy
`/schedule.json` serves the frozen `webapp/schedule.json` — see
`feed/README.md`)

The `scheduleDate` field is an epoch-ms
timestamp, shown to users in the apps' About screens as the date the
schedule data is "as of". As of 2026-06-18 it's sourced from
`data/feed_version.json`, which `generate.py` writes from the GTFS feed's
own `feed_info.txt` `feed_version` field — Trillium's build timestamp for
the feed, e.g. `UTC: 10-Jun-2026 22:25` — not from local CSV mtimes. mtimes
only reflected when someone last ran the generate sequence, so
`scheduleDate` (and the JSON itself) used to change on every
rerun even when Caltrain hadn't published anything new. Both
`update_json.py` falls back to the old mtime-based
calculation if `data/feed_version.json` is missing.

An earlier version of this also folded in `holiday_*.csv`'s filesystem
mtime via `max()`, on the theory that a hand-edit to that hand-maintained
file should bump the date too. Dropped on 2026-06-18: `git checkout`/`reset`
stamp file mtimes with "now" regardless of content, so that fold-in made
`scheduleDate` change on every fresh checkout - the exact instability this
mechanism exists to prevent, just triggered a different way. `scheduleDate`
is now `feedVersionMs` alone; a holiday-only PDF edit (no GTFS feed change)
won't bump it until Caltrain's next feed update.

That's an intentional, not just expedient, choice: weekday/weekend service
is what the overwhelming majority of riders see day to day, while holiday
service affects well under 1% of trips. The GTFS feed's own build
timestamp is the one unambiguous, externally-verifiable signal for "has the
schedule that matters to almost everyone changed" - a hand edit to the
holiday CSVs is real, but rare and low-impact enough that it doesn't need
its own freshness signal mixed into the same field.

The PWA itself is live at the same App Engine app's root,
https://next-caltrain-pwa.appspot.com/ — it's an actively published app, not
just a hosting shell for the JSON.

## CaltrainService.js: no longer the reference

`src/CaltrainService.js` was the canonical routing logic, but since
2026-10-21 **next-caltrain-swift is the baseline** (Woodie agreed): the
Swift and Kotlin apps grew past this one (`TripViewModel`, tomorrow's
trips, saved stations), and next-caltrain-react ports from Swift. When
debugging routing in any app, compare against `CaltrainService.swift`.

## This feed, and next-caltrain-react's GTFS feed

**This repo's `feed/schedule.json` is still production:** the iOS and
Android apps read `https://next-caltrain-pwa.appspot.com/feed/schedule.json`.
Woodie is meeting Caltrain staff before anything changes.

Since 2026-10-21, next-caltrain-react also builds a feed, from GTFS alone
and with no server: GitHub Actions port `generate.py` and `update_json.py`
to TypeScript, open a pull request for each new timetable (with a proposed
go-live date a person corrects), and switch it live on its date. It's at
`https://next-caltrain-app.appspot.com/feed/schedule.json`. Compared with
this feed: stations, weekday, weekend and `scheduleDate` are identical;
the holiday tables and special dates differ exactly where GTFS disagrees
with Caltrain's PDF (`docs/HOLIDAY.md`: Tamien stops on Local trains,
Diridon times, College Park on #143 vs #141, MLK Day 2027-01-27 vs 01-18),
plus this feed's hand-maintained special dates running past the GTFS
timetable's end (2027-01-31). To compare, download both with
`curl --compressed` (App Engine sometimes sends gzip unasked) and compare
each key with `jq -S`.

The Ruby-free PWA here also gained the "Create Calendar Event" planner
(issue #39, PR #40).

## Running locally

Frontend (vanilla JS/HTML/CSS — there is no `npm start`; it's static):
```bash
npm install
npm run build     # babel-transpiles src/ into webapp/script.js
```

Serve it rather than opening `webapp/index.html` from disk, since the PWA
fetches its schedule from `/feed/schedule.json`. `npm run server` runs
`serve.mjs`, a dependency-free Node server mirroring `app.yaml`'s handlers
(`webapp/` at the root, the feed at `/feed/schedule.json`) — keep the two in
step:
```bash
npm run server
open http://localhost:8000/
```

## Deploying

For a schedule update (new GTFS feed or holiday PDF), follow
`docs/PUBLISHING.md` start to finish — it covers generate, validate,
publish, and rollback in order.

**Deploys here are still by hand** (`npm run deploy`, from Woodie's Mac).
Woodie's other App Engine sites (netpress, johnwoodell, liamwoodell,
next-caltrain-react) deploy from GitHub Actions on every push to their
default branch, through a shared Workload Identity pool; this repo isn't
on it yet. Adding it is one deploy account plus a workflow (see the
cross-project notes), but since this repo serves the production feed,
deploying on every push to `master` is a decision for Woodie. Deploying
also redeploys `feed/schedule.json`; check it afterwards.

For non-schedule frontend changes, just rebuild and deploy:
```bash
npm run build    # rebuild webapp/script.js from src/
npm run deploy   # gcloud app deploy app.yaml --quiet — ships webapp/ and
                  # feed/ to App Engine, immediately, no date gate
```
