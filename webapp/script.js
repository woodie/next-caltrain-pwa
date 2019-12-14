let prefs = new Preferences(caltrainServiceData.southStops);

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
  var d = new Date();
  var hr = d.getHours();
  var min = d.getMinutes();
  if (min < 10) { min = "0" + min; }
  var ampm = "am";
  if( hr > 12 ) { hr -= 12; ampm = "pm"; } // hr + ":" + min + ampm ;
  //document.getElementById('timeNow').innerHTML = `${hr}:${min}${ampm}`;
  fakeTime = '7:58am';
  document.getElementById('timeNow').innerHTML = fakeTime;
  // Load the schdule
  let tripLabels = prefs.tripLabels();
  document.getElementById('origin').innerHTML = tripLabels[0];
  document.getElementById('destin').innerHTML = tripLabels[1];
  var filler = [
      [309, '6:04', 'am', '7:09', 'am'],
      [211, '6:23', 'am', '7:57', 'am'],
      [217, '6:59', 'am', '8:24', 'am'],
      [313, '6:49', 'am', '7:52', 'am'],
      [215, '6:54', 'am', '8:08', 'am'],
      [319, '7:04', 'am', '8:13', 'am'],
      [221, '7:23', 'am', '9:00', 'am'],
      [323, '7:49', 'am', '9:00', 'am'],
      [329, '8:04', 'am', '9:13', 'am'],
      [231, '8:23', 'am', '9:52', 'am'],
      [233, '8:39', 'am','10:09', 'am'],
      [135, '9:13', 'am','10:52', 'am'],
      [237, '9:50', 'am','11:19', 'am'],
      [139,'10:13', 'am','11:48', 'am'],
      [143,'11:13', 'am','12:48', 'pm'],
      [147,'12:13', 'pm', '1:48', 'pm'],
      [151, '1:13', 'pm', '2:48', 'pm'],
      [155, '2:13', 'pm', '3:52', 'pm'],
      [257, '2:24', 'pm', '3:57', 'pm'],
      [159, '3:13', 'pm', '4:53', 'pm'],
      [261, '3:40', 'pm', '5:02', 'pm'],
      [263, '4:12', 'pm', '5:38', 'pm'],
      [365, '4:24', 'pm', '5:33', 'pm'] ];
  for (var i=0; i < 6; i++) {
    var data = filler[appState.offset + i]
    var card = `<div class="train-number">#${data[0]}</div>
        <div class="train-time">${data[1]}<span class="meridiem">${data[2]}</span></div>
        <div class="train-time">${data[3]}<span class="meridiem">${data[4]}</span></div>`;
    var element = document.getElementById(`trip${i}`)
    element.innerHTML = card;
    var classes = ['trip-card'];
    var inThePast = appState.offset + i < 8;
    if (inThePast) classes.push('train-departed');
    if (i === 0) {
      classes.push('selection');
      classes.push(inThePast ? 'selection-departed' : 'selection-arriving');
      fakeCountdown =  countdownFake(fakeTime, data[1] + data[2]);
      document.getElementById('message').innerHTML = fakeCountdown;
    }
    element.className = classes.join(' ');
  }
};

// The countdownFake function works with minutes (not seconds)
var countdownFake = function(clockNowTime, selectedTime) {
  var clockNowParts = clockNowTime.split(':');
  var selectedParts = selectedTime.split(':');
  clockNow = (parseInt(clockNowParts[0]) * 60 + parseInt(clockNowParts[1]));
  selected = (parseInt(selectedParts[0]) * 60 + parseInt(selectedParts[1]));
  if (selectedParts[1].endsWith('pm')) { selected += 1440; }
  var timeDifference = selected - clockNow;
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
    loadSchedule();
  } else if (message === 'down' && appState.offset < 17) {
    appState.offset = appState.offset + 1;
    loadSchedule();
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
      loadSchedule();
    } else if (code == 54) { // 6
      prefs.bumpStations(true, true);
      loadSchedule();
    } else if (code == 55) { // 7
      prefs.bumpStations(false, false);
      loadSchedule();
    } else if (code == 57) { // 9
      prefs.bumpStations(false, true);
      loadSchedule();
    } else if (code == 48) { // 0
      prefs.swapStations();
      loadSchedule();
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
    }
    openFullScreen();
  });
};

var openFullScreen = function () {
  try {
    if (!appState.fullScreen) document.documentElement.requestFullscreen();
  } catch(error) {
    console.log('requestFullscreen() failed');
  }
};
