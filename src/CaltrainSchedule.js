const special = { 
//'2019-07-04': 2, // Independence Day
//'2019-09-02': 2, // Labor Day
//'2019-11-28': 2, // Thanksgiving Day
//'2019-11-29': 3, // Day after Thanksgiving
//'2019-12-25': 2, // Christmas Day
//'2019-12-31': 2, // New Year's Eve
  '2020-01-01': 2, // New Year's Day
  '2020-01-20': 3, // Martin Luther King Jr Day
  '2020-02-17': 3, // Presidents Day
  '2020-05-25': 2, // Memorial Day
};
const scheduleOptions = [
  'Weekday', // 0
  'Saturday',// 1
  'Sunday',  // 2
  'Modified' // 3
];

class CaltrainSchedule {

  constructor(goodTime) {
    this.forToday = CaltrainSchedule.optionIndex(goodTime);
    this.selected = this.forToday;
  }

  label() {
    return scheduleOptions[this.selected];
  }

  next() {
    this.selected = (this.selected >= scheduleOptions.length - 1) ? 0 : this.selected + 1;
  }

  swapped() {
    return (this.forToday !== this.selected);
  }

  static optionIndex(goodTime) {
    if (goodTime.date in special) {
      return special[goodTime.date];
    } else if (goodTime.dotw === 0) {
      return 2; // SUNDAY
    } else if (goodTime.dotw === 6) {
      return 1; // SATURDAY
    } else {
      return 0; // WEEKDAY
    }
  }

}