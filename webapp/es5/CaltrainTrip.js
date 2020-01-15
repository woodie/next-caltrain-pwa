"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CaltrainTrip = function () {
  function CaltrainTrip(trip) {
    _classCallCheck(this, CaltrainTrip);

    this.trip = trip;
    this.stops = [];
    this.times = [];
    this.direction = trip % 2 === SOUTH ? SOUTH : NORTH;
    this.schedule = trip < 400 ? WEEKDAY : WEEKEND;
    this.setService();
  }

  _createClass(CaltrainTrip, [{
    key: "setService",
    value: function setService() {
      var mins = CaltrainService.tripStops(this.trip, this.direction, this.schedule);
      var strs = this.direction === NORTH ? caltrainServiceData.northStops : caltrainServiceData.southStops;
      this.times = [];
      this.stops = [];

      for (var i = 0; i < mins.length; i++) {
        if (mins[i] == undefined) continue;
        this.times.push(mins[i]);
        this.stops.push(strs[i]);
      }
    }
  }, {
    key: "label",
    value: function label() {
      return `${this.directionString()} #${this.trip}`;
    }
  }, {
    key: "description",
    value: function description() {
      return `${CaltrainTrip.type(this.trip)} / ${this.scheduleString()}`;
    }
  }, {
    key: "directionString",
    value: function directionString() {
      return this.direction === NORTH ? "Northbound" : "Southbound";
    }
  }, {
    key: "scheduleString",
    value: function scheduleString() {
      if (this.schedule === WEEKDAY) {
        return "Weekday";
      } else {
        return saturdayTripIds.indexOf(this.trip) === -1 ? "Weekend" : "Saturday";
      }
    }
  }], [{
    key: "type",
    value: function type(trip) {
      if (trip > 800) {
        return "Baby Bullet";
      } else if (trip > 400) {
        return "Local";
      } else if (trip > 300) {
        return "Baby Bullet";
      } else if (trip > 200) {
        return "Limited";
      }
      return "Local";
    }
  }]);

  return CaltrainTrip;
}();