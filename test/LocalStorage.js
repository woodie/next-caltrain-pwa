import { LocalStorage } from '../src/LocalStorage.js';
import { caltrainServiceData } from '../src/@caltrainServiceData.js';
const expect = require('chai').expect;

describe('LocalStorage', () => {
  const ls = new LocalStorage(caltrainServiceData.southStops);

  describe('#tripLabels()', () => {
    it('should return trip labels', () => {
      expect(ls.tripLabels()).deep.to.eq(['Palo Alto to', 'San Francisco']);
    });
  });

  describe('#flipStations()', () => {
    it('should flip stations', () => {
      ls.flipStations();
      expect(ls.tripLabels()).deep.to.eq(['San Francisco', 'to Palo Alto']);
    });
  });

  describe('#bumpStations()', () => {
    it('should bump stations', () => {
      ls.bumpStations(true, true);
      expect(ls.tripLabels()).deep.to.eq(['Gilroy', 'to Palo Alto']);
      ls.bumpStations(false, false);
      expect(ls.tripLabels()).deep.to.eq(['Gilroy to', 'California Ave']);
    });
  });
});
