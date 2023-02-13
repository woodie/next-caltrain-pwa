# Next Caltrain PWA

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

## History and Goals

This project started as a port of our [our other project](https://github.com/woodie/Caltrain-Schedule-MIDlet)
that runs on J2ME phones. This app will function on any device with an ES 2015 capable browser.

Early on, we decided not to use any frameworks, not even jQuery. This app is just vanilla JS, HTML and CSS.

## Develop and Deploy

This is mostly a PWA writtend in `VanillaJS` and transcompiled to support older phones. We scrape status from
[the Caltrain website](https://www.caltrain.com/alerts?active_tab=service_alerts_tab)
and will (eventually) maintain a copy in App Engine
[datastore](https://github.com/GoogleCloudPlatform/ruby-docs-samples/blob/main/appengine/standard-datastore/app.rb).

### Backend

After making Ruby changes, update the specs and test the backend locally.
```
bundle exec standardrb --fix
bundle exec rspec -fd

bundle exec ruby app.rb
open http://localhost:4567/status
```
Note: The [Local development server](https://cloud.google.com/appengine/docs/standard/tools/local-devserver-command?tab=ruby)
is **not currently** supported for the Ruby runtime so App Engine features and APSs
can only be tested after deploying to the cloud.

### Frontend

After making JS changes, build the app and browse the HTML file locally.
```
npm run build
open webapp/index.html
```

Authenticate and deploy to App Engine (after updating the project name in `package.json`).
```
gcloud auth login
npm run deploy
```

## Project Status

This app is fully functional, with support for Weekday, Saturday and Sunday Schedules.
Trips that require a transfer stop should also be supported. From any KaiOS phone, visit:
http://next-caltrain-pwa.appspot.com

When the app is installed with WebIDE, we get D-Pad events and can change the softkey labels.
When simply running in the browser, we have two major limitations. We need to convert `mousemove`
events to the associated D-Pad events which is tricky, and we can't change the softkey labels
so we have two sets of options from the same softkey.

This app is avialable from [the KaiStore](https://www.kaiostech.com/store/apps/?bundle_id=com.netpress.nextcaltrain).

<kbd><img src="https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/store-listing.png" /></kbd>
&nbsp;
<kbd><img src="https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/store-details.png" /></kbd>

### Website in KaiOS browser

![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/1.1.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/1.2.png) &nbsp;
![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/1.3.png)

### Hosted App from KaiStore

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

![alt text](https://raw.githubusercontent.com/woodie/next-caltrain-pwa/master/docs/phones.jpg)

