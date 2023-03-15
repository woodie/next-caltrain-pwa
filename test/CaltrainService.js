import { CaltrainService } from '../src/CaltrainService.js';
const expect = require('chai').expect;

describe('CaltrainService', () => {
  const cs = new CaltrainService();

  describe('.mapStops()', () => {
    it('should contain stations', () => {
      let mapStops = CaltrainService.mapStops('North');
      expect(mapStops.has('Gilroy')).to.be.true;
      expect(mapStops.has('San Francisco')).to.be.true;
    });
  });

  describe('#tripStops()', () => {
    it('should contain stations', () => {
      let tripStops = CaltrainService.tripStops(101, 'North', 'Weekday');
      expect(tripStops[0]).to.contain('Tamien');
      expect(tripStops[tripStops.length - 1]).to.contain('San Francisco');
    });
  });

  // static direction (departStop, arriveStop) {
  // static nextIndex (routes, minutes) {
  // static merge (departTimes, arriveTimes, skip) {
  // static select (direction, schedule) {

  describe('.stopMap()', () => {
    it('should contain stations', () => {
      expect(cs.stopMap().has('Gilroy')).to.be.true;
      expect(cs.stopMap().has('San Francisco')).to.be.true;
    });
  });

  // routes (departStop, arriveStop, schedule) {
  // times (stop, direction, schedule) {

});




