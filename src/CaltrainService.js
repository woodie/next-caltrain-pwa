import { caltrainServiceData } from './@caltrainServiceData.js';

const SOUTH_COUNTY_STATIONS = new Set([
  'Gilroy', 'San Martin', 'Morgan Hill', 'Blossom Hill', 'Capitol'
]);
const TRANSFER_STATION = 'San Jose Diridon';

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
  * @param schedule is Weekday, Weekend (Saturday, Sunday or Holiday)
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
   * True if the train ID belongs to the South County (diesel) fleet.
   */
  static isSouthCounty(trainId) {
    return trainId > 800 && trainId <= 900;
  }

  /**
   * Return the schedule routes, with transfer support for South County routes.
   * Transfer routes are returned as [trainId, depart, arrive, transferTrainId, transferDepart].
   * Direct routes are returned as [trainId, depart, arrive].
   * @param departStop the departing stop name string
   * @param arriveStop the arriving stop name string
   * @param schedule is Weekday, Weekend (Saturday, Sunday or Holiday)
   * @return a two dimensional array of ints
   */
  routes(departStop, arriveStop, schedule) {
    const departIsSC = SOUTH_COUNTY_STATIONS.has(departStop);
    const arriveIsSC = SOUTH_COUNTY_STATIONS.has(arriveStop);
    const needsTransfer = schedule === 'Weekday' && (departIsSC !== arriveIsSC);

    if (needsTransfer) {
      return this.transferRoutes(departStop, arriveStop, schedule);
    } else {
      const direction = CaltrainService.direction(departStop, arriveStop);
      const departTimes = this.times(departStop, direction, schedule);
      const arriveTimes = this.times(arriveStop, direction, schedule);
      return CaltrainService.merge(departTimes, arriveTimes, []);
    }
  }

  /**
   * Build transfer routes through San Jose Diridon.
   * Northbound: SC train (origin -> SJD), then first electric departing SJD >= SC arrival.
   * Southbound: electric train (origin -> SJD), then last SC departing SJD <= electric arrival.
   * @return array of [trainId, depart, arrive, transferTrainId, transferDepart]
   */
  transferRoutes(departStop, arriveStop, schedule) {
    const direction = CaltrainService.direction(departStop, arriveStop);
    const transfer = TRANSFER_STATION;
    const source = CaltrainService.select(direction, schedule);
    const stopMap = this.stopMap(direction);

    const originIdx = stopMap.get(departStop);
    const transferIdx = stopMap.get(transfer);
    const destIdx = stopMap.get(arriveStop);

    if (originIdx === undefined || transferIdx === undefined || destIdx === undefined) {
      return [];
    }

    if (direction === 'North') {
      // SC trains: origin -> SJD
      const scTrains = [];
      for (const [key, times] of Object.entries(source)) {
        const trainId = Number(key);
        if (!CaltrainService.isSouthCounty(trainId)) continue;
        const departTime = times[originIdx];
        const arriveTime = times[transferIdx];
        if (departTime && arriveTime) {
          scTrains.push([trainId, departTime, arriveTime]);
        }
      }
      scTrains.sort((a, b) => a[1] - b[1]);

      // Electric trains: SJD -> destination
      const elTrains = [];
      for (const [key, times] of Object.entries(source)) {
        const trainId = Number(key);
        if (CaltrainService.isSouthCounty(trainId)) continue;
        const departTime = times[transferIdx];
        const arriveTime = times[destIdx];
        if (departTime && arriveTime) {
          elTrains.push([trainId, departTime, arriveTime]);
        }
      }
      elTrains.sort((a, b) => a[1] - b[1]);

      // Pair each SC train with the first electric that departs SJD >= SC arrival
      const trips = [];
      for (const sc of scTrains) {
        const el = elTrains.find(e => e[1] >= sc[2]);
        if (el) {
          trips.push([sc[0], sc[1], el[2], el[0], el[1]]);
        }
      }
      return trips;

    } else {
      // Electric trains: origin -> SJD
      const elTrains = [];
      for (const [key, times] of Object.entries(source)) {
        const trainId = Number(key);
        if (CaltrainService.isSouthCounty(trainId)) continue;
        const departTime = times[originIdx];
        const arriveTime = times[transferIdx];
        if (departTime && arriveTime) {
          elTrains.push([trainId, departTime, arriveTime]);
        }
      }
      elTrains.sort((a, b) => a[1] - b[1]);

      // SC trains: SJD -> destination
      const scTrains = [];
      for (const [key, times] of Object.entries(source)) {
        const trainId = Number(key);
        if (!CaltrainService.isSouthCounty(trainId)) continue;
        const departTime = times[transferIdx];
        const arriveTime = times[destIdx];
        if (departTime && arriveTime) {
          scTrains.push([trainId, departTime, arriveTime]);
        }
      }
      scTrains.sort((a, b) => a[1] - b[1]);

      // Pair each SC train with the last electric that arrives SJD <= SC departure
      const trips = [];
      for (const sc of scTrains) {
        const el = [...elTrains].reverse().find(e => e[2] <= sc[1]);
        if (el) {
          trips.push([el[0], el[1], sc[2], sc[0], sc[1]]);
        }
      }
      return trips.sort((a, b) => a[1] - b[1]);
    }
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
   * @param schedule is Weekday, Saturday, Sunday or Holiday
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
   * @param schedule is Weekday, Saturday, Sunday or Holiday
   * @return a two dementional array or ints
   */
  static select(direction, schedule) {
    if (schedule === 'Holiday') {
      return direction === 'North'
        ? caltrainServiceData.northHoliday
        : caltrainServiceData.southHoliday;
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
