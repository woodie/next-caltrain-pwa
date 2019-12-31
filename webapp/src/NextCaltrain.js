let prefs = new Preferences(caltrainServiceData.southStops);
let schedule = new CaltrainService();
let swapped = false; // WEEKDAY/WEEKEND
let kaios1 = false;
let kaios2 = false;
let others = false;
let countdown = null;
let trainId = null;
let offset = null;

let splashScreen = true;
let mainScreen = false;
let tripScreen = false;
//let userScreen = false;
//let helpScreen = false;

class NextCaltrain {

  static startApp() {
    if (navigator.userAgent.indexOf('KaiOS/1') !== -1) kaios1 = true;
    if (navigator.userAgent.indexOf('KAIOS/2') !== -1) kaios2 = true;
    others = (kaios1 || kaios2) ? false : true;
    document.getElementById('keypad').style['display'] = others ? 'flex' : 'none';
    document.getElementById('native-infobar').style['display'] = others ? 'block' : 'none';
    document.getElementById('native-titlebar').style['display'] = others ? 'block' : 'none';
    document.getElementById('native-toolbar').style['display'] = others ? 'flex' : 'none';
    NextCaltrain.attachListeners();
    NextCaltrain.setTheTime();
  }

  static setTheTime() {
    let ourTime = new GoodTimes();
    document.getElementById('mainTime').innerHTML = ourTime.fullTime();
    document.getElementById('moreTime').innerHTML = ourTime.fullTime();
    setTimeout( function () { NextCaltrain.setTheTime() }, (60 - ourTime.seconds) * 1000);
    NextCaltrain.loadSchedule();
  }

  static setCountdown(minutes) {
    let downTime = new GoodTimes();
    let blurb = downTime.countdown(minutes);
    document.getElementById('blurb').innerHTML = blurb;
    document.getElementById('blurb-splash').innerHTML = blurb;
    let refresh = blurb.endsWith('sec') ? 1000 : (60 - downTime.seconds) * 1000;
    countdown = setTimeout( function () { NextCaltrain.setCountdown(minutes); }, refresh);
  }

  static openFullScreen() {
    if (kaios2 === true) {
      document.documentElement.requestFullscreen();
    } else {
      NextCaltrain.fullScreenView(true);
    }
  }

  static fullScreenView(fs) {
    document.getElementById('splash-screen').style['display'] = fs ? 'none' : 'flex';
    document.getElementById('main-screen').style['display'] = fs ? 'flex' : 'none';
    document.getElementById('trip-screen').style['display'] = 'none';
    tripScreen = false;
  }

