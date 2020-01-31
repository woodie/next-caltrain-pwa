'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var special = {
  '2020-01-01': 2,
  '2020-01-20': 3,
  '2020-02-17': 3,
  '2020-05-25': 2 };
var scheduleOptions = ['Weekday', 'Saturday', 'Sunday', 'Modified'];

var CaltrainSchedule = function () {
  function CaltrainSchedule(goodTime) {
    _classCallCheck(this, CaltrainSchedule);

    this.forToday = CaltrainSchedule.optionIndex(goodTime);
    this.selected = this.forToday;
  }

  _createClass(CaltrainSchedule, [{
    key: 'label',
    value: function label() {
      return scheduleOptions[this.selected];
    }
  }, {
    key: 'next',
    value: function next() {
      this.selected = this.selected >= scheduleOptions.length - 1 ? 0 : this.selected + 1;
    }
  }, {
    key: 'swapped',
    value: function swapped() {
      return this.forToday !== this.selected;
    }
  }], [{
    key: 'optionIndex',
    value: function optionIndex(goodTime) {
      if (goodTime.date in special) {
        return special[goodTime.date];
      } else if (goodTime.dotw === 0) {
        return 2;
      } else if (goodTime.dotw === 6) {
        return 1;
      } else {
        return 0;
      }
    }
  }]);

  return CaltrainSchedule;
}();