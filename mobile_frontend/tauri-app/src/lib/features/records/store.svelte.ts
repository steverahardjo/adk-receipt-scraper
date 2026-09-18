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

export function importEntries(incoming: Entry[]) {
  entries = [...incoming, ...entries]
}

export function replaceEntries(next: Entry[]) {
  entries = next
}

export function reassignCategory(from: string, to: string) {
  entries = entries.map((entry) => {
    if (entry.type === from) return { ...entry, type: to as Entry['type'] }
    if (entry.source === from) return { ...entry, source: to as Entry['source'] }
    return entry
  })
}
