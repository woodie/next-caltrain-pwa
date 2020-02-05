'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CaltrainTrip = function () {
  function CaltrainTrip(trip, schedule) {
    _classCallCheck(this, CaltrainTrip);

    this.trip = trip;
    this.schedule = schedule;
    this.stops = [];
    this.times = [];
    this.direction = trip % 2 === 0 ? 'South' : 'North';
    this.setService();
  }

  _createClass(CaltrainTrip, [{
    key: 'setService',
    value: function setService() {
      var mins = CaltrainService.tripStops(this.trip, this.direction, this.schedule);
      var strs = this.direction === 'North' ? caltrainServiceData.northStops : caltrainServiceData.southStops;
      this.times = [];
      this.stops = [];

      for (var i = 0; i < mins.length; i++) {
        if (mins[i] == undefined) continue;
        this.times.push(mins[i]);
        this.stops.push(strs[i]);
      }
    }
  }, {
    key: 'label',
    value: function label() {
      return `${this.directionString()} #${this.trip} ${CaltrainTrip.type(this.trip)}`;
    }
  }, {
    key: 'directionString',
    value: function directionString() {
      return this.direction[0] + 'B';
    }
  }], [{
    key: 'type',
    value: function type(trip) {
      if (trip > 900) {
        return 'Unknown';
      } else if (trip > 800) {
        return 'Baby Bullet';
      } else if (trip > 500) {
        return 'Limited';
      } else if (trip > 400) {
        return 'Local';
      } else if (trip > 300) {
        return 'Baby Bullet';
      } else if (trip > 200) {
        return 'Limited';
      } else if (trip > 100) {
        return 'Local';
      } else {
        return 'Unknown';
      }
    }
  }]);

  return CaltrainTrip;
}();