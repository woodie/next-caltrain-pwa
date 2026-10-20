import { beforeEach, describe, expect, it } from 'vitest'
import { justBeforeEach } from 'penultimate'
import { CaltrainService } from '../src/CaltrainService.js'

const context = describe

describe('CaltrainService', () => {
  let service

  beforeEach(() => { service = new CaltrainService() })

  describe('.mapStops()', () => {
    it('maps northbound station names', () => {
      const stops = CaltrainService.mapStops('North')
      expect(stops.has('Gilroy')).toBe(true)
      expect(stops.has('San Francisco')).toBe(true)
    })
  })

  describe('.tripStops()', () => {
    it('lists the stops for train 101, from Tamien to San Francisco', () => {
      const stops = CaltrainService.tripStops(101, 'North', 'Weekday')
      expect(stops[0]).toContain('Tamien')
      expect(stops[stops.length - 1]).toContain('San Francisco')
    })
  })

  describe('.direction()', () => {
    let origin, destination, direction

    justBeforeEach(() => { direction = CaltrainService.direction(origin, destination) })

    context('when traveling from San Francisco to Gilroy', () => {
      beforeEach(() => { origin = 'San Francisco'; destination = 'Gilroy' })

      it('is South', () => { expect(direction).toBe('South') })
    })

    context('when traveling from Gilroy to San Francisco', () => {
      beforeEach(() => { origin = 'Gilroy'; destination = 'San Francisco' })

      it('is North', () => { expect(direction).toBe('North') })
    })
  })

  describe('.isSouthCounty()', () => {
    it('returns true for South County trains (the 800s)', () => {
      expect(CaltrainService.isSouthCounty(801)).toBe(true)
      expect(CaltrainService.isSouthCounty(814)).toBe(true)
      expect(CaltrainService.isSouthCounty(899)).toBe(true)
    })

    it('returns false for electric trains', () => {
      expect(CaltrainService.isSouthCounty(101)).toBe(false)
      expect(CaltrainService.isSouthCounty(514)).toBe(false)
      expect(CaltrainService.isSouthCounty(601)).toBe(false)
    })

    it('returns false for Special trains (the 900s)', () => {
      expect(CaltrainService.isSouthCounty(900)).toBe(false)
      expect(CaltrainService.isSouthCounty(901)).toBe(false)
    })
  })

  describe('.nextIndex()', () => {
    it('returns 0 when there are no routes', () => {
      expect(CaltrainService.nextIndex([], 700)).toBe(0)
    })
  })

  describe('.merge()', () => {
    it('returns no trips when neither stop has times', () => {
      const none = service.times('Unknown Stop', 'North', 'Weekday')
      expect(CaltrainService.merge(none, new Map(), [])).toEqual([])
    })
  })

  describe('.select()', () => {
    it('leaves stops a train skips empty', () => {
      expect(CaltrainService.select('North', 'Weekday')['101'][0]).toBeUndefined()
    })
  })

  describe('#stopMap()', () => {
    it('maps northbound station names', () => {
      expect(service.stopMap('North').has('Gilroy')).toBe(true)
      expect(service.stopMap('North').has('San Francisco')).toBe(true)
    })
  })

  describe('#times()', () => {
    it('is empty for an unknown stop', () => {
      expect(service.times('Unknown Stop', 'North', 'Weekday').size).toBe(0)
    })
  })

  describe('#routes()', () => {
    let origin, destination, schedule, routes

    beforeEach(() => { schedule = 'Weekday' })

    justBeforeEach(() => { routes = service.routes(origin, destination, schedule) })

    context('for an unknown station', () => {
      beforeEach(() => { origin = 'Unknown'; destination = 'Palo Alto' })

      it('returns no trips', () => { expect(routes).toEqual([]) })
    })

    context('for a direct trip (San Francisco to Palo Alto)', () => {
      beforeEach(() => { origin = 'San Francisco'; destination = 'Palo Alto' })

      it('returns trips', () => { expect(routes.length).toBeGreaterThan(0) })

      it('returns 3-element direct routes, with no transfer', () => {
        for (const route of routes) expect(route).toHaveLength(3)
      })
    })

    context('within South County (Morgan Hill to Gilroy)', () => {
      beforeEach(() => { origin = 'Morgan Hill'; destination = 'Gilroy' })

      it('returns direct routes, with no transfer needed', () => {
        expect(routes.length).toBeGreaterThan(0)
        for (const route of routes) expect(route).toHaveLength(3)
      })
    })

    context('southbound with a transfer (San Francisco to Gilroy)', () => {
      beforeEach(() => { origin = 'San Francisco'; destination = 'Gilroy' })

      it('returns trips', () => { expect(routes.length).toBeGreaterThan(0) })

      it('returns 5-element transfer routes', () => {
        for (const route of routes) expect(route).toHaveLength(5)
      })

      it('leads with an electric train', () => {
        for (const route of routes) expect(CaltrainService.isSouthCounty(route[0])).toBe(false)
      })

      it('transfers to a South County train', () => {
        for (const route of routes) expect(CaltrainService.isSouthCounty(route[3])).toBe(true)
      })

      it('departs from the transfer after the electric train arrives at San Jose Diridon', () => {
        for (const route of routes) expect(route[4]).toBeGreaterThanOrEqual(route[1])
      })

      it('sorts trips by departure time', () => {
        for (let i = 1; i < routes.length; i++) expect(routes[i][1]).toBeGreaterThanOrEqual(routes[i - 1][1])
      })

      context('on a weekend', () => {
        beforeEach(() => { schedule = 'Weekend' })

        it('returns no trips (no South County weekend service)', () => { expect(routes).toEqual([]) })
      })
    })

    context('northbound with a transfer (Gilroy to San Francisco)', () => {
      beforeEach(() => { origin = 'Gilroy'; destination = 'San Francisco' })

      it('returns trips', () => { expect(routes.length).toBeGreaterThan(0) })

      it('returns 5-element transfer routes', () => {
        for (const route of routes) expect(route).toHaveLength(5)
      })

      it('leads with a South County train', () => {
        for (const route of routes) expect(CaltrainService.isSouthCounty(route[0])).toBe(true)
      })

      it('transfers to an electric train', () => {
        for (const route of routes) expect(CaltrainService.isSouthCounty(route[3])).toBe(false)
      })

      it('sorts trips by departure time', () => {
        for (let i = 1; i < routes.length; i++) expect(routes[i][1]).toBeGreaterThanOrEqual(routes[i - 1][1])
      })
    })
  })
})
