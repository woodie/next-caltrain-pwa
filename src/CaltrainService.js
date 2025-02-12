import { caltrainServiceData } from './@caltrainServiceData.js';

export class CaltrainService {
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
    const out = new Map();
    const stops =
      direction === 'North'
        ? caltrainServiceData.northStops
        : caltrainServiceData.southStops;
    for (let i = 0; i < stops.length; i++) {
      out.set(stops[i], i);
    }
    return out;
  }

  /**
  * Station name maps to index of column with stop times
  * @param train is train number.
  * @param direction is North or South.
  * @param schedule is Weekday, Weekend (Saturday, Sunday or Modified)
/
  * @return array of Station stop times.
  */
  static tripStops(train, direction, schedule) {
    const stops =
      direction === 'North'
        ? caltrainServiceData.northStops
        : caltrainServiceData.southStops;
    const times = this.select(direction, schedule)[train] || [];
    const out = [];
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
    return direction === 'North' ? this.northStops : this.southStops;
  }

  /**
   * Determine the direction given two stops
   * @param departStop the departing stop name string
   * @param arriveStop the arriving stop name string
   * @return the direction of this trip: North or South
   */
  static direction(departStop, arriveStop) {
    const depart = caltrainServiceData.southStops.indexOf(departStop);
    const arrive = caltrainServiceData.southStops.indexOf(arriveStop);
    return depart < arrive ? 'South' : 'North';
  }

  /**
   * Return the schedule routes
   * @param trains the train IDs
   * @param departStop the departing stop name string
   * @param arriveStop the arriving stop name string
   * @param schedule is Weekday, Weekend (Saturday, Sunday or Modified)
   * @return a two dementional array or ints
   */
  routes(departStop, arriveStop, schedule) {
    const direction = CaltrainService.direction(departStop, arriveStop);
    const departTimes = this.times(departStop, direction, schedule);
    const arriveTimes = this.times(arriveStop, direction, schedule);
    // let skip = (schedule === 'Sunday') ? caltrainServiceData.saturdayTripIds : [];
    const skip = [];
    return CaltrainService.merge(departTimes, arriveTimes, skip);
  }

  static nextIndex(routes, minutes) {
    let index = 0;
    for (const route of routes) {
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
    for (const x of skip) {
      departTimes.delete(x);
    }
    const arr = [];
    for (const train of departTimes.keys()) {
      if (arriveTimes.has(train)) {
        arr.push([train, departTimes.get(train), arriveTimes.get(train)]);
      }
    }
    const sorted = arr.sort(function (a, b) {
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
    const source = CaltrainService.select(direction, schedule);
    const index = this.stopMap(direction).get(stop);
    const times = new Map();
    for (const train of Object.keys(source).map(Number)) {
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
      return direction === 'North'
        ? caltrainServiceData.northModified
        : caltrainServiceData.southModified;
    } else if (schedule === 'Weekday') {
      return direction === 'North'
        ? caltrainServiceData.northWeekday
        : caltrainServiceData.southWeekday;
    } else {
      return direction === 'North'
        ? caltrainServiceData.northWeekend
        : caltrainServiceData.southWeekend;
    }
  }
}
