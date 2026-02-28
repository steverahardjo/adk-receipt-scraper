import { ref, watch, onMounted } from 'vue'

const DARK_MODE_CLASS = 'dark-mode'
const DARK_MODE_STORAGE_KEY = 'darkMode'

/**
 * Composable for managing dark mode state with PrimeVue integration.
 * Handles initialization, persistence, and flash prevention.
 */
export function useDarkMode() {
  /**
   * Get initial dark mode state from localStorage or system preference.
   * This runs synchronously to prevent flash of wrong theme.
   */
  const getInitialDarkMode = (): boolean => {
    // Check localStorage first (user preference)
    const saved = localStorage.getItem(DARK_MODE_STORAGE_KEY)
    if (saved !== null) {
      return saved === 'true'
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // Initialize state immediately to prevent flash
  const isDarkMode = ref(getInitialDarkMode())

  /**
   * Apply dark mode class to document element.
   * Called immediately on mount and whenever isDarkMode changes.
   */
  const applyDarkMode = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add(DARK_MODE_CLASS)
    } else {
      document.documentElement.classList.remove(DARK_MODE_CLASS)
    }
  }

  /**
   * Toggle dark mode state.
   * Automatically persists to localStorage and updates DOM.
   */
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  /**
   * Set dark mode state explicitly.
   * @param dark - Whether to enable dark mode
   */
  const setDarkMode = (dark: boolean) => {
    isDarkMode.value = dark
  }

  // Watch for changes and persist to localStorage + update DOM
  watch(isDarkMode, (dark) => {
    localStorage.setItem(DARK_MODE_STORAGE_KEY, String(dark))
    applyDarkMode(dark)
  })

  // Apply initial state on mount (ensures SSR/hydration compatibility)
  onMounted(() => {
    applyDarkMode(isDarkMode.value)
  })

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
  }
}
