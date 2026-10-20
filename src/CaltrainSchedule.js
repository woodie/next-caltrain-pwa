import { scheduleData } from './ScheduleFeed.js'

const scheduleOptions = [
  'Weekday',  // 0
  'Weekend',  // 1
  'Holiday',  // 2
]
export class CaltrainSchedule {
  constructor (goodTime) {
    this.forToday = CaltrainSchedule.optionIndex(goodTime)
    this.selected = this.forToday
  }

  label () {
    return scheduleOptions[this.selected]
  }

  next () {
    this.selected =
      this.selected >= scheduleOptions.length - 1 ? 0 : this.selected + 1
  }

  swapped () {
    return this.forToday !== this.selected
  }

  // Returns the schedule label for tomorrow's date/dotw
  tomorrowLabel (goodTime) {
    return scheduleOptions[
      CaltrainSchedule.optionIndexFor(goodTime.tomorrowDate, goodTime.tomorrowDotw)
    ]
  }

  // Schedule label (Weekday, Weekend, Holiday) for an ISO date and day-of-week
  static labelFor (date, dotw) {
    return scheduleOptions[CaltrainSchedule.optionIndexFor(date, dotw)]
  }

  static optionIndex (goodTime) {
    return CaltrainSchedule.optionIndexFor(goodTime.date, goodTime.dotw)
  }

  // Factored out so tomorrow's schedule can be computed without a full GoodTimes object
  static optionIndexFor (date, dotw) {
    // specialDates maps 'YYYY-MM-DD' to a scheduleOptions index, from the feed
    const special = scheduleData.specialDates || {}
    if (date in special) {
      return special[date]
    } else if (dotw === 6 || dotw === 0) {
      return 1 // WEEKEND
    } else {
      return 0 // WEEKDAY
    }
  }
}
