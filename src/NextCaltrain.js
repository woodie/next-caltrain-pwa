let prefs = new Preferences(caltrainServiceData.southStops);
let service = new CaltrainService();
let app = false;
let kaios1 = false;
let kaios2 = false;
let kaios = false;
let schedule = null;
let countdown = null;
let trainId = null;
let offset = null;
let goodTime = null;
let dup = true;
let vh = 228;
let splash = false;

const OK = 13;
const BACK = 95;
const HANGUP = 8;
const ESC = 27;
const UP = 38;
const DOWN = 40;
// const SPLAT = 170;
// const POUND = 163;
// const ZERO = 48;

const screens = 'splash hero grid trip about commands'.split(' ');
const titles = {'about':'About Next Caltrain', 'commands':'Keypad commands'};
const email = 'next-caltrain@netpress.com';

let hints = [
  ['Set your origin', [1,3],
    'Use [4] and [6] keys to<br/>set your origin station.'],
  ['Set destination', [4,6],
    'Use [7] and [9] keys to<br/>set destination station.'],
  ['Change schedule', [2],
    'Press [2] to cycle through<br/>available schedules.'],
  ['Flip direction', ['c'],
    'Press the [CALL] button to<br/>flip the selected stations'],
  ['Save stations', ['l'],
    'Press the [LEFT] softkey to<br/>select "Save Stations".'],
  ['Bookmark app', ['r'],
    'Press the [RIGHT] softkey to<br/>select "Pin to Apps Menu".'],
  ['Usability Caveats',
    'The cursor (pointer)<br/>is not used by this app<br/>so we keep it to the right.',
    'The left softkey label should<br/>read [MENU] but cannot be<br/>changed by this type of app.']];

let hintIndex = -1;

class NextCaltrain {

