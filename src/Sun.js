// Palo Alto, mid-line: sunrise and sunset differ by only a few minutes from San Francisco to Gilroy.
const LATITUDE = 37.44
const LONGITUDE = -122.14
const RADIANS = Math.PI / 180

export class Sun {
  /**
   * Sunrise and sunset on the Pacific date of `now`, from NOAA's solar equations.
   * @return {sunrise: Date, sunset: Date}
   */
  static times (now = new Date()) {
    // UTC minus eight hours keeps the Pacific date without relying on the phone's time zone.
    const pacific = new Date(now.getTime() - 8 * 60 * 60 * 1000)
    const year = pacific.getUTCFullYear()
    const month = pacific.getUTCMonth()
    const day = pacific.getUTCDate()
    const dayOfYear = (Date.UTC(year, month, day) - Date.UTC(year, 0, 0)) / 86400000
    const g = (2 * Math.PI / 365) * (dayOfYear - 1)
    const equationOfTime = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) -
      0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g))
    const declination = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) -
      0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) -
      0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g)
    const lat = LATITUDE * RADIANS
    const hourAngle = Math.acos(Math.cos(90.833 * RADIANS) / (Math.cos(lat) * Math.cos(declination)) -
      Math.tan(lat) * Math.tan(declination)) / RADIANS
    const utcMinutes = (sign) => 720 - 4 * (LONGITUDE + sign * hourAngle) - equationOfTime
    return {
      sunrise: new Date(Date.UTC(year, month, day, 0, utcMinutes(1))),
      sunset: new Date(Date.UTC(year, month, day, 0, utcMinutes(-1))),
    }
  }

  static isDark (now = new Date()) {
    const { sunrise, sunset } = Sun.times(now)
    return now < sunrise || now >= sunset
  }
}