  static toggleTripScreen() {
    tripScreen = tripScreen ? false : trainId != null;
    if (!tripScreen) {
      document.getElementById('trip-screen').style['display'] = 'none';
      document.getElementById('splash-screen').style['display'] = kaios1 ? 'flex' : 'none';
      document.getElementById('main-screen').style['display'] = kaios1 ? 'none' : 'flex';
    } else {
      document.getElementById('trip-screen').style['display'] = 'flex';
      document.getElementById('splash-screen').style['display'] = 'none';
      document.getElementById('main-screen').style['display'] = 'none';
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

  static loadSchedule() {
    let minutes = 0;
    clearTimeout(countdown);
    let goodTime = new GoodTimes();
    let message = '&nbsp;';
    // Set the stations
    let tripLabels = prefs.tripLabels();
    document.getElementById('origin').innerHTML = tripLabels[0];
    document.getElementById('destin').innerHTML = tripLabels[1];
    document.getElementById('origin-splash').innerHTML = tripLabels[0];
    document.getElementById('destin-splash').innerHTML = tripLabels[1];
    // Load the schdule
    let routes = schedule.routes(prefs.origin, prefs.destin, goodTime.schedule(), swapped);
    if (offset === null) {
      minutes = goodTime.minutes;
      offset = CaltrainService.nextIndex(routes, minutes);
    } else if (offset > routes.length - 1) {
      offset = 0;
    } else if (offset < 0) {
      offset = routes.length - 1;
    }
    for (let i=0; i < 6; i++) {
      let classes = ['trip-card'];
      let element = document.getElementById(`trip${i}`)
      let n = (offset + i > routes.length - 1) ? offset + i - routes.length : offset + i;
      let route = routes[n];
      if (i > routes.length - 1) {
        element.innerHTML = '<div class="train-time">&nbsp;</div>';
        if (i === 0) {
          document.getElementById('blurb').className = 'message-departed blink';
          message = 'NO TRAINS';
          element.className = 'selection-none';
        }
        continue;
      }
      minutes = route[1];
      let originTime = GoodTimes.partTime(minutes);
      let destinTime = GoodTimes.partTime(route[2]);
      let card = `<div class="train-number">#${route[0]}</div>
          <div class="train-time">${originTime[0]}<span class="meridiem">${originTime[1]}</span></div>
          <div class="train-time">${destinTime[0]}<span class="meridiem">${destinTime[1]}</span></div>`;
      element.innerHTML = card;
      if (i === 0) {
        trainId = route[0];
        classes.push('selection');
        if (swapped) {
          document.getElementById('blurb').className = 'message-departed';
          classes.push('selection-swapped');
          message = goodTime.swapped();
          if (goodTime.inThePast(minutes)) { classes.push('message-departed'); }
        } else {
          if (goodTime.inThePast(minutes)) {
            classes.push('message-departed');
            classes.push('selection-departed');
          } else if (goodTime.departing(minutes)) {
            document.getElementById('blurb').className = 'message-departing blink';
            message = 'DEPARTING';
            classes.push('selection-departing');
          } else {
            document.getElementById('blurb').className = 'message-arriving';
            classes.push('selection-arriving');
            message = goodTime.countdown(minutes);
            if (minutes > 0) { NextCaltrain.setCountdown(minutes); }
          }
        }
        let tripTime = `<span class="train-splash">#${route[0]}</span>
            <span class="time-splash">${originTime[0]}</span>
            <span class="meridiem-splash">${originTime[1]}</span>`;
        document.getElementById('trip').innerHTML = tripTime;
      } else {
        if (goodTime.inThePast(minutes)) {
          classes.push('message-departed');
        }
      }
      element.className = classes.join(' ');
    }
    document.getElementById('blurb').innerHTML = message;
    document.getElementById('blurb-splash').innerHTML = message.replace(' Schedule', '');
  }

  static attachListeners() {
    document.onfullscreenchange = function (event) {
      let invert = (document.getElementById('splash-screen').style['display'] === 'flex');
      NextCaltrain.fullScreenView(invert);
    };
    document.body.addEventListener("mousemove", function (e) {
      if (kaios2) {
        if (e.movementY < 0) { // up
          NextCaltrain.press(53);
        } else if (e.movementY > 0) { // down
          NextCaltrain.press(56);
        // } else if (e.movementX > 0) { // right
        // } else if (e.movementX < 0) { // left
        }
      }
    });
    document.addEventListener("click", function (e) {
      if (!others) NextCaltrain.press(13);
    });
    document.addEventListener('keydown', function (e) {
      var code = e.keyCode ? e.keyCode : e.which;
      // code:95 (BACK on KaiOS/1) is OK
      if ((tripScreen && code === 8) || code === 13) {
        e.preventDefault();
      }
      NextCaltrain.press(code);
    });
  }

  static press(code) {
    if (code === -1) { // simulate exit
      NextCaltrain.fullScreenView(false);
    } else if (tripScreen) {
      if (code === 8) { // back/hangup
        NextCaltrain.toggleTripScreen();
      }
    } else {
      if (code === 13) { // select
        if (kaios2 && document.getElementById('splash-screen').style['display'] === 'flex') {
          NextCaltrain.openFullScreen();
        } else {
          NextCaltrain.toggleTripScreen();
        }
        return;
      } else if (code === 163 || code === 39) { // # or ->
        swapped = swapped ? false : true;
        offset = null;
      } else if (code === 170 || code === 37) { // * or <-
        prefs.saveStops();
      } else if (code === 50) { // 2
        return;
      } else if (code === 53) { // 5 page up
      offset--;
      } else if (code === 56) { // 8 page down
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
