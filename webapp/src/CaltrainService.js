const SOUTH = 0;
const NORTH = 1;
const SUNDAY = 0;
const SATURDAY = 6;
const WEEKEND = 7;
const WEEKDAY = 8;
const MODIFIED = 9;
const TRAIN = 0;
const DEPART = 1;
const ARRIVE = 2;
const DIRECTION = 0;
const SCHEDULE = 1;
const TRIP_IDX = 2;
const saturdayTripIds = [421,443,442,444]; // Saturday Only

/**
* A utility to simplify working with caltrainServiceData.
* Some odd structures as this is a port from a Java app.
*/
class CaltrainService {

  constructor() {
    this.northStops = CaltrainService.mapStops(NORTH);
    this.southStops = CaltrainService.mapStops(SOUTH);
  }

 /**
  * Station name maps to index of column with stop times
  * @param direction the northbound and southbound schedules
  * @return Map of Station Name keys
  */
  static mapStops(direction) {
    let out = new Map();
    let stops = (direction === NORTH) ? caltrainServiceData.northStops : caltrainServiceData.southStops;
    for (let i = 0; i < stops.length; i++) {
      out.set(stops[i], i);
    }
    return out;
  }

 /**
  * Station name maps to index of column with stop times
  * @param train is train number.
  * @param direction is NORTH or SOUTH.
  * @param schedule is WEEKDAY or WEEKEND.
  * @return array of Station stop times.
  */
  static tripStops(train, direction, schedule) {
    let stops = (direction === NORTH) ? caltrainServiceData.northStops : caltrainServiceData.southStops;
    let times = CaltrainService.select(direction, schedule)[train];
    let out = [];
    for (let i = 0; i < times.length; i++) {
      if (times[i]) out.push([stops[i], times[i]]);
    }
    return out;
  }

 /**
  * Map the stops for provided direction
  * @param direction is NORTH or SOUTH
  * @return stop name string mapping to schedule columns.
  */
  stopMap(direction) {
    return (direction === NORTH) ? this.northStops : this.southStops;
  }

 /**
  * Determine the direction given two stops
  * @param departStop the departing stop name string
  * @param arriveStop the arriving stop name string
  * @return the direction of this trip: NORTH or SOUTH
  */
  static direction(departStop, arriveStop) {
    let depart = caltrainServiceData.southStops.indexOf(departStop);
    let arrive = caltrainServiceData.southStops.indexOf(arriveStop);
    return (depart < arrive) ? SOUTH : NORTH;
  }

 /**
  * Return the schedule routes
  * @param trains the train IDs
  * @param departStop the departing stop name string
  * @param arriveStop the arriving stop name string
  * @param dotw a Calendar day-of-the-week
  * @param swap the schedule for today or not
  * @return a two dementional array or ints
  */
  routes(departStop, arriveStop, dotw, swap) {
    let schedule = CaltrainService.schedule(dotw, swap);
    let direction = CaltrainService.direction(departStop, arriveStop);
    let departTimes = this.times(departStop, direction, schedule);
    let arriveTimes = this.times(arriveStop, direction, schedule);
    let skip = (dotw === SUNDAY) ? saturdayTripIds : [];
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
  * Convert day-of-the-week into a schedule
  * @param dotw the Calendar day-of-the-week
  * @param swap show other schedule that today's
  * @return the schedule
  */
  static schedule(dotw, swap) {
    if (swap) {
      return ((dotw === SATURDAY) || (dotw === SUNDAY)) ? WEEKDAY : SATURDAY;
    } else {
      return ((dotw === SATURDAY) || (dotw === SUNDAY)) ? dotw : WEEKDAY;
    }
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
  * @param direction is NORTH or SOUTH
  * @param schedule is WEEKDAY, SATURDAY or SUNDAY
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
  * @param direction is NORTH or SOUTH
  * @param schedule is WEEKDAY, SATURDAY or SUNDAY
  * @return a two dementional array or ints
  */
  static select(direction, schedule) {
    if (direction === NORTH) {
      if (schedule === MODIFIED) return caltrainServiceData.northModified;
      return (schedule === WEEKDAY) ? caltrainServiceData.northWeekday : caltrainServiceData.northWeekend;
    } else {
      if (schedule === MODIFIED) return caltrainServiceData.southModified;
      return (schedule === WEEKDAY) ? caltrainServiceData.southWeekday : caltrainServiceData.southWeekend;
    }
  }

}
