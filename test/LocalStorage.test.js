import { LocalStorage } from "../src/LocalStorage.js";
import { caltrainServiceData } from "../src/@caltrainServiceData.js";
const sinon = require("sinon");

describe("LocalStorage", () => {
  sinon.stub(Date.prototype, "getHours").returns(10);
  let ls;

  beforeEach(() => {
    ls = new LocalStorage(caltrainServiceData.southStops);
  });

  describe("#tripLabels()", () => {
    it("should return trip labels", () => {
      expect(ls.tripLabels()).toEqual(["Palo Alto to", "San Francisco"]);
    });
  });

  describe("#flipStations()", () => {
    it("should flip stations", () => {
      ls.flipStations();
      expect(ls.tripLabels()).toEqual(["San Francisco", "to Palo Alto"]);
    });
  });

  describe("#bumpStations()", () => {
    it("should bump stations", () => {
      ls.bumpStations(true, true);
      expect(ls.tripLabels()).toEqual(["Menlo Park", "to San Francisco"]);
      ls.bumpStations(false, false);
      expect(ls.tripLabels()).toEqual(["Menlo Park", "to 22nd Street"]);
    });
  });
});
