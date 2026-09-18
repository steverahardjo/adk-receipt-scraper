export type Theme = 'light' | 'dark'
export type ThemeMode = 'system' | 'light' | 'dark'

function createTheme() {
  let mode = $state<ThemeMode>('system')
  let current = $state<Theme>('light')
  let media: MediaQueryList | null = null

  function resolve(): Theme {
    if (mode === 'system') return media?.matches ? 'dark' : 'light'
    return mode
  }

  function apply() {
    current = resolve()
    document.documentElement.classList.toggle('dark', current === 'dark')
    document.documentElement.style.colorScheme = current
  }

  function init() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('deneb-theme-mode')
      if (stored === 'system' || stored === 'light' || stored === 'dark') {
        mode = stored
      } else {
        const legacy = localStorage.getItem('deneb-theme')
        if (legacy === 'light' || legacy === 'dark') mode = legacy
      }
    }
    if (typeof window !== 'undefined') {
      media = window.matchMedia('(prefers-color-scheme: dark)')
      media.addEventListener('change', () => { if (mode === 'system') apply() })
    }
    apply()
  }

  function setMode(next: ThemeMode) {
    mode = next
    localStorage.setItem('deneb-theme-mode', next)
    apply()
  }

  function toggle() {
    setMode(current === 'light' ? 'dark' : 'light')
  }

  return {
    get mode() { return mode },
    get current() { return current },
    init,
    setMode,
    toggle,
  }
}

export const theme = createTheme()
