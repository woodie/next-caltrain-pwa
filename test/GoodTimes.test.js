import { GoodTimes } from '../src/GoodTimes.js';
describe('GoodTimes', () => {
  let gt = new GoodTimes('2020-10-15T12:00:00');
  describe('.partTime()', () => {
    it('should return an array', () => {
      expect(GoodTimes.partTime(720)).toEqual(['12:00', 'pm']);
    });
  });
  describe('.fullTime()', () => {
    it('should return a string', () => {
      expect(GoodTimes.fullTime(720)).toEqual('12:00pm');
    });
  });
  describe('.dateString()', () => {
    it('should return a string', () => {
      expect(GoodTimes.dateString(0)).toEqual('Dec 31 1969');
    });
  });
  describe('#partTime()', () => {
    it('should return an array', () => {
      expect(gt.partTime()).toEqual(['12:00', 'pm']);
    });
  });
  describe('#fullTime()', () => {
    it('should return a string', () => {
      expect(gt.fullTime()).toEqual('12:00pm');
    });
  });
  describe('#inThePast()', () => {
    it('should identify minutes in the past and future', () => {
      expect(gt.inThePast(gt.minutes - 2)).toBe.true;
      expect(gt.inThePast(gt.minutes + 2)).toBe.false;
    });
  });
  describe('#departing()', () => {
    it('should identify a departing train', () => {
      expect(gt.departing(gt.minutes)).toBe.true;
    });
  });
  describe('#countdown()', () => {
    it('should provice a countdown', () => {
      expect(gt.countdown(gt.minutes + 66)).toEqual('in 1 hr 5 min');
    });
  });
  describe('#tomorrowDate', () => {
    it('should return the next calendar date', () => {
      // 2020-10-15T12:00 - 2hrs = 10:00am Thursday Oct 15; tomorrow = Oct 16
      expect(gt.tomorrowDate).toEqual('2020-10-16');
    });
  });
  describe('#tomorrowDotw', () => {
    it('should return the next day of the week', () => {
      // Thursday (4) -> Friday (5)
      expect(gt.tomorrowDotw).toEqual(5);
    });
    it('should wrap Sunday (0) to Monday (1)', () => {
      const sunday = new GoodTimes('2020-10-18T12:00:00'); // Sunday
      expect(sunday.dotw).toEqual(0);
      expect(sunday.tomorrowDotw).toEqual(1);
    });
    it('should compute Saturday (6) -> Sunday (0)', () => {
      const saturday = new GoodTimes('2020-10-17T12:00:00'); // Saturday
      expect(saturday.dotw).toEqual(6);
      expect(saturday.tomorrowDotw).toEqual(0);
    });
  });
});
