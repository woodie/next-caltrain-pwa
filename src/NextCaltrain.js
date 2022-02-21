let prefs = new LocalStorage(caltrainServiceData.southStops);
let service = new CaltrainService();
let app = false;
let kaiWeb1 = false;
let kaiWeb2 = false;
let kaiWeb = false;
let schedule = null;
let countdown = null;
let trainId = null;
let offset = null;
let goodTime = null;
let skip = false;
let splash = false;
let hintIndex = -1;
let menuIndex = 0;
let listing = null;
let vh = 228;
// window.innerWidth  240
// window.innerHeight 228
// window.outerWidth  240
// window.outerHeight 320

const OK = 13;
const BACK = 95;
const HANGUP = 8;
const ESC = 27;
const UP = 38;
const DOWN = 40;
// const SPLAT = 170;
// const POUND = 163;
// const ZERO = 48;

const screens = 'splash hero grid trip menu about commands prefs'.split(' ');
const titles = {'about':'About Next Caltrain', 'commands':'Keypad commands'};

let hints = [
  ['Set your origin', [1,3],
    'Use [1] and [3] keys to<br/>set your origin station.'],
  ['Set destination', [4,6],
    'Use [4] and [6] keys to<br/>set destination station.'],
  ['Flip direction', ['c'],
    'Press the [CALL] button to<br/>flip the selected stations'],
  ['Change schedule', ['l'],
    'Press the [LEFT] softkey<br/>to cycle through schedules.'],
  ['Save stations', ['r'],
    'Press the [RIGHT] softkey<br/>and select "Save Stations".'],
  ['Bookmark app', ['r'],
    'Press the [RIGHT] softkey<br/>twice to "Pin to Apps Menu".']];

/* exported NextCaltrain */
class NextCaltrain {

  static startApp() {
    if (document.location.search === '?app') app = true;
    else if (document.location.search === '?kaiWeb1' ||
      navigator.userAgent.toLowerCase().indexOf('kaios/1') > -1) kaiWeb1 = true;
    else if (document.location.search === '?kaiWeb2' ||
      navigator.userAgent.toLowerCase().indexOf('kaios/2') > -1) kaiWeb2 = true;
    kaiWeb = (kaiWeb1 || kaiWeb2);
    if (!kaiWeb) {
      document.getElementById('softkey-menu').style['display'] = 'flex';
      document.getElementById('about-filler').style['display'] = 'flex';
      document.getElementById('commands-filler').style['display'] = 'flex';
      document.getElementById('content').className = 'full-screen';
    } else {
      document.getElementById('content').className = 'part-screen';
      document.getElementById('hero-screen').style['display'] = 'none';
      document.getElementById('splash-screen').style['display'] = 'flex';
      splash = true;
    }
    // render a keyboard
    if (window.outerHeight > 320 && !kaiWeb) {
      document.getElementById('keypad').style['display'] = 'flex';
    }
    // setup the app state
    const dateString = GoodTimes.dateString(caltrainServiceData.scheduleDate);
    listing = document.getElementById('listing');
    document.getElementById('date-string').innerHTML = dateString;
    NextCaltrain.attachListeners();
    NextCaltrain.setTheTime();
    NextCaltrain.formatHints();
  }

  static formatHints() {
    if (!kaiWeb) hints = hints.slice(0, 5);
    for (let i = 0; i < hints.length; i++) {
      for (let n = 0; n < 2; n++) {
        hints[i][n * 2] = hints[i][n * 2].replace(/\[/g, '<span class=\'btn\'>').replace(/\]/g, '</span>');
        if (kaiWeb1) hints[i][n * 2] = hints[i][n * 2].replace(/Apps Menu/, 'Top Sites');
      }
    }
  }

  static bumpKeypadHint() {
    hintIndex++;
    if (hintIndex >= hints.length) {
      hintIndex = -1;
      NextCaltrain.displayScreen('hero');
      return;
    } else if (hintIndex === hints.length - 1) {
      NextCaltrain.populateSoftkeyMenu('', 'OK', '');
    }
    document.getElementById('hint-above').innerHTML = hints[hintIndex][0];
    document.getElementById('hint-below').innerHTML = hints[hintIndex][2];
    if (Array.isArray(hints[hintIndex][1])) {
      document.getElementById('mini-keypad').style['display'] = 'flex';
      document.getElementById('hint-center').style['display'] = 'none';
      for (let i = 1; i < 15; i++) {
        let key = (i < 10) ? i : ['l','r','c','o','h'][i - 10];
        let cls = hints[hintIndex][1].indexOf(key) === -1 ? 'default' : 'selected';
        document.getElementById(`k${key}`).className = cls;
      }
    } else {
      document.getElementById('mini-keypad').style['display'] = 'none';
      document.getElementById('hint-center').style['display'] = 'block';
      document.getElementById('hint-center').innerHTML = hints[hintIndex][1];
    }
  }

