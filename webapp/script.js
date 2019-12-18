let prefs = new Preferences(caltrainServiceData.southStops);
let sched = new CaltrainService();
let fullScreen = false;
let swapped = false;
let kaios = false;
let offset = null;

var fullScreenView = function () {
  fs = fullScreen
  document.getElementById('trip4').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('trip5').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('title').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('hints').style['display'] = fs ? 'none' : 'flex';
  document.getElementById('contents').style['height'] = fs ? '290px' : '228px';
};

var loadSchedule = function () {
  let goodTime = new GoodTimes();
  let message = '&nbsp;';
  document.getElementById('timeNow').innerHTML = goodTime.fullTime();
  // Set the stations
  let tripLabels = prefs.tripLabels();
  document.getElementById('origin').innerHTML = tripLabels[0];
  document.getElementById('destin').innerHTML = tripLabels[1];
  // Load the schdule
  let routes = sched.routes(prefs.origin, prefs.destin, goodTime.schedule(), swapped);
  if (offset === null) {
    offset = CaltrainService.nextIndex(routes, goodTime.minutes);
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
        document.getElementById('message').innerHTML = 'NO TRAINS';
        document.getElementById('message').className = 'message-swapped';
        element.className = 'selection-none';
      }
      continue;
    }
    let originTime = GoodTimes.partTime(route[1]);
    let destinTime = GoodTimes.partTime(route[2]);
    let card = `<div class="train-number">#${route[0]}</div>
        <div class="train-time">${originTime[0]}<span class="meridiem">${originTime[1]}</span></div>
        <div class="train-time">${destinTime[0]}<span class="meridiem">${destinTime[1]}</span></div>`;
    element.innerHTML = card;
    if (i === 0) {
      classes.push('selection');
      if (goodTime.inThePast(route[1])) {
        classes.push('train-departed');
        classes.push('selection-departed');
      } else {
        if (swapped) {
          document.getElementById('message').className = 'message-swapped';
          classes.push('selection-swapped');
          message = goodTime.swapped();
        } else {
          document.getElementById('message').className = 'message-arriving';
          classes.push('selection-arriving');
          message = goodTime.countdown(route[1]);
        }
      }
    } else {
      if (goodTime.inThePast(route[1])) {
        classes.push('train-departed');
      }
    }
    element.className = classes.join(' ');
    document.getElementById('message').innerHTML = message;
  }
};

var attachListeners = function () {
  if (navigator.userAgent.includes('KAIOS')) kaios = true;
  document.onfullscreenchange = function (event) {
    fullScreen = fullScreen ? false : true;
    fullScreenView();
  };
  document.addEventListener('keydown', function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 0 || code == 13) { // select
      return;
    } else if (code == 8) { // hangup
      return;
    } else if (code == 163 || code === 39) { // # or ->
      swapped = swapped ? false : true;
      offset = null;
    } else if (code == 170 || code === 37) { // * or <-
      prefs.saveStops();
      return;
    } else if (code == 53) { // 5 page up
      offset--;
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
    openFullScreen();
    loadSchedule();
  });
};

var openFullScreen = function () {
  try {
    if (!fullScreen) document.documentElement.requestFullscreen();
  } catch(error) {
  }
};
