/**
 * A utility to simplify working with the date and time.
 */
class GoodTimes{

  constructor() {
    this.today = new Date();
    this.minutes = Math.floor(this.today.getHours() / 60) + this.today.getMinutes();
    this.seconds = 60 - this.today.getSeconds();
  }

  static partTime(minutes) {
    let mer = 'am';
    let hrs = Math.floor(minutes / 60);
    let min = minutes % 60;
    if (min < 10) { min = '0' + min; }
    if (hrs > 12) {
      hrs -= 12;
      if (hrs > 12) {
        hrs -= 12;
      } else {
        mer = 'pm';
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
    GoodTimes.fullTime(this.minute);
  }

  dayOfTheWeek() {
    return this.today.getDay();
  }

  dateString() {
    return this.today.toString().split(' ').slice(1, 4).join(' ');
  }

  inThePast(target) {
    return (target - this.minutes < 0);
  }

  countdown(target) {
    let minutes = target - this.minutes;
    if (minutes > 59) {
      return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
    } else {
      return `${minutes} min ${60 - this.second} sec`;
    }
  }

}
