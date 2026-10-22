# Schedule data quality

Next Caltrain shows six schedules: weekday, weekend and modified (holiday),
each northbound and southbound. All six come from Caltrain's GTFS feed. We
assume GTFS is Caltrain's most recent data, but riders never see GTFS
directly, so we always compare it against what Caltrain publishes for
riders: the timetable on caltrain.com and the timetable PDFs.

The six schedules, as tables laid out like Caltrain's timetables:

| | Northbound | Southbound |
|---|---|---|
| Weekday | [weekday_north.csv](https://github.com/woodie/next-caltrain-pwa/blob/master/data/weekday_north.csv) | [weekday_south.csv](https://github.com/woodie/next-caltrain-pwa/blob/master/data/weekday_south.csv) |
| Weekend | [weekend_north.csv](https://github.com/woodie/next-caltrain-pwa/blob/master/data/weekend_north.csv) | [weekend_south.csv](https://github.com/woodie/next-caltrain-pwa/blob/master/data/weekend_south.csv) |
| Modified | [holiday_north.csv](https://github.com/woodie/next-caltrain-pwa/blob/master/data/holiday_north.csv) | [holiday_south.csv](https://github.com/woodie/next-caltrain-pwa/blob/master/data/holiday_south.csv) |

## Summary, October 22, 2026

| Schedule | Compared against | Result |
|---|---|---|
| Weekday and weekend | caltrain.com timetable | Matches GTFS: every train and stop |
| Modified | Presidents' Day 2026 PDF, the newest | Matches GTFS: every train and stop |
| Modified dates | caltrain.com holiday page | **One wrong date in GTFS:** MLK Day 2027 |

## Weekday and weekend

The timetable on caltrain.com (for example on
https://www.caltrain.com/schedules/holiday-service-schedules) lists weekday
and weekend trains together: 89 trains each way, 3,694 stop times. Every
one matches GTFS's weekday and weekend schedules.

## Modified schedule (holidays)

This has always been the hard one. Caltrain releases a new Modified
Schedule PDF a few weeks before each holiday that uses it, and links to old
PDFs stay up all over the web. So for each PDF we note which dates it
covers and how it compares with GTFS.

**Holiday page:** https://www.caltrain.com/schedules/holiday-service-schedules
lists the 2026 dates. Modified schedule days: MLK Day (Jan 19), Presidents'
Day (Feb 16), the day after Thanksgiving (Nov 27) and Christmas Eve
(Dec 24). Its note on Presidents' Day: "Modified Schedule updated due to
Jan 31, 2026 Caltrain service change and includes restored electric train
service to Tamien station."

**PDFs**, newest first:

| PDF | Dates covered | Compared with GTFS |
|---|---|---|
| [Presidents' Day 2026](https://www.caltrain.com/media/36463/) | Feb 16, 2026 | Matches: every train and stop, both directions |
| [2025–2026](https://www.caltrain.com/media/36013/) | Nov 28 and Dec 24, 2025; Jan 19, 2026 | Earlier version; differs as below |
| [MLK 2025](https://www.caltrain.com/media/34616/) | Jan 20, 2025 | Older timetable; about 60% of times differ |

The 2025–2026 PDF is the same timetable as GTFS except:

| | 2025–2026 PDF | Presidents' Day 2026 PDF and GTFS |
|---|---|---|
| San Jose Diridon, northbound #141 | 2:53p | 2:58p |
| San Jose Diridon, northbound #143 | 3:28p | 3:23p |
| San Jose Diridon, southbound #104 | 6:52a | 7:03a |
| San Jose Diridon, southbound #108 | 8:14a | 8:23a |
| College Park, northbound | #141 at 3:01p | #143 at 3:31p |
| Tamien | South County Connector trains only (VTA bus to Diridon) | Also 19 Local trains each way |

We first read these as GTFS errors. They weren't: GTFS already had the
timetable from the Jan 31, 2026 service change, and the PDF we compared
against was older.

## For Caltrain

**MLK Day 2027 has the wrong date in GTFS.** GTFS lists four modified
schedule dates:

| Date | Holiday |
|---|---|
| Feb 16, 2026 | Presidents' Day |
| Nov 27, 2026 | Day after Thanksgiving |
| Dec 24, 2026 | Christmas Eve |
| **Jan 27, 2027** | **Martin Luther King Jr. Day** |

January 27, 2027 is a Wednesday. MLK Day is the third Monday in January:
**January 18, 2027**.

## What riders see

Since October 22, 2026 our modified schedule comes from GTFS. Before that
it was copied by hand from the 2025–2026 PDF, so it had the older times
above. Riders first see the modified schedule on November 27, 2026. We'll
compare again when Caltrain releases the Nov 27 and Dec 24 PDFs.
