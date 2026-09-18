import { readValue, writeValue } from '$lib/features/core/storage'

export type ConnectionKind = 'bank' | 'investment' | 'service'
export type ConnectionStatus = 'connected' | 'error' | 'syncing'

export interface Connection {
  id: string
  kind: ConnectionKind
  name: string
  status: ConnectionStatus
  lastSync: string
  permissions: string[]
}

const KEY = 'connections'

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `conn-${Date.now()}`
}

const defaults: Connection[] = [
  { id: 'b1', kind: 'bank', name: 'BCA', status: 'connected', lastSync: '2 hours ago', permissions: ['Balances', 'Transactions'] },
  { id: 'b2', kind: 'bank', name: 'Mandiri', status: 'connected', lastSync: 'Yesterday', permissions: ['Balances', 'Transactions'] },
  { id: 'i1', kind: 'investment', name: 'Bibit', status: 'connected', lastSync: '1 day ago', permissions: ['Portfolio (read-only)'] },
  { id: 's1', kind: 'service', name: 'GoPay', status: 'connected', lastSync: '30 minutes ago', permissions: ['Wallet balance'] },
]

function createConnections() {
  let items = $state<Connection[]>(structuredClone(defaults))
  let ready = $state(false)

  async function init() {
    const stored = await readValue<Connection[]>(KEY)
    if (stored) items = stored
    ready = true
  }

  async function persist() {
    await writeValue(KEY, items)
  }

  function list(kind: ConnectionKind) {
    return items.filter((c) => c.kind === kind)
  }

  async function sync(id: string) {
    items = items.map((c) => (c.id === id ? { ...c, status: 'syncing' as const } : c))
    await new Promise((r) => setTimeout(r, 900))
    items = items.map((c) => (c.id === id ? { ...c, status: 'connected' as const, lastSync: 'Just now' } : c))
    await persist()
  }

  async function disconnect(id: string) {
    items = items.filter((c) => c.id !== id)
    await persist()
  }

  async function connect(input: { kind: ConnectionKind; name: string }) {
    items = [...items, { id: uid(), status: 'connected', lastSync: 'Just now', permissions: ['Read-only'], ...input }]
    await persist()
  }

  return {
    get value() { return items },
    get ready() { return ready },
    init,
    list,
    sync,
    disconnect,
    connect,
  }
}

export const connections = createConnections()
