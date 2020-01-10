let prefs = new Preferences(caltrainServiceData.southStops);
let schedule = new CaltrainService();
let swapped = false; // WEEKDAY/WEEKEND
let kaios1 = false;
let kaios2 = false;
let kaios = false;
let countdown = null;
let trainId = null;
let offset = null;

const OK = 13;
const BACK = 95;
const HANGUP = 8;
const UP = 53;
const DOWN = 56

let tripScreen = false;
const screens = 'hero grid trip about commands'.split(' ');
let previousScreen = screens[0];

const hints = [
    ['With no touchscreen, use<br/>the keypad to navigate.', [],
     'Press [OK] to continue and<br/>[BACK] to return to the app.'],
    ['Use [5] and [8] to move<br/>the seletion up and down.', [5,8],
     'Up and down buttons may not<br/>work when cursor is hidden.'],
    ['Use [4] and [6] to<br/>change origin station.', [4,6,7,9],
     'Use [7] and [9] to<br/>change destination station.'],
    ['Use [0] to flip the direction<br/>of the selected stations.', [0,'#'],
     'Use [#] to swap weekday<br/>and weekend schedules.'],
    ['Use [2] to hide the cursor,<br/>then nagivate with 5 and 8.', [2,'*'],
     'Use [*] to acess the menu<br/>for help and settings.']];
let hintIndex = -1;

class NextCaltrain {

  static startApp() {
    if (navigator.userAgent.indexOf('KaiOS/1') !== -1) kaios1 = true;
    if (navigator.userAgent.indexOf('KAIOS/2') !== -1) kaios2 = true;
    kaios = (kaios1 || kaios2);
    if (!kaios) document.getElementById('keypad').style['display'] = 'flex';
    // setup the app state
    const dateString = GoodTimes.dateString(caltrainServiceData.scheduleDate);
    document.getElementById('date-string').innerHTML = dateString;
    NextCaltrain.attachListeners();
    NextCaltrain.setTheTime();
    NextCaltrain.formatHints();
  }

  static formatHints() {
    for (let i = 0; i < hints.length; i++) {
      for (let n = 0; n < 2; n++) {
        hints[i][n * 2] = hints[i][n * 2].replace(/\[/g, "<span class='btn'>").replace(/\]/g, "</span>");
      }
    }
  }

  static bumpKeypadHint() {
    hintIndex++;
    if (hintIndex >= hints.length) hintIndex = 0;
    document.getElementById('hint-above').innerHTML = hints[hintIndex][0];
    document.getElementById('hint-below').innerHTML = hints[hintIndex][2];
    let bg = ['black', 'gray'];
    for (let i = 0; i < 12; i++) {
      let key = (i < 10) ? i : ['*','#'][i % 2];
      let clr = hints[hintIndex][1].indexOf(key) == -1 ? bg[1] : bg[0];
      document.getElementById(`k${key}`).style['background-color'] = clr;
    }
  }

  static setTheTime() {
    let ourTime = new GoodTimes();
    document.getElementById('gridTime').innerHTML = ourTime.fullTime();
    document.getElementById('moreTime').innerHTML = ourTime.fullTime();
    setTimeout( function () { NextCaltrain.setTheTime() }, (60 - ourTime.seconds) * 1000);
    NextCaltrain.loadSchedule();
  }

  static setCountdown(minutes) {
    let downTime = new GoodTimes();
    let blurb = downTime.countdown(minutes);
    if (blurb.startsWith('-')) blurb = '';
    document.getElementById('blurb').innerHTML = blurb;
    document.getElementById('blurb-hero').innerHTML = blurb;
    if (blurb === '') return;
    let refresh = blurb.endsWith('sec') ? 1000 : (60 - downTime.seconds) * 1000;
    countdown = setTimeout( function () { NextCaltrain.setCountdown(minutes); }, refresh);
  }

  static openFullScreen() {
    if (kaios2 === true) { // and function exists (TODO)
      document.documentElement.requestFullscreen();
    } else {
      NextCaltrain.fullScreenView(true);
    }
  }

  static fullScreenView(fs) {
    NextCaltrain.displayScreen(fs ? 'grid' : 'hero');
    tripScreen = false; // cleanup (TODO)
  }

