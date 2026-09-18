import { readValue, writeValue } from '$lib/features/core/storage'

export interface Session {
  id: string
  device: string
  location: string
  lastActive: string
  current: boolean
}

const KEY = 'sessions'

const defaults: Session[] = [
  { id: 's1', device: 'iPhone 15 Pro', location: 'Kuala Lumpur, MY', lastActive: 'Active now', current: true },
  { id: 's2', device: 'Chrome on macOS', location: 'Singapore', lastActive: '2 hours ago', current: false },
  { id: 's3', device: 'Android Tablet', location: 'Jakarta, ID', lastActive: '3 days ago', current: false },
]

function createSessions() {
  let items = $state<Session[]>(structuredClone(defaults))
  let ready = $state(false)

  async function init() {
    const stored = await readValue<Session[]>(KEY)
    if (stored) items = stored
    ready = true
  }

  async function persist() {
    await writeValue(KEY, items)
  }

  async function revoke(id: string) {
    items = items.filter((s) => s.id !== id || s.current)
    await persist()
  }

  async function signOutOthers() {
    items = items.filter((s) => s.current)
    await persist()
  }

  return {
    get value() { return items },
    get ready() { return ready },
    init,
    revoke,
    signOutOthers,
  }
}

export const sessions = createSessions()
