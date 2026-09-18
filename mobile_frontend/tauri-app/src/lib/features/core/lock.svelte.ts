import { readSync, readValue, writeValue, removeValue } from './storage'

const CONFIG_KEY = 'lock-config'
const LOCK_TIMEOUT_MS = 5 * 60 * 1000
const PBKDF2_ITERATIONS = 100_000

export interface LockConfig {
  enabled: boolean
  biometric: boolean
  salt: string
  hash: string
  iterations: number
}

function toBase64(bytes: Uint8Array): string {
  let out = ''
  for (const byte of bytes) out += String.fromCharCode(byte)
  return btoa(out)
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function derive(passcode: string, salt: Uint8Array, iterations: number): Promise<string> {
  const subtle = globalThis.crypto?.subtle
  if (!subtle) throw new Error('Web Crypto unavailable')
  const keyMaterial = await subtle.importKey('raw', new TextEncoder().encode(passcode), 'PBKDF2', false, ['deriveBits'])
  const bits = await subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    256,
  )
  return toBase64(new Uint8Array(bits))
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function createLock() {
  const cached = readSync<LockConfig>(CONFIG_KEY)

  let config = $state<LockConfig | null>(cached)
  let enabled = $state(cached?.enabled ?? false)
  let biometricEnabled = $state(cached?.biometric ?? false)
  let locked = $state(cached?.enabled ?? false)
  let ready = $state(false)
  let biometricAvailable = $state(false)
  let hiddenAt: number | null = null

  async function init() {
    const stored = await readValue<LockConfig>(CONFIG_KEY)
    if (stored) {
      config = stored
      enabled = stored.enabled
      biometricEnabled = stored.biometric
      if (stored.enabled) locked = true
    }
    await refreshBiometric()
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibility)
    }
    ready = true
  }

  function onVisibility() {
    if (document.visibilityState === 'hidden') {
      hiddenAt = Date.now()
    } else if (hiddenAt !== null) {
      if (enabled && Date.now() - hiddenAt > LOCK_TIMEOUT_MS) locked = true
      hiddenAt = null
    }
  }

  async function refreshBiometric() {
    try {
      const { checkStatus } = await import('@tauri-apps/plugin-biometric')
      const status = await checkStatus()
      biometricAvailable = !!status.isAvailable
    } catch {
      biometricAvailable = false
    }
  }

  async function setPasscode(passcode: string) {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const hash = await derive(passcode, salt, PBKDF2_ITERATIONS)
    config = { enabled: true, biometric: biometricEnabled, salt: toBase64(salt), hash, iterations: PBKDF2_ITERATIONS }
    enabled = true
    locked = false
    await writeValue(CONFIG_KEY, config)
  }

  async function verifyPasscode(passcode: string): Promise<boolean> {
    const cfg = config ?? (await readValue<LockConfig>(CONFIG_KEY))
    if (!cfg) return false
    try {
      const hash = await derive(passcode, fromBase64(cfg.salt), cfg.iterations)
      return safeEqual(hash, cfg.hash)
    } catch {
      return false
    }
  }

  async function setBiometric(value: boolean) {
    biometricEnabled = value
    if (config) {
      config = { ...config, biometric: value }
      await writeValue(CONFIG_KEY, config)
    }
    if (value) await refreshBiometric()
  }

  async function tryBiometric(): Promise<boolean> {
    try {
      const { authenticate } = await import('@tauri-apps/plugin-biometric')
      await authenticate('Unlock Deneb', {
        allowDeviceCredential: true,
        title: 'Unlock Deneb',
        subtitle: 'Use your fingerprint to continue',
      })
      return true
    } catch {
      return false
    }
  }

  async function disable() {
    enabled = false
    locked = false
    biometricEnabled = false
    config = null
    await removeValue(CONFIG_KEY)
  }

  function lockNow() {
    if (enabled) locked = true
  }

  function unlock() {
    locked = false
  }

  return {
    get ready() { return ready },
    get enabled() { return enabled },
    get locked() { return locked },
    get biometricEnabled() { return biometricEnabled },
    get biometricAvailable() { return biometricAvailable },
    init,
    setPasscode,
    verifyPasscode,
    setBiometric,
    tryBiometric,
    disable,
    lockNow,
    unlock,
    refreshBiometric,
  }
}

export const lock = createLock()
