'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prefs = new Preferences(caltrainServiceData.southStops);
var service = new CaltrainService();
var kaios1 = false;
var kaios2 = false;
var kaios = false;
var schedule = null;
var countdown = null;
var trainId = null;
var offset = null;
var goodTime = null;

var OK = 13;
var BACK = 95;
var HANGUP = 8;
var ESC = 27;
var UP = 53;
var DOWN = 56;
var SPLAT = 170;
var POUND = 163;
var ZERO = 48;

var screens = 'hero grid trip about commands'.split(' ');
var titles = { 'about': 'About Next Caltrain', 'commands': 'Keypad commands' };
var email = 'next-caltrain@netpress.com';

var hints = [['Set your origin', [4, 6], 'Use [4] and [6] to<br/>set your origin station.'], ['Set destination', [7, 9], 'Use [7] and [9] to<br/>set destination station.'], ['Select a train', [5, 8], 'Use [5] and [8] to move<br/>the seletion up and down.'], ['Flip direction', ['c'], 'Flip the selected stations<br/>with the green [call] button.'], ['Save stations', ['l'], 'Select "Save Stations"<br/>with the [Left] softkey.'], ['Bookmark app', ['r'], 'Select "Pin to Apps Menu"<br/>with the [Right] softkey.'], ['Change schedule', ['0'], 'Use [0] to cycle through<br/>available schedules.'], ['Thanks for using<br/> Next Caltrain', null, `Please send feedback to<br/>&nbsp;<a href="mailto:${email}">${email}</a>.<br/>` + 'Note: The cursor (arrow)<br/>is not used by this app,<br/>' + 'just move it to the right.<br/>']];

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
        document.getElementById('softkey-menu').style['display'] = 'flex';
        document.getElementById('keypad').style['display'] = 'flex';
        document.getElementById('content').className = 'full-screen';
      } else {
        document.getElementById('content').className = 'part-screen';
      }

      var dateString = GoodTimes.dateString(caltrainServiceData.scheduleDate);
      var listing = document.getElementById('listing');
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
          hints[i][n * 2] = hints[i][n * 2].replace(/\[/g, '<span class=\'btn\'>').replace(/\]/g, '</span>');
          if (kaios1) hints[i][n * 2] = hints[i][n * 2].replace(/Apps Menu/, 'Top Sites');
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
        for (var i = 4; i < 18; i++) {
          var key = i < 10 ? i : ['l', 'r', 'c', 'o', 'h', '*', '0', '#'][i - 10];
          var cls = hints[hintIndex][1].indexOf(key) == -1 ? 'default' : 'selected';
          document.getElementById(`k${key}`).className = cls;
        }
      }
    }
  }, {
    key: 'setTheTime',
    value: function setTheTime() {
      var ourTime = new GoodTimes();
      var partTime = ourTime.partTime();
      schedule = new CaltrainSchedule(ourTime);
      document.getElementById('time').innerHTML = partTime[0];
      document.getElementById('ampm').innerHTML = partTime[1].toUpperCase();
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
      document.getElementById('blurb-grid').innerHTML = blurb;
      document.getElementById('blurb-hero').innerHTML = blurb;
      if (blurb !== '') {
        var refresh = blurb.endsWith('sec') ? 1000 : (60 - downTime.seconds) * 1000;
        countdown = setTimeout(function () {
          NextCaltrain.setCountdown(minutes);
        }, refresh);
      }
    }
  }, {
    key: 'populateStops',
    value: function populateStops(labels) {
      document.getElementById('origin-grid').innerHTML = labels[0];
      document.getElementById('destin-grid').innerHTML = labels[1];
      document.getElementById('origin-hero').innerHTML = labels[0];
      document.getElementById('destin-hero').innerHTML = labels[1];
    }
  }, {
    key: 'populateBlurb',
    value: function populateBlurb(message, textClass) {
      document.getElementById('blurb-grid').innerHTML = message;
      document.getElementById('blurb-grid').className = textClass;
      document.getElementById('blurb-hero').innerHTML = message.replace(' Schedule', '');
      document.getElementById('blurb-hero').className = textClass;
    }
  }, {
    key: 'loadTrip',
    value: function loadTrip(train) {
      goodTime = new GoodTimes();
      var trip = new CaltrainTrip(train, schedule.label());
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
               class="hour-filler">${filler}</span>${fullTime}</div>
          <div class="station-spacer ${style}">${spacer}<br/><span
               class="station-dot ${target}">&#9679;</span></div>
          <div class="station-name"><br/>${stop[0]}</div></div>`);
      }
      listing.innerHTML = lines.join('\n');
      document.getElementById('trip-filler').innerHTML = trip.label();
      document.title = trip.label();
    }
  }, {
    key: 'loadSchedule',
    value: function loadSchedule() {
      goodTime = new GoodTimes();
      clearTimeout(countdown);
      NextCaltrain.populateStops(prefs.tripLabels());

      var routes = service.routes(prefs.origin, prefs.destin, schedule.label());
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
            trainId = null;
            NextCaltrain.populateBlurb('NO TRAINS', 'message-departed blink');
            document.getElementById('circle').className = 'selection-departed';
            document.getElementById('trip0').className = 'selection-none';
            document.getElementById('trip').innerHTML = '<span class="time-hero">&nbsp;</span>';
            document.getElementById('trip-type').innerHTML = '&nbsp;';
            document.getElementById('title').innerHTML = 'Next Caltrain';
            document.title = 'Next Caltrain';
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
          if (schedule.swapped()) {
            message = schedule.label() + ' Schedule';
            textClass = 'message-departed';
            tripClass = goodTime.inThePast(minutes) ? 'message-departed' : '';
            wrapClass = 'selection-departed';
          } else if (goodTime.inThePast(minutes)) {
            message = schedule.label() + ' Schedule';
            textClass = 'message-departed';
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
          if (trainId && NextCaltrain.currentScreen() === 'grid') {
            document.getElementById('title').innerHTML = `${CaltrainTrip.type(trainId)} Service`;
            document.title = `${CaltrainTrip.type(trainId)} Service`;
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
      for (var i = 0; i < screens.length; i++) {
        var display = target === screens[i] ? 'flex' : 'none';
        document.getElementById(`${screens[i]}-screen`).style['display'] = display;
      }

      document.getElementById('title').innerHTML = 'Next Caltrain';
      document.title = target in titles ? titles[target] : 'Next Caltrain';

      if (target === 'grid' || target === 'hero') {
        NextCaltrain.loadSchedule();
      }

      if (kaios2) {
        if (target === 'grid' || target === 'trip') {
          document.documentElement.requestFullscreen();
        } else if (target !== 'hero') {
          document.exitFullscreen();
        }
      }
    }
  }, {
    key: 'attachListeners',
    value: function attachListeners() {
      document.onfullscreenchange = function (e) {
        if (document.fullscreenElement) {
          document.getElementById('content').className = 'full-screen';
        } else {
          document.getElementById('content').className = 'part-screen';
          NextCaltrain.displayScreen('hero');
        }
      };

      document.body.addEventListener('mousemove', function (e) {
        if (kaios2) {
          if (e.movementY < 0) {
            NextCaltrain.press(UP);
          } else if (e.movementY > 0) {
            NextCaltrain.press(DOWN);
          }
        }
      });

      document.addEventListener('click', function (e) {
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
        } else if (e.key === 'SoftLeft') {
          code = 'menu';

          e.preventDefault();
        } else if (e.key === 'Call') {
          code = 'flip';
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
        NextCaltrain.displayScreen('hero');
      } else if (code === 'prefs') {
        var confirmation = ['Save', prefs.flipped ? prefs.destin : prefs.origin, 'as morning and', prefs.flipped ? prefs.origin : prefs.destin, 'as evening default stations?'].join(' ');
        if (confirm(confirmation)) prefs.saveStops();
      } else if (code === 'about') {
        NextCaltrain.displayScreen('about');
      } else if (code === 'commands') {
        NextCaltrain.bumpKeypadHint();
        NextCaltrain.displayScreen('commands');
      } else if (NextCaltrain.currentScreen() === 'about') {
        if (code == OK || code == BACK) {
          NextCaltrain.displayScreen('hero');
        }
      } else if (NextCaltrain.currentScreen() === 'commands') {
        if (code == OK) {
          NextCaltrain.bumpKeypadHint();
        } else if (code == BACK) {
          hintIndex = -1;
          NextCaltrain.displayScreen('hero');
        }
      } else if (document.getElementById('popup-menu').style['display'] === 'block') {
        if (code === OK || code === BACK) {
          NextCaltrain.popupMenu('hide');
        }
      } else if (code === 'menu' || code === 37) {
        if (kaios2 && document.fullscreenElement) document.exitFullscreen();
        if (NextCaltrain.currentScreen() !== 'hero') NextCaltrain.displayScreen('hero');
        NextCaltrain.popupMenu('show');
      } else if (NextCaltrain.currentScreen() === 'trip') {
        if (code === OK || code === BACK) {
          NextCaltrain.displayScreen('grid');
        } else if (code === UP) {
          if (listing.scrollTop > 0) listing.scrollTo(0, listing.scrollTop - 72);
        } else if (code === DOWN) {
          if (listing.scrollTop < listing.scrollHeight - 228) listing.scrollTo(0, listing.scrollTop + 72);
        }
      } else if (code === OK && NextCaltrain.currentScreen() === 'grid' && trainId !== null) {
        NextCaltrain.displayScreen('trip');
        NextCaltrain.loadTrip(trainId);
      } else {
        if (code === BACK) {
          NextCaltrain.displayScreen('hero');
        } else if (code === OK) {
          NextCaltrain.displayScreen('grid');
        } else if (code === ZERO || code === 39) {
          schedule.next();
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
        } else if (code === 'flip') {
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