# Next Caltrain PWA

Although this KaiOS app was a fun project it's now deprecated.
Project now provides schedule data for the smartphone apps for
[iOS](https://github.com/woodie/next-caltrain-swift) and
[Android](https://github.com/woodie/next-caltrain-kotlin),

## Generate new schedule
```bash
npm run generate # download the GTFS feed and write the CSVs in data/
npm run convert  # convert the CSVs into feed/schedule.json
npm run validate # check feed/schedule.json and diff it against HEAD
npm run schedule # all three of the above, in order
npm run deploy   # publish to App Engine (commit first)
```
See [docs/PUBLISHING.md](docs/PUBLISHING.md) for the full runbook and rollback.

## Run the legacy app
```bash
npm run build  # transpile src/ into webapp/script.js
npm run server # serve the app at http://localhost:8000/
npm test       # run the unit tests with Vitest
npm run lint   # lint with ESLint and fix what it can
npm run check  # lint and test without fixing, before a push
```

## Lagacy project status

This Caltrain schedule is a progressive web app (PWA) designed for KaiOS phones without a touchscreen.
This app runs in the KaiOS browser for phones without access to the store. The app can also be sideloaded.

| Targeted Phones   | OS          | Browser    | Javascript | System chip    | Sideload |
| ----------------- | ----------- | ---------- | ---------- | -------------- | -------- |
| Nokia 2780 Flip   | KaiOS 3.1   | Firefox 78 | ES 2018    | Snapdragon 215 |          |
| Alcatel GO Flip 3 | KaiOS 2.5.2 | Firefox 48 | ES 2016    | Snapdragon 210 | No       |
| Alcatel SMARTFLIP | KaiOS 2.5.2 | Firefox 48 | ES 2016    | Snapdragon 210 | No       |
| Nokia 2720 Flip   | KaiOS 2.5.2 | Firefox 48 | ES 2016    | Snapdragon 205 | Yes      |
| Nokia 8110 4G     | KaiOS 2.5.1 | Firefox 48 | ES 2016    | Snapdragon 205 | Yes      |
| Alcatel GO Flip   | KaiOS 1.0   | Firefox 37 | ES 2015    | Snapdragon 210 | Yes      |

This app is avialable from [the KaiStore](https://www.kaiostech.com/store/apps/?bundle_id=com.netpress.nextcaltrain).

![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/phones.jpg)

![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/0.1.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/0.2.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/0.3.png)
