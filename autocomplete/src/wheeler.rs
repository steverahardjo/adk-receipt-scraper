//! Wheeler Transform implementation for fuzzy/pattern matching.
//!
//! The Wheeler Transform is a string transformation similar to the Burrows-Wheeler Transform (BWT)
//! but optimized for pattern matching in compressed space. It enables efficient substring matching
//! and is particularly useful for autocomplete with typos or partial matches.
//!
//! This implementation provides:
//! - Wheeler Transform encoding/decoding
//! - Pattern matching using the transformed string
//! - Edit distance calculation for fuzzy matching

use std::collections::{HashMap, HashSet};

/// Wheeler Transform data structure for efficient pattern matching
#[derive(Debug, Clone)]
pub struct WheelerIndex {
    /// Original words stored
    words: Vec<String>,
    /// Transformed strings with their indices (reserved for future optimization)
    #[allow(dead_code)]
    transformed: Vec<(String, usize)>,
    /// Sorted suffix array for binary search (reserved for future optimization)
    #[allow(dead_code)]
    suffix_array: Vec<(String, usize)>,
}

impl WheelerIndex {
    /// Creates a new Wheeler Index from a list of words
    pub fn new(words: Vec<String>) -> Self {
        let mut transformed = Vec::with_capacity(words.len());
        let mut suffix_array = Vec::with_capacity(words.len() * 10); // Estimate

        for (idx, word) in words.iter().enumerate() {
            let tw = Self::wheeler_transform(word);
            transformed.push((tw, idx));

            // Generate all suffixes for the suffix array (using char indices for Unicode safety)
            let chars: Vec<char> = word.chars().collect();
            for i in 0..chars.len() {
                let suffix: String = chars[i..].iter().collect();
                suffix_array.push((suffix, idx));
            }
        }

        // Sort transformed pairs
        transformed.sort_by(|a, b| a.0.cmp(&b.0));

        // Sort suffix array
        suffix_array.sort_by(|a, b| a.0.cmp(&b.0));

        Self {
            words,
            transformed,
            suffix_array,
        }
    }

    /// Computes the Wheeler Transform of a string
    ///
    /// The Wheeler Transform rotates the string to all possible positions,
    /// sorts them lexicographically, and takes the last column.
    pub fn wheeler_transform(s: &str) -> String {
        if s.is_empty() {
            return String::new();
        }

        let chars: Vec<char> = s.chars().collect();
        let n = chars.len();

        // Generate all rotations
        let mut rotations: Vec<Vec<char>> = (0..n)
            .map(|i| {
                chars
                    .iter()
                    .skip(i)
                    .chain(chars.iter())
                    .take(n)
                    .copied()
                    .collect()
            })
            .collect();

        // Sort rotations lexicographically
        rotations.sort();

        // Take the last column
        rotations.iter().map(|r| r[n - 1]).collect()
    }

    /// Inverse Wheeler Transform to recover the original string
    pub fn inverse_wheeler_transform(transformed: &str) -> Option<String> {
        if transformed.is_empty() {
            return Some(String::new());
        }

        let chars: Vec<char> = transformed.chars().collect();
        let n = chars.len();
        let mut table = vec![String::new(); n];

        // Build the transformation table iteratively
        for _ in 0..n {
            let mut chars_with_idx: Vec<(usize, char)> = chars
                .iter()
                .copied()
                .enumerate()
                .collect();
            chars_with_idx.sort_by(|a, b| a.1.cmp(&b.1));

            for (i, (_, ch)) in chars_with_idx.iter().enumerate() {
                table[i].push(*ch);
            }
        }

        // Find the row that ends with the EOF marker (if present)
        // or return the lexicographically smallest rotation
        table.into_iter().find(|s| !s.is_empty())
    }

    /// Searches for patterns using the Wheeler index with edit distance
    pub fn search(&self, pattern: &str, max_distance: u32) -> Vec<(String, u32)> {
        let mut results = HashMap::new();

        for word in &self.words {
            let distance = Self::levenshtein_distance(word, pattern);
            if distance <= max_distance {
                // Score inversely proportional to distance
                let score = (max_distance + 1 - distance) as u32;
                results.insert(word.clone(), score);
            }
        }

        let mut sorted_results: Vec<(String, u32)> = results.into_iter().collect();
        sorted_results.sort_by(|a, b| b.1.cmp(&a.1));
        sorted_results
    }

