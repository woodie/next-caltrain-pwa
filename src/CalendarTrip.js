import { GoodTimes } from './GoodTimes.js'

// Caltrain runs on Pacific time, whatever the phone's own time zone is.
const CALTRAIN_TZ = 'America/Los_Angeles'

export class CalendarTrip {
  /**
   * Pick the planned train, like Google Maps' "Leave at" / "Arrive by".
   * @param routes sorted by departure, as from CaltrainService.routes()
   * @param mode 'leave' (first train departing at or after minutes) or
   *   'arrive' (last train arriving at or before minutes)
   * @return index into routes, or -1 if no train fits
   */
  static find (routes, mode, minutes) {
    if (mode === 'arrive') {
      let found = -1
      for (let i = 0; i < routes.length; i++) {
        if (routes[i][2] <= minutes) found = i
      }
      return found
    }
    for (let i = 0; i < routes.length; i++) {
      if (routes[i][1] >= minutes) return i
    }
    return -1
  }

  /**
   * The planned train with the trains before and after it.
   * @return array of { label, depart, arrive, selected }
   */
  static neighbors (routes, index) {
    const out = []
    for (let i = index - 1; i <= index + 1; i++) {
      if (i < 0 || i >= routes.length) continue
      const route = routes[i]
      const label = route.length >= 5 ? `#${route[0]}+#${route[3]}` : `#${route[0]}`
      out.push({ label, depart: route[1], arrive: route[2], selected: i === index })
    }
    return out
  }

  static line (train) {
    return `${train.label}  ${GoodTimes.fullTime(train.depart)} – ${GoodTimes.fullTime(train.arrive)}`
  }

  static title (destin) {
    return `Caltrain to ${destin}`
  }

  static html (origin, destin, trains) {
    // HTML collapses the two spaces after the train number; keep both
    const lines = trains.map((train) => CalendarTrip.line(train).replace('  ', '&nbsp; '))
      .map((line, i) => trains[i].selected ? `<b>${line}</b>` : line)
    return [`<b>${origin} to ${destin}</b>`].concat(lines).join('<br>')
  }

  /**
   * Local date-time stamp for minutes past midnight on an ISO date
   * (times past midnight, > 1440, roll over to the next day).
   * @return 'YYYYMMDDTHHMMSS'
   */
  static stamp (isoDate, minutes) {
    const [y, m, d] = isoDate.split('-').map(Number)
    const t = new Date(Date.UTC(y, m - 1, d) + minutes * 60000)
    const pad = (n) => (n < 10 ? '0' : '') + n
    return `${t.getUTCFullYear()}${pad(t.getUTCMonth() + 1)}${pad(t.getUTCDate())}` +
      `T${pad(t.getUTCHours())}${pad(t.getUTCMinutes())}00`
  }

  static googleUrl (title, isoDate, train, details) {
    const dates = `${CalendarTrip.stamp(isoDate, train.depart)}/${CalendarTrip.stamp(isoDate, train.arrive)}`
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      `&text=${encodeURIComponent(title)}&dates=${dates}` +
      `&ctz=${encodeURIComponent(CALTRAIN_TZ)}&details=${encodeURIComponent(details)}`
  }

  /**
   * Local ISO date (YYYY-MM-DD) for a Date, days from now.
   */
  static isoDate (date, days = 0) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
    const pad = (n) => (n < 10 ? '0' : '') + n
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }

  static dotw (isoDate) {
    const [y, m, d] = isoDate.split('-').map(Number)
    return new Date(y, m - 1, d).getDay()
  }
}
