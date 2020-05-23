/* exported GoodTimes */
class GoodTimes{

  constructor() {
    //let now = new Date('2020-10-15T08:10:10'); // force weekday
    //let now = new Date('2020-02-17T08:10:10'); // force modified
    let now = new Date(); // run day goes until 2am
    let run = new Date(now.getTime() - (2 * 60 * 60 * 1000));
    this.date = run.toJSON().slice(0, 10);
    this.minutes = (run.getHours() + 2) * 60 + run.getMinutes();
    this.seconds = run.getSeconds();
    this.dotw = run.getDay();
  }

  static partTime(minutes) {
    let hrs = Math.floor(minutes / 60);
    let min = minutes % 60;
    if (min < 10) { min = '0' + min; }
    let mer = (hrs > 11 && hrs < 24) ? 'pm' : 'am';
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

  static dateString(miliseconds) {
    return new Date(miliseconds).toString().split(' ').slice(1, 4).join(' ');
  }

  inThePast(target) {
    return (target - this.minutes < 0);
  }

  departing(target) {
    return (target === this.minutes);
  }

  countdown(target) {
    let minutes = target - this.minutes - 1;
    if (minutes < 0) {
      return '';
    } else if (minutes > 59) {
      return `in ${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
    } else {
      return `in ${minutes} min ${60 - this.seconds} sec`;
    }
  }

}
