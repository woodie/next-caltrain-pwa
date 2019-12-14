const SOUTH = 0;
const NORTH = 1;
const WEEKEND = 0;
const SUNDAY = 1;
const SATURDAY = 7;
const WEEKDAY = 8;
const TRAIN = 0;
const DEPART = 1;
const ARRIVE = 2;
const DIRECTION = 0;
const SCHEDULE = 1;
const TRIP_IDX = 2;
const saturdayTripIds = [421,443,442,444]; // Saturday Only

/**
* A utility to simplify working with caltrainServiceData.
*/
class CaltrainService {

  constructor() {
    this.northStops = this.mapStops(NORTH);
    this.southStops = this.mapStops(SOUTH);
  }

 /**
  * Station name maps to index of column with stop times
  * @param direction the northbound and southbound schedules
  * @return Map of Station Name keys
  */
  mapStops(direction) {
    let out = new Map();
    let stops = (direction === NORTH) ? caltrainServiceData.northStops : caltrainServiceData.southStops;
    for (let i = 0; i < stops.length; i++) {
      out.set(stops[i], i);
    }
    return out;
  }

 /**
  * Station name maps to index of column with stop times
  * @param trip is trip ID.
  * @param direction is NORTH or SOUTH.
  * @param schedule is WEEKDAY or WEEKEND.
  * @return array of Station stop times.
  */
  static tripStops(trip, direction, schedule) {
    let trips = CaltrainService.select(direction, schedule);
    for (let i = 1; i < trips.length; i++) {
      if (trips[i][TRAIN] === trip) return trips[i];
    }
    return [];
  }

 /**
  * Map the stops for provided direction
  * @param direction is NORTH or SOUTH
  * @return stop name string mapping to schedule columns.
  */
  stops(direction) {
    return (direction === NORTH) ? this.northStops : this.southStops;
  }

 /**
  * Determine the direction given two stops
  * @param departStop the departing stop name string
  * @param arriveStop the arriving stop name string
  * @return the direction of this trip: NORTH or SOUTH
  */
  direction(departStop, arriveStop) {
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
    let direction = this.direction(departStop, arriveStop);
    let departTimes = this.times(departStop, direction, schedule);
    let arriveTimes = this.times(arriveStop, direction, schedule);
    let skip = (dotw === SUNDAY) ? CaltrainService.saturdayTripIds : [];
    return this.merge(departTimes, arriveTimes, skip);
  }

 /**
  * Convert day-of-the-week into a schedule
  * @param dotw the Calendar day-of-the-week
  * @param swap invert schedule selection logic
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
  merge(departTimes, arriveTimes, skip) {
    for (x of skip) {
      departTimes.delete(x);
    }
    let arr = [];
    for (let stopId of departTimes.keys()) {
      if (arriveTimes.has(stopId)) {
        arr.push([stopId, departTimes.get(stopId), arriveTimes.get(stopId)]);
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
    let index = this.stops(direction).get(stop);
    let keys = Object.keys(source).map(Number);
    let times = new Map();
    for (let i = 0; i < keys.length; i++) {
      if (source[keys[i]][index]) times.set(keys[i], source[keys[i]][index]);
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
      return (schedule === WEEKDAY) ? caltrainServiceData.northWeekday : caltrainServiceData.northWeekend;
    } else {
      return (schedule === WEEKDAY) ? caltrainServiceData.southWeekday : caltrainServiceData.southWeekend;
    }
  }

}
