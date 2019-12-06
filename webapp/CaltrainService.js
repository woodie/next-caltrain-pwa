/**
* A utility to simplify working with caltrainServiceData.
*/
class CaltrainService {

  northStops = {};
  southStops = {};
  static SOUTH = 0;
  static NORTH = 1;
  static WEEKEND = 0;
  static SUNDAY = 1;
  static SATURDAY = 7;
  static WEEKDAY = 8;
  static TRAIN = 0;
  static DEPART = 1;
  static ARRIVE = 2;
  static DIRECTION = 0;
  static SCHEDULE = 1;
  static TRIP_IDX = 2;
  static saturday_trip_ids = [421,443,442,444]; // Saturday Only

  constructor() {
    this.northStops = mapStops(NORTH);
    this.southStops = mapStops(SOUTH);
  }

 /**
  * Station name maps to index of column with stop times
  * @param direction the northbound and southbound schedules
  * @return Hashmap of Station Name keys
  */
  mapStops(direction) {
    out = {};
    stops = (direction == NORTH) ? caltrainServiceData.north_stops : caltrainServiceData.south_stops;
    for (let i = 1; i < stops.length; i++) {
      out.put(stops[i], new Integer(i));
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
    trips = CaltrainService.select(direction, schedule);
    for (let i = 1; i < trips.length; i++) {
      if (trips[i][TRAIN] == trip) return trips[i];
    }
    return [];
  }

 /**
  * Map the stops for provided direction
  * @param direction is NORTH or SOUTH
  * @return stop name string mapping to schedule columns.
  */
  stops(direction) {
    return (direction == NORTH) ? this.northStops : this.southStops;
  }

 /**
  * Determine the direction given two stops
  * @param departStop the departing stop name string
  * @param arriveStop the arriving stop name string
  * @return the direction of this trip: NORTH or SOUTH
  */
  direction(departStop, arriveStop) {
    let depart = caltrainServiceData.south_stops.indexOf(departStop);
    let arrive = caltrainServiceData.south_stops.indexOf(arriveStop);
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
    let schedule = schedule(dotw, swap);
    let direction = direction(departStop, arriveStop);
    let trains = times(null, direction, schedule);
    let departTimes = times(departStop, direction, schedule);
    let arriveTimes = times(arriveStop, direction, schedule);
    let skip = (dotw == SUNDAY) ? CaltrainService.saturday_trip_ids : [];
    return merge(trains, departTimes, arriveTimes, skip);
  }

 /**
  * Convert day-of-the-week into a schedule
  * @param dotw the Calendar day-of-the-week
  * @param swap invert schedule selection logic
  * @return the schedule
  */
  static schedule(dotw, swap) {
    if (swap) {
      return ((dotw == SATURDAY) || (dotw == SUNDAY)) ? WEEKDAY : SATURDAY;
    } else {
      return ((dotw == SATURDAY) || (dotw == SUNDAY)) ? dotw : WEEKDAY;
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
  merge(trains, departTimes, arriveTimes, skip) {
    let tmp = [];
    let count = 0;
    for (let i = 0; i < trains.length; i++) {
      for (let x = 0; x < skip.length; x++) {
        if (trains[i] == x) continue;
      }
      if ((departTimes[i] != -1) && (arriveTimes[i] != -1)) {
        tmp[count][TRAIN] = trains[i];
        tmp[count][DEPART] = departTimes[i];
        tmp[count][ARRIVE] = arriveTimes[i];
        count++;
      }
    }
    let out = [];
    for (let i = 0; i < count; i++) {
      if ((i > 0) && (out[i - 1][DEPART] > tmp[i][DEPART])) {
        for (let n = 0; n < 3; n++) {
          out[i][n] = out[i - 1][n];
          out[i - 1][n] = tmp[i][n];
        }
      } else {
        for (let n = 0; n < 3; n++) {
          out[i][n] = tmp[i][n];
        }
      }
    }
    return out;
  }

 /**
  * For direction and day-of-the-week: train times (or IDs)
  * @param stop the Stop name (or null for IDs)
  * @param direction is NORTH or SOUTH
  * @param schedule is WEEKDAY, SATURDAY or SUNDAY
  * @return the stop times (or IDs)
  */
  times(stop, direction, schedule) {
    let source = CaltrainService.select(direction, schedule);
    let times = []; // offset for stop_id header
    let column = (null == stop) ? 0 : stops(direction).indexOf(stop);
    for (let i = 0; i < times.length; i++) {
      times[i] = source[i + 1][column];       // skip the stop_id header
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
    if (direction == NORTH) {
      return (schedule == WEEKDAY) ? caltrainServiceData.north_weekday : caltrainServiceData.north_weekend;
    } else {
      return (schedule == WEEKDAY) ? caltrainServiceData.south_weekday : caltrainServiceData.south_weekend;
    }
  }

}