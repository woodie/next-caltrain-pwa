'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prefs = new Preferences(caltrainServiceData.southStops);
var schedule = new CaltrainService();
var swapped = false;
var kaios1 = false;
var kaios2 = false;
var others = false;
var countdown = null;
var trainId = null;
var offset = null;

var splashScreen = true;
var mainScreen = false;
var tripScreen = false;

var NextCaltrain = function () {
  function NextCaltrain() {
    _classCallCheck(this, NextCaltrain);
  }

  _createClass(NextCaltrain, null, [{
    key: 'startApp',
    value: function startApp() {
      if (navigator.userAgent.indexOf('KaiOS/1') !== -1) kaios1 = true;
      if (navigator.userAgent.indexOf('KAIOS/2') !== -1) kaios2 = true;
      others = kaios1 || kaios2 ? false : true;
      document.getElementById('keypad').style['display'] = others ? 'flex' : 'none';
      document.getElementById('native-infobar').style['display'] = others ? 'block' : 'none';
      document.getElementById('native-titlebar').style['display'] = others ? 'block' : 'none';
      document.getElementById('native-toolbar').style['display'] = others ? 'flex' : 'none';
      NextCaltrain.attachListeners();
      NextCaltrain.setTheTime();
    }
  }, {
    key: 'setTheTime',
    value: function setTheTime() {
      var ourTime = new GoodTimes();
      document.getElementById('mainTime').innerHTML = ourTime.fullTime();
      document.getElementById('moreTime').innerHTML = ourTime.fullTime();
      setTimeout(function () {
        NextCaltrain.setTheTime();
      }, (60 - ourTime.seconds) * 1000);
      NextCaltrain.loadSchedule();
    }
  }, {
    key: 'setCountdown',
    value: function setCountdown(minutes) {
      var downTime = new GoodTimes();
      var blurb = downTime.countdown(minutes);
      document.getElementById('blurb').innerHTML = blurb;
      document.getElementById('blurb-splash').innerHTML = blurb;
      var refresh = blurb.endsWith('sec') ? 1000 : (60 - downTime.seconds) * 1000;
      countdown = setTimeout(function () {
        NextCaltrain.setCountdown(minutes);
      }, refresh);
    }
  }, {
    key: 'openFullScreen',
    value: function openFullScreen() {
      if (kaios2 === true) {
        document.documentElement.requestFullscreen();
      } else {
        NextCaltrain.fullScreenView(true);
      }
    }
  }, {
    key: 'fullScreenView',
    value: function fullScreenView(fs) {
      document.getElementById('splash-screen').style['display'] = fs ? 'none' : 'flex';
      document.getElementById('main-screen').style['display'] = fs ? 'flex' : 'none';
      document.getElementById('trip-screen').style['display'] = 'none';
      tripScreen = false;
    }
  }, {
    key: 'toggleTripScreen',
    value: function toggleTripScreen() {
      tripScreen = tripScreen ? false : trainId != null;
      if (!tripScreen) {
        document.getElementById('trip-screen').style['display'] = 'none';
        document.getElementById('splash-screen').style['display'] = kaios1 ? 'flex' : 'none';
        document.getElementById('main-screen').style['display'] = kaios1 ? 'none' : 'flex';
      } else {
        document.getElementById('trip-screen').style['display'] = 'flex';
        document.getElementById('splash-screen').style['display'] = 'none';
        document.getElementById('main-screen').style['display'] = 'none';
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
    }
  }, {
    key: 'populateBlurb',
    value: function populateBlurb(message, textClass) {
      document.getElementById('blurb').innerHTML = message;
      document.getElementById('blurb').className = textClass;
      document.getElementById('blurb-splash').innerHTML = message.replace(' Schedule', '');
      document.getElementById('blurb-splash').className = textClass;
    }
  }, {
    key: 'loadSchedule',
    value: function loadSchedule() {
      clearTimeout(countdown);

      var tripLabels = prefs.tripLabels();
      document.getElementById('origin').innerHTML = tripLabels[0];
      document.getElementById('destin').innerHTML = tripLabels[1];
      document.getElementById('origin-splash').innerHTML = tripLabels[0];
      document.getElementById('destin-splash').innerHTML = tripLabels[1];

      var goodTime = new GoodTimes();
      var routes = schedule.routes(prefs.origin, prefs.destin, goodTime.schedule(), swapped);
      var minutes = 0;
      if (offset === null) {
        minutes = goodTime.minutes;
        offset = CaltrainService.nextIndex(routes, minutes);
      } else if (offset > routes.length - 1) {
        offset = 0;
      } else if (offset < 0) {
        offset = routes.length - 1;
      }

      for (var i = 0; i < 6; i++) {
        var tripCardElement = document.getElementById(`trip${i}`);
        var n = offset + i > routes.length - 1 ? offset + i - routes.length : offset + i;
        var route = routes[n];
        if (i > routes.length - 1) {
          if (i === 0) {
            NextCaltrain.populateBlurb('NO TRAINS', 'message-departed blink');
            document.getElementById('circle').className = 'selection-departed';
            document.getElementById('trip0').className = 'selection-none';
            document.getElementById('trip').innerHTML = '<span class="time-splash">&nbsp;</span>';
            document.getElementById('trip-type').innerHTML = '&nbsp;';
          }
          tripCardElement.innerHTML = '<div class="train-time">&nbsp;</div>';
          continue;
        }
        minutes = route[1];
        var originTime = GoodTimes.partTime(minutes);
        var destinTime = GoodTimes.partTime(route[2]);
        var card = `<div class="train-number">#${route[0]}</div>
          <div class="train-time">${originTime[0]}<span class="meridiem">${originTime[1]}</span></div>
          <div class="train-time">${destinTime[0]}<span class="meridiem">${destinTime[1]}</span></div>`;
        tripCardElement.innerHTML = card;
        if (i === 0) {
          var tripTime = `<span class="train-splash">#${route[0]}</span>
            <span class="time-splash">${originTime[0]}</span>
            <span class="meridiem-splash">${originTime[1]}</span>`;
          document.getElementById('trip').innerHTML = tripTime;
          trainId = route[0];
          var message = void 0,
              textClass = void 0,
              tripClass = void 0,
              wrapClass = void 0;
          if (swapped) {
            message = goodTime.swapped();
            textClass = 'message-departed';
            tripClass = goodTime.inThePast(minutes) ? 'message-departed' : '';
            wrapClass = 'selection-swapped';
          } else if (goodTime.inThePast(minutes)) {
            message = '&nbsp;';
            tripClass = 'message-departed';
            wrapClass = 'selection-departed';
          } else if (goodTime.departing(minutes)) {
            message = 'DEPARTING';
            textClass = 'message-departing blink';
            wrapClass = 'selection-departing';
          } else {
            message = goodTime.countdown(minutes);
            textClass = 'message-arriving';
            wrapClass = 'selection-arriving';
            if (minutes > 0) {
              NextCaltrain.setCountdown(minutes);
            }
          }
          document.getElementById('circle').className = wrapClass;
          document.getElementById('trip').className = tripClass;
          document.getElementById('trip-type').innerHTML = CaltrainTrip.type(trainId);
          tripCardElement.className = ['trip-card', 'selection', tripClass, wrapClass].join(' ');
          NextCaltrain.populateBlurb(message, textClass);
        } else {
          if (goodTime.inThePast(minutes)) {
            tripCardElement.className = 'trip-card message-departed';
          } else {
            tripCardElement.className = 'trip-card';
          }
        }
      }
    }
  }, {
    key: 'attachListeners',
    value: function attachListeners() {
      document.onfullscreenchange = function (event) {
        var invert = document.getElementById('splash-screen').style['display'] === 'flex';
        NextCaltrain.fullScreenView(invert);
      };
      document.body.addEventListener("mousemove", function (e) {
        if (kaios2) {
          if (e.movementY < 0) {
            NextCaltrain.press(53);
          } else if (e.movementY > 0) {
            NextCaltrain.press(56);
          }
        }
      });
      document.addEventListener("click", function (e) {
        if (!others) NextCaltrain.press(13);
      });
      document.addEventListener('keydown', function (e) {
        var code = e.keyCode ? e.keyCode : e.which;

        if (tripScreen && code === 8 || code === 13) {
          e.preventDefault();
        }
        NextCaltrain.press(code);
      });
    }
  }, {
    key: 'press',
    value: function press(code) {
      if (code === -1) {
        NextCaltrain.fullScreenView(false);
      } else if (tripScreen) {
        if (code === 8) {
          NextCaltrain.toggleTripScreen();
        }
      } else {
        if (code === 13) {
          if (kaios2 && document.getElementById('splash-screen').style['display'] === 'flex') {
            NextCaltrain.openFullScreen();
          } else {
            NextCaltrain.toggleTripScreen();
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
        NextCaltrain.loadSchedule();
      }
    }
  }]);

  return NextCaltrain;
}();