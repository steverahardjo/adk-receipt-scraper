export type Theme = 'light' | 'dark'

function createTheme() {
  let current = $state<Theme>('light')

  function init() {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('deneb-theme') : null
    if (stored === 'light' || stored === 'dark') {
      current = stored
    } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      current = 'dark'
    }
    apply(current)
  }

  function apply(theme: Theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
  }

  function toggle() {
    current = current === 'light' ? 'dark' : 'light'
    localStorage.setItem('deneb-theme', current)
    apply(current)
  }

  return {
    get current() { return current },
    init,
    toggle,
  }
}

export const theme = createTheme()
