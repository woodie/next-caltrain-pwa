// The live schedule, built from Caltrain's GTFS by next-caltrain-react.
const FEED_URL = 'https://next-caltrain-app.appspot.com/feed/schedule.json'
const FEED_CACHE_KEY = 'scheduleFeed'

// Populated once by ScheduleFeed.load(), before anything else reads it.
export const scheduleData = {}

export class ScheduleFeed {
  static load (data) {
    Object.assign(scheduleData, data)
    return scheduleData
  }

  /**
   * Fetch the feed, keeping the last good copy so the app still works offline.
   * @return Promise resolving to scheduleData
   */
  static fetch () {
    return fetch(FEED_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`${FEED_URL}: ${response.status}`)
        return response.text()
      })
      .then((text) => {
        const data = JSON.parse(text)
        try {
          localStorage.setItem(FEED_CACHE_KEY, text)
        } catch (error) {
          console.log(error)
        }
        return ScheduleFeed.load(data)
      })
      .catch((error) => {
        const cached = localStorage.getItem(FEED_CACHE_KEY)
        if (cached === null) throw error
        console.log(error)
        return ScheduleFeed.load(JSON.parse(cached))
      })
  }
}