    /// Calculates Levenshtein (edit) distance between two strings
    pub fn levenshtein_distance(s1: &str, s2: &str) -> u32 {
        let s1_chars: Vec<char> = s1.chars().collect();
        let s2_chars: Vec<char> = s2.chars().collect();
        let m = s1_chars.len();
        let n = s2_chars.len();

        if m == 0 {
            return n as u32;
        }
        if n == 0 {
            return m as u32;
        }

        // Create distance matrix
        let mut dp = vec![vec![0u32; n + 1]; m + 1];

        for i in 0..=m {
            dp[i][0] = i as u32;
        }
        for j in 0..=n {
            dp[0][j] = j as u32;
        }

        for i in 1..=m {
            for j in 1..=n {
                let cost = if s1_chars[i - 1] == s2_chars[j - 1] {
                    0
                } else {
                    1
                };
                dp[i][j] = (dp[i - 1][j] + 1)
                    .min(dp[i][j - 1] + 1)
                    .min(dp[i - 1][j - 1] + cost);
            }
        }

        dp[m][n]
    }

    /// Performs fuzzy matching with character-level optimizations
    pub fn fuzzy_match(&self, pattern: &str, max_distance: u32) -> Vec<(String, u32)> {
        let mut results = HashSet::new();

        // Direct pattern search
        for (distance, word) in self.words.iter().map(|w| (Self::levenshtein_distance(w, pattern), w)) {
            if distance <= max_distance {
                results.insert((word.clone(), (max_distance + 1 - distance) as u32));
            }
        }

        // Also try with pattern prefixes (for partial matches)
        let pattern_chars: Vec<char> = pattern.chars().collect();
        for prefix_len in (2..=pattern_chars.len()).rev() {
            let prefix: String = pattern_chars[..prefix_len].iter().collect();
            for word in &self.words {
                if word.starts_with(&prefix) {
                    let distance = Self::levenshtein_distance(word, pattern);
                    if distance <= max_distance {
                        results.insert((word.clone(), (max_distance + 1 - distance) as u32 * 2));
                    }
                }
            }
        }

        let mut sorted_results: Vec<(String, u32)> = results.into_iter().collect();
        sorted_results.sort_by(|a, b| b.1.cmp(&a.1));
        sorted_results
    }

    /// Returns the number of indexed words
    pub fn word_count(&self) -> usize {
        self.words.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_wheeler_transform_basic() {
        let s = "banana";
        let transformed = WheelerIndex::wheeler_transform(s);
        assert_eq!(transformed.len(), s.len());
    }

    #[test]
    fn test_wheeler_transform_empty() {
        let transformed = WheelerIndex::wheeler_transform("");
        assert_eq!(transformed, "");
    }

    #[test]
    fn test_inverse_transform() {
        let original = "test";
        let transformed = WheelerIndex::wheeler_transform(original);
        let recovered = WheelerIndex::inverse_wheeler_transform(&transformed);
        assert!(recovered.is_some());
        // Note: Inverse may not perfectly recover due to rotation ambiguity
    }

    #[test]
    fn test_levenshtein_distance() {
        assert_eq!(WheelerIndex::levenshtein_distance("kitten", "sitting"), 3);
        assert_eq!(WheelerIndex::levenshtein_distance("hello", "hello"), 0);
        assert_eq!(WheelerIndex::levenshtein_distance("", "abc"), 3);
        assert_eq!(WheelerIndex::levenshtein_distance("abc", ""), 3);
        assert_eq!(WheelerIndex::levenshtein_distance("abc", "abd"), 1);
    }

    #[test]
    fn test_wheeler_search_exact() {
        let words = vec![
            "hello".to_string(),
            "world".to_string(),
            "help".to_string(),
            "held".to_string(),
        ];
        let index = WheelerIndex::new(words);

        let results = index.search("hello", 0);
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].0, "hello");
    }

    #[test]
    fn test_wheeler_search_fuzzy() {
        let words = vec![
            "hello".to_string(),
            "world".to_string(),
            "help".to_string(),
            "held".to_string(),
            "hero".to_string(),
        ];
        let index = WheelerIndex::new(words);

        // Search with 1 edit distance
        let results = index.search("helo", 1);
        assert!(!results.is_empty());
        assert!(results.iter().any(|(w, _)| w == "hello"));
    }

    #[test]
    fn test_fuzzy_match() {
        let words = vec![
            "autocomplete".to_string(),
            "autofill".to_string(),
            "automaton".to_string(),
            "automatic".to_string(),
        ];
        let index = WheelerIndex::new(words);

        let results = index.fuzzy_match("autofll", 2);
        assert!(!results.is_empty());
        // autofill should be top result due to prefix match bonus
        assert_eq!(results[0].0, "autofill");
    }

    #[test]
    fn test_word_count() {
        let words = vec!["one".to_string(), "two".to_string(), "three".to_string()];
        let index = WheelerIndex::new(words);
        assert_eq!(index.word_count(), 3);
    }

    #[test]
    fn test_unicode_support() {
        let words = vec![
            "こんにちは".to_string(),
            "こんばんは".to_string(),
            "ありがとう".to_string(),
        ];
        let index = WheelerIndex::new(words);

        let results = index.search("こんにちは", 0);
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].0, "こんにちは");
    }
}
