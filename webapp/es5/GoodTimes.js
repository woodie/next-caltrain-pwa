'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var special_service = {
  '2020-01-20': MODIFIED,
  '2020-02-17': MODIFIED,
  '2020-05-25': SUNDAY };

var GoodTimes = function () {
  function GoodTimes() {
    _classCallCheck(this, GoodTimes);

    var now = new Date();
    var run = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    var str = run.toJSON().slice(0, 10);
    this.minutes = (run.getHours() + 2) * 60 + run.getMinutes();
    this.seconds = run.getSeconds();
    this.dotw = special_service[str] ? special_service[str] : run.getDay();
  }

  _createClass(GoodTimes, [{
    key: 'partTime',
    value: function partTime() {
      return GoodTimes.partTime(this.minutes);
    }
  }, {
    key: 'fullTime',
    value: function fullTime() {
      return GoodTimes.fullTime(this.minutes);
    }
  }, {
    key: 'schedule',
    value: function schedule() {
      if (this.dotw === MODIFIED) {
        return MODIFIED;
      } else if (this.dotw === SUNDAY) {
        return SUNDAY;
      } else if (this.dotw === SATURDAY) {
        return SATURDAY;
      } else {
        return WEEKDAY;
      }
    }
  }, {
    key: 'swapped',
    value: function swapped() {
      return this.dotw === 0 || this.dotw === 6 ? 'Weekday Schedule' : 'Weekend Schedule';
    }
  }, {
    key: 'inThePast',
    value: function inThePast(target) {
      return target - this.minutes < 0;
    }
  }, {
    key: 'departing',
    value: function departing(target) {
      return target === this.minutes;
    }
  }, {
    key: 'countdown',
    value: function countdown(target) {
      var minutes = target - this.minutes - 1;
      if (minutes < 0) {
        return '';
      } else if (minutes > 59) {
        return `in ${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
      } else {
        return `in ${minutes} min ${60 - this.seconds} sec`;
      }
    }
  }], [{
    key: 'partTime',
    value: function partTime(minutes) {
      var hrs = Math.floor(minutes / 60);
      var min = minutes % 60;
      if (min < 10) {
        min = '0' + min;
      }
      var mer = hrs > 11 && hrs < 24 ? 'pm' : 'am';
      if (hrs > 12) {
        hrs -= 12;
        if (hrs > 12) {
          hrs -= 12;
        }
      }
      if (hrs < 1) {
        hrs = 12;
      }
      return [`${hrs}:${min}`, mer];
    }
  }, {
    key: 'fullTime',
    value: function fullTime(minutes) {
      return GoodTimes.partTime(minutes).join('');
    }
  }, {
    key: 'dateString',
    value: function dateString(miliseconds) {
      return new Date(miliseconds).toString().split(' ').slice(1, 4).join(' ');
    }
  }]);

  return GoodTimes;
}();