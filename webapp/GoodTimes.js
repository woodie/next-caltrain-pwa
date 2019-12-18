/**
 * A utility to simplify working with the date and time.
 */
class GoodTimes{

  constructor() {
    let now = new Date();
    this.minutes = now.getHours() * 60 + now.getMinutes();
    this.seconds = now.getSeconds();
    this.dotw = now.getDay();
  }

  static partTime(minutes) {
    let hrs = Math.floor(minutes / 60);
    let min = minutes % 60;
    if (min < 10) { min = '0' + min; }
    let mer = (hrs > 11 && hrs < 23) ? 'pm' : 'am';
    if (hrs > 12) {
      hrs -= 12;
      if (hrs > 12) {
        hrs -= 12;
      }
    }
    if (hrs < 1) { hrs = 12; }
    return [`${hrs}:${min}`, mer];
  } 

  partTime() {
    return GoodTimes.partTime(this.minutes);
  }

  static fullTime(minutes) {
    return GoodTimes.partTime(minutes).join('');
  }

  fullTime() { 
    return GoodTimes.fullTime(this.minutes);
  }

  schedule() {
    if (this.dotw === 0) {
      return SUNDAY;
    } else if (this.dotw === 6) {
      return SATURDAY;
    } else {
    return WEEKDAY;
    }
  }

  swapped() {
    return (this.dotw === 0 || this.dotw === 6) ? 'Weekday Schedule' : 'Weekend Schedule';
  }

  static dateString(miliseconds) {
    return new Date(miliseconds).toString().split(' ').slice(1, 4).join(' ');
  }

  inThePast(target) {
    return (target - this.minutes < 0);
  }

  countdown(target) {
    let minutes = target - this.minutes;
    if (minutes > 59) {
      return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
    } else {
      return `${minutes} min ${60 - this.seconds} sec`;
    }
  }

}
