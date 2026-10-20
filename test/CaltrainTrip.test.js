import { beforeEach, describe, expect, it } from 'vitest'
import { justBeforeEach } from 'penultimate'
import { CaltrainTrip } from '../src/CaltrainTrip.js'

const context = describe

describe('CaltrainTrip', () => {
  describe('.type()', () => {
    let train, type

    justBeforeEach(() => { type = CaltrainTrip.type(train) })

    context('for a South County train (851)', () => {
      beforeEach(() => { train = 851 })

      it('returns South County', () => { expect(type).toBe('South County') })
    })

    context('for an Express train (501)', () => {
      beforeEach(() => { train = 501 })

      it('returns Express', () => { expect(type).toBe('Express') })
    })

    context('for a Limited train (401)', () => {
      beforeEach(() => { train = 401 })

      it('returns Limited', () => { expect(type).toBe('Limited') })
    })

    context('for a Local train (101)', () => {
      beforeEach(() => { train = 101 })

      it('returns Local', () => { expect(type).toBe('Local') })
    })

    context('for a weekend Local train (601)', () => {
      beforeEach(() => { train = 601 })

      it('returns Local', () => { expect(type).toBe('Local') })
    })

    context('for a Special train (901)', () => {
      beforeEach(() => { train = 901 })

      it('returns Special', () => { expect(type).toBe('Special') })
    })

    context('for a number outside any series (701)', () => {
      beforeEach(() => { train = 701 })

      it('returns Unknown', () => { expect(type).toBe('Unknown') })
    })
  })

  describe('an instance for train 101 on a weekday', () => {
    let trip

    beforeEach(() => { trip = new CaltrainTrip(101, 'Weekday') })

    describe('#label()', () => {
      it('returns the direction, number and type', () => {
        expect(trip.label()).toBe('NB #101 Local')
      })
    })

    describe('#directionString()', () => {
      it('returns NB for a northbound train', () => {
        expect(trip.directionString()).toBe('NB')
      })
    })
  })
})