  static startApp() {
    if (document.location.search === '?app') app = true;
    else if (document.location.search === '?kaios1' ||
      navigator.userAgent.indexOf('KaiOS/1') !== -1) kaios1 = true;
    else if (document.location.search === '?kaios2' ||
      navigator.userAgent.indexOf('KAIOS/2') !== -1) kaios2 = true;
    kaios = (kaios1 || kaios2);
    if (app || !kaios) {
      if (!app) {
        document.getElementById('keypad').style['display'] = 'flex';
      }
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
    // setup the app state
    const dateString = GoodTimes.dateString(caltrainServiceData.scheduleDate);
    const listing = document.getElementById('listing');
    document.getElementById('date-string').innerHTML = dateString;
    NextCaltrain.attachListeners();
    NextCaltrain.setTheTime();
    NextCaltrain.formatHints();
  }

  static formatHints() {
    if (!kaios) hints = hints.slice(0, 5);
    for (let i = 0; i < hints.length; i++) {
      for (let n = 0; n < 2; n++) {
        hints[i][n * 2] = hints[i][n * 2].replace(/\[/g, '<span class=\'btn\'>').replace(/\]/g, '</span>');
        if (kaios1) hints[i][n * 2] = hints[i][n * 2].replace(/Apps Menu/, 'Top Sites');
      }
    }
  }

  static bumpKeypadHint() {
    hintIndex++;
    if (hintIndex >= hints.length) {
      hintIndex = -1;
      NextCaltrain.displayScreen('hero');
      return;
    } else if (hintIndex == hints.length - 1 && app) {
      NextCaltrain.populateSoftkeyMenu('', 'OK', '');
    }
    document.getElementById('hint-above').innerHTML = hints[hintIndex][0];
    document.getElementById('hint-below').innerHTML = hints[hintIndex][2];
    if (Array.isArray(hints[hintIndex][1])) {
      document.getElementById('mini-keypad').style['display'] = 'flex';
      document.getElementById('hint-center').style['display'] = 'none';
      for (let i = 1; i < 15; i++) {
        let key = (i < 10) ? i : ['l','r','c','o','h'][i - 10];
        let cls = hints[hintIndex][1].indexOf(key) == -1 ? 'default' : 'selected';
        document.getElementById(`k${key}`).className = cls;
      }
    } else {
      document.getElementById('mini-keypad').style['display'] = 'none';
      document.getElementById('hint-center').style['display'] = 'block';
      document.getElementById('hint-center').innerHTML = hints[hintIndex][1];
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
      stop = trip.times[i];
      let spacer = (i === 0) ? '' : '|';
      let fullTime = GoodTimes.fullTime(stop[1]);
      let filler = fullTime.length > 6 ? '' : '0';
      let style = (goodTime.inThePast(stop[1])) ? 'message-departed' : 'message-arriving';
      let target = (prefs.origin === stop[0] || prefs.destin === stop[0]) ? 'target' : '';
      lines.push(`<div class="station-stop">
          <div class="station-time"><br/><span
               class="hour-filler">${filler}</span>${fullTime}</div>
          <div class="station-spacer ${style}">${spacer}<br/><span
               class="station-dot ${target}">&#9679;</span></div>
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

  static popupMenu(action) {
    let popupElement = document.getElementById('popup-menu');
    if (action === 'show') {
      popupElement.style['display'] = 'block';
      popupElement.selectedIndex = 3;
      popupElement.focus();
    } else if (action === 'hide') {
      popupElement.style['display'] = 'none';
    } else {
      NextCaltrain.press(action);
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
    if (!kaios) {
      if (target === 'hero') {
        NextCaltrain.populateSoftkeyMenu('Menu', 'SELECT', '');
      } else if (target === 'grid') {
        NextCaltrain.populateSoftkeyMenu('Menu', 'SELECT', 'Back');
      } else if (target === 'trip') {
        NextCaltrain.populateSoftkeyMenu('Menu', '', 'Back');
      } else if (target === 'about') {
        NextCaltrain.populateSoftkeyMenu('', 'OK', '');
      } else if (target === 'commands') {
        NextCaltrain.populateSoftkeyMenu('', 'NEXT', 'Cancel');
      }
    }
    // set the title
    document.getElementById('title').innerHTML = 'Next Caltrain';
    document.title = (target in titles) ? titles[target] : 'Next Caltrain';
    // load schedule (and override the title)
    if (target === 'grid' || target === 'hero') {
      NextCaltrain.loadSchedule();
    }
    // request full sreen when KaiOS/2
    if (kaios2) {
      if (target === 'grid' || target === 'trip') {
        try {
          document.documentElement.requestFullscreen();
        } catch (e) {
        }
      } else if (target !== 'hero') {
        document.exitFullscreen();
      }
    }
  }

  static attachListeners() {
    // Return to the hero screen when EXIT from fullscreen.
    document.onfullscreenchange = function (e) {
      if (document.fullscreenElement) {
        document.getElementById('content').className = 'full-screen';
        vh = 320;
      } else {
        document.getElementById('content').className = 'part-screen';
        vh = 228;
        NextCaltrain.displayScreen(splash ? 'splash' : 'hero');
      }
    };
    // Catch and convert cursor movements to UP/DOWN events (n/a on kaios1).
    document.addEventListener('mousemove', function (e) {
      if (!kaios) return;
      dup = dup ? false : true;
      if (kaios && splash && e.clientX >= 239) {
        splash = false;
        NextCaltrain.displayScreen('hero');
      } else if (kaios && !splash && e.clientX < 239) {
        splash = true;
        NextCaltrain.displayScreen('splash');
      } else if (e.mozMovementY > 0) {
        NextCaltrain.press(DOWN);
      } else if (e.mozMovementY < 0) {
        NextCaltrain.press(UP);
      } else if (e.mozMovementX === 0 && dup) {
        if (e.clientY === 0) {
          NextCaltrain.press(UP);
        } else if (e.clientY >= vh - 1) {
          NextCaltrain.press(DOWN);
        }
      }
    });
    // Catch and convert cursor click to OK event.
    document.addEventListener('click', function (e) {
      if (kaios) {
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
      } else if (e.key === 'SoftLeft' || code === 220) {
        code = 'menu';
        // Supress native SEARCH action.
        e.preventDefault();
      } else if (e.key === 'SoftRight' && app) {
        code = BACK;
        // Maintain OPTIONS menu unless app
      } else if (e.key === 'Call') {
        code = 'flip';
      } else if (e.key === '1' || e.key === '3') {
        // Catch 1,3 to stifle zoom in/out.
        e.preventDefault();
      } else if (e.key === '2') {
        code = 'cycle';
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
      // Simulate EXIT from fullscreen mode.
      NextCaltrain.displayScreen('hero');
    } else if (code === 'prefs') {
      // Display the 'Save stations' confirmation.
      let confirmation = ['Save', (prefs.flipped ? prefs.destin : prefs.origin), 'as morning and',
        (prefs.flipped ? prefs.origin : prefs.destin), 'as evening default stations?'].join(' ');
      if (confirm(confirmation)) prefs.saveStops();
    } else if (code === 'about') {
      // Display the 'About' screen.
      NextCaltrain.displayScreen('about');
    } else if (code === 'commands') {
      // Display the 'Keypad commands' screen.
      NextCaltrain.bumpKeypadHint();
      NextCaltrain.displayScreen('commands');
    } else if (NextCaltrain.currentScreen() === 'about') {
      // Handle events on the 'About' screen.
      if (code == OK || code == BACK) {
        NextCaltrain.displayScreen('hero');
      }
    } else if (NextCaltrain.currentScreen() === 'commands') {
      // Handle events on the 'Keypad commands' screen.
      if (code == OK) {
        NextCaltrain.bumpKeypadHint();
      } else if (code == BACK) {
        hintIndex = -1;
        NextCaltrain.displayScreen('hero');
      }
    } else if (document.getElementById('popup-menu').style['display'] === 'block') {
      // Handle and catch events intended for the popup menu.
      if (code === OK || code === BACK) {
        NextCaltrain.popupMenu('hide');
      }
    } else if (code === 'menu') {
      if (kaios2 && document.fullscreenElement) document.exitFullscreen();
      if (NextCaltrain.currentScreen() !== 'hero') NextCaltrain.displayScreen('hero');
      NextCaltrain.popupMenu('show');
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
      } else if (code === 49) { // 1
        offset = null;
        prefs.bumpStations(true, false);
      } else if (code === 51) { // 3
        offset = null;
        prefs.bumpStations(true, true);
      } else if (code === 52) { // 4
        offset = null;
        prefs.bumpStations(false, false);
      } else if (code === 54) { // 6
        offset = null;
        prefs.bumpStations(false, true);
        // } else if (code === 55) { // 7
        // } else if (code === 57) { // 9
      } else if (code === 'flip') {
        offset = null;
        prefs.flipStations();
      } else if (code === 'cycle') {
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
