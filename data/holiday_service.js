// https://www.caltrain.com/schedules/holiday-service
// 0 = Weekday, 1 = Weekend, 2 = Modified

const special = {
  '2023-01-01': 1, // New Year's Day
  '2023-01-02': 1, // New Year's Day (Observed)
  '2023-01-16': 2, // Martin Luther King Jr. Day
  '2023-02-20': 2, // Presidents' Day
  '2023-05-29': 1, // Memorial Day
  '2023-11-23': 1, // Thanksgiving Day
  '2023-11-24': 2, // Black Friday
  '2023-12-24': 2, // Christmas Eve
  '2024-11-29': 2, // Black Friday
  '2024-12-24': 2, // Christmas Eve
  '2025-11-27': 1, // Thanksgiving Day
  '2025-11-28': 2, // Black Friday
  '2025-12-24': 2, // Christmas Eve
  '2025-12-25': 1, // Christmas Day
  '2026-01-01': 1, // New Year's Day
  '2026-01-19': 2, // MLK Day
  '2026-02-16': 2, // Presidents' Day
  '2026-05-25': 1, // Memorial Day
  '2026-07-04': 1, // Independence Day
  '2026-09-07': 1, // Labor Day
  '2026-11-26': 1, // Thanksgiving Day
  '2026-11-27': 2, // Black Friday
  '2026-12-24': 2, // Christmas Eve
  '2026-12-25': 1, // Christmas Day
  '2027-01-01': 1, // New Year's Day
  '2027-01-18': 2, // MLK Day
  '2027-02-15': 2, // Presidents' Day
  '2027-05-31': 1, // Memorial Day
  '2027-07-05': 1, // Independence Day (observed)
  '2027-09-06': 1, // Labor Day
  '2027-11-25': 1, // Thanksgiving Day
  '2027-11-26': 2, // Black Friday
  '2027-12-24': 2, // Christmas Eve
};

export { special };
