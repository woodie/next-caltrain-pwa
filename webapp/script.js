var appState = {
  fullScreen: false,
};

var fullScreenView = function () {
  fs = appState.fullScreen
  document.getElementById('trip4').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('trip5').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('title').style['display'] = fs ? 'flex' : 'none';
  document.getElementById('hints').style['display'] = fs ? 'none' : 'flex';
  document.getElementById('contents').style['height'] = fs ? 290 : 228;
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
  document.getElementById('timeNow').innerHTML = '7:58am'; // fake
  // Load the schdule
  document.getElementById('stations').innerHTML = `San Jose Diridon<br>to San Francisco`;
  document.getElementById('message').innerHTML = `in 6 min 22 sec`;
  var filler = [[329, '8:04', 'am', '9:13', 'am'],
                [231, '8:23', 'am', '9:52', 'am'],
                [233, '8:39', 'am','10:09', 'am'],
                [135, '9:13', 'am','10:52', 'am'],
                [237, '9:50', 'am','11:19', 'am'],
                [139,'10:13', 'am','11:48', 'am']];
  for (var i=0; i < 6; i++) {
    var data = filler[i]
    var card = `<div class="train-number">#${data[0]}</div>
        <div class="train-time">${data[1]}<span class="meridiem">${data[2]}</span></div>
        <div class="train-time">${data[3]}<span class="meridiem">${data[4]}</span></div>`;
    document.getElementById(`trip${i}`).innerHTML = card;
  }
};

var displayMessage = function (message) {
  document.getElementById('message').innerHTML = message;
};

var attachListeners = function () {
  document.onfullscreenchange = function (event) {
    appState.fullScreen = appState.fullScreen ? false : true;
    fullScreenView();
  };
  document.body.addEventListener("mousemove", function (e) {
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
    } else if (code == 8) { // hangup
      displayMessage('hangup');    // hangup
    } else if (code == 163) { // #
      displayMessage('hash');      // hash
    } else if (code == 170) { // *
      displayMessage('splat');     // splat
    } else if (code == 49) { // 1
      displayMessage('zoom out');  // zoom out
    } else if (code == 50) { // 2
      openFullScreen();             // cursor
    } else if (code == 51) { // 3
      displayMessage('zoom in');   // zoom in
    } else if (code == 53) { // 5
      displayMessage('page up');   // page up
    } else if (code == 56) { // 8
      displayMessage('page down'); // page down
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
  });
};

var openFullScreen = function () {
  document.documentElement.requestFullscreen();
};
