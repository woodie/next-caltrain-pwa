import { CaltrainTrip } from '../src/CaltrainTrip.js';
const expect = require('chai').expect;

describe('CaltrainTrip', () => {
  const ct = new CaltrainTrip(101, 'Weekday');

  describe('.type()', () => {
    it('should return correct types', () => {
      expect(CaltrainTrip.type(701)).to.equal('Baby Bullet');
      expect(CaltrainTrip.type(301)).to.equal('Limited');
      expect(CaltrainTrip.type(101)).to.equal('Local');
    });
  });

  describe('#label()', () => {
    it('should return correct types', () => {
      expect(ct.label()).to.eq('NB #101 Local');
    });
  });

  describe('#directionString()', () => {
    it('should return correct types', () => {
      expect(ct.directionString()).to.eq('NB');
    });
  });
});
