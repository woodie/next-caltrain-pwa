// https://www.caltrain.com/schedules/holiday-service

const special = {
  //'2023-01-01': 1, // New Year’s Day
  //'2023-01-02': 1, // New Year’s Day (Observed)
  //'2023-01-16': 2, // Martin Luther King Jr. Day
  //'2023-02-20': 2, // Presidents Day
  //'2023-05-29": 1, // Memorial Day
  //'2023-11-23": 1, // Thanksgiving Day
  //'2023-11-24': 2, // Day After Thanksgiving
  //'2023-12-24': 2, // Christmas Eve
  //'2024-11-29': 2, // Day After Thanksgiving
  //'2024-12-24': 2, // Christmas Eve
  '2025-11-28': 2, // Day After Thanksgiving
  '2025-12-24': 2, // Christmas Eve
};

const scheduleOptions = [
  'Weekday',  // 0
  'Weekend',  // 1
  'Modified', // 2
];

export class CaltrainSchedule {
  constructor(goodTime) {
    this.forToday = CaltrainSchedule.optionIndex(goodTime);
    this.selected = this.forToday;
  }

  label() {
    return scheduleOptions[this.selected];
  }

  next() {
    this.selected =
      this.selected >= scheduleOptions.length - 1 ? 0 : this.selected + 1;
  }

  swapped() {
    return this.forToday !== this.selected;
  }

  static optionIndex(goodTime) {
    if (goodTime.date in special) {
      return special[goodTime.date];
    } else if (goodTime.dotw === 6 || goodTime.dotw === 0) {
      return 1; // WEEKEND
    } else {
      return 0; // WEEKDAY
    }
  }
}
