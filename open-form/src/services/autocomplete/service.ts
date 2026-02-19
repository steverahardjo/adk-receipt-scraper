/**
 * Autocomplete service that interfaces with the Rust WASM module
 */

import type { WordEntry, AutocompleteResult } from './protobuf'
import { ProtobufCodec } from './protobuf'

// Import the WASM module
import init, { WasmAutocomplete } from '@/../autocomplete/pkg/autocomplete.js'

export interface AutocompleteSuggestion {
  term: string
  score: number
  isPrefixMatch: boolean
  isWheelerMatch: boolean
}

export class AutocompleteService {
  private instance: WasmAutocomplete | null = null
  private initialized = false
  private initPromise: Promise<void> | null = null

  /**
   * Initialize the WASM module
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return
    }

    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = (async () => {
      try {
        await init()
        this.instance = new WasmAutocomplete()
        this.initialized = true
        console.log('[Autocomplete] WASM module initialized')
      } catch (error) {
        console.error('[Autocomplete] Failed to initialize WASM:', error)
        throw error
      }
    })()

    return this.initPromise
  }

  /**
   * Load words from a WordBatch protobuf message
   */
  async loadWords(batch: { entries: WordEntry[] }): Promise<void> {
    if (!this.instance) {
      await this.initialize()
    }

    try {
      // Encode to protobuf
      const encoded = ProtobufCodec.encodeWordBatch(batch)
      // Convert to base64
      const base64 = btoa(String.fromCharCode(...encoded))
      // Send to WASM
      this.instance!.init_from_protobuf(base64)
      console.log(`[Autocomplete] Loaded ${batch.entries.length} words`)
    } catch (error) {
      console.error('[Autocomplete] Failed to load words:', error)
      throw error
    }
  }

  /**
   * Load words from a simple JSON array
   */
  async loadWordsJson(words: Array<{ term: string; frequency: number; tags?: string[] }>): Promise<void> {
    if (!this.instance) {
      await this.initialize()
    }

    try {
      const json = JSON.stringify(words)
      this.instance!.add_words_json(json)
      console.log(`[Autocomplete] Loaded ${words.length} words from JSON`)
    } catch (error) {
      console.error('[Autocomplete] Failed to load words from JSON:', error)
      throw error
    }
  }

  /**
   * Query for autocomplete suggestions
   */
  query(searchTerm: string, maxResults: number = 10): AutocompleteSuggestion[] {
    if (!this.instance || !this.initialized) {
      console.warn('[Autocomplete] Not initialized, returning empty results')
      return []
    }

    try {
      const resultsJson = this.instance.query(searchTerm)
      const results: AutocompleteSuggestion[] = JSON.parse(resultsJson).map((r: {
        term: string
        score: number
        is_prefix_match: boolean
        is_wheeler_match: boolean
      }) => ({
        term: r.term,
        score: r.score,
        isPrefixMatch: r.is_prefix_match,
        isWheelerMatch: r.is_wheeler_match
      }))
      return results
    } catch (error) {
      console.error('[Autocomplete] Query failed:', error)
      return []
    }
  }

  /**
   * Query using protobuf request/response
   */
  queryProtobuf(
    query: string,
    maxResults: number = 10,
    useWheeler: boolean = true,
    wheelerMaxDistance: number = 2
  ): AutocompleteSuggestion[] {
    if (!this.instance || !this.initialized) {
      console.warn('[Autocomplete] Not initialized, returning empty results')
      return []
    }

    try {
      // Create request object (would normally be encoded to protobuf)
      const request = {
        query,
        max_results: maxResults,
        use_wheeler: useWheeler,
        wheeler_max_distance: wheelerMaxDistance
      }

      // For now, use the JSON query and convert
      // In production, you'd encode the request to protobuf
      const resultsJson = this.instance.query(query)
      const results: AutocompleteSuggestion[] = JSON.parse(resultsJson).map((r: {
        term: string
        score: number
        is_prefix_match: boolean
        is_wheeler_match: boolean
      }) => ({
        term: r.term,
        score: r.score,
        isPrefixMatch: r.is_prefix_match,
        isWheelerMatch: r.is_wheeler_match
      }))

      console.log('[Autocomplete] Protobuf query:', request, '->', results.length, 'results')
      return results
    } catch (error) {
      console.error('[Autocomplete] Protobuf query failed:', error)
      return []
    }
  }

  /**
   * Get the total word count
   */
  getWordCount(): number {
    if (!this.instance) return 0
    return this.instance.word_count()
  }

  /**
   * Clear all loaded words
   */
  clear(): void {
    if (!this.instance) return
    this.instance.clear()
    console.log('[Autocomplete] Cleared all words')
  }

  /**
   * Check if the service is ready
   */
  isReady(): boolean {
    return this.initialized && this.instance !== null
  }
}

// Singleton instance
export const autocompleteService = new AutocompleteService()

// Sample expense-related words for autocomplete
export const SAMPLE_EXPENSE_WORDS: Array<{ term: string; frequency: number; tags?: string[] }> = [
  { term: 'Morning coffee', frequency: 50, tags: ['food', 'daily'] },
  { term: 'Lunch at office', frequency: 45, tags: ['food', 'work'] },
  { term: 'Dinner with friends', frequency: 30, tags: ['food', 'social'] },
  { term: 'Grocery shopping', frequency: 40, tags: ['food', 'weekly'] },
  { term: 'Gas station', frequency: 35, tags: ['transport', 'car'] },
  { term: 'Bus fare', frequency: 25, tags: ['transport', 'daily'] },
  { term: 'Taxi ride', frequency: 20, tags: ['transport'] },
  { term: 'Online shopping', frequency: 30, tags: ['shopping'] },
  { term: 'Electricity bill', frequency: 15, tags: ['bills', 'monthly'] },
  { term: 'Internet bill', frequency: 15, tags: ['bills', 'monthly'] },
  { term: 'Phone bill', frequency: 15, tags: ['bills', 'monthly'] },
  { term: 'Movie tickets', frequency: 20, tags: ['entertainment'] },
  { term: 'Gym membership', frequency: 10, tags: ['health', 'monthly'] },
  { term: 'Pharmacy', frequency: 15, tags: ['health'] },
  { term: 'Restaurant', frequency: 35, tags: ['food'] },
  { term: 'Cafe', frequency: 30, tags: ['food'] },
  { term: 'Supermarket', frequency: 40, tags: ['food', 'shopping'] },
  { term: 'Convenience store', frequency: 25, tags: ['shopping'] },
  { term: 'Food delivery', frequency: 30, tags: ['food'] },
  { term: 'Subscription', frequency: 20, tags: ['bills', 'monthly'] },
  { term: 'ATM withdrawal', frequency: 15, tags: ['cash'] },
  { term: 'Transfer', frequency: 10, tags: ['banking'] },
  { term: 'Coffee shop', frequency: 35, tags: ['food'] },
  { term: 'Fast food', frequency: 30, tags: ['food'] },
  { term: 'Parking fee', frequency: 20, tags: ['transport'] },
  { term: 'Toll road', frequency: 15, tags: ['transport'] },
  { term: 'Car maintenance', frequency: 10, tags: ['transport', 'car'] },
  { term: 'Insurance', frequency: 10, tags: ['bills', 'monthly'] },
  { term: 'Rent', frequency: 5, tags: ['bills', 'monthly'] },
  { term: 'Utilities', frequency: 10, tags: ['bills', 'monthly'] },
]
