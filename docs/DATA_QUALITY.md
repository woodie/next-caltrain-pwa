# Schedule data quality

Caltrain publishes six schedules (weekday, weekend and modified, each
northbound and southbound) two ways: as GTFS, used by other apps and Google
Maps, and as website schedules and PDFs, used by people. We compare the two.

**MLK Day 2027 is wrong in GTFS.** It's listed as Wednesday, January 27,
2027. MLK Day is Monday, January 18, 2027.

| Schedule | Compared against | Result |
|---|---|---|
| Weekday and weekend | Website schedules[^1] | GTFS matches |
| Modified | Presidents' Day 2026 PDF[^2] | GTFS matches |
| Modified dates | Holiday page[^3] | MLK Day 2027 is wrong in GTFS |

GTFS schedules as tables: weekday
[north](https://github.com/woodie/next-caltrain-pwa/blob/master/data/weekday_north.csv)/[south](https://github.com/woodie/next-caltrain-pwa/blob/master/data/weekday_south.csv),
weekend
[north](https://github.com/woodie/next-caltrain-pwa/blob/master/data/weekend_north.csv)/[south](https://github.com/woodie/next-caltrain-pwa/blob/master/data/weekend_south.csv),
modified
[north](https://github.com/woodie/next-caltrain-pwa/blob/master/data/holiday_north.csv)/[south](https://github.com/woodie/next-caltrain-pwa/blob/master/data/holiday_south.csv).

[^1]: https://www.caltrain.com/schedules, weekday and weekend trains in one table.
[^2]: https://www.caltrain.com/media/36463/, Feb 16, 2026. Links to older PDFs stay up around the web: [2025–2026](https://www.caltrain.com/media/36013/) (Nov 28 and Dec 24, 2025; Jan 19, 2026) predates the Jan 31, 2026 service change, so Tamien, College Park and four Diridon times differ; [MLK 2025](https://www.caltrain.com/media/34616/) (Jan 20, 2025) is an older timetable.
[^3]: https://www.caltrain.com/schedules/holiday-service-schedules
