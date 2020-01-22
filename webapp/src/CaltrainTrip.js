// SOUTH:0, NORTH:1, SUNDAY:0, SATURDAY:6, WEEKEND:7, WEEKDAY:8, MODIFIED:9

class CaltrainTrip {

 /**
  * A train with times for each station stop.
  * @param trip the trip ID
  * @return a list of service stops.
  */
  constructor(trip, dotw) {
    this.trip = trip;
    this.stops = [];
    this.times = [];
    this.direction = (trip % 2 === SOUTH) ? SOUTH : NORTH;
    this.schedule = (trip < 400) ? WEEKDAY: (dotw) === MODIFIED ? MODIFIED : WEEKEND;
    this.setService();
  }

 /**
  * Set the time and station name for a trip ID.
  */
  setService() {
    let mins = CaltrainService.tripStops(this.trip, this.direction, this.schedule);
    let strs = (this.direction === NORTH) ? caltrainServiceData.northStops : caltrainServiceData.southStops;
    this.times = [];
    this.stops = [];
    // populate instance
    for (let i = 0; i < mins.length; i++) {
      if (mins[i] == undefined) continue;
      this.times.push(mins[i]);
      this.stops.push(strs[i]);
    }
  }

  static type(trip) {
    if (trip > 900) {
    return "Unknown";
    } else if (trip > 800) { // Weekend & Modified
      return "Baby Bullet";
    } else if (trip > 500) { // Modified
      return "Limited";
    } else if (trip > 400) { // Weekend & Modified
      return "Local";
    } else if (trip > 300) { // Weekday
      return "Baby Bullet";
    } else if (trip > 200) { // Weekday
      return "Limited";
    } else if (trip > 100) { // Weekday
      return "Local";
    } else {
      return "Unknown";
    }
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
    if (this.schedule === MODIFIED) {
      return "Modified";
    } else if (this.schedule === WEEKDAY) {
      return "Weekday";
    } else {
      return (saturdayTripIds.indexOf(this.trip)) === -1 ? "Weekend" : "Saturday";
    }
  }

}