  static toggleTripScreen() {
    tripScreen = tripScreen ? false : trainId != null;
    if (!tripScreen) {
      NextCaltrain.displayScreen('grid')
    } else {
      NextCaltrain.displayScreen('trip')
      let trip = new CaltrainTrip(trainId);
      document.getElementById('label').innerHTML = trip.label();
      document.getElementById('description').innerHTML = trip.description();
      let goodTime = new GoodTimes();
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
                 class="filler">${filler}</span>${fullTime}</div>
            <div class="station-spacer ${style}">${spacer}<br/><span
                 class="station-dot ${target}">&#9679;</span></div>
            <div class="station-name"><br/>${stop[0]}</div></div>`);
      }
      document.getElementById('listing').innerHTML = lines.join("\n");
    }
  }

  static populateBlurb(message, textClass) {
    document.getElementById('blurb').innerHTML = message;
    document.getElementById('blurb').className = textClass;
    document.getElementById('blurb-hero').innerHTML = message.replace(' Schedule', '');
    document.getElementById('blurb-hero').className = textClass;
  }

  static loadSchedule() {
    clearTimeout(countdown);
    // Set the stations
    let tripLabels = prefs.tripLabels();
    document.getElementById('origin').innerHTML = tripLabels[0];
    document.getElementById('destin').innerHTML = tripLabels[1];
    document.getElementById('origin-hero').innerHTML = tripLabels[0];
    document.getElementById('destin-hero').innerHTML = tripLabels[1];
    // Load the schdule
    let goodTime = new GoodTimes();
    let routes = schedule.routes(prefs.origin, prefs.destin, goodTime.schedule(), swapped);
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
      let tripCardElement = document.getElementById(`trip${i}`)
      let n = (offset + i > routes.length - 1) ? offset + i - routes.length : offset + i;
      let route = routes[n];
      if (i > routes.length - 1) {
        if (i === 0) {
          NextCaltrain.populateBlurb('NO TRAINS', 'message-departed blink');
          document.getElementById('circle').className = 'selection-departed';
          document.getElementById('trip0').className = 'selection-none';
          document.getElementById('trip').innerHTML = '<span class="time-hero">&nbsp;</span>';
          document.getElementById('trip-type').innerHTML = '&nbsp;';
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
        if (swapped) {
          message = goodTime.swapped();
          textClass = 'message-departed';
          tripClass = (goodTime.inThePast(minutes)) ? 'message-departed' : '';
          wrapClass = 'selection-swapped';
        } else if (goodTime.inThePast(minutes)) {
          message = '&nbsp;';
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

  static displayScreen(target) {
    for (let i = 0; i < screens.length; i++) {
      let display = (target === screens[i]) ? 'flex' : 'none';
      document.getElementById(`${screens[i]}-screen`).style['display'] = display;
    }
  }

  static currentScreen() {
    for (let i = 0; i < screens.length; i++) {
      if (document.getElementById(`${screens[i]}-screen`).style['display'] === 'flex') return screens[i];
    }
    return screens[0];
  }

  static attachListeners() {
    // resize & scroll
    document.onfullscreenchange = function (e) {
      let invert = (document.getElementById('hero-screen').style['display'] === 'flex');
      NextCaltrain.fullScreenView(invert);
    };
    document.body.addEventListener("mousemove", function (e) {
      if (kaios) {
        if (e.movementY < 0) {
          NextCaltrain.press(UP);
        } else if (e.movementY > 0) {
          NextCaltrain.press(DOWN);
        // } else if (e.movementX > 0) { // right
        // } else if (e.movementX < 0) { // left
        }
      }
    });
    document.addEventListener("click", function (e) {
      if (kaios) NextCaltrain.press(OK);
    });
    document.addEventListener('keydown', function (e) {
      var code = e.keyCode ? e.keyCode : e.which;
      if (code === HANGUP && NextCaltrain.currentScreen() !== 'hero') {
        // catch and convert HANGUP to BACK except on hero screen
        e.preventDefault();
        code = BACK;
      } else if (code === OK) {
        // catch OK to stifle fullscreen exit.
        e.preventDefault();
      }
      NextCaltrain.press(code);
    });
  }

  static press(code) {
    if (code === 'x') { // on fake keypad
      NextCaltrain.fullScreenView(false);
    } else if (code === 'prefs') {
      let confirmation = ['Save', (prefs.flipped ? prefs.destin : prefs.origin), 'as morning and', 
          (prefs.flipped ? prefs.origin : prefs.destin), 'as evening default stations?'].join(' ');
      if (confirm(confirmation)) prefs.saveStops();
      NextCaltrain.displayScreen(previousScreen);
    } else if (code === 'about') {
      NextCaltrain.displayScreen('about')
    } else if (code === 'commands') {
      NextCaltrain.bumpKeypadHint();
      NextCaltrain.displayScreen('commands')
    } else if (NextCaltrain.currentScreen() === 'about') {
      if (code == OK || code == BACK) {
        NextCaltrain.displayScreen(previousScreen);
      }
    } else if (NextCaltrain.currentScreen() === 'commands') {
      if (code == OK) {
        NextCaltrain.bumpKeypadHint();
      } else if (code == BACK) {
        hintIndex = -1;
        NextCaltrain.displayScreen(previousScreen);
      }
    } else if (NextCaltrain.currentScreen() === 'menu') {
      if (code == BACK) {
        NextCaltrain.displayScreen(previousScreen);
      }
    } else if (document.getElementById('popup-menu').style['display'] === 'block') {
      if (code === OK || code === BACK || code == HANGUP) {
        NextCaltrain.popupMenu('hide');
      }
    } else if (tripScreen) {
      if (code === BACK) { // back/hangup
        NextCaltrain.toggleTripScreen();
      }
    } else {
      if (code === OK) { // select
        if (kaios2 && document.getElementById('hero-screen').style['display'] === 'flex') {
          NextCaltrain.openFullScreen();
        } else {
          NextCaltrain.toggleTripScreen();
        }
        return;
      } else if (code === 163 || code === 39) { // # or ->
        swapped = swapped ? false : true;
        offset = null;
      } else if (code === 170 || code === 37) { // * or <-
        NextCaltrain.popupMenu('show');
      } else if (code === 50) { // 2
        return;
      } else if (code === UP) {
      offset--;
      } else if (code === DOWN) {
        offset++;
      } else if (code === 52) { // 4
        offset = null;
        prefs.bumpStations(true, false);
      } else if (code === 54) { // 6
        offset = null;
        prefs.bumpStations(true, true);
      } else if (code === 55) { // 7
        offset = null;
        prefs.bumpStations(false, false);
      } else if (code === 57) { // 9
        offset = null;
        prefs.bumpStations(false, true);
      } else if (code === 48) { // 0
        offset = null;
        prefs.flipStations();
      } else if (code === 38) { // up arrow
        offset--;
      } else if (code === 40) { // down arrow
        offset++;
      } else {
        return;
      }
      NextCaltrain.loadSchedule();
    }
  }

}
