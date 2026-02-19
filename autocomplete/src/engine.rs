//! Autocomplete engine combining Trie-based prefix matching with Wheeler Transform fuzzy matching.
//!
//! This module provides the main autocomplete engine that:
//! 1. Prioritizes exact prefix matches from the Trie
//! 2. Falls back to Wheeler Transform-based fuzzy matching for typos/partial matches
//! 3. Merges and scores results from both approaches

use crate::trie::Trie;
use crate::wheeler::WheelerIndex;

/// Configuration for the autocomplete engine
#[derive(Debug, Clone)]
pub struct AutocompleteConfig {
    /// Maximum number of results to return
    pub max_results: usize,
    /// Enable Wheeler transform for fuzzy matching
    pub use_wheeler: bool,
    /// Maximum edit distance for Wheeler matching
    pub wheeler_max_distance: u32,
    /// Boost factor for prefix matches over Wheeler matches
    pub prefix_boost: u32,
}

impl Default for AutocompleteConfig {
    fn default() -> Self {
        Self {
            max_results: 10,
            use_wheeler: true,
            wheeler_max_distance: 2,
            prefix_boost: 100, // Prefix matches get significant boost
        }
    }
}

/// A single autocomplete result
#[derive(Debug, Clone)]
pub struct AutocompleteEntry {
    /// The matched term
    pub term: String,
    /// Combined score (higher is better)
    pub score: u32,
    /// Whether this was a prefix match
    pub is_prefix_match: bool,
    /// Whether this was a Wheeler/fuzzy match
    pub is_wheeler_match: bool,
    /// Original frequency from the trie
    pub frequency: u32,
}

/// Main autocomplete engine combining Trie and Wheeler Transform
pub struct AutocompleteEngine {
    trie: Trie,
    wheeler_index: Option<WheelerIndex>,
    config: AutocompleteConfig,
}

impl AutocompleteEngine {
    /// Creates a new autocomplete engine with default configuration
    pub fn new() -> Self {
        Self {
            trie: Trie::new(),
            wheeler_index: None,
            config: AutocompleteConfig::default(),
        }
    }

    /// Creates a new autocomplete engine with custom configuration
    pub fn with_config(config: AutocompleteConfig) -> Self {
        Self {
            trie: Trie::new(),
            wheeler_index: None,
            config,
        }
    }

    /// Builds the engine from a list of words with frequencies and tags
    pub fn from_words(words: impl IntoIterator<Item = (String, u32, Vec<String>)>) -> Self {
        let mut engine = Self::new();
        engine.add_words(words);
        engine
    }

    /// Adds words to both the Trie and Wheeler index
    pub fn add_words(&mut self, words: impl IntoIterator<Item = (String, u32, Vec<String>)>) {
        let mut word_list = Vec::new();
        for (word, freq, _tags) in words {
            self.trie.insert(&word, freq, vec![]);
            word_list.push(word);
        }

        // Rebuild Wheeler index if enabled
        if self.config.use_wheeler {
            self.wheeler_index = Some(WheelerIndex::new(word_list));
        }
    }

    /// Performs autocomplete query combining prefix and Wheeler matching
    pub fn query(&self, query: &str) -> Vec<AutocompleteEntry> {
        let mut results: Vec<AutocompleteEntry> = Vec::new();

        // 1. First, get prefix matches (highest priority)
        let prefix_results = self.trie.prefix_search(query, self.config.max_results);
        for (term, freq) in prefix_results {
            results.push(AutocompleteEntry {
                term,
                score: freq * self.config.prefix_boost,
                is_prefix_match: true,
                is_wheeler_match: false,
                frequency: freq,
            });
        }

        // 2. If Wheeler is enabled and we need more results or query has potential typos
        if self.config.use_wheeler {
            if let Some(ref wheeler) = self.wheeler_index {
                // Use Wheeler for fuzzy matching
                let wheeler_results = wheeler.fuzzy_match(query, self.config.wheeler_max_distance);

                for (term, score) in wheeler_results {
                    // Skip if already have as prefix match
                    if results.iter().any(|r| r.term == term) {
                        continue;
                    }

                    results.push(AutocompleteEntry {
                        term,
                        score,
                        is_prefix_match: false,
                        is_wheeler_match: true,
                        frequency: 0,
                    });
                }
            }
        }

        // 3. Sort by combined score and limit results
        results.sort_by(|a, b| b.score.cmp(&a.score));
        results.truncate(self.config.max_results);

        results
    }

    /// Performs a prefix-only search (faster, no fuzzy matching)
    pub fn prefix_query(&self, query: &str, max_results: usize) -> Vec<AutocompleteEntry> {
        let prefix_results = self.trie.prefix_search(query, max_results);
        prefix_results
            .into_iter()
            .map(|(term, freq)| AutocompleteEntry {
                term,
                score: freq,
                is_prefix_match: true,
                is_wheeler_match: false,
                frequency: freq,
            })
            .collect()
    }

