const saturdayTripIds = [421,443,442,444]; // Saturday Only

/**
* A utility to simplify working with caltrainServiceData.
* Some odd structures as this is a port from a Java app.
*/
class CaltrainService {

  constructor() {
    this.northStops = CaltrainService.mapStops('North');
    this.southStops = CaltrainService.mapStops('South');
  }

  /**
  * Station name maps to index of column with stop times
  * @param direction the northbound and southbound schedules
  * @return Map of Station Name keys
  */
  static mapStops(direction) {
    let out = new Map();
    let stops = (direction === 'North') ? caltrainServiceData.northStops : caltrainServiceData.southStops;
    for (let i = 0; i < stops.length; i++) {
      out.set(stops[i], i);
    }
    return out;
  }

  /**
  * Station name maps to index of column with stop times
  * @param train is train number.
  * @param direction is North or South.
  * @param schedule is Weekday, Saturday, Sunday or Modified
/
  * @return array of Station stop times.
  */
  static tripStops(train, direction, schedule) {
    let stops = (direction === 'North') ? caltrainServiceData.northStops : caltrainServiceData.southStops;
    let times = CaltrainService.select(direction, schedule)[train];
    let out = [];
    for (let i = 0; i < times.length; i++) {
      if (times[i]) out.push([stops[i], times[i]]);
    }
    return out;
  }

  /**
  * Map the stops for provided direction
  * @param direction is North or South
  * @return stop name string mapping to schedule columns.
  */
  stopMap(direction) {
    return (direction === 'North') ? this.northStops : this.southStops;
  }

  /**
  * Determine the direction given two stops
  * @param departStop the departing stop name string
  * @param arriveStop the arriving stop name string
  * @return the direction of this trip: North or South
  */
  static direction(departStop, arriveStop) {
    let depart = caltrainServiceData.southStops.indexOf(departStop);
    let arrive = caltrainServiceData.southStops.indexOf(arriveStop);
    return (depart < arrive) ? 'South' : 'North';
  }

  /**
  * Return the schedule routes
  * @param trains the train IDs
  * @param departStop the departing stop name string
  * @param arriveStop the arriving stop name string
  * @param schedule is Weekday, Saturday, Sunday or Modified
  * @return a two dementional array or ints
  */
  routes(departStop, arriveStop, schedule) {
    let direction = CaltrainService.direction(departStop, arriveStop);
    let departTimes = this.times(departStop, direction, schedule);
    let arriveTimes = this.times(arriveStop, direction, schedule);
    let skip = (schedule === 'Sunday') ? saturdayTripIds : [];
    return CaltrainService.merge(departTimes, arriveTimes, skip);
  }

  static nextIndex(routes, minutes) {
    let index = 0;
    for (let route of routes) {
      if (route[1] > minutes) {
        return index;
      }
      index++;
    }
    return index;
  }

  /**
  * Merge two stop into a subset of the schedule
  * @param trains the train IDs
  * @param departStop the departing stop name string
  * @param arriveStop the arriving stop name string
  * @param skip over these trips
  * @return a two dementional array or ints
  */
  static merge(departTimes, arriveTimes, skip) {
    for (let x of skip) {
      departTimes.delete(x);
    }
    let arr = [];
    for (let train of departTimes.keys()) {
      if (arriveTimes.has(train)) {
        arr.push([train, departTimes.get(train), arriveTimes.get(train)]);
      }
    }
    let sorted = arr.sort(function(a,b) {
      return a[1] - b[1];
    });
    return sorted;
  }

  /**
  * For direction and day-of-the-week: train times
  * @param stop the Stop name
  * @param direction is North or South
  * @param schedule is Weekday, Saturday, Sunday or Modified
  * @return Map of stopID times
  */
  times(stop, direction, schedule) {
    let source = CaltrainService.select(direction, schedule);
    let index = this.stopMap(direction).get(stop);
    let times = new Map();
    for (let train of Object.keys(source).map(Number)) {
      if (source[train][index]) times.set(train, source[train][index]);
    }
    return times;
  }

  /**
  * Select a schedule for direction and day-of-the-week.
  * @param direction is North or South
  * @param schedule is Weekday, Saturday, Sunday or Modified
  * @return a two dementional array or ints
  */
  static select(direction, schedule) {
    if (schedule === 'Modified') {
      return (direction === 'North') ? caltrainServiceData.northModified : caltrainServiceData.southModified;
    } else if (schedule === 'Weekday') {
    //return (direction === 'North') ? caltrainServiceData.northWeekday : caltrainServiceData.southWeekday;
      return (direction === 'North') ? caltrainServiceData.northReduced : caltrainServiceData.southReduced;
    } else {
    //return (direction === 'North') ? caltrainServiceData.northWeekend : caltrainServiceData.southWeekend;
      return (direction === 'North') ? caltrainServiceData.northClosure : caltrainServiceData.southClosure;
    }
  }

}
