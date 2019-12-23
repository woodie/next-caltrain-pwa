let prefs = new Preferences(caltrainServiceData.southStops);
let sched = new CaltrainService();
let fullScreen = false;
let details = false;
let swapped = false;
let kaios = false;
let offset = null;
let countdown = null;
let trainId = null;

var startApp = function () {
  if (navigator.userAgent.includes('KAIOS')) kaios = true;
  attachListeners();
  setTheTime();
};

var setTheTime = function () {
  let ourTime = new GoodTimes();
  document.getElementById('theTime').innerHTML = ourTime.fullTime();
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
  if (kaios == true) {
    if (fullScreen == false) {
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
  fs = fullScreen
  document.getElementById('trip4').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('trip5').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('title').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('hints').style['display'] = fs ? 'none' : 'flex';
  document.getElementById('main').style['height'] = fs ? '290px' : '228px';
};

var toggleDetailsView = function () {
  details = details ? false : trainId != null;
  document.getElementById('details').style['display'] = details ? 'flex' : 'none';
  document.getElementById('main').style['display'] = details ? 'none' : 'flex';
  if (details) {
    let trip = new CaltrainTrip(trainId);
    document.getElementById('label').innerHTML = trip.label();
    document.getElementById('description').innerHTML = trip.description();
    let goodTime = new GoodTimes();
    let lines = [];
    for (stop of trip.times) {
      let style = (goodTime.inThePast(stop[1])) ? 'train-departed' : '';
      lines.push(`<div class="station-stop">
          <div class="station-time" style="${style}">${GoodTimes.fullTime(stop[1])}</div>
          <div class="circle">&#11044;</div><div class="station-name">${stop[0]}</div></div>`);
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
  // Load the schdule
  let routes = sched.routes(prefs.origin, prefs.destin, goodTime.schedule(), swapped);
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
        document.getElementById('blurb').className = 'message-swapped blink';
        document.getElementById('blurb').innerHTML = 'NO TRAINS';
        element.className = 'selection-none';
      }
      continue;
    }
    minutes = route[1];
    let originTime = GoodTimes.partTime(minutes);
    let destinTime = GoodTimes.partTime(route[2]);
    let card = `<div class="train-number">#${trainId}</div>
        <div class="train-time">${originTime[0]}<span class="meridiem">${originTime[1]}</span></div>
        <div class="train-time">${destinTime[0]}<span class="meridiem">${destinTime[1]}</span></div>`;
    element.innerHTML = card;
    if (i === 0) {
      trainId = route[0];
      classes.push('selection');
      if (swapped) {
        document.getElementById('blurb').className = 'message-swapped';
        classes.push('selection-swapped');
        message = goodTime.swapped();
        if (goodTime.inThePast(minutes)) { classes.push('train-departed'); }
      } else {
        if (goodTime.inThePast(minutes)) {
          classes.push('train-departed');
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
    } else {
      if (goodTime.inThePast(minutes)) {
        classes.push('train-departed');
      }
    }
    element.className = classes.join(' ');
    document.getElementById('blurb').innerHTML = message;
  }
};

var attachListeners = function () {
  document.onfullscreenchange = function (event) {
    // keep track of actual onfullscreenchange.
    fullScreen = fullScreen ? false : true;
    fullScreenView();
  };
  document.addEventListener('keydown', function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 0 || code == 13) { // select
      toggleDetailsView();
    } else if (code == 8) { // hangup
      // prepare to shutdown.
    } else if (code == 163 || code === 39) { // # or ->
      swapped = swapped ? false : true;
      offset = null;
    } else if (code == 170 || code === 37) { // * or <-
      prefs.saveStops();
    } else if (code == 50) { // 2
      return;
    } else if (code == 53) { // 5 page up
      if (fullScreen) {
        offset--;
      } else {
        openFullScreen();
      }
    } else if (code == 56) { // 8 page down
      offset++;
    } else if (code == 52) { // 4
      offset = null;
      prefs.bumpStations(true, false);
    } else if (code == 54) { // 6
      offset = null;
      prefs.bumpStations(true, true);
    } else if (code == 55) { // 7
      offset = null;
      prefs.bumpStations(false, false);
    } else if (code == 57) { // 9
      offset = null;
      prefs.bumpStations(false, true);
    } else if (code == 48) { // 0
      offset = null;
      prefs.flipStations();
    } else if (code == 38) { // up arrow
      offset--;
    } else if (code == 40) { // down arrow
      offset++;
    } else {
      return;
    }
    loadSchedule();
  });
};
