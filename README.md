# Next Caltrain PWA

This is a Caltrain Schedule for modern Alcatel flip phones.
The Alcatel `GO FLIP` and `SMARTFLIP` phones run on `KaiOS` which
incorporates a modern Firefox browser with geo location capabilities.
The `SMARTFLIP` supports full-screen mode but the `GO FLIP` does not,
so this scredule will function in both modes.

| Supported Phones  | Model | OS          | Browser    | Javascript | Full-Screen |
| ----------------- | ------|------------ | ---------- | ---------- | ----------- |
| Alcatel SMARTFLIP | 4052R | KaiOS 2.5.2 | Firefox 48 | ES 2016    | Yes         |
| Alcatel GO FLIP   | 4044O | KaiOS 1.0   | Firefox 37 | ES 2015    | No          |

## Project Goals

Once we have a full-featured web app with stored station preferences,
we can look into publishing as an app in the KaiOS store. For now,
this app will simply function as a destination URL in the browser.

## Project Status

This is currently a UI prototype, but it will be trivial to port features from
[our other project](https://github.com/woodie/Caltrain-Schedule-MIDlet)
that runs on J2ME phones.

## Keypad Actions (proposed)

Events from the `directional keys` (up, down, left, right) are  only accessible on `SMARTFLIP`,
so `GO FLIP` can only use `[5]` (page up) and `[8]` (page down) keys to select a trip.
The `OK` key can also be used for select on the `SMARTFLIP`.

    [1] - Zoom in (browser feature)
    [2] - Lock Cursor (n/a in full-screen mode)
    [3] - Zoom out (browser feature)
    [5] - Page up
    [8] - Page down
    [4] - Set origin station South
    [6] - Set origin station North
    [7] - Set destination station South
    [9] - Set destination station North
    [*] - Option menu
    [0] - Swap departure and arrival stations
    [#] - Swap current and weekend/weekday schedules
    [answer] - Select
    [hangup] - Exit

<img width="33%" src="https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/part-screen.png">
<img width="33%" src="https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/full-screen.png">