  static moveMenuSelection() {
    let menuOptions = document.getElementById('menu-list').getElementsByTagName('li');
    if (menuIndex >= menuOptions.length) {
      menuIndex = 0;
    } else if (menuIndex < 0) {
      menuIndex = menuOptions.length - 1;
    }
    for (let i = 0; i < menuOptions.length; i++) {
      menuOptions[i].className = menuIndex === i ? 'selected' : '';
    }
  }

  static setTheTime() {
    let ourTime = new GoodTimes();
    let partTime = ourTime.partTime();
    schedule = new CaltrainSchedule(ourTime);
    document.getElementById('time').innerHTML = partTime[0];
    document.getElementById('ampm').innerHTML = partTime[1].toUpperCase();
    setTimeout( function () { NextCaltrain.setTheTime(); }, (60 - ourTime.seconds) * 1000);
    NextCaltrain.loadSchedule();
  }

  static setCountdown(minutes) {
    let downTime = new GoodTimes();
    let blurb = downTime.countdown(minutes);
    document.getElementById('blurb-grid').innerHTML = blurb;
    document.getElementById('blurb-hero').innerHTML = blurb;
    if (blurb !== '') {
      let refresh = blurb.endsWith('sec') ? 1000 : (60 - downTime.seconds) * 1000;
      countdown = setTimeout( function () { NextCaltrain.setCountdown(minutes); }, refresh);
    }
  }

  static populateStops(labels) {
    document.getElementById('origin-grid').innerHTML = labels[0];
    document.getElementById('destin-grid').innerHTML = labels[1];
    document.getElementById('origin-hero').innerHTML = labels[0];
    document.getElementById('destin-hero').innerHTML = labels[1];
  }

  static populateBlurb(message, textClass) {
    document.getElementById('blurb-grid').innerHTML = message;
    document.getElementById('blurb-grid').className = textClass;
    document.getElementById('blurb-hero').innerHTML = message.replace(' Schedule', '');
    document.getElementById('blurb-hero').className = textClass;
  }

  static populateSoftkeyMenu(left, center, right) {
    document.getElementById('softkey-left').innerHTML = left;
    document.getElementById('softkey-center').innerHTML = center;
    document.getElementById('softkey-right').innerHTML = right;
  }

  static loadTrip(train) {
    goodTime = new GoodTimes();
    let trip = new CaltrainTrip(train, schedule.label());
    let lines = [];
    for (let i=0; i < trip.times.length; i++) {
      let stop = trip.times[i];
      let spacer = (i === 0) ? '' : '|';
      let fullTime = GoodTimes.fullTime(stop[1]);
      let filler = fullTime.length > 6 ? '' : '0';
      let style = (goodTime.inThePast(stop[1])) ? 'message-departed' : 'message-arriving';
      let target = (prefs.origin === stop[0] || prefs.destin === stop[0]) ? 'target' : '';
      lines.push(`<div class="station-stop">
          <div class="station-time"><br/><span
               class="hour-filler">${filler}</span>${fullTime}</div>
          <div class="station-spacer ${style}">${spacer}<br/><span
               class="station-dot ${target}">&#x2022;</span></div>
          <div class="station-name"><br/>${stop[0]}</div></div>`);
    }
    listing.innerHTML = lines.join('\n');
    document.getElementById('trip-filler').innerHTML = trip.label();
    document.title = trip.label();
  }

