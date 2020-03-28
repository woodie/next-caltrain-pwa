'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var saturdayTripIds = [421, 443, 442, 444];
var CaltrainService = function () {
  function CaltrainService() {
    _classCallCheck(this, CaltrainService);

    this.northStops = CaltrainService.mapStops('North');
    this.southStops = CaltrainService.mapStops('South');
  }

  _createClass(CaltrainService, [{
    key: 'stopMap',
    value: function stopMap(direction) {
      return direction === 'North' ? this.northStops : this.southStops;
    }
  }, {
    key: 'routes',
    value: function routes(departStop, arriveStop, schedule) {
      var direction = CaltrainService.direction(departStop, arriveStop);
      var departTimes = this.times(departStop, direction, schedule);
      var arriveTimes = this.times(arriveStop, direction, schedule);
      var skip = schedule === 'Sunday' ? saturdayTripIds : [];
      return CaltrainService.merge(departTimes, arriveTimes, skip);
    }
  }, {
    key: 'times',
    value: function times(stop, direction, schedule) {
      var source = CaltrainService.select(direction, schedule);
      var index = this.stopMap(direction).get(stop);
      var times = new Map();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(source).map(Number)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var train = _step.value;

          if (source[train][index]) times.set(train, source[train][index]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return times;
    }
  }], [{
    key: 'mapStops',
    value: function mapStops(direction) {
      var out = new Map();
      var stops = direction === 'North' ? caltrainServiceData.northStops : caltrainServiceData.southStops;
      for (var i = 0; i < stops.length; i++) {
        out.set(stops[i], i);
      }
      return out;
    }
  }, {
    key: 'tripStops',
    value: function tripStops(train, direction, schedule) {
      var stops = direction === 'North' ? caltrainServiceData.northStops : caltrainServiceData.southStops;
      var times = CaltrainService.select(direction, schedule)[train];
      var out = [];
      for (var i = 0; i < times.length; i++) {
        if (times[i]) out.push([stops[i], times[i]]);
      }
      return out;
    }
  }, {
    key: 'direction',
    value: function direction(departStop, arriveStop) {
      var depart = caltrainServiceData.southStops.indexOf(departStop);
      var arrive = caltrainServiceData.southStops.indexOf(arriveStop);
      return depart < arrive ? 'South' : 'North';
    }
  }, {
    key: 'nextIndex',
    value: function nextIndex(routes, minutes) {
      var index = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = routes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var route = _step2.value;

          if (route[1] > minutes) {
            return index;
          }
          index++;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return index;
    }
  }, {
    key: 'merge',
    value: function merge(departTimes, arriveTimes, skip) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = skip[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var x = _step3.value;

          departTimes.delete(x);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var arr = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = departTimes.keys()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var train = _step4.value;

          if (arriveTimes.has(train)) {
            arr.push([train, departTimes.get(train), arriveTimes.get(train)]);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var sorted = arr.sort(function (a, b) {
        return a[1] - b[1];
      });
      return sorted;
    }
  }, {
    key: 'select',
    value: function select(direction, schedule) {
      if (schedule === 'Modified') {
        return direction === 'North' ? caltrainServiceData.northModified : caltrainServiceData.southModified;
      } else if (schedule === 'Weekday') {
        return direction === 'North' ? caltrainServiceData.northWeekday : caltrainServiceData.southWeekday;
      } else {
        return direction === 'North' ? caltrainServiceData.northClosure : caltrainServiceData.southClosure;
      }
    }
  }]);

  return CaltrainService;
}();