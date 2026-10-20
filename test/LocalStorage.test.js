// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { justBeforeEach } from 'penultimate'
import { LocalStorage } from '../src/LocalStorage.js'
import { caltrainServiceData } from '../src/@caltrainServiceData.js'

const context = describe

describe('LocalStorage', () => {
  let hour, ls

  beforeEach(() => {
    localStorage.clear()
    hour = 10
    vi.spyOn(Date.prototype, 'getHours').mockImplementation(() => hour)
  })

  afterEach(() => { vi.restoreAllMocks() })

  justBeforeEach(() => { ls = new LocalStorage(caltrainServiceData.southStops) })

  describe('#tripLabels()', () => {
    context('in the morning', () => {
      it('goes from the morning stop to the evening stop', () => {
        expect(ls.tripLabels()).toEqual(['Palo Alto to', 'San Francisco'])
      })
    })

    context('in the afternoon', () => {
      beforeEach(() => { hour = 14 })

      it('goes the other way', () => {
        expect(ls.tripLabels()).toEqual(['San Francisco', 'to Palo Alto'])
      })
    })
  })

  describe('#flipStations()', () => {
    justBeforeEach(() => { ls.flipStations() })

    it('swaps origin and destination', () => {
      expect(ls.tripLabels()).toEqual(['San Francisco', 'to Palo Alto'])
    })
  })

  describe('#bumpStations()', () => {
    let origin, increment

    justBeforeEach(() => { ls.bumpStations(origin, increment) })

    context('when bumping the origin', () => {
      beforeEach(() => { origin = true; increment = true })

      it('moves the origin one stop', () => {
        expect(ls.tripLabels()).toEqual(['Menlo Park', 'to San Francisco'])
      })

      context('and then the destination', () => {
        justBeforeEach(() => { ls.bumpStations(false, false) })

        it('moves the destination one stop too', () => {
          expect(ls.tripLabels()).toEqual(['Menlo Park', 'to 22nd Street'])
        })
      })
    })
  })
})