  static loadSchedule() {
    goodTime = new GoodTimes();
    clearTimeout(countdown);
    NextCaltrain.populateStops(prefs.tripLabels());
    // Load the schedule
    let routes = service.routes(prefs.origin, prefs.destin, schedule.label());
    let minutes = 0;
    if (offset === null) {
      minutes = goodTime.minutes;
      offset = CaltrainService.nextIndex(routes, minutes);
    } else if (offset > routes.length - 1) {
      offset = 0;
    } else if (offset < 0) {
      offset = routes.length - 1;
    }
    // Populate the grid view
    for (let i=0; i < 6; i++) {
      let tripCardElement = document.getElementById(`trip${i}`);
      let n = (offset + i > routes.length - 1) ? offset + i - routes.length : offset + i;
      let route = routes[n];
      if (i > routes.length - 1) {
        if (i === 0) {
          trainId = null;
          NextCaltrain.populateBlurb('NO TRAINS', 'message-departed blink');
          document.getElementById('circle').className = 'selection-departed';
          document.getElementById('trip0').className = 'selection-none';
          document.getElementById('trip').innerHTML = '<span class="time-hero">&nbsp;</span>';
          document.getElementById('trip-type').innerHTML = '&nbsp;';
          document.getElementById('title').innerHTML = 'Next Caltrain';
          document.title = 'Next Caltrain';
        }
        tripCardElement.innerHTML = '<div class="train-time">&nbsp;</div>';
        continue; // clear previous values.
      }
      minutes = route[1];
      let originTime = GoodTimes.partTime(minutes);
      let destinTime = GoodTimes.partTime(route[2]);
      let card = `<div class="train-number">#${route[0]}</div>
          <div class="train-time">${originTime[0]}<span class="meridiem">${originTime[1]}</span></div>
          <div class="train-time">${destinTime[0]}<span class="meridiem">${destinTime[1]}</span></div>`;
      tripCardElement.innerHTML = card;
      if (i === 0) {
        let tripTime = `<span class="train-hero">#${route[0]}</span>
            <span class="time-hero">${originTime[0]}</span>
            <span class="meridiem-hero">${originTime[1]}</span>`;
        document.getElementById('trip').innerHTML = tripTime;
        trainId = route[0];
        let message, textClass, tripClass, wrapClass;
        if (schedule.swapped()) {
          message = schedule.label() + ' Schedule';
          textClass = 'message-departed';
          tripClass = (goodTime.inThePast(minutes)) ? 'message-departed' : '';
          wrapClass = 'selection-departed';
        } else if (goodTime.inThePast(minutes)) {
          message = schedule.label() + ' Schedule';
          textClass = 'message-departed';
          tripClass = 'message-departed';
          wrapClass = 'selection-departed';
        } else if (goodTime.departing(minutes)) {
          message = 'DEPARTING';
          textClass = 'message-departing blink';
          wrapClass = 'selection-departing';
        } else {
          message = goodTime.countdown(minutes);
          textClass = 'message-arriving';
          wrapClass = 'selection-arriving';
          if (minutes > 0) { NextCaltrain.setCountdown(minutes); }
        }
        document.getElementById('circle').className = wrapClass;
        document.getElementById('trip').className = tripClass;
        document.getElementById('trip-type').innerHTML = CaltrainTrip.type(trainId);
        if (trainId && NextCaltrain.currentScreen() === 'grid') {
          document.getElementById('title').innerHTML = `${CaltrainTrip.type(trainId)} Service`;
          document.title = `${CaltrainTrip.type(trainId)} Service`;
        }
        tripCardElement.className = ['trip-card', 'selection', tripClass, wrapClass].join(' ');
        NextCaltrain.populateBlurb(message, textClass);
      } else {
        if (goodTime.inThePast(minutes)) {
          tripCardElement.className = 'trip-card message-departed';
        } else {
          tripCardElement.className = 'trip-card';
        }
      }
    }
  }

  static currentScreen() {
    for (let i = 0; i < screens.length; i++) {
      if (document.getElementById(`${screens[i]}-screen`).style['display'] === 'flex') return screens[i];
    }
    return screens[0];
  }

  static displayScreen(target) {
    // set the target screen
    for (let i = 0; i < screens.length; i++) {
      let display = (target === screens[i]) ? 'flex' : 'none';
      document.getElementById(`${screens[i]}-screen`).style['display'] = display;
    }
    // set softkey menu
    if (!kaiWeb) {
      if (target === 'hero') {
        NextCaltrain.populateSoftkeyMenu('', 'SELECT', 'Options');
      } else if (target === 'grid') {
        NextCaltrain.populateSoftkeyMenu('', 'SELECT', 'Options');
      } else if (target === 'trip') {
        NextCaltrain.populateSoftkeyMenu('', 'BACK', 'Options');
      } else if (target === 'menu') {
        NextCaltrain.populateSoftkeyMenu('', 'SELECT', '');
      } else if (target === 'prefs') {
        NextCaltrain.populateSoftkeyMenu('Cancel', '', 'OK');
      } else if (target === 'about') {
        NextCaltrain.populateSoftkeyMenu('', 'OK', '');
      } else if (target === 'commands') {
        NextCaltrain.populateSoftkeyMenu('', 'NEXT', '');
      }
    }
    // set the title
    document.getElementById('title').innerHTML = 'Next Caltrain';
    document.title = (target in titles) ? titles[target] : 'Next Caltrain';
    // load schedule (and override the title)
    if (target === 'grid' || target === 'hero') {
      NextCaltrain.loadSchedule();
    }
  }

