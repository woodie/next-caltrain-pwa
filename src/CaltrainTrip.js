import { caltrainServiceData } from './@caltrainServiceData.js'
import { CaltrainService } from './CaltrainService.js'

// Caltrain numbers trains by service: the first digit is the type
// (100s weekday Local, 600s weekend Local, ...), the last digit's parity the direction.
const trainTypes = {
  1: 'Local',
  4: 'Limited',
  5: 'Express',
  6: 'Local',
  8: 'South County',
  9: 'Special'
}

export class CaltrainTrip {
  /**
   * A train with times for each station stop.
   * @param trip the trip ID
   * @param schedule string
   * @return a list of service stops.
   */
  constructor (trip, schedule) {
    this.trip = trip
    this.schedule = schedule
    this.stops = []
    this.times = []
    this.direction = trip % 2 === 0 ? 'South' : 'North'
    this.setService()
  }

  /**
   * Set the time and station name for a trip ID.
   */
  setService () {
    const mins = CaltrainService.tripStops(
      this.trip,
      this.direction,
      this.schedule
    )
    const strs =
      this.direction === 'North'
        ? caltrainServiceData.northStops
        : caltrainServiceData.southStops
    this.times = []
    this.stops = []
    // populate instance
    for (let i = 0; i < mins.length; i++) {
      if (mins[i] == null) continue
      this.times.push(mins[i])
      this.stops.push(strs[i])
    }
  }

  static type (trip) {
    return trainTypes[Math.floor(trip / 100)] ?? 'Unknown'
  }

  label () {
    return `${this.directionString()} #${this.trip} ${CaltrainTrip.type(
      this.trip
    )}`
  }

  directionString () {
    return this.direction[0] + 'B'
  }
}
