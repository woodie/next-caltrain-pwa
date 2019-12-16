let prefs = new Preferences(caltrainServiceData.southStops);
let sched = new CaltrainService();
let fullScreen = false;
let kaios = false;
let offset = -1;

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
  document.getElementById('timeNow').innerHTML = goodTime.fullTime();
  // Set the stations
  let tripLabels = prefs.tripLabels();
  document.getElementById('origin').innerHTML = tripLabels[0];
  document.getElementById('destin').innerHTML = tripLabels[1];
  // Load the schdule (CaltrainService WEEKDAY: 8)
  let routes = sched.routes(prefs.origin, prefs.destin, WEEKDAY, prefs.swapped);
  if (offset === -1) offset = 0;
  for (let i=0; i < 6; i++) {
    let element = document.getElementById(`trip${i}`)
    let n = (i >= routes.length - 1) ? routes.length - 1 : i;
    let data = routes[offset + n];
    if (routes.length <= i) {
      element.innerHTML = '<div class="train-time">&nbsp;</div>';
      document.getElementById('message').innerHTML = '';
      continue;
    }
    if (1 === 0) {
      document.getElementById('message').innerHTML = goodTime.countdown(data[1]);
    }
    let originTime = GoodTimes.partTime(data[1]);
    let destinTime = GoodTimes.partTime(data[2]);
    let card = `<div class="train-number">#${data[0]}</div>
        <div class="train-time">${originTime[0]}<span class="meridiem">${originTime[1]}</span></div>
        <div class="train-time">${destinTime[0]}<span class="meridiem">${destinTime[1]}</span></div>`;
    element.innerHTML = card;
    let classes = ['trip-card'];
    if (n === 0) {
      classes.push('selection');
      if (goodTime.inThePast(data[1])) {
        classes.push('train-departed');
        classes.push('selection-departed');
      } else {
        classes.push('selection-arriving');
      }
    }
    element.className = classes.join(' ');
  }
};

// Should be moved into GoodTimes class.
var countdown = function(minsNow, minsSet) {
  let timeDifference = minsSet - minsNow;
  if (timeDifference < 0) { return '&nbsp;'; }
  if (timeDifference < 60) {
    return `in ${Math.floor(timeDifference % 60)} min 22 sec`;
  } else {
    return `in ${Math.floor(timeDifference / 60)} hr ${Math.floor(timeDifference % 60)} min`;
  }
}

var displayMessage = function (message) {
  document.getElementById('message').innerHTML = message;
  if (message === 'up' && offset > 0) {
    offset = offset - 1;
  } else if (message === 'down' && offset < 17) {
    offset = offset + 1;
  }
};

var attachListeners = function () {
  if (navigator.userAgent.includes('KAIOS')) kaios = true;
  document.onfullscreenchange = function (event) {
    fullScreen = fullScreen ? false : true;
    fullScreenView();
  };
  document.body.addEventListener("mousemove", function (e) {
    if (kaios == false) return;
    if (e.movementY > 0) {
      displayMessage("down");
    } else if (e.movementY < 0) {
      displayMessage("up");
    } else if (e.movementX > 0) {
      displayMessage("right");
    } else if (e.movementX < 0) {
      displayMessage("left");
    }
  });
  document.addEventListener('keydown', function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 0 || code == 13) {
      displayMessage('select');
      return;
    } else if (code == 8) { // hangup
      displayMessage('hangup');    // hangup
      prefs.saveStops();
      return;
    } else if (code == 163) { // #
      displayMessage('hash');      // hash
    } else if (code == 170) { // *
      displayMessage('splat');     // splat
    } else if (code == 49) { // 1
      displayMessage('zoom out');  // zoom out
    } else if (code == 50) { // 2
      displayMessage('cursor');    // cursor
    } else if (code == 51) { // 3
      displayMessage('zoom in');   // zoom in
    } else if (code == 53) { // 5
      displayMessage('up');   // page up
    } else if (code == 56) { // 8
      displayMessage('down'); // page down
    } else if (code == 52) { // 4
      offset = -1;
      prefs.bumpStations(true, false);
    } else if (code == 54) { // 6
      offset = -1;
      prefs.bumpStations(true, true);
    } else if (code == 55) { // 7
      offset = -1;
      prefs.bumpStations(false, false);
    } else if (code == 57) { // 9
      offset = -1;
      prefs.bumpStations(false, true);
    } else if (code == 48) { // 0
      offset = -1;
      prefs.swapStations();
    } else if (code >= 48 && code <= 57) {
      displayMessage('#' + (code - 48));
    } else if (code == 37) {
      displayMessage("left");
    } else if (code == 38) {
      displayMessage("up");
    } else if (code == 39) {
      displayMessage("right");
    } else if (code == 40) {
      displayMessage("down");
    } else {
      displayMessage(code);
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