  static attachListeners() {
    // https://www.kaiads.com/publishers/sdk.html
    document.addEventListener('DOMContentLoaded', () => {
      if (app && navigator.userAgent.toLowerCase().indexOf('kaios/2') > -1) {
        getKaiAd({
          publisher: '8400043d-1768-4179-8a02-6bc7f7e62a25',
          app: 'NextCaltrain',
          slot: 'mainAdUnit',
          test: 0,
          onerror: err => console.error('Custom catch:', err),
          onready: ad => {
            ad.call('display');
          }
        });
      }
    });
    document.addEventListener('touchstart', function(e) {
      let code = null;
      if (e.target.id === 'softkey-center') {
        code = OK;
      } else if (e.target.id === 'softkey-left') {
        code = 'sl';
      } else if (e.target.id === 'softkey-right') {
        code = 'sr';
      } else if (e.target.getAttribute('value') === 'about') {
        code = 'about';
      } else if (e.target.getAttribute('value') === 'commands') {
        code = 'commands';
      } else if (e.target.getAttribute('value') === 'prefs') {
        code = 'prefs';
      } else {
        return;
      }
      NextCaltrain.press(code);
    });
    document.addEventListener('mousemove', function (e) {
      if (!kaiWeb) return;
      skip = skip ? false : true;
      // Display splash screen unless cursor all-the-way right
      if (kaiWeb && splash && e.clientX >= 239) {
        splash = false;
        NextCaltrain.displayScreen('hero');
      } else if (kaiWeb && !splash && e.clientX < 239) {
        splash = true;
        NextCaltrain.displayScreen('splash');
      // Convert cursor movements to UP/DOWN events
      } else if (e.mozMovementY > 0) {
        NextCaltrain.press(DOWN);
        if (skip) {
          NextCaltrain.press(DOWN);
          skip = false;
        }
      } else if (e.mozMovementY < 0) {
        NextCaltrain.press(UP);
        if (skip) {
          NextCaltrain.press(UP);
          skip = false;
        }
      // Infer UP/DOWN when cursor bottoms/tops out
      } else if (e.mozMovementX === 0 && !skip) {
        if (e.clientY === 0) {
          NextCaltrain.press(UP);
        } else if (e.clientY >= vh - 1) {
          NextCaltrain.press(DOWN);
        }
      }
    });
    // Catch and convert cursor click to OK event.
    document.addEventListener('click', function () {
      if (kaiWeb) {
        NextCaltrain.press(OK);
      }
    });
    // Catch keydown events.
    document.addEventListener('keydown', function (e) {
      let code = e.keyCode ? e.keyCode : e.which;
      if (code === HANGUP) {
        // Catch and convert HANGUP to BACK
        code = BACK;
        if (NextCaltrain.currentScreen() !== 'hero') {
          // Support native EXIT on hero screen.
          e.preventDefault();
        } else {
          return;
        }
      } else if (e.key === 'Call' || code === 220) {
        code = 'call';
      } else if (e.key === 'SoftLeft' || e.key === '[') {
        code = 'sl';
        // Supress native SEARCH action.
        e.preventDefault();
      } else if (e.key === 'SoftRight' || e.key === ']') {
        code = 'sr';
        // Support native OPTIONS on menu screen.
        if (NextCaltrain.currentScreen() !== 'menu') e.preventDefault();
      } else if (e.key === '1' || e.key === '3') {
        // Catch 1,3 to stifle zoom in/out.
        e.preventDefault();
      } else if (e.key === '2') {
        // Catch 2 to stifle screen lock.
        e.preventDefault();
      } else if (code === OK) {
        // Catch OK to stifle fullscreen exit.
        e.preventDefault();
      }
      NextCaltrain.press(code);
    });
  }

