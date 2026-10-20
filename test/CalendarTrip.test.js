import { describe, expect, it } from 'vitest'
import { CalendarTrip } from '../src/CalendarTrip.js'
import { CaltrainService } from '../src/CaltrainService.js'

const context = describe

describe('CalendarTrip', () => {
  // Palo Alto to San Mateo, weekday: #523 5:43pm, #151 5:55pm, #425 6:10pm, ...
  const routes = new CaltrainService().routes('Palo Alto', 'San Mateo', 'Weekday')
  const labels = (index) => CalendarTrip.neighbors(routes, index).map((train) => train.label)

  describe('.find()', () => {
    context('leaving at 5:50pm', () => {
      it('picks the first train departing at or after then', () => {
        expect(labels(CalendarTrip.find(routes, 'leave', 17 * 60 + 50))).toEqual(['#523', '#151', '#425'])
      })
    })

    context('arriving by 6:20pm', () => {
      it('picks the last train arriving at or before then', () => {
        expect(labels(CalendarTrip.find(routes, 'arrive', 18 * 60 + 20))).toEqual(['#523', '#151', '#425'])
      })
    })

    context('leaving after the last train', () => {
      it('finds nothing', () => { expect(CalendarTrip.find(routes, 'leave', 1500)).toBe(-1) })
    })
  })

  describe('.neighbors()', () => {
    it('marks the planned train', () => {
      const trains = CalendarTrip.neighbors(routes, CalendarTrip.find(routes, 'leave', 17 * 60 + 55))
      expect(trains.map((train) => train.selected)).toEqual([false, true, false])
    })

    it('has no train before the first one of the day', () => {
      expect(CalendarTrip.neighbors(routes, 0)).toHaveLength(2)
    })
  })

  describe('.text() and .html()', () => {
    const trains = CalendarTrip.neighbors(routes, CalendarTrip.find(routes, 'leave', 17 * 60 + 55))

    it('formats one train per line', () => {
      expect(CalendarTrip.text('Palo Alto', 'San Mateo', trains)).toBe(
        'Palo Alto to San Mateo\n#523  5:43pm – 5:59pm\n#151  5:55pm – 6:17pm\n#425  6:10pm – 6:28pm')
    })

    it('bolds the planned train', () => {
      expect(CalendarTrip.html('Palo Alto', 'San Mateo', trains)).toContain('<b>#151&nbsp; 5:55pm – 6:17pm</b>')
    })
  })

  describe('.stamp()', () => {
    it('formats a local date-time', () => {
      expect(CalendarTrip.stamp('2026-05-21', 17 * 60 + 55)).toBe('20260521T175500')
    })

    it('rolls times past midnight over to the next day', () => {
      expect(CalendarTrip.stamp('2026-12-31', 1445)).toBe('20270101T000500')
    })
  })

  describe('.googleUrl()', () => {
    it('uses the exact times on Pacific time', () => {
      const url = new URL(CalendarTrip.googleUrl('Caltrain to San Mateo', '2026-05-21',
        { depart: 17 * 60 + 55, arrive: 18 * 60 + 17 }, 'details'))
      expect(url.searchParams.get('dates')).toBe('20260521T175500/20260521T181700')
      expect(url.searchParams.get('ctz')).toBe('America/Los_Angeles')
    })
  })

  describe('.ics()', () => {
    const ics = CalendarTrip.ics('Caltrain to San Mateo', '2026-05-21',
      { label: '#151', depart: 17 * 60 + 55, arrive: 18 * 60 + 17 }, 'a, b\nc')

    it('has the event times and a 10 minute reminder', () => {
      expect(ics).toContain('DTSTART;TZID=America/Los_Angeles:20260521T175500')
      expect(ics).toContain('DTEND;TZID=America/Los_Angeles:20260521T181700')
      expect(ics).toContain('TRIGGER:-PT10M')
    })

    it('escapes the description', () => {
      expect(ics).toContain('DESCRIPTION:a\\, b\\nc')
    })
  })

  describe('.dotw()', () => {
    it('is Thursday for 2026-05-21', () => { expect(CalendarTrip.dotw('2026-05-21')).toBe(4) })
  })
})
