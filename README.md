# Next Caltrain PWA

This Caltrain schedule is a progressive web app (PWA) designed for KaiOS phones without a touchscreen.
This app runs in the KaiOS browser for phones without access to the store. The app can also be sideloaded.

| Targeted Phones   | OS          | Browser    | Javascript | System chip    | Sideload |
| ----------------- | ----------- | ---------- | ---------- | -------------- | -------- |
| Alcatel GO FLIP 3 | KaiOS 2.5.2 | Firefox 48 | ES 2016    | Snapdragon 210 | No       |
| Nokia 2720 Flip   | KaiOS 2.5.2 | Firefox 48 | ES 2016    | Snapdragon 205 | Yes      |
| Alcatel SMARTFLIP | KaiOS 2.5.2 | Firefox 48 | ES 2016    | Snapdragon 210 | No       |
| Nokia 8110 4G     | KaiOS 2.5.1 | Firefox 48 | ES 2016    | Snapdragon 205 | Yes      |
| Alcatel GO FLIP   | KaiOS 1.0   | Firefox 37 | ES 2015    | Snapdragon 210 | Yes      |

**Note: KaiOS 3.0 phones will be on Firefox 78 with ES 2018 support.**

## History and Goals

This project started as a port of our [our other project](https://github.com/woodie/Caltrain-Schedule-MIDlet)
that runs on J2ME phones. This app will function on any device with an ES 2015 capable browser.

## Development

After making JS changes, `npm run build`, then browse `webapp/index.html`.

## Project Status

This app is fully functional, with support for Weekday, Saturday and Sunday Schedules.
Trips that require a transfer stop should be supported. From your KaiOS phone, visit:
http://next-caltrain-pwa.appspot.com

We're able to convert `mousemove` events to the associated D-Pad events,
and we're able to override browser `keydown` events on the keypad and
softkeys. Unfortunately, we can't change or softkey labels, so note 
that the left softwey should read `MENU`.

### Website on KaiOS 1.0 phones

![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/1.1.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/1.2.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/1.3.png)

### Website on KaiOS 2.5 phones

![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/2.1.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/2.2.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/2.3.png)

### Packaged Kaios App (sideload with WebIDE)

![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/0.1.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/0.2.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/0.3.png)

### Keypad Commands

![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/help0.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/help1.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/help2.png)

![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/help3.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/help4.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/help5.png)

![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/phones.png)

