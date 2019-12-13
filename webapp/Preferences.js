const stations = caltrainServiceData.southStops;

class Preferences {

  constructor() {
    this.amStop = 17, // should be in
    this.pmStop = 0,  // local storage
  }

  setStops(swap) {
    stopAM = ((stopAM > 0) && (stopAM < stations.length)) ? stopAM : 17; // Preferences.defaults[0];
    stopPM = ((stopPM > 0) && (stopPM < stations.length)) ? stopPM : 0;  //Preferences.defaults[1];
    if (swap != false) {
      let tmp = stopAM;
      stopAM = stopPM;
      stopPM = tmp;
    }
  }

  tripLabels(from, dest) {
    let out = []; 
    if (from.length >= dest.length) {
      out[0] = from;
      out[1] = `to ${dest}`;
    } else {
      out[0] = `${from} to`;
      out[1] = dest;
    }
    return out;
  }

}
