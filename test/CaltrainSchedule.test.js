import { beforeEach, describe, expect, it } from 'vitest'
import { justBeforeEach } from 'penultimate'
import { CaltrainSchedule } from '../src/CaltrainSchedule.js'
import { GoodTimes } from '../src/GoodTimes.js'

const context = describe

describe('CaltrainSchedule', () => {
  describe('.optionIndex()', () => {
    it('returns 0 (Weekday) on a Thursday', () => {
      expect(CaltrainSchedule.optionIndex(new GoodTimes('2020-10-15T08:10:10'))).toBe(0)
    })
  })

  describe('.optionIndexFor()', () => {
    let date, dotw, result

    justBeforeEach(() => { result = CaltrainSchedule.optionIndexFor(date, dotw) })

    context('on a weekday (Thursday, dotw=4)', () => {
      beforeEach(() => { date = '2020-10-15'; dotw = 4 })

      it('returns 0 (Weekday)', () => { expect(result).toBe(0) })
    })

    context('on Saturday (dotw=6)', () => {
      beforeEach(() => { date = '2020-10-17'; dotw = 6 })

      it('returns 1 (Weekend)', () => { expect(result).toBe(1) })
    })

    context('on Sunday (dotw=0)', () => {
      beforeEach(() => { date = '2020-10-18'; dotw = 0 })

      it('returns 1 (Weekend)', () => { expect(result).toBe(1) })
    })

    context('on a special date (the day after Thanksgiving 2025)', () => {
      beforeEach(() => { date = '2025-11-28'; dotw = 5 })

      it('returns 2 (Holiday) regardless of dotw', () => { expect(result).toBe(2) })
    })
  })

  describe('an instance', () => {
    let goodTime, schedule

    beforeEach(() => { goodTime = new GoodTimes('2020-10-15T08:10:10') }) // Thursday morning

    justBeforeEach(() => { schedule = new CaltrainSchedule(goodTime) })

    describe('#label()', () => {
      it("returns today's schedule, Weekday on a Thursday", () => {
        expect(schedule.label()).toBe('Weekday')
      })
    })

    describe('#swapped()', () => {
      it("returns false while today's schedule is selected", () => {
        expect(schedule.swapped()).toBe(false)
      })
    })

    describe('#next()', () => {
      justBeforeEach(() => { schedule.next() })

      it('selects the next schedule', () => {
        expect(schedule.selected).toBe(1)
        expect(schedule.label()).toBe('Weekend')
      })

      it('marks the schedule as swapped', () => {
        expect(schedule.swapped()).toBe(true)
      })
    })

    describe('#tomorrowLabel()', () => {
      let result

      justBeforeEach(() => { result = schedule.tomorrowLabel(goodTime) })

      context('when today is Thursday', () => {
        beforeEach(() => { goodTime = new GoodTimes('2020-10-15T12:00:00') })

        it('returns Weekday for tomorrow (Friday)', () => { expect(result).toBe('Weekday') })
      })

      context('when today is Friday', () => {
        beforeEach(() => { goodTime = new GoodTimes('2020-10-16T12:00:00') })

        it('returns Weekend for tomorrow (Saturday)', () => { expect(result).toBe('Weekend') })
      })

      context('when today is Sunday', () => {
        beforeEach(() => { goodTime = new GoodTimes('2020-10-18T12:00:00') })

        it('returns Weekday for tomorrow (Monday)', () => { expect(result).toBe('Weekday') })
      })
    })
  })
})
