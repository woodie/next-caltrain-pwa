'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prefs = new Preferences(caltrainServiceData.southStops);
var schedule = new CaltrainService();
var swapped = false;
var kaios1 = false;
var kaios2 = false;
var kaios = false;
var countdown = null;
var trainId = null;
var offset = null;

var OK = 13;
var BACK = 95;
var HANGUP = 8;
var ESC = 27;
var UP = 53;
var DOWN = 56;

var screens = 'hero grid trip about commands'.split(' ');

var hints = [['Use the keypad to navigate<br/>as there is no touchscreen.', [], 'Press [OK] to continue and<br/>[BACK] to return to the app.'], ['Use [5] and [8] to move<br/>the seletion up and down.', [5, 8], 'The [UP] and [DOWN] buttons<br/>may not work as expected.'], ['Use [4] and [6] to<br/>change origin station.', [4, 6, 7, 9], 'Use [7] and [9] to<br/>change destination station.'], ['Use [0] to flip the direction<br/>of the selected stations.', [0, '#'], 'Use [#] to swap between<br/>weekday/weekend schedules.'], ['Move cursor to the right,<br/>use [5] or [8] to navigate.<br/>' + 'Note: Cursor arrow is visible<br/>but not used by this app.<br/>', null, `Select "Pin to Apps Menu"<br/>from the [Options] menu.<br/>` + 'Note: Function keys do not<br/>directly control this app.']];

var hintIndex = -1;

