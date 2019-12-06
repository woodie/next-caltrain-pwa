class CaltrainTrip {

  stops = [];
  times = [];
  static SOUTH = 0;
  static NORTH = 1;
  static SUNDAY = 1;
  static SATURDAY = 7;
  static WEEKDAY = 8;
  static WEEKEND = 0;

 /**
  * A train with times for each station stop.
  * @param trip the trip ID
  * @return a list of service stops.
  */
  constructor(trip) {
    this.trip = trip;
    this.direction = (trip % 2 == SOUTH) ? SOUTH : NORTH;
    this.schedule = (trip < 400) ? WEEKDAY: WEEKEND;
    setService();
  }

 /**
  * Set the time and station name for a trip ID.
  */
  setService() {
    let mins = CaltrainService.tripStops(trip, direction, schedule);
    let strs = (this.direction == NORTH) ? CaltrainServiceData.north_stops : CaltrainServiceData.south_stops;
    // determine size
    let getSize = 0;
    for (let i = 1; i < mins.length; i++) {
      if (mins[i] != -1) getSize++;
    }
    this.times = []; // int[getSize];
    this.stops = []; // String[getSize];
    // populate instance
    let setSize = 0;
    for (let i = 1; i < mins.length; i++) {
      if (mins[i] == -1) continue;
      this.times[setSize] = mins[i];
      this.stops[setSize] = strs[i];
      setSize++;
    }
  }

  static type(trip) {
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

  label() {
    return `#${trip} ${direction}`;
  }

  description() {
    return `${CaltrainTrip.type(trip)}  /  ${schedule()}`;
  }

  direction() {
    return (direction == NORTH) ? "Northbound" : "Southbound";
  }

  schedule() {
    if (schedule == WEEKDAY) {
      return "Weekday";
    } else {
      for (let x = 0; x < CaltrainService.saturday_trip_ids.length; x++) {
        if (trip == CaltrainService.saturday_trip_ids[x]) return "Saturday";
      }
      return "Weekend";
    }
  }

}
