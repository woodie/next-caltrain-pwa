# feed/

`schedule.json` is a frozen copy of the schedule, served at
`/feed/schedule.json` only for the iOS 1.3 build in App Review, which reads
it from this site. The PWA, the KaiOS app and newer iOS and Android builds
read https://next-caltrain-app.appspot.com/feed/schedule.json instead.

Once an iOS build that reads the app feed is submitted, delete this folder
and its handler in `app.yaml`. The pipeline that used to build it is in git
history, before the "Retire the feed pipeline" commit.
