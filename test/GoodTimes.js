import { GoodTimes } from "../src/GoodTimes.js";
const expect = require("chai").expect;

describe("GoodTimes", () => {
  let gt = new GoodTimes("2020-10-15T12:00:00");

  describe(".partTime()", () => {
    it("should return an array", () => {
      expect(GoodTimes.partTime(720)).deep.to.equal(["12:00", "pm"]);
    });
  });

  describe(".fullTime()", () => {
    it("should return a string", () => {
      expect(GoodTimes.fullTime(720)).to.equal("12:00pm");
    });
  });

  describe(".dateString()", () => {
    it("should return a string", () => {
      expect(GoodTimes.dateString(0)).to.equal("Dec 31 1969");
    });
  });

  describe("#partTime()", () => {
    it("should return an array", () => {
      expect(gt.partTime()).deep.to.equal(["12:00", "pm"]);
    });
  });

  describe("#fullTime()", () => {
    it("should return a string", () => {
      expect(gt.fullTime()).to.equal("12:00pm");
    });
  });

  describe("#inThePast()", () => {
    it("should identify minutes in the past and future", () => {
      expect(gt.inThePast(gt.minutes - 2)).to.be.true;
      expect(gt.inThePast(gt.minutes + 2)).to.be.false;
    });
  });

  describe("#departing()", () => {
    it("should identify a departing train", () => {
      expect(gt.departing(gt.minutes)).to.be.true;
    });
  });

  describe("#countdown()", () => {
    it("should provice a countdown", () => {
      expect(gt.countdown(gt.minutes + 66)).to.eq("in 1 hr 5 min");
    });
  });
});
