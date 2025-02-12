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
      expect(mapStops.has('Gilroy')).toBe.true;
      expect(mapStops.has('San Francisco')).toBe.true;
    });
  });

  describe('.tripStops()', () => {
    let tripStops = CaltrainService.tripStops(train, direction, schedule);

    it('should contain stations', () => {
      expect(tripStops[0]).to.contain('Tamien');
      expect(tripStops[tripStops.length - 1]).to.contain('San Francisco');
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
      expect(merge).toBe.empty;
    });
  });

  describe('.select()', () => {
    let select = CaltrainService.select(direction, schedule);

    it('should have empty members', () => {
      expect(select['101'][0]).toBe.undefined;
    });
  });

  describe('#stopMap()', () => {
    it('should contain stations', () => {
      expect(cs.stopMap().has('Gilroy')).toBe.true;
      expect(cs.stopMap().has('San Francisco')).toBe.true;
    });
  });

  describe('#routes()', () => {
    it('should be empty', () => {
      let routes = cs.routes(0, 0, 'Weekday');
      expect(routes).toBe.empty;
    });
  });

  describe('#times()', () => {
    it('should be empty', () => {
      let times = cs.times(0, 'North', 'Weekday');
      expect(times).toBe.empty;
    });
  });
});
