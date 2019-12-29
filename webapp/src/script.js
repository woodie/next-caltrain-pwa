let prefs = new Preferences(caltrainServiceData.southStops);
let schedule = new CaltrainService();
let fullScreen = false;
let swapped = false;
let kaios = false;
let countdown = null;
let trainId = null;
let offset = null;

let splashScreen = true;
let mainScreen = false;
let tripScreen = false;
//let userScreen = false;
//let helpScreen = false;

var startApp = function () {
  if (navigator.userAgent.indexOf('KAIOS') !== -1) kaios = true;
  document.getElementById('keypad').style['display'] = kaios ? 'none' : 'flex';
  attachListeners();
  setTheTime();
};

var setTheTime = function () {
  let ourTime = new GoodTimes();
  document.getElementById('mainTime').innerHTML = ourTime.fullTime();
  document.getElementById('moreTime').innerHTML = ourTime.fullTime();
  setTimeout(setTheTime, (60 - ourTime.seconds) * 1000);
  loadSchedule();
};

var setCountdown = function (minutes) {
  let downTime = new GoodTimes();
  let blurb = downTime.countdown(minutes);
  document.getElementById('blurb').innerHTML = blurb;
  let refresh = blurb.endsWith('sec') ? 1000 : (60 - downTime.seconds) * 1000;
  countdown = setTimeout( function () { setCountdown(minutes);  }, refresh);
};

var openFullScreen = function () {
  if (kaios === true) {
    if (fullScreen === false) {
      try {
        document.documentElement.requestFullscreen();
      } catch(error) {}
    }
  } else {
    fullScreen = true;
    fullScreenView();
  }
};

var fullScreenView = function () {
  document.getElementById('splashScreen').style['display'] = fullScreen ? 'none' : 'flex';
  document.getElementById('mainScreen').style['display'] = fullScreen ? 'flex' : 'none';
  document.getElementById('tripScreen').style['display'] = 'none';
  tripScreen = false;
};

var toggleTripScreen = function () {
  tripScreen = tripScreen ? false : trainId != null;
  document.getElementById('tripScreen').style['display'] = tripScreen ? 'flex' : 'none';
  document.getElementById('mainScreen').style['display'] = tripScreen ? 'none' : 'flex';
  if (tripScreen) {
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

var loadSchedule = function () {
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
          if (minutes > 0) { setCountdown(minutes); }
        }
      }
      document.getElementById('trip').innerHTML = card;
    } else {
      if (goodTime.inThePast(minutes)) {
        classes.push('message-departed');
      }
    }
    element.className = classes.join(' ');
  }
  document.getElementById('blurb').innerHTML = message;
  document.getElementById('blurb-splash').innerHTML = message;
};

var attachListeners = function () {
  document.onfullscreenchange = function (event) {
    // keep track of actual onfullscreenchange.
    fullScreen = fullScreen ? false : true;
    fullScreenView();
  };
  document.body.addEventListener("mousemove", function (e) {
    if (kaios) {
      if (e.movementY < 0) { // up
        processEvent(53);
      } else if (e.movementY > 0) { // down
        processEvent(56);
      // } else if (e.movementX > 0) { // right
      // } else if (e.movementX < 0) { // left
      }
    }
  });
  document.addEventListener("click", function (e) {
    if (kaios) {
      processEvent(13);
    }
  });
  document.addEventListener('keydown', function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code === 8 || code === 13) { // hangup & select
      e.preventDefault();
    }
    processEvent(code);
  });
};

var processEvent = function (code) {
  if (code === -1) { // simulate exit
    fullScreen = false;
    fullScreenView();
  } else if (tripScreen) {
    if (code === 8) { // hangup
      toggleTripScreen();
    }
  } else {
    if (code === 1 || code === 13) { // select
      if (!fullScreen) {
        openFullScreen();
      } else {
        toggleTripScreen();
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
    loadSchedule();
  }
};
