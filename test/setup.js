import { readFileSync } from 'node:fs'
import { ScheduleFeed } from '../src/ScheduleFeed.js'

// Tests run against the committed feed, the same file the app fetches.
ScheduleFeed.load(JSON.parse(readFileSync('test/fixtures/schedule.json', 'utf8')))
