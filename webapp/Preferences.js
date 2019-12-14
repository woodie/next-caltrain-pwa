class Preferences {

  constructor(stations) {
    this.stations = stations;
    this.stopAM = 16, // Should be in
    this.stopPM = 0,  // local storage.
    this.swapped = false; // true when PM
  }

  swapStations() {
    this.swapped = this.swapped ? false : true;
  }

  tripLabels() {
    this.origin = this.stations[this.swapped ? this.stopPM : this.stopAM];
    this.destin = this.stations[this.swapped ? this.stopAM : this.stopPM];
    let out = [];
    if (this.origin.length >= this.destin.length) {
      out[0] = this.origin;
      out[1] = `to ${this.destin}`;
    } else {
      out[0] = `${this.origin} to`;
      out[1] = this.destin;
    }
    return out;
  }

  bumpStations(origin, increment) {
    let max = this.stations.length - 1;
    if (this.swapped) origin = !origin;
    if (origin && !increment) {
      this.stopAM = (this.stopAM === max) ? 0 : ++this.stopAM;
    } else if (origin && increment) {
      this.stopAM = (this.stopAM === 0) ? max: --this.stopAM;
    } else if (!origin && !increment) {
      this.stopPM = (this.stopPM === max) ? 0 : ++this.stopPM;
    } else if (!origin && increment) {
      this.stopPM = (this.stopPM === 0) ? max: --this.stopPM;
    }
  }
}
