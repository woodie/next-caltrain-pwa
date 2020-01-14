// SOUTH:0, NORTH:1, WEEKEND:0, WEEKDAY:8

class CaltrainTrip {

 /**
  * A train with times for each station stop.
  * @param trip the trip ID
  * @return a list of service stops.
  */
  constructor(trip) {
    this.trip = trip;
    this.stops = [];
    this.times = [];
    this.direction = (trip % 2 === SOUTH) ? SOUTH : NORTH;
    this.schedule = (trip < 400) ? WEEKDAY: WEEKEND;
    this.setService();
  }

 /**
  * Set the time and station name for a trip ID.
  */
  setService() {
    let mins = CaltrainService.tripStops(this.trip, this.direction, this.schedule);
    let strs = (this.direction === NORTH) ? caltrainServiceData.northStops : caltrainServiceData.southStops;
    // determine size
    let getSize = 0;
    for (let i = 0; i < mins.length; i++) {
      if (mins[i] !== -1) getSize++;
    }
    this.times = [];
    this.stops = [];
    // populate instance
    let setSize = 0;
    for (let i = 0; i < mins.length; i++) {
      if (mins[i] === -1) continue;
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
    return `${this.directionString()} #${this.trip}`;
  }

  description() {
    return `${CaltrainTrip.type(this.trip)} / ${this.scheduleString()}`;
  }

  directionString() {
    return (this.direction === NORTH) ? "Northbound" : "Southbound";
  }

  scheduleString() {
    if (this.schedule === WEEKDAY) {
      return "Weekday";
    } else {
      return (saturdayTripIds.indexOf(this.trip)) === -1 ? "Weekend" : "Saturday";
    }
  }

}