    /// Performs a Wheeler-only fuzzy search
    pub fn wheeler_query(&self, query: &str, max_distance: u32) -> Vec<AutocompleteEntry> {
        if let Some(ref wheeler) = self.wheeler_index {
            wheeler
                .fuzzy_match(query, max_distance)
                .into_iter()
                .map(|(term, score)| AutocompleteEntry {
                    term,
                    score,
                    is_prefix_match: false,
                    is_wheeler_match: true,
                    frequency: 0,
                })
                .collect()
        } else {
            Vec::new()
        }
    }

    /// Returns the total word count in the trie
    pub fn word_count(&self) -> usize {
        self.trie.word_count()
    }

    /// Clears all data from the engine
    pub fn clear(&mut self) {
        self.trie.clear();
        self.wheeler_index = None;
    }

    /// Updates the configuration
    pub fn set_config(&mut self, config: AutocompleteConfig) {
        self.config = config;
    }

    /// Gets the current configuration
    pub fn get_config(&self) -> &AutocompleteConfig {
        &self.config
    }
}

impl Default for AutocompleteEngine {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_engine_basic_prefix() {
        let mut engine = AutocompleteEngine::new();
        engine.add_words(vec![
            ("hello".to_string(), 10, vec![]),
            ("help".to_string(), 5, vec![]),
            ("world".to_string(), 20, vec![]),
        ]);

        let results = engine.query("hel");
        assert!(!results.is_empty());
        assert!(results.iter().all(|r| r.is_prefix_match));
    }

    #[test]
    fn test_engine_prefix_priority() {
        let mut engine = AutocompleteEngine::new();
        engine.add_words(vec![
            ("test".to_string(), 10, vec![]),
            ("testing".to_string(), 15, vec![]),
            ("temp".to_string(), 5, vec![]),
        ]);

        let results = engine.query("test");
        assert!(!results.is_empty());
        // Prefix matches should have higher scores due to boost
        assert!(results[0].is_prefix_match);
    }

    #[test]
    fn test_engine_wheeler_fallback() {
        let mut engine = AutocompleteEngine::new();
        engine.add_words(vec![
            ("autocomplete".to_string(), 10, vec![]),
            ("autofill".to_string(), 5, vec![]),
            ("automatic".to_string(), 8, vec![]),
        ]);

        // Query with typo
        let results = engine.query("autofll");
        assert!(!results.is_empty());
        // Should find autofill via Wheeler matching
        assert!(results.iter().any(|r| r.term == "autofill"));
    }

    #[test]
    fn test_engine_no_wheeler() {
        let config = AutocompleteConfig {
            use_wheeler: false,
            ..Default::default()
        };
        let mut engine = AutocompleteEngine::with_config(config);
        engine.add_words(vec![
            ("hello".to_string(), 10, vec![]),
            ("help".to_string(), 5, vec![]),
        ]);

        // Query with typo should return empty or limited results
        let results = engine.query("helo");
        assert!(results.is_empty() || results.iter().all(|r| r.is_prefix_match));
    }

    #[test]
    fn test_engine_max_results() {
        let mut engine = AutocompleteEngine::new();
        for i in 0..20 {
            engine.add_words(vec![(format!("test{}", i), 1, vec![])]);
        }

        let results = engine.query("test");
        assert!(results.len() <= 10); // Default max_results
    }

    #[test]
    fn test_engine_word_count() {
        let mut engine = AutocompleteEngine::new();
        assert_eq!(engine.word_count(), 0);

        engine.add_words(vec![
            ("one".to_string(), 1, vec![]),
            ("two".to_string(), 1, vec![]),
        ]);
        assert_eq!(engine.word_count(), 2);
    }

    #[test]
    fn test_engine_clear() {
        let mut engine = AutocompleteEngine::new();
        engine.add_words(vec![
            ("hello".to_string(), 10, vec![]),
            ("world".to_string(), 20, vec![]),
        ]);

        engine.clear();
        assert_eq!(engine.word_count(), 0);
    }

    #[test]
    fn test_engine_prefix_only_query() {
        let mut engine = AutocompleteEngine::new();
        engine.add_words(vec![
            ("hello".to_string(), 10, vec![]),
            ("help".to_string(), 5, vec![]),
        ]);

        let results = engine.prefix_query("hel", 10);
        assert!(results.iter().all(|r| r.is_prefix_match));
        assert!(results.iter().all(|r| !r.is_wheeler_match));
    }

    #[test]
    fn test_engine_wheeler_only_query() {
        let mut engine = AutocompleteEngine::new();
        engine.add_words(vec![
            ("hello".to_string(), 10, vec![]),
            ("help".to_string(), 5, vec![]),
        ]);

        let results = engine.wheeler_query("helo", 1);
        assert!(results.iter().all(|r| r.is_wheeler_match));
        assert!(results.iter().all(|r| !r.is_prefix_match));
    }

    #[test]
    fn test_engine_config_update() {
        let mut engine = AutocompleteEngine::new();
        let new_config = AutocompleteConfig {
            max_results: 5,
            use_wheeler: false,
            wheeler_max_distance: 1,
            prefix_boost: 50,
        };
        engine.set_config(new_config.clone());

        assert_eq!(engine.get_config().max_results, 5);
        assert!(!engine.get_config().use_wheeler);
    }
}
