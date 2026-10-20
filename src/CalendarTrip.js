import { GoodTimes } from './GoodTimes.js'

// Caltrain runs on Pacific time, whatever the phone's own time zone is.
const CALTRAIN_TZ = 'America/Los_Angeles'
const REMINDER_MINUTES = 10

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

  static text (origin, destin, trains) {
    return [`${origin} to ${destin}`].concat(trains.map(CalendarTrip.line)).join('\n')
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

  static ics (title, isoDate, train, description) {
    const escape = (s) => s.replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n')
    const now = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Next Caltrain//EN',
      'BEGIN:VTIMEZONE',
      `TZID:${CALTRAIN_TZ}`,
      'BEGIN:DAYLIGHT',
      'TZOFFSETFROM:-0800',
      'TZOFFSETTO:-0700',
      'TZNAME:PDT',
      'DTSTART:19700308T020000',
      'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
      'END:DAYLIGHT',
      'BEGIN:STANDARD',
      'TZOFFSETFROM:-0700',
      'TZOFFSETTO:-0800',
      'TZNAME:PST',
      'DTSTART:19701101T020000',
      'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      `UID:${CalendarTrip.stamp(isoDate, train.depart)}-${train.label.replace(/\W/g, '')}@next-caltrain-pwa.appspot.com`,
      `DTSTAMP:${now}`,
      `DTSTART;TZID=${CALTRAIN_TZ}:${CalendarTrip.stamp(isoDate, train.depart)}`,
      `DTEND;TZID=${CALTRAIN_TZ}:${CalendarTrip.stamp(isoDate, train.arrive)}`,
      `SUMMARY:${escape(title)}`,
      `DESCRIPTION:${escape(description)}`,
      'BEGIN:VALARM',
      `TRIGGER:-PT${REMINDER_MINUTES}M`,
      'ACTION:DISPLAY',
      `DESCRIPTION:${escape(title)}`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
      '',
    ].join('\r\n')
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
