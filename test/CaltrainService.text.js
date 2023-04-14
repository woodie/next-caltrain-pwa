import { CaltrainService } from "../src/CaltrainService.js";
const expect = require("chai").expect;

describe("CaltrainService", () => {
  let schedule = "Weekday";
  let direction = "North";
  let departStop = 0;
  let arriveStop = 6;
  let routes = [];
  let skip = [];
  let minutes = 700;
  let train = 101;

  const cs = new CaltrainService();
  let departTimes = cs.times(departStop, direction, schedule);
  let arriveTimes = cs.times(arriveStop, direction, schedule);

  describe(".mapStops()", () => {
    let mapStops = CaltrainService.mapStops(direction);

    it("should contain stations", () => {
      expect(mapStops.has("Gilroy")).to.be.true;
      expect(mapStops.has("San Francisco")).to.be.true;
    });
  });

  describe(".tripStops()", () => {
    let tripStops = CaltrainService.tripStops(train, direction, schedule);

    it("should contain stations", () => {
      expect(tripStops[0]).to.contain("Tamien");
      expect(tripStops[tripStops.length - 1]).to.contain("San Francisco");
    });
  });

  describe(".direction()", () => {
    let direction = CaltrainService.direction(departStop, arriveStop);

    it("should be North", () => {
      expect(direction).to.eq("North");
    });
  });

  describe(".nextIndex()", () => {
    let nextIndex = CaltrainService.nextIndex(routes, minutes);

    it("should be zero", () => {
      expect(nextIndex).to.eq(0);
    });
  });

  describe(".merge()", () => {
    let merge = CaltrainService.merge(departTimes, arriveTimes, skip);

    it("should be empty", () => {
      expect(merge).to.be.empty;
    });
  });

  describe(".select()", () => {
    let select = CaltrainService.select(direction, schedule);

    it("should have empty members", () => {
      expect(select["101"][0]).to.be.undefined;
    });
  });

  describe("#stopMap()", () => {
    it("should contain stations", () => {
      expect(cs.stopMap().has("Gilroy")).to.be.true;
      expect(cs.stopMap().has("San Francisco")).to.be.true;
    });
  });

  describe("#routes()", () => {
    it("should be empty", () => {
      let routes = cs.routes(0, 0, "Weekday");
      expect(routes).to.be.empty;
    });
  });

  describe("#times()", () => {
    it("should be empty", () => {
      let times = cs.times(0, "North", "Weekday");
      expect(times).to.be.empty;
    });
  });
});
