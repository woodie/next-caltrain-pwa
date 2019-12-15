let prefs = new Preferences(caltrainServiceData.southStops);
let sched = new CaltrainService();

var appState = {
  fullScreen: false,
  offset: 8,
  kaios: false,
};

var fullScreenView = function () {
  fs = appState.fullScreen
  document.getElementById('trip4').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('trip5').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('title').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('hints').style['display'] = fs ? 'none' : 'flex';
  document.getElementById('contents').style['height'] = fs ? '290px' : '228px';
};

var loadSchedule = function () {
  // Set the time
  let timeNow = new Date();
  let hr = timeNow.getHours();
  let min = timeNow.getMinutes();
  if (min < 10) { min = "0" + min; }
  let ampm = "am";
  if( hr > 12 ) { hr -= 12; ampm = "pm"; } // hr + ":" + min + ampm ;
  document.getElementById('timeNow').innerHTML = `${hr}:${min}${ampm}`;
  // Set the stations
  let tripLabels = prefs.tripLabels();
  document.getElementById('origin').innerHTML = tripLabels[0];
  document.getElementById('destin').innerHTML = tripLabels[1];
  // Load the schdule (CaltrainService WEEKDAY: 8)
  let routes = sched.routes(tripLabels[0], tripLabels[1], WEEKDAY, prefs.swapped);
  let minsNow = hr * 60 + min;
  debugger;
  let minsSet = routes[appState.offset][1];
  for (let i=0; i < 6; i++) {
    let data = routes[appState.offset + i];
    // Should be moved into GoodTimes class
    let originStr = originMer = destinStr = destinMer = null;
    let om = data[1] % 60;
    let dm = data[2] % 60;
    if (data[1] > 720) {
      originStr = `${(data[1] - 720) / 60}:${om < 10 ? 0 : ''}${om}`;
      originMer = 'pm';
    } else {
      originStr = `${data[1] / 60}:${om < 10 ? 0 : ''}${om}`;
      originMer = 'am';
    }
    if (data[1] > 720) {
      destinStr = `${(data[2] - 720) / 60}:${dm < 10 ? 0 : ''}${dm}`;
      destinMer = 'pm';
    } else {
      destinStr = `${data[2] / 60}:${dm < 10 ? 0 : ''}${dm}`;
      destinMer = 'am';
    }
    // Create each trip card.
    let card = `<div class="train-number">#${data[0]}</div>
        <div class="train-time">${originStr}<span class="meridiem">${originMer}</span></div>
        <div class="train-time">${destinStr}<span class="meridiem">${destinMer}</span></div>`;
    let element = document.getElementById(`trip${i}`)
    element.innerHTML = card;
    let classes = ['trip-card'];
    let inThePast = appState.offset + i < 8;
    if (inThePast) classes.push('train-departed');
    if (i === 0) {
      classes.push('selection');
      classes.push(inThePast ? 'selection-departed' : 'selection-arriving');
      document.getElementById('message').innerHTML = countdown(timeNow, selectedTime);
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
  if (message === 'up' && appState.offset > 0) {
    appState.offset = appState.offset - 1;
  } else if (message === 'down' && appState.offset < 17) {
    appState.offset = appState.offset + 1;
  }
};

var attachListeners = function () {
  if (navigator.userAgent.includes('KAIOS')) appState.kaios = true;
  document.onfullscreenchange = function (event) {
    appState.fullScreen = appState.fullScreen ? false : true;
    fullScreenView();
  };
  document.body.addEventListener("mousemove", function (e) {
    if (appState.kaios == false) return;
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
      prefs.bumpStations(true, false);
    } else if (code == 54) { // 6
      prefs.bumpStations(true, true);
    } else if (code == 55) { // 7
      prefs.bumpStations(false, false);
    } else if (code == 57) { // 9
      prefs.bumpStations(false, true);
    } else if (code == 48) { // 0
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
    if (!appState.fullScreen) document.documentElement.requestFullscreen();
  } catch(error) {
  }
};
