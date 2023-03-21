import { LocalStorage } from "../src/LocalStorage.js";
import { caltrainServiceData } from "../src/@caltrainServiceData.js";
const expect = require("chai").expect;
const sinon = require("sinon");

describe("LocalStorage", () => {
  sinon.stub(Date.prototype, "getHours").returns(10);
  let ls;

  beforeEach(() => {
    ls = new LocalStorage(caltrainServiceData.southStops);
  });

  describe("#tripLabels()", () => {
    it("should return trip labels", () => {
      expect(ls.tripLabels()).deep.to.eq(["Palo Alto to", "San Francisco"]);
    });
  });

  describe("#flipStations()", () => {
    it("should flip stations", () => {
      ls.flipStations();
      expect(ls.tripLabels()).deep.to.eq(["San Francisco", "to Palo Alto"]);
    });
  });

  describe("#bumpStations()", () => {
    it("should bump stations", () => {
      ls.bumpStations(true, true);
      expect(ls.tripLabels()).deep.to.eq(["Menlo Park", "to San Francisco"]);
      ls.bumpStations(false, false);
      expect(ls.tripLabels()).deep.to.eq(["Menlo Park", "to 22nd Street"]);
    });
  });
});
