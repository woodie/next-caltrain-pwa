const special_service = {
    '2019-07-04': 'sun', // Independence Day
    '2019-09-02': 'sun', // Labor Day
    '2019-11-28': 'sun', // Thanksgiving Day
    '2019-11-29': 'mod', // Day after Thanksgiving
    '2019-12-25': 'sun', // Christmas Day
    '2019-12-31': 'sun', // New Year's Eve
    '2020-01-01': 'sun', // New Year's Day
    '2020-01-20': 'mod', // Martin Luther King Jr Day
    '2020-02-17': 'mod', // Presidents Day
    '2020-05-25': 'sun', // Memorial Day
};

/**
 * A utility to simplify working with the date and time.
 */
class GoodTimes{

  constructor() {
    //let now = new Date('2020-10-15T08:10:10');
    let now = new Date(); // run day goes until 2am
    let run = new Date(now.getTime() - (2 * 60 * 60 * 1000));
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
