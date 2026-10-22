# Holiday/modified-schedule GTFS discrepancies to report to Caltrain

**Feed:** `http://data.trilliumtransit.com/gtfs/caltrain-ca-us/caltrain-ca-us.zip`
(Trillium-published Caltrain GTFS)
**Service:** the calendar_dates-only "holiday / modified schedule" service,
`service_id` `c_71743_b_none_d_0` in the feed pulled 2026-06-17
**Compared against:** Caltrain's published "Modified Schedule" timetable PDF
(currently https://www.caltrain.com/media/36463/), which uses the same recurring
train pattern for every holiday/modified-schedule day

**Holiday page:** https://www.caltrain.com/schedules/holiday-service-schedules
(2026 dates; says the Presidents' Day timetable was "updated due to Jan 31,
2026 Caltrain service change and includes restored electric train service to
Tamien station", and that each modified timetable is released a few weeks
before its holiday)

**Timetable PDFs** (newest first):

| Link | File | Covers |
|---|---|---|
| https://www.caltrain.com/media/36463/ | `CT_Modified_Schedule_PresidentDay2026_FINAL.pdf` | Presidents' Day, Feb 16 2026; current, checked below |
| https://www.caltrain.com/media/36013/ | `CT_Modified_Schedule_2025-2026_FINAL.pdf` | 2025–2026 holidays; superseded |
| https://www.caltrain.com/media/34616/ | `CT_Modified_Schedule_MLK_2025_FINAL_0.pdf` | MLK Day 2025 |

`data/holiday_north.csv`/`data/holiday_south.csv` are hand-transcribed from
media/36013 and remain the canonical files shipped to riders. `generate.py`
also parses the same GTFS service directly, but writes that output to
`data/_holiday_north.csv`/`data/_holiday_south.csv` - an underscore-prefixed
pair of comparison/diagnostic files, not the canonical names - because the
two disagreed on items 2–4 and we don't know which side Caltrain
considers correct. This mirrors the policy used elsewhere in `generate.py`:
GTFS is the default source of truth, but where it disagrees with Caltrain's
own published PDF, the GTFS output gets the `_` prefix instead of
overwriting the canonical file, so the discrepancy stays visible and the
diff is ready to hand to Caltrain. Re-diff `_holiday_*.csv` against
`holiday_*.csv` whenever the GTFS feed is refreshed, to check whether
Caltrain has fixed the underlying data.

## 1. Wrong calendar date for Martin Luther King Jr. Day

`calendar_dates.txt` lists exactly four dates for this service_id:

| date | holiday_name |
|---|---|
| 2026-02-16 | President's Day |
| 2026-11-27 | Day after Thanksgiving |
| 2026-12-24 | Christmas Eve |
| **2027-01-27** | **Martin Luther King Jr. Day** |

January 27, 2027 is a **Wednesday**. MLK Day is always the third Monday in
January; in 2027 that's **Monday, January 18** — which is also exactly what
`data/holiday_service.js` (a hand-maintained list sourced from
https://www.caltrain.com/schedules/holiday-service, kept independently of
this GTFS feed) lists for MLK Day 2027. The other three dates are all
correctly placed too (President's Day, day-after-Thanksgiving, and
Christmas Eve all land on their real calendar dates that year), so this
looks like an isolated data-entry slip on the MLK entry specifically —
`2027-01-27` should be `2027-01-18`.

## Resolved: items 2–4 were the old timetable, not GTFS errors

**Checked 2026-10-22** against media/36463 (Presidents' Day 2026), every
train and stop in both directions: GTFS matches it exactly, 0 differences.
Items 2–4 below compared GTFS with media/36013, which predates the
Jan 31, 2026 service change. GTFS already had the new timetable; our PDF
didn't. Nothing here to report to Caltrain.

Our hand-transcribed `holiday_north.csv`/`holiday_south.csv` (and so the
production feed) still have the old timetable: 44 differences from
media/36463, all of them items 2–4:

| Was | Old PDF (our CSVs) | Current PDF = GTFS |
|---|---|---|
| 2. Diridon, northbound 141 | 2:53p | 2:58p |
| 2. Diridon, northbound 143 | 3:28p | 3:23p |
| 2. Diridon, southbound 104 | 6:52a | 7:03a |
| 2. Diridon, southbound 108 | 8:14a | 8:23a |
| 3. College Park, northbound | 141 at 3:01p | 143 at 3:31p |
| 4. Tamien on Local trains | not served | 19 northbound, 19 southbound |

The 2026-10-20 College Park correction (#36) still holds for the old PDF:
3:01p is under 141 on media/36013.

Next: switch the canonical holiday CSVs to the GTFS output, and check the
Nov 27 and Dec 24 timetables when Caltrain releases them.
