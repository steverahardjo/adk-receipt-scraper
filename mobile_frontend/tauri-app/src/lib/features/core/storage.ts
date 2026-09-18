type JsonValue = unknown

const PREFIX = 'deneb:'

let storePromise: Promise<import('@tauri-apps/plugin-store').Store | null> | null = null

async function getStore() {
  if (storePromise) return storePromise
  storePromise = (async () => {
    try {
      const { load } = await import('@tauri-apps/plugin-store')
      return await load('deneb.json', { defaults: {}, autoSave: false })
    } catch {
      return null
    }
  })()
  return storePromise
}

export function readSync<T>(key: string): T | null {
  if (typeof localStorage === 'undefined') return null
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export async function readValue<T>(key: string): Promise<T | null> {
  const store = await getStore()
  if (store) {
    try {
      const value = await store.get<T>(key)
      if (value !== undefined && value !== null) return value as T
    } catch {
      /* fall through to localStorage */
    }
  }
  return readSync<T>(key)
}

export async function writeValue(key: string, value: JsonValue): Promise<void> {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      /* quota or unavailable */
    }
  }
  const store = await getStore()
  if (store) {
    try {
      await store.set(key, value)
      await store.save()
    } catch {
      /* native store unavailable */
    }
  }
}

export async function removeValue(key: string): Promise<void> {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch {
      /* unavailable */
    }
  }
  const store = await getStore()
  if (store) {
    try {
      await store.delete(key)
      await store.save()
    } catch {
      /* unavailable */
    }
  }
}

export async function clearAll(): Promise<void> {
  if (typeof localStorage !== 'undefined') {
    try {
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith(PREFIX)) keys.push(key)
      }
      keys.forEach((key) => localStorage.removeItem(key))
    } catch {
      /* unavailable */
    }
  }
  const store = await getStore()
  if (store) {
    try {
      await store.clear()
      await store.save()
    } catch {
      /* unavailable */
    }
  }
}
