# Next Caltrain for KaiOS

A Caltrain schedule for KaiOS phones without a touchscreen. It runs as a
progressive web app (PWA) in the KaiOS browser and as an installed app.
The schedule comes from the feed that
[next-caltrain-react](https://github.com/woodie/next-caltrain-react) builds
from Caltrain's GTFS, the same feed the
[iOS](https://github.com/woodie/next-caltrain-swift) and
[Android](https://github.com/woodie/next-caltrain-kotlin) apps read.

## Run the app
```bash
npm run build  # transpile src/ into webapp/script.js
npm run server # serve the app at http://localhost:8000/
npm test       # run the unit tests with Vitest
npm run lint   # lint with ESLint and fix what it can
npm run check  # lint and test without fixing, before a push
```

## Phones

| Phone             | OS          | Browser    | JavaScript | System chip    | Sideload |
| ----------------- | ----------- | ---------- | ---------- | -------------- | -------- |
| Nokia 2780 Flip   | KaiOS 3.1   | Firefox 78 | ES 2018    | Snapdragon 215 |          |
| Alcatel GO Flip 3 | KaiOS 2.5.2 | Firefox 48 | ES 2016    | Snapdragon 210 | No       |
| Alcatel SMARTFLIP | KaiOS 2.5.2 | Firefox 48 | ES 2016    | Snapdragon 210 | No       |
| Nokia 2720 Flip   | KaiOS 2.5.2 | Firefox 48 | ES 2016    | Snapdragon 205 | Yes      |
| Nokia 8110 4G     | KaiOS 2.5.1 | Firefox 48 | ES 2016    | Snapdragon 205 | Yes      |
| Alcatel GO Flip   | KaiOS 1.0   | Firefox 37 | ES 2015    | Snapdragon 210 | Yes      |

On KaiOS 2.5 phones it's in the KaiStore: search for Next Caltrain.

![Phones running Next Caltrain](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/phones.jpg)

![Screenshot](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/0.1.png) &nbsp;
![Screenshot](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/0.2.png) &nbsp;
![Screenshot](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/0.3.png)

## Schedule feed

This repo used to build the schedule feed; that pipeline is in git history.
`feed/schedule.json` is a frozen copy kept only for the iOS 1.3 build in
App Review (see [feed/README.md](feed/README.md)).
