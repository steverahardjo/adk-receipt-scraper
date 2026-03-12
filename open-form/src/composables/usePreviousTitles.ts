import { ref, readonly } from 'vue'

const STORAGE_KEY = 'expense_title_history'
const MAX_TITLES = 20

const loadTitles = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveTitles = (titles: string[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(titles))
}

// Reactive state
const previousTitles = ref<string[]>(loadTitles())

export function usePreviousTitles() {
  const addTitle = (title: string): void => {
    const trimmed = title.trim()
    if (!trimmed) return

    const filtered = previousTitles.value.filter(t => t.toLowerCase() !== trimmed.toLowerCase())
    const updated = [trimmed, ...filtered].slice(0, MAX_TITLES)
    previousTitles.value = updated
    saveTitles(updated)
  }

  const removeTitle = (title: string): void => {
    const filtered = previousTitles.value.filter(t => t !== title)
    previousTitles.value = filtered
    saveTitles(filtered)
  }

  const clearTitles = (): void => {
    previousTitles.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    previousTitles: readonly(previousTitles),
    addTitle,
    removeTitle,
    clearTitles,
  }
}
