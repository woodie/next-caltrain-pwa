import { CaltrainTrip } from "../src/CaltrainTrip.js";

describe("CaltrainTrip", () => {
  const ct = new CaltrainTrip(101, "Weekday");

  describe(".type()", () => {
    it("should return correct types", () => {
      expect(CaltrainTrip.type(701)).toEqual("Baby Bullet");
      expect(CaltrainTrip.type(301)).toEqual("Limited");
      expect(CaltrainTrip.type(101)).toEqual("Local");
    });
  });

  describe("#label()", () => {
    it("should return correct types", () => {
      expect(ct.label()).toEqual("NB #101 Local");
    });
  });

  describe("#directionString()", () => {
    it("should return correct types", () => {
      expect(ct.directionString()).toEqual("NB");
    });
  });
});
