# Holiday/modified-schedule GTFS discrepancies to report to Caltrain

**Feed:** `http://data.trilliumtransit.com/gtfs/caltrain-ca-us/caltrain-ca-us.zip`
(Trillium-published Caltrain GTFS)
**Service:** the calendar_dates-only "holiday / modified schedule" service,
`service_id` `c_71743_b_none_d_0` in the feed pulled 2026-06-17
**Compared against:** Caltrain's published "Modified Schedule" timetable PDF
(e.g. https://www.caltrain.com/media/36013/), which uses the same recurring
train pattern for every holiday/modified-schedule day

As of 2026-06-17, `next-caltrain-pwa` switched its holiday schedule from a
hand-transcribed copy of this PDF over to parsing this GTFS service
directly (see `generate.py`). One real GTFS encoding (a stop_times row for
the Tamien transfer connection on ordinary Local trains) turned out to be
intentional, not a bug, and is now filtered out in our own code — not
listed here. The items below are genuine disagreements between the GTFS
data and Caltrain's own published timetable that we can't resolve on our
end, since we don't know which side is correct.

## 1. Wrong calendar date for Martin Luther King Jr. Day

`calendar_dates.txt` lists exactly four dates for this service_id:

| date | holiday_name |
|---|---|
| 2026-02-16 | President's Day |
| 2026-11-27 | Day after Thanksgiving |
| 2026-12-24 | Christmas Eve |
| **2027-01-27** | **Martin Luther King Jr. Day** |

January 27, 2027 is a **Wednesday**. MLK Day is always the third Monday in
January; in 2027 that's **Monday, January 18**. The other three dates are
all correctly placed (President's Day, day-after-Thanksgiving, and
Christmas Eve all land on their real calendar dates that year), so this
looks like an isolated data-entry slip on the MLK entry specifically, not a
systemic pattern problem.

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

## What we're not reporting

The feed also attaches a stop_times row at Tamien (and the other South
County branch stations) to many ordinary Local trains that don't run the
South County branch. We initially treated this as a candidate GTFS bug, but
it represents a real, scheduled rider transfer at Tamien that Caltrain
intentionally surfaces — `next-caltrain-pwa` just doesn't display transfer
detail, only departure times, so we filter it out in our own generator
instead of asking Caltrain to change it.
