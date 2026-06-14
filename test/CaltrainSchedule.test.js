import { GoodTimes } from '../src/GoodTimes.js';
import { CaltrainSchedule } from '../src/CaltrainSchedule.js';
describe('CaltrainSchedule', () => {
  const gt = new GoodTimes('2020-10-15T08:10:10');
  const ct = new CaltrainSchedule(gt);
  describe('.optionIndex()', () => {
    it('should return option index', () => {
      expect(CaltrainSchedule.optionIndex(gt)).toEqual(0);
    });
  });
  describe('.optionIndexFor()', () => {
    it('should return 0 for a weekday', () => {
      expect(CaltrainSchedule.optionIndexFor('2020-10-15', 4)).toEqual(0); // Thursday
    });
    it('should return 1 for Saturday', () => {
      expect(CaltrainSchedule.optionIndexFor('2020-10-17', 6)).toEqual(1);
    });
    it('should return 1 for Sunday', () => {
      expect(CaltrainSchedule.optionIndexFor('2020-10-18', 0)).toEqual(1);
    });
    it('should return 2 for a special/holiday date', () => {
      expect(CaltrainSchedule.optionIndexFor('2025-11-28', 5)).toEqual(2);
    });
  });
  describe('#label()', () => {
    it('should return label', () => {
      expect(ct.label()).toEqual('Weekday');
    });
  });
  describe('#next()', () => {
    it('should increment seleted', () => {
      expect(ct.selected).toEqual(0);
      ct.next();
      expect(ct.selected).toEqual(1);
    });
  });
  describe('#swapped()', () => {
    it('should return true', () => {
      expect(ct.swapped()).toBe.true;
    });
  });
  describe('#tomorrowLabel()', () => {
    it('should return Weekday for Thursday -> Friday', () => {
      const thursday = new GoodTimes('2020-10-15T12:00:00');
      const cs = new CaltrainSchedule(thursday);
      expect(cs.tomorrowLabel(thursday)).toEqual('Weekday');
    });
    it('should return Weekend for Friday -> Saturday', () => {
      const friday = new GoodTimes('2020-10-16T12:00:00');
      const cs = new CaltrainSchedule(friday);
      expect(cs.tomorrowLabel(friday)).toEqual('Weekend');
    });
    it('should return Weekday for Sunday -> Monday', () => {
      const sunday = new GoodTimes('2020-10-18T12:00:00');
      const cs = new CaltrainSchedule(sunday);
      expect(cs.tomorrowLabel(sunday)).toEqual('Weekday');
    });
  });
});
