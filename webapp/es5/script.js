'use strict';

var prefs = new Preferences(caltrainServiceData.southStops);
var schedule = new CaltrainService();
var fullScreen = false;
var swapped = false;
var kaios = false;
var countdown = null;
var trainId = null;
var offset = null;

var splashScreen = true;
var mainScreen = false;
var tripScreen = false;


var startApp = function startApp() {
  if (navigator.userAgent.indexOf('KAIOS') !== -1) kaios = true;
  document.getElementById('keypad').style['display'] = kaios ? 'none' : 'flex';
  attachListeners();
  setTheTime();
};

var setTheTime = function setTheTime() {
  var ourTime = new GoodTimes();
  document.getElementById('mainTime').innerHTML = ourTime.fullTime();
  document.getElementById('moreTime').innerHTML = ourTime.fullTime();
  setTimeout(setTheTime, (60 - ourTime.seconds) * 1000);
  loadSchedule();
};

var setCountdown = function setCountdown(minutes) {
  var downTime = new GoodTimes();
  var blurb = downTime.countdown(minutes);
  document.getElementById('blurb').innerHTML = blurb;
  var refresh = blurb.endsWith('sec') ? 1000 : (60 - downTime.seconds) * 1000;
  countdown = setTimeout(function () {
    setCountdown(minutes);
  }, refresh);
};

var openFullScreen = function openFullScreen() {
  if (kaios === true) {
    if (fullScreen === false) {
      try {
        document.documentElement.requestFullscreen();
      } catch (error) {}
    }
  } else {
    fullScreen = true;
    fullScreenView();
  }
};

var fullScreenView = function fullScreenView() {
  document.getElementById('splashScreen').style['display'] = fullScreen ? 'none' : 'flex';
  document.getElementById('mainScreen').style['display'] = fullScreen ? 'flex' : 'none';
  document.getElementById('tripScreen').style['display'] = 'none';
  tripScreen = false;
};

var toggleTripScreen = function toggleTripScreen() {
  tripScreen = tripScreen ? false : trainId != null;
  document.getElementById('tripScreen').style['display'] = tripScreen ? 'flex' : 'none';
  document.getElementById('mainScreen').style['display'] = tripScreen ? 'none' : 'flex';
  if (tripScreen) {
    var trip = new CaltrainTrip(trainId);
    document.getElementById('label').innerHTML = trip.label();
    document.getElementById('description').innerHTML = trip.description();
    var goodTime = new GoodTimes();
    var lines = [];
    for (var i = 0; i < trip.times.length; i++) {
      stop = trip.times[i];
      var spacer = i === 0 ? '' : '|';
      var fullTime = GoodTimes.fullTime(stop[1]);
      var filler = fullTime.length > 6 ? '' : '0';
      var style = goodTime.inThePast(stop[1]) ? 'message-departed' : 'message-arriving';
      var target = prefs.origin === stop[0] || prefs.destin === stop[0] ? 'target' : '';
      lines.push(`<div class="station-stop">
          <div class="station-time"><br/><span
               class="filler">${filler}</span>${fullTime}</div>
          <div class="station-spacer ${style}">${spacer}<br/><span
               class="station-dot ${target}">&#9679;</span></div>
          <div class="station-name"><br/>${stop[0]}</div></div>`);
    }
    document.getElementById('listing').innerHTML = lines.join("\n");
  }
};

var loadSchedule = function loadSchedule() {
  var minutes = 0;
  clearTimeout(countdown);
  var goodTime = new GoodTimes();
  var message = '&nbsp;';

  var tripLabels = prefs.tripLabels();
  document.getElementById('origin').innerHTML = tripLabels[0];
  document.getElementById('destin').innerHTML = tripLabels[1];
  document.getElementById('origin-splash').innerHTML = tripLabels[0];
  document.getElementById('destin-splash').innerHTML = tripLabels[1];

  var routes = schedule.routes(prefs.origin, prefs.destin, goodTime.schedule(), swapped);
  if (offset === null) {
    minutes = goodTime.minutes;
    offset = CaltrainService.nextIndex(routes, minutes);
  } else if (offset > routes.length - 1) {
    offset = 0;
  } else if (offset < 0) {
    offset = routes.length - 1;
  }
  for (var i = 0; i < 6; i++) {
    var classes = ['trip-card'];
    var element = document.getElementById(`trip${i}`);
    var n = offset + i > routes.length - 1 ? offset + i - routes.length : offset + i;
    var route = routes[n];
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
    var originTime = GoodTimes.partTime(minutes);
    var destinTime = GoodTimes.partTime(route[2]);
    var card = `<div class="train-number">#${route[0]}</div>
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
        if (goodTime.inThePast(minutes)) {
          classes.push('message-departed');
        }
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
          if (minutes > 0) {
            setCountdown(minutes);
          }
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

var attachListeners = function attachListeners() {
  document.onfullscreenchange = function (event) {
    fullScreen = fullScreen ? false : true;
    fullScreenView();
  };
  document.body.addEventListener("mousemove", function (e) {
    if (kaios) {
      if (e.movementY < 0) {
        processEvent(53);
      } else if (e.movementY > 0) {
        processEvent(56);
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
    if (code === 8 || code === 13) {
      e.preventDefault();
    }
    processEvent(code);
  });
};

var processEvent = function processEvent(code) {
  if (code === -1) {
    fullScreen = false;
    fullScreenView();
  } else if (tripScreen) {
    if (code === 8) {
      toggleTripScreen();
    }
  } else {
    if (code === 1 || code === 13) {
      if (!fullScreen) {
        openFullScreen();
      } else {
        toggleTripScreen();
      }
      return;
    } else if (code === 163 || code === 39) {
      swapped = swapped ? false : true;
      offset = null;
    } else if (code === 170 || code === 37) {
      prefs.saveStops();
    } else if (code === 50) {
      return;
    } else if (code === 53) {
      offset--;
    } else if (code === 56) {
      offset++;
    } else if (code === 52) {
      offset = null;
      prefs.bumpStations(true, false);
    } else if (code === 54) {
      offset = null;
      prefs.bumpStations(true, true);
    } else if (code === 55) {
      offset = null;
      prefs.bumpStations(false, false);
    } else if (code === 57) {
      offset = null;
      prefs.bumpStations(false, true);
    } else if (code === 48) {
      offset = null;
      prefs.flipStations();
    } else if (code === 38) {
      offset--;
    } else if (code === 40) {
      offset++;
    } else {
      return;
    }
    loadSchedule();
  }
};