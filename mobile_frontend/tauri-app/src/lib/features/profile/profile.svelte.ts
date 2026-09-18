import { readValue, writeValue } from '$lib/features/core/storage'

export interface Profile {
  name: string
  email: string
  phone: string
  dob: string
  country: string
  avatar: string
}

const KEY = 'profile'

const defaults: Profile = {
  name: 'Alex Tan',
  email: 'alex.tan@example.com',
  phone: '+60 12-345 6789',
  dob: '',
  country: 'Malaysia',
  avatar: '',
}

function createProfile() {
  let profile = $state<Profile>({ ...defaults })
  let ready = $state(false)

  function initials(name = profile.name) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return '?'
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase()
  }

  async function init() {
    const stored = await readValue<Profile>(KEY)
    if (stored) profile = { ...defaults, ...stored }
    ready = true
  }

  async function update(patch: Partial<Profile>) {
    profile = { ...profile, ...patch }
    await writeValue(KEY, profile)
  }

  return {
    get value() { return profile },
    get ready() { return ready },
    get initials() { return initials() },
    init,
    update,
  }
}

export const profile = createProfile()
