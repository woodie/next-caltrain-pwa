# Holiday/modified-schedule GTFS discrepancies to report to Caltrain

**Feed:** `http://data.trilliumtransit.com/gtfs/caltrain-ca-us/caltrain-ca-us.zip`
(Trillium-published Caltrain GTFS)
**Service:** the calendar_dates-only "holiday / modified schedule" service,
`service_id` `c_71743_b_none_d_0` in the feed pulled 2026-06-17
**Compared against:** Caltrain's published "Modified Schedule" timetable PDF
(e.g. https://www.caltrain.com/media/36013/), which uses the same recurring
train pattern for every holiday/modified-schedule day

`data/holiday_north.csv`/`data/holiday_south.csv` are hand-transcribed from
this PDF and remain the canonical files shipped to riders. `generate.py`
also parses the same GTFS service directly, but writes that output to
`data/_holiday_north.csv`/`data/_holiday_south.csv` - an underscore-prefixed
pair of comparison/diagnostic files, not the canonical names - because the
two disagree on the items below and we don't know which side Caltrain
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

## 2. San Jose Diridon times disagree with the published timetable

| Direction | Trip | GTFS departure | PDF/timetable departure |
|---|---|---|---|
| Northbound | 141 | 14:58 (2:58p) | 14:53 (2:53p) |
| Northbound | 143 | 15:23 (3:23p) | 15:28 (3:28p) |
| Southbound | 104 | 7:03a | 6:52a |
| Southbound | 108 | 8:23a | 8:14a |

Every other station/trip pair we checked in both directions matches
exactly, so this isn't a systemic offset — it's specific to these four
trip/station combinations.

## 3. College Park stop attached to the wrong trip number (northbound)

GTFS has a College Park stop on trip **143** at 15:31 (3:31p). The published
timetable instead shows College Park served by trip **139**, at 15:01
(3:01p), with no College Park stop on 143. Combined with item 2 above (both
141 and 143's Diridon times being off), this looks like a single
transcription error in the feed that shifted both a stop and its time onto
the wrong trip — but we're flagging the data, not guessing at the fix.

## 4. Tamien stop attached to ordinary Local trains, not on the published timetable

The holiday/modified-schedule GTFS attaches a stop_times row at Tamien to
about 19 northbound and 20 southbound ordinary Local trips that never run
the South County Connector branch (trips 101, 105, 109, 113, 117, 121, 125,
129, 133, 137, 141, 145, 149, 153, 157, 161, 165, 169, 173 northbound;
104, 108, 112, 116, 120, 124, 128, 132, 136, 140, 144, 148, 152, 156, 160,
164, 168, 172, 176 southbound). Caltrain's published Modified Schedule PDF
(media/36013) shows Tamien served only by the two genuine South County
Connector trips each direction (819/825 northbound, 840/848 southbound) -
none of the Local trips above show a Tamien departure on the PDF.

This looked, at first, like the same "spurious row" pattern this project
previously (and incorrectly) filtered out of the regular weekday/weekend
schedule too - see `generate.py`'s module docstring for that story. The
key difference: when checked against Caltrain's published *weekday and
weekend* timetables, the equivalent Tamien rows on Local trips turned out
to be genuine, scheduled stops. When this holiday/modified-schedule case is
checked the same way against the holiday PDF, the Tamien rows on Local
trips do *not* appear on the published timetable. So unlike weekday/
weekend, this looks like a real holiday-specific GTFS data problem - one of
four reasons (alongside items 1-3 above) we're not trusting GTFS's holiday
output outright. Rather than silently correcting it in code (see the lesson
in `generate.py`), we keep the hand-transcribed PDF version as canonical
and write GTFS's version to `_holiday_north.csv`/`_holiday_south.csv` so
the mismatch stays visible and documented here for Caltrain.
