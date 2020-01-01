'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Preferences = function () {
  function Preferences(stations) {
    _classCallCheck(this, Preferences);

    this.stations = stations;
    this.flipped = new Date().getHours() >= 12;
    var savedAM = parseInt(localStorage.getItem('stopAM'));
    var savedPM = parseInt(localStorage.getItem('stopPM'));
    if (Number.isNaN(savedAM) || savedAM < 0 || savedAM >= stations.length) {
      localStorage.setItem('stopAM', 16);
    }
    if (Number.isNaN(savedAM) || savedPM < 0 || savedPM >= stations.length) {
      localStorage.setItem('stopPM', 0);
    }
    this.stopAM = parseInt(localStorage.getItem("stopAM"));
    this.stopPM = parseInt(localStorage.getItem("stopPM"));
  }

  _createClass(Preferences, [{
    key: 'saveStops',
    value: function saveStops() {
      localStorage.setItem('stopAM', this.stopAM);
      localStorage.setItem('stopPM', this.stopPM);
    }
  }, {
    key: 'flipStations',
    value: function flipStations() {
      this.flipped = this.flipped ? false : true;
    }
  }, {
    key: 'tripLabels',
    value: function tripLabels() {
      this.origin = this.stations[this.flipped ? this.stopPM : this.stopAM];
      this.destin = this.stations[this.flipped ? this.stopAM : this.stopPM];
      if (this.origin.length + 3 >= this.destin.length) {
        return [this.origin, `to ${this.destin}`];
      } else {
        return [`${this.origin} to`, this.destin];
      }
    }
  }, {
    key: 'bumpStations',
    value: function bumpStations(origin, increment) {
      var max = this.stations.length - 1;
      if (this.flipped) origin = !origin;
      if (origin && !increment) {
        this.stopAM = this.stopAM === max ? 0 : ++this.stopAM;
      } else if (origin && increment) {
        this.stopAM = this.stopAM < 1 ? max : --this.stopAM;
      } else if (!origin && !increment) {
        this.stopPM = this.stopPM === max ? 0 : ++this.stopPM;
      } else if (!origin && increment) {
        this.stopPM = this.stopPM < 1 ? max : --this.stopPM;
      }
    }
  }]);

  return Preferences;
}();