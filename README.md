# Next Caltrain PWA

This Caltrain schedule is a progressive web app (PWA) designed for KaiOS phones without a touchscreen.
The Alcatel `GO FLIP` and `SMARTFLIP` phones run on `KaiOS` which incorporates a modern Firefox browser.

| Supported Phones  | Model | OS          | Browser    | Javascript | Full-Screen |
| ----------------- | ------|------------ | ---------- | ---------- | ----------- |
| Alcatel SMARTFLIP | 4052R | KaiOS 2.5.2 | Firefox 48 | ES 2016    | Yes         |
| Alcatel GO FLIP   | 4044O | KaiOS 1.0   | Firefox 37 | ES 2015    | No          |

## Project History and Goals

This project started as a port of our [our other project](https://github.com/woodie/next-caltrain-pwa)
that runs on J2ME phones. This app will function on any device with an ES 2015 capable browser.
We may also consider publishing an an app to the KaiOS store.

## Project Status

This app is fully functional, but there is room for improvement:
- Each day should extend two hours into the next morning.
- Trips that require a transfer stop should be supported. 
- Users should be warned to avoid the function keys.

## Keypad Actions (proposed)

The directional keys may not work so use `[5]` and `[8]` to move the selection up and down.

    [OK] - SELECT
    [back] - BACK (on GO FLIP)
    [hangup] - BACK/EXIT
    [5][8] - Move the seletion up and down.
    [4][6] - Change origin station.
    [7][9] - Change destination station.
    [0] - Flip the direction of the selected stations.
    [#] - Swap between weekday/weekend schedules.
    [2] - To hide the cursor (and nagivate with 5 and 8).
    [*] - Acess the menu for help and settings.

![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/phones.png)

<img width="33%" src="https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/hero.png" valign="top">
<img width="33%" src="https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/grid.png" valign="top">
<img width="33%" src="https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/trip.png" valign="top">
