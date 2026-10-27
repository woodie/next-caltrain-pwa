import { describe, expect, it } from 'vitest'
import { Sun } from '../src/Sun.js'

const context = describe

// Published Palo Alto times, as UTC instants; NOAA's simple equations are good to a few minutes.
const near = (actual, expected) => {
  expect(Math.abs(actual.getTime() - new Date(expected).getTime())).toBeLessThan(4 * 60 * 1000)
}

describe('Sun', () => {
  describe('.times()', () => {
    context('at the June solstice', () => {
      it('rises around 5:48am and sets around 8:34pm PDT', () => {
        const { sunrise, sunset } = Sun.times(new Date('2026-06-21T19:00:00Z'))
        near(sunrise, '2026-06-21T12:48:00Z')
        near(sunset, '2026-06-22T03:34:00Z')
      })
    })

    context('at the December solstice', () => {
      it('rises around 7:20am and sets around 4:53pm PST', () => {
        const { sunrise, sunset } = Sun.times(new Date('2026-12-21T20:00:00Z'))
        near(sunrise, '2026-12-21T15:20:00Z')
        near(sunset, '2026-12-22T00:53:00Z')
      })
    })

    context('late in the evening, Pacific time', () => {
      it('uses the Pacific date, not the UTC date', () => {
        const { sunset } = Sun.times(new Date('2026-12-22T06:30:00Z'))
        near(sunset, '2026-12-22T00:53:00Z')
      })
    })
  })

  describe('.isDark()', () => {
    it('is light at noon', () => {
      expect(Sun.isDark(new Date('2026-10-26T19:00:00Z'))).toBe(false)
    })

    it('is dark at 9pm', () => {
      expect(Sun.isDark(new Date('2026-10-27T04:00:00Z'))).toBe(true)
    })

    it('is dark at 5am', () => {
      expect(Sun.isDark(new Date('2026-10-26T12:00:00Z'))).toBe(true)
    })
  })
})
