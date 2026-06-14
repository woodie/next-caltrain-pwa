import { CaltrainService } from '../src/CaltrainService.js';
describe('CaltrainService', () => {
  let schedule = 'Weekday';
  let direction = 'North';
  let departStop = 0;
  let arriveStop = 6;
  let routes = [];
  let skip = [];
  let minutes = 700;
  let train = 101;
  const cs = new CaltrainService();
  let departTimes = cs.times(departStop, direction, schedule);
  let arriveTimes = cs.times(arriveStop, direction, schedule);
  describe('.mapStops()', () => {
    let mapStops = CaltrainService.mapStops(direction);
    it('should contain stations', () => {
      expect(mapStops.has('Gilroy')).toBe(true);
      expect(mapStops.has('San Francisco')).toBe(true);
    });
  });
  describe('.tripStops()', () => {
    let tripStops = CaltrainService.tripStops(train, direction, schedule);
    it('should contain stations', () => {
      expect(tripStops[0]).toContain('Tamien');
      expect(tripStops[tripStops.length - 1]).toContain('San Francisco');
    });
  });
  describe('.direction()', () => {
    let direction = CaltrainService.direction(departStop, arriveStop);
    it('should be North', () => {
      expect(direction).toEqual('North');
    });
  });
  describe('.nextIndex()', () => {
    let nextIndex = CaltrainService.nextIndex(routes, minutes);
    it('should be zero', () => {
      expect(nextIndex).toEqual(0);
    });
  });
  describe('.merge()', () => {
    let merge = CaltrainService.merge(departTimes, arriveTimes, skip);
    it('should be empty', () => {
      expect(merge).toEqual([]);
    });
  });
  describe('.select()', () => {
    let select = CaltrainService.select(direction, schedule);
    it('should have empty members', () => {
      expect(select['101'][0]).toBeUndefined();
    });
  });
  describe('#stopMap()', () => {
    it('should contain stations', () => {
      expect(cs.stopMap('North').has('Gilroy')).toBe(true);
      expect(cs.stopMap('North').has('San Francisco')).toBe(true);
    });
  });
  describe('#routes()', () => {
    it('should be empty for unknown station', () => {
      let routes = cs.routes('Unknown', 'Palo Alto', 'Weekday');
      expect(routes).toEqual([]);
    });
  });
  describe('#times()', () => {
    it('should be empty for unknown stop', () => {
      let times = cs.times('Unknown Stop', 'North', 'Weekday');
      expect(times.size).toEqual(0);
    });
  });

  describe('.isSouthCounty()', () => {
    it('should return true for South County trains (801-900)', () => {
      expect(CaltrainService.isSouthCounty(801)).toBe(true);
      expect(CaltrainService.isSouthCounty(814)).toBe(true);
      expect(CaltrainService.isSouthCounty(900)).toBe(true);
    });
    it('should return false for electric trains', () => {
      expect(CaltrainService.isSouthCounty(101)).toBe(false);
      expect(CaltrainService.isSouthCounty(514)).toBe(false);
    });
  });

  describe('#routes() transfer routes', () => {
    describe('southbound SF -> Gilroy on Weekday', () => {
      let routes;
      beforeEach(() => {
        routes = cs.routes('San Francisco', 'Gilroy', 'Weekday');
      });
      it('should return trips', () => {
        expect(routes.length).toBeGreaterThan(0);
      });
      it('each route should be a 5-element transfer array', () => {
        for (const route of routes) {
          expect(route.length).toEqual(5);
        }
      });
      it('lead train should be an electric (non-South County)', () => {
        for (const route of routes) {
          expect(CaltrainService.isSouthCounty(route[0])).toBe(false);
        }
      });
      it('second train should be a South County train', () => {
        for (const route of routes) {
          expect(CaltrainService.isSouthCounty(route[3])).toBe(true);
        }
      });
      it('transfer depart should be >= electric arrive at SJD', () => {
        for (const route of routes) {
          expect(route[4]).toBeGreaterThanOrEqual(route[1]);
        }
      });
      it('trips should be sorted by departure time', () => {
        for (let i = 1; i < routes.length; i++) {
          expect(routes[i][1]).toBeGreaterThanOrEqual(routes[i - 1][1]);
        }
      });
    });

    describe('northbound Gilroy -> SF on Weekday', () => {
      let routes;
      beforeEach(() => {
        routes = cs.routes('Gilroy', 'San Francisco', 'Weekday');
      });
      it('should return trips', () => {
        expect(routes.length).toBeGreaterThan(0);
      });
      it('each route should be a 5-element transfer array', () => {
        for (const route of routes) {
          expect(route.length).toEqual(5);
        }
      });
      it('lead train should be a South County train', () => {
        for (const route of routes) {
          expect(CaltrainService.isSouthCounty(route[0])).toBe(true);
        }
      });
      it('second train should be an electric', () => {
        for (const route of routes) {
          expect(CaltrainService.isSouthCounty(route[3])).toBe(false);
        }
      });
      it('trips should be sorted by departure time', () => {
        for (let i = 1; i < routes.length; i++) {
          expect(routes[i][1]).toBeGreaterThanOrEqual(routes[i - 1][1]);
        }
      });
    });

    describe('SF -> Gilroy on Weekend', () => {
      it('should return no trips (no South County weekend service)', () => {
        const routes = cs.routes('San Francisco', 'Gilroy', 'Weekend');
        expect(routes.length).toEqual(0);
      });
    });

    describe('direct route SF -> Palo Alto on Weekday', () => {
      it('should return 3-element direct arrays (no transfer)', () => {
        const routes = cs.routes('San Francisco', 'Palo Alto', 'Weekday');
        expect(routes.length).toBeGreaterThan(0);
        for (const route of routes) {
          expect(route.length).toEqual(3);
        }
      });
    });

    describe('Morgan Hill -> Gilroy on Weekday', () => {
      it('should return direct trips (both South County, no transfer needed)', () => {
        const routes = cs.routes('Morgan Hill', 'Gilroy', 'Weekday');
        expect(routes.length).toBeGreaterThan(0);
        for (const route of routes) {
          expect(route.length).toEqual(3);
        }
      });
    });
  });
});
