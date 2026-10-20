import { beforeEach, describe, expect, it } from 'vitest'
import { justBeforeEach } from 'penultimate'
import { GoodTimes } from '../src/GoodTimes.js'

const context = describe

describe('GoodTimes', () => {
  describe('.partTime()', () => {
    it('returns noon as the time and "pm"', () => {
      expect(GoodTimes.partTime(720)).toEqual(['12:00', 'pm'])
    })
  })

  describe('.fullTime()', () => {
    it('returns noon as one string', () => {
      expect(GoodTimes.fullTime(720)).toBe('12:00pm')
    })
  })

  describe('.dateString()', () => {
    it('formats a timestamp as a short date', () => {
      expect(GoodTimes.dateString(Date.UTC(2020, 9, 15, 12))).toBe('Oct 15 2020')
    })
  })

  describe('an instance at noon on Thursday, October 15, 2020', () => {
    let gt

    beforeEach(() => { gt = new GoodTimes('2020-10-15T12:00:00') })

    describe('#partTime()', () => {
      it('returns the time and "pm"', () => {
        expect(gt.partTime()).toEqual(['12:00', 'pm'])
      })
    })

    describe('#fullTime()', () => {
      it('returns the time as one string', () => {
        expect(gt.fullTime()).toBe('12:00pm')
      })
    })

    describe('#inThePast()', () => {
      it('returns true for two minutes ago', () => {
        expect(gt.inThePast(gt.minutes - 2)).toBe(true)
      })

      it('returns false for two minutes from now', () => {
        expect(gt.inThePast(gt.minutes + 2)).toBe(false)
      })
    })

    describe('#departing()', () => {
      it('returns true for the current minute', () => {
        expect(gt.departing(gt.minutes)).toBe(true)
      })
    })

    describe('#countdown()', () => {
      it('counts down to a train 66 minutes away', () => {
        expect(gt.countdown(gt.minutes + 66)).toBe('in 1 hr 5 min')
      })
    })

    describe('#tomorrowDate', () => {
      it('returns the next calendar date', () => {
        // the service day starts at 2am, so noon is still Thursday, October 15
        expect(gt.tomorrowDate).toBe('2020-10-16')
      })
    })
  })

  describe('#tomorrowDotw', () => {
    let when, gt

    justBeforeEach(() => { gt = new GoodTimes(when) })

    context('when today is Thursday (4)', () => {
      beforeEach(() => { when = '2020-10-15T12:00:00' })

      it('returns Friday (5)', () => { expect(gt.tomorrowDotw).toBe(5) })
    })

    context('when today is Saturday (6)', () => {
      beforeEach(() => { when = '2020-10-17T12:00:00' })

      it('is Saturday', () => { expect(gt.dotw).toBe(6) })
      it('returns Sunday (0), wrapping the week', () => { expect(gt.tomorrowDotw).toBe(0) })
    })

    context('when today is Sunday (0)', () => {
      beforeEach(() => { when = '2020-10-18T12:00:00' })

      it('is Sunday', () => { expect(gt.dotw).toBe(0) })
      it('returns Monday (1)', () => { expect(gt.tomorrowDotw).toBe(1) })
    })
  })
})
