var appState = {
  fullScreen: false,
};

var fullScreenView = function () {
  full = appState.fullScreen
  var elements = document.getElementsByClassName('full-screen-only');
  for(var i=0; i < elements.length; i++){
    elements[i].style['display'] = full ? 'flex' : 'none';
  }
  document.getElementById('titlebar').style['display'] = full ? 'flex' : 'none';
  document.getElementById('hints').style['display'] = full ? 'none' : 'flex';
};

var load_schedule = function () {
  var schedule = document.getElementById('schedule');
  var tripCard = document.getElementsByClassName('trip-card')[0];
  for (var i=0; i < 5; i++) {
    var clone = tripCard.cloneNode(true);
    if (i > 2) {
      clone.classList.add('full-screen-only');
      clone.style.display = 'none';
    } else {
    }
    schedule.appendChild(clone);
  }
  tripCard.classList.add('selection')
};

var display_message = function (message) {
  document.getElementById('message').innerHTML = message;
};

var attach_listeners = function () {
  document.onfullscreenchange = function (event) {
    appState.fullScreen = appState.fullScreen ? false : true;
    fullScreenView();
  };
  document.body.addEventListener("mousemove", function (e) {
    if (e.movementY > 0) {
      display_message("down");
    } else if (e.movementY < 0) {
      display_message("up");
    } else if (e.movementX > 0) {
      display_message("right");
    } else if (e.movementX < 0) {
      display_message("left");
    }
  });
  document.addEventListener('keydown', function (e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 0 || code == 13) {
      display_message('select');
    } else if (code == 8) { // hangup
      display_message('hangup');    // hangup
    } else if (code == 163) { // #
      display_message('hash');      // hash
    } else if (code == 170) { // *
      display_message('splat');     // splat
    } else if (code == 49) { // 1
      display_message('zoom out');  // zoom out
    } else if (code == 50) { // 2
      openFullScreen();             // cursor
    } else if (code == 51) { // 3
      display_message('zoom in');   // zoom in
    } else if (code == 53) { // 5
      display_message('page up');   // page up
    } else if (code == 56) { // 8
      display_message('page down'); // page down
    } else if (code >= 48 && code <= 57) {
      display_message('#' + (code - 48));
    } else if (code == 37) {
      display_message("left");
    } else if (code == 38) {
      display_message("up");
    } else if (code == 39) {
      display_message("right");
    } else if (code == 40) {
      display_message("down");
    } else {
      display_message(code);
    }
  });
};

var openFullScreen = function () {
  document.documentElement.requestFullscreen();
};