var NextCaltrain = function () {
  function NextCaltrain() {
    _classCallCheck(this, NextCaltrain);
  }

  _createClass(NextCaltrain, null, [{
    key: 'startApp',
    value: function startApp() {
      if (document.location.search === '?kaios1' || navigator.userAgent.indexOf('KaiOS/1') !== -1) kaios1 = true;
      if (document.location.search === '?kaios2' || navigator.userAgent.indexOf('KAIOS/2') !== -1) kaios2 = true;
      kaios = kaios1 || kaios2;
      if (!kaios) {
        document.getElementById('keypad').style['display'] = 'flex';
        document.getElementById('hero-filler').style['display'] = 'flex';
      } else if (kaios1) {
        document.getElementById('grid-screen').className = 'part-screen';
        document.getElementById('trip-screen').className = 'part-screen';
      }

      var dateString = GoodTimes.dateString(caltrainServiceData.scheduleDate);
      document.getElementById('date-string').innerHTML = dateString;
      NextCaltrain.attachListeners();
      NextCaltrain.setTheTime();
      NextCaltrain.formatHints();
    }
  }, {
    key: 'formatHints',
    value: function formatHints() {
      for (var i = 0; i < hints.length; i++) {
        for (var n = 0; n < 2; n++) {
          hints[i][n * 2] = hints[i][n * 2].replace(/\[/g, "<span class='btn'>").replace(/\]/g, "</span>");
          if (kaios1) hints[i][n * 2].replace(/Apps Menu/, 'Top Sites');
        }
      }
    }
  }, {
    key: 'bumpKeypadHint',
    value: function bumpKeypadHint() {
      hintIndex++;
      if (hintIndex >= hints.length) hintIndex = 0;
      document.getElementById('hint-above').innerHTML = hints[hintIndex][0];
      document.getElementById('hint-below').innerHTML = hints[hintIndex][2];
      if (hints[hintIndex][1] === null) {
        document.getElementById('mini-keypad').style['display'] = 'none';
      } else {
        document.getElementById('mini-keypad').style['display'] = 'flex';
        var bg = ['black', 'gray'];
        for (var i = 0; i < 12; i++) {
          var key = i < 10 ? i : ['*', '#'][i % 2];
          var clr = hints[hintIndex][1].indexOf(key) == -1 ? bg[1] : bg[0];
          document.getElementById(`k${key}`).style['background-color'] = clr;
        }
      }
    }
  }, {
    key: 'setTitlebar',
    value: function setTitlebar(message) {
      document.title = message;
    }
  }, {
    key: 'setTheTime',
    value: function setTheTime() {
      var ourTime = new GoodTimes();
      var partTime = ourTime.partTime();
      document.getElementById('grid-time').innerHTML = partTime[0];
      document.getElementById('grid-ampm').innerHTML = partTime[1].toUpperCase();
      document.getElementById('trip-time').innerHTML = partTime[0];
      document.getElementById('trip-ampm').innerHTML = partTime[1].toUpperCase();
      document.getElementById('hero-time').innerHTML = partTime[0];
      document.getElementById('hero-ampm').innerHTML = partTime[1].toUpperCase();
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
      document.getElementById('blurb-hero').innerHTML = blurb;
      if (blurb !== '') {
        var refresh = blurb.endsWith('sec') ? 1000 : (60 - downTime.seconds) * 1000;
        countdown = setTimeout(function () {
          NextCaltrain.setCountdown(minutes);
        }, refresh);
      }
    }
  }, {
    key: 'populateBlurb',
    value: function populateBlurb(message, textClass) {
      document.getElementById('blurb').innerHTML = message;
      document.getElementById('blurb').className = textClass;
      document.getElementById('blurb-hero').innerHTML = message.replace(' Schedule', '');
      document.getElementById('blurb-hero').className = textClass;
    }
  }, {
    key: 'loadTrip',
    value: function loadTrip(train) {
      var trip = new CaltrainTrip(train);
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
  }, {
    key: 'loadSchedule',
    value: function loadSchedule() {
      clearTimeout(countdown);

      var tripLabels = prefs.tripLabels();
      document.getElementById('origin-grid').innerHTML = tripLabels[0];
      document.getElementById('destin-grid').innerHTML = tripLabels[1];
      document.getElementById('origin-hero').innerHTML = tripLabels[0];
      document.getElementById('destin-hero').innerHTML = tripLabels[1];

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
            document.getElementById('trip').innerHTML = '<span class="time-hero">&nbsp;</span>';
            document.getElementById('trip-type').innerHTML = '&nbsp;';
            document.getElementById('grid-type').innerHTML = 'Next Caltrain';
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
          var tripTime = `<span class="train-hero">#${route[0]}</span>
            <span class="time-hero">${originTime[0]}</span>
            <span class="meridiem-hero">${originTime[1]}</span>`;
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
          document.getElementById('grid-type').innerHTML = `Service: ${CaltrainTrip.type(trainId)}`;
          if (kaios1 && NextCaltrain.currentScreen() === 'grid') {
            if (trainId) NextCaltrain.setTitlebar(`Service: ${CaltrainTrip.type(trainId)}`);
          }
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
    key: 'popupMenu',
    value: function popupMenu(action) {
      var popupElement = document.getElementById('popup-menu');
      if (action === 'show') {
        popupElement.style['display'] = 'block';
        popupElement.selectedIndex = 3;
        popupElement.focus();
      } else if (action === 'hide') {
        popupElement.style['display'] = 'none';
      } else {
        NextCaltrain.press(action);
      }
    }
  }, {
    key: 'currentScreen',
    value: function currentScreen() {
      for (var i = 0; i < screens.length; i++) {
        if (document.getElementById(`${screens[i]}-screen`).style['display'] === 'flex') return screens[i];
      }
      return screens[0];
    }
  }, {
    key: 'displayScreen',
    value: function displayScreen(target) {
      if (kaios1) document.title = 'Next Caltrain';
      if (target === 'hero' || target === 'grid' || target === 'trip') {
        if (kaios2 && !document.fullscreenElement) document.documentElement.requestFullscreen();
      } else {
        if (kaios2 && document.fullscreenElement) document.exitFullscreen();
      }
      for (var i = 0; i < screens.length; i++) {
        var display = target === screens[i] ? 'flex' : 'none';
        document.getElementById(`${screens[i]}-screen`).style['display'] = display;
      }
      if (target === 'grid' || target === 'trip' || target === 'hero') {
        NextCaltrain.loadSchedule();
      }
    }
  }, {
    key: 'attachListeners',
    value: function attachListeners() {
      document.onfullscreenchange = function (e) {
        if (document.fullscreenElement) {
          document.getElementById('hero-filler').style['display'] = 'flex';
        } else {
          document.getElementById('hero-filler').style['display'] = 'none';
          NextCaltrain.displayScreen('hero');
        }
      };

      document.body.addEventListener("mousemove", function (e) {
        if (kaios2) {
          if (e.movementY < 0) {
            NextCaltrain.press(UP);
          } else if (e.movementY > 0) {
            NextCaltrain.press(DOWN);
          }
        }
      });

      document.addEventListener("click", function (e) {
        if (kaios) {
          NextCaltrain.press(OK);
        }
      });

      document.addEventListener('keydown', function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code === HANGUP) {
          code = BACK;
          if (NextCaltrain.currentScreen() !== 'hero') {
            e.preventDefault();
          } else {
            return;
          }
        } else if (code === OK) {
          e.preventDefault();
        } else if (code === 38) {
          code = UP;
        } else if (code === 40) {
          code = DOWN;
        }
        NextCaltrain.press(code);
      });
    }
  }, {
    key: 'press',
    value: function press(code) {
      if (code === ESC) {
        NextCaltrain.setTitlebar('Next Caltrain');
        NextCaltrain.displayScreen('hero');
      } else if (code === 'prefs') {
        var confirmation = ['Save', prefs.flipped ? prefs.destin : prefs.origin, 'as morning and', prefs.flipped ? prefs.origin : prefs.destin, 'as evening default stations?'].join(' ');
        if (confirm(confirmation)) prefs.saveStops();
      } else if (code === 'about') {
        NextCaltrain.setTitlebar('About Next Caltrain');
        NextCaltrain.displayScreen('about');
      } else if (code === 'commands') {
        NextCaltrain.setTitlebar('Keyboard commands');
        NextCaltrain.bumpKeypadHint();
        NextCaltrain.displayScreen('commands');
      } else if (NextCaltrain.currentScreen() === 'about') {
        if (code == OK || code == BACK) {
          NextCaltrain.setTitlebar('Next Caltrain');
          NextCaltrain.displayScreen('hero');
        }
      } else if (NextCaltrain.currentScreen() === 'commands') {
        if (code == OK) {
          NextCaltrain.bumpKeypadHint();
        } else if (code == BACK) {
          hintIndex = -1;
          NextCaltrain.setTitlebar('Next Caltrain');
          NextCaltrain.displayScreen('hero');
        }
      } else if (document.getElementById('popup-menu').style['display'] === 'block') {
        if (code === OK || code === BACK) {
          NextCaltrain.popupMenu('hide');
        }
      } else if (NextCaltrain.currentScreen() === 'trip') {
        if (code === OK || code === BACK) {
          NextCaltrain.displayScreen('grid');
        }
      } else if (code === OK && NextCaltrain.currentScreen() === 'grid' && trainId !== null) {
        NextCaltrain.loadTrip(trainId);
        NextCaltrain.displayScreen('trip');
      } else {
        if (code === BACK) {
          NextCaltrain.setTitlebar('Next Caltrain');
          NextCaltrain.displayScreen('hero');
        } else if (code === OK) {
          NextCaltrain.displayScreen('grid');
        } else if (code === 170 || code === 37) {
          if (kaios2 && document.fullscreenElement) document.exitFullscreen();
          NextCaltrain.popupMenu('show');
        } else if (code === 163 || code === 39) {
          swapped = swapped ? false : true;
          offset = null;
        } else if (code === UP) {
          offset--;
        } else if (code === DOWN) {
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
        } else {
          return;
        }
        NextCaltrain.loadSchedule();
      }
    }
  }]);

  return NextCaltrain;
}();