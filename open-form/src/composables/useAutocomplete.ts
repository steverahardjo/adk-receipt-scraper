/**
 * Composable for using autocomplete in Vue components
 */

import { ref, watch, type Ref } from 'vue'
import { autocompleteService, SAMPLE_EXPENSE_WORDS, type AutocompleteSuggestion } from '@/services/autocomplete/service'

export interface UseAutocompleteOptions {
  /** Minimum characters before triggering autocomplete */
  minLength?: number
  /** Debounce delay in milliseconds */
  debounceMs?: number
  /** Maximum number of suggestions to show */
  maxSuggestions?: number
  /** Whether to use Wheeler fuzzy matching */
  useWheeler?: boolean
}

export function useAutocomplete(
  inputRef: Ref<string>,
  options: UseAutocompleteOptions = {}
) {
  const {
    minLength = 2,
    debounceMs = 150,
    maxSuggestions = 5,
    useWheeler = true
  } = options

  const suggestions = ref<AutocompleteSuggestion[]>([])
  const isLoading = ref(false)
  const isOpen = ref(false)
  const selectedIndex = ref(-1)
  const isInitialized = ref(false)

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * Initialize the autocomplete service
   */
  async function initialize() {
    if (isInitialized.value) return

    try {
      await autocompleteService.initialize()
      // Load sample words
      await autocompleteService.loadWordsJson(SAMPLE_EXPENSE_WORDS)
      isInitialized.value = true
      console.log('[useAutocomplete] Initialized with', autocompleteService.getWordCount(), 'words')
    } catch (error) {
      console.error('[useAutocomplete] Initialization failed:', error)
    }
  }

  /**
   * Query for suggestions
   */
  function querySuggestions() {
    const query = inputRef.value?.trim() || ''

    if (query.length < minLength) {
      suggestions.value = []
      isOpen.value = false
      selectedIndex.value = -1
      return
    }

    isLoading.value = true

    // Debounce the query
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      try {
        const results = useWheeler
          ? autocompleteService.query(query, maxSuggestions)
          : autocompleteService.queryProtobuf(query, maxSuggestions, false, 0)

        suggestions.value = results
        isOpen.value = results.length > 0
        selectedIndex.value = -1
        console.log('[useAutocomplete] Query:', query, '->', results.length, 'suggestions')
      } catch (error) {
        console.error('[useAutocomplete] Query failed:', error)
        suggestions.value = []
      } finally {
        isLoading.value = false
      }
    }, debounceMs)
  }

  /**
   * Select a suggestion
   */
  function selectSuggestion(index: number) {
    if (index < 0 || index >= suggestions.value.length) return

    const suggestion = suggestions.value[index]
    if (!suggestion) return
    
    inputRef.value = suggestion.term
    suggestions.value = []
    isOpen.value = false
    selectedIndex.value = -1
  }

  /**
   * Navigate suggestions with keyboard
   */
  function navigateSuggestions(direction: 'up' | 'down') {
    if (!isOpen.value || suggestions.value.length === 0) return

    if (direction === 'down') {
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
    } else {
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
    }
  }

  /**
   * Close the suggestions dropdown
   */
  function close() {
    isOpen.value = false
    selectedIndex.value = -1
  }

  /**
   * Open the suggestions dropdown
   */
  function open() {
    if (inputRef.value?.length >= minLength) {
      querySuggestions()
    }
  }

  /**
   * Handle input keydown events
   */
  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen.value) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        navigateSuggestions('down')
        break
      case 'ArrowUp':
        event.preventDefault()
        navigateSuggestions('up')
        break
      case 'Enter':
        if (selectedIndex.value >= 0) {
          event.preventDefault()
          selectSuggestion(selectedIndex.value)
        }
        break
      case 'Escape':
        close()
        break
    }
  }

  // Watch for input changes
  watch(inputRef, () => {
    if (inputRef.value?.length >= minLength) {
      querySuggestions()
    } else {
      close()
    }
  })

  // Initialize on mount
  initialize()

  return {
    suggestions,
    isLoading,
    isOpen,
    selectedIndex,
    isInitialized,
    selectSuggestion,
    handleKeydown,
    close,
    open,
    initialize,
  }
}
