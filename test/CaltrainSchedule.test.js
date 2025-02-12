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
});
