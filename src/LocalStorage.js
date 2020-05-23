/* exported LocalStorage */
class LocalStorage {

  constructor(stations) {
    this.stations = stations;
    this.flipped = new Date().getHours() >= 12;
    let savedAM = parseInt(localStorage.getItem('stopAM'));
    let savedPM = parseInt(localStorage.getItem('stopPM'));
    if (Number.isNaN(savedAM) || savedAM < 0 || savedAM >= stations.length) {
      localStorage.setItem('stopAM', 16);
    }
    if (Number.isNaN(savedAM) || savedPM < 0 || savedPM >= stations.length) {
      localStorage.setItem('stopPM', 0);
    }
    this.stopAM = parseInt(localStorage.getItem('stopAM'));
    this.stopPM = parseInt(localStorage.getItem('stopPM'));
  }

  saveStops() {
    localStorage.setItem('stopAM', this.stopAM);
    localStorage.setItem('stopPM', this.stopPM);
  }

  flipStations() {
    this.flipped = this.flipped ? false : true;
  }

  tripLabels() {
    this.origin = this.stations[this.flipped ? this.stopPM : this.stopAM];
    this.destin = this.stations[this.flipped ? this.stopAM : this.stopPM];
    if (this.origin.length + 3 >= this.destin.length) {
      return [this.origin, `to ${this.destin}`];
    } else {
      return [`${this.origin} to`, this.destin];
    }
  }

  bumpStations(origin, increment) {
    let max = this.stations.length - 1;
    if (this.flipped) origin = !origin;
    if (origin && !increment) {
      this.stopAM = (this.stopAM === max) ? 0 : ++this.stopAM;
    } else if (origin && increment) {
      this.stopAM = (this.stopAM < 1) ? max : --this.stopAM;
    } else if (!origin && !increment) {
      this.stopPM = (this.stopPM === max) ? 0 : ++this.stopPM;
    } else if (!origin && increment) {
      this.stopPM = (this.stopPM < 1) ? max : --this.stopPM;
    }
  }
}
