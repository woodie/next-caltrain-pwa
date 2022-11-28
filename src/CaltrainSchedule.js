const special = { 
//'2019-07-04': 2, // Independence Day
//'2019-09-02': 2, // Labor Day
//'2019-11-28': 2, // Thanksgiving Day
//'2019-11-29': 3, // Day after Thanksgiving
//'2019-12-25': 2, // Christmas Day
//'2019-12-31': 2, // New Year's Eve
//'2020-01-01': 2, // New Year's Day
//'2020-01-20': 3, // Martin Luther King Jr Day
//'2020-02-17': 3, // Presidents Day
//'2020-05-25': 2, // Memorial Day
//'2020-12-24': 3, // Christmas Eve
//'2020-12-25': 0, // Christmas Day
//'2020-12-31': 0, // New Year’s Eve
//'2021-01-01': 2, // New Year’s Day
//'2021-01-18': 3, // Martin Luther King Jr Day
//'2021-02-15': 3, // Presidents Day
//'2021-05-31': 2, // Memorial Day
//'2021-07-04': 2, // Independence Day
//'2021-11-25': 1, // Thanksgiving Day
//'2021-11-26': 3, // Day After Thanksgiving
//'2021-12-24': 1, // Christmas Eve
//'2021-12-25': 1, // Christmas Day
//'2021-12-31': 0, // New Year’s Eve
//'2022-01-01': 1, // New Year’s Day
//'2022-01-17': 3, // Martin Luther King Jr. Day
//'2022-02-21': 3, // Presidents Day
//'2022-05-30': 1, // Memorial Day
//'2022-07-04': 1, // Independence Day
//'2022-09-05': 1  // Labor Day
  '2022-11-24': 1, // Thanksgiving Day
  '2022-11-25': 2, // Day After Thanksgiving
  '2022-12-24': 1, // Christmas Eve
  '2022-12-25': 1, // Christmas Day
  '2022-12-26': 1, // Christmas Day (Observed)
  '2022-12-31': 1, // New Year’s Eve
  '2023-01-01': 1, // New Year’s Day
  '2023-01-02': 1, // New Year’s Day (Observed)
  '2023-01-16': 2, // Martin Luther King Jr. Day
  '2023-02-23': 2, // Presidents Day
  '2023-05-29': 1, // Memorial Day
};
// https://www.caltrain.com/schedules/holiday-service

const scheduleOptions = [
  'Weekday', // 0
  'Weekend', // 1
  'Modified' // 2
];

/* exported CaltrainSchedule */
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
