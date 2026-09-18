import type { Entry } from './types'
import { generateEntries } from './mockdata'

// In-memory session store. Swap for the persistence layer when the API lands.
let entries = $state<Entry[]>(generateEntries(200))

export function getEntries(): Entry[] {
  return entries
}

export function addEntry(entry: Entry) {
  entries = [entry, ...entries]
}
