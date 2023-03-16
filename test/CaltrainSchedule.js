import { GoodTimes } from '../src/GoodTimes.js';
import { CaltrainSchedule } from '../src/CaltrainSchedule.js';
const expect = require('chai').expect;

describe('CaltrainSchedule', () => {
  const gt = new GoodTimes('2020-10-15T08:10:10');
  const ct = new CaltrainSchedule(gt);

  describe('.optionIndex()', () => {
    it('should return option index', () => {
      expect(CaltrainSchedule.optionIndex(gt)).to.eq(0);
    });
  });

  describe('#label()', () => {
    it('should return label', () => {
      expect(ct.label()).to.eq('Weekday');
    });
  });

  describe('#next()', () => {
    it('should increment seleted', () => {
      expect(ct.selected).to.eq(0);
      ct.next();
      expect(ct.selected).to.eq(1);
    });
  });

  describe('#swapped()', () => {
    it('should return true', () => {
      expect(ct.swapped()).to.be.true;
    });
  });
});