  static press(code) {
    if (splash) return;
    if (code === ESC) {
      // Simulate EXIT.
      NextCaltrain.displayScreen('hero');
    } else if (code === 'prefs') {
      // Display the 'Save stations' confirmation.
      let confirmation = ['Save', (prefs.flipped ? prefs.destin : prefs.origin), 'as morning and',
        (prefs.flipped ? prefs.origin : prefs.destin), 'as evening default stations?'].join(' ');
      //if (confirm(confirmation)) prefs.saveStops();
      document.getElementById('confirmation').innerHTML = confirmation;
      NextCaltrain.displayScreen('prefs');
    } else if (code === 'about') {
      // Display the 'About' screen.
      NextCaltrain.displayScreen('about');
    } else if (code === 'commands') {
      // Display the 'Keypad commands' screen.
      NextCaltrain.bumpKeypadHint();
      NextCaltrain.displayScreen('commands');
    } else if (NextCaltrain.currentScreen() === 'about') {
      // Handle events on the 'About' screen.
      if (code === OK || code === BACK) {
        NextCaltrain.displayScreen('hero');
      }
    } else if (NextCaltrain.currentScreen() === 'commands') {
      // Handle events on the 'Keypad commands' screen.
      if (code === OK) {
        NextCaltrain.bumpKeypadHint();
      } else if (code === BACK) {
        hintIndex = -1;
        // set title
        NextCaltrain.displayScreen('hero');
      }
    } else if (NextCaltrain.currentScreen() === 'prefs') {
      if ((kaiWeb && code === OK) || (!kaiWeb && code === 'sr')) {
        prefs.saveStops();
        NextCaltrain.displayScreen('hero');
      } else if ((kaiWeb && code === BACK) || (!kaiWeb && code === 'sl')) {
        NextCaltrain.displayScreen('hero');
      }
    } else if (NextCaltrain.currentScreen() === 'menu') {
      // Handle and catch events intended for the menu.
      if (code === OK) {
        let menuOptions = document.getElementById('menu-list').getElementsByTagName('li');
        let action = menuOptions[menuIndex].getAttribute('value');
        menuIndex = 0;
        //if (action === 'prefs') NextCaltrain.displayScreen('hero');
        NextCaltrain.press(action);
      } else if (code === UP) {
        menuIndex--;
      } else if (code === DOWN) {
        menuIndex++;
      } else if (code === BACK) {
        menuIndex = 0;
        NextCaltrain.displayScreen('hero');
      }
      NextCaltrain.moveMenuSelection();
    } else if (code === 'sr') {
      menuIndex = 0;
      NextCaltrain.displayScreen('menu');
    } else if (NextCaltrain.currentScreen() === 'trip') {
      // Handle events for the trip screen.
      if (code === OK || code === BACK) {
        NextCaltrain.displayScreen('grid');
      } else if (code === UP) {
        if (listing.scrollTop > 0) listing.scrollTo(0, listing.scrollTop - 72);
      } else if (code === DOWN) {
        if (listing.scrollTop < listing.scrollHeight - 228) listing.scrollTo(0, listing.scrollTop + 72);
      }
    } else if (code === OK && NextCaltrain.currentScreen() === 'grid' && trainId !== null) {
      NextCaltrain.displayScreen('trip');
      NextCaltrain.loadTrip(trainId);
    } else {
      // Handle events for the hero and grid screens.
      if (code === BACK) {
        NextCaltrain.displayScreen('hero');
      } else if (code === OK) {
        NextCaltrain.displayScreen('grid');
      } else if (code === UP) {
        offset--;
      } else if (code === DOWN) {
        offset++;
      } else if (code === 49 || code === 55) { // 1 or 7
        offset = null;
        prefs.bumpStations(true, false);
      } else if (code === 51 || code === 57) { // 3 or 9
        offset = null;
        prefs.bumpStations(true, true);
      } else if (code === 52) { // 4
        offset = null;
        prefs.bumpStations(false, false);
      } else if (code === 54) { // 6
        offset = null;
        prefs.bumpStations(false, true);
      } else if (code === 'call') {
        offset = null;
        prefs.flipStations();
      } else if (code === 'sl') {
        // clearTimeout(countdown);
        schedule.next();
        offset = null;
      } else {
        return;
      }
      NextCaltrain.loadSchedule();
    }
  }

}
