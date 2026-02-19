//! Core Trie implementation with packed node optimization for autocompletion.
//!
//! This module provides a memory-efficient Trie structure optimized for prefix-based
//! autocompletion. Each node uses packed arrays to store children, reducing memory overhead.

use std::collections::HashMap;

/// A node in the Trie with packed children storage
#[derive(Debug, Clone)]
pub struct TrieNode {
    /// Packed array of children nodes indexed by character
    children: HashMap<char, TrieNode>,
    /// Whether this node marks the end of a complete word
    is_end: bool,
    /// Frequency/weight associated with this word (if is_end)
    frequency: u32,
    /// Optional tags associated with this word
    tags: Vec<String>,
}

impl TrieNode {
    /// Creates a new empty Trie node
    pub fn new() -> Self {
        Self {
            children: HashMap::new(),
            is_end: false,
            frequency: 0,
            tags: Vec::new(),
        }
    }

    /// Inserts a word into the Trie with associated metadata
    pub fn insert(&mut self, word: &str, frequency: u32, tags: Vec<String>) {
        let mut current = self;
        for ch in word.chars() {
            current = current.children.entry(ch).or_insert_with(TrieNode::new);
        }
        current.is_end = true;
        current.frequency = frequency;
        current.tags = tags;
    }

    /// Searches for a node corresponding to the given prefix
    pub fn find_prefix(&self, prefix: &str) -> Option<&TrieNode> {
        let mut current = self;
        for ch in prefix.chars() {
            match current.children.get(&ch) {
                Some(node) => current = node,
                None => return None,
            }
        }
        Some(current)
    }

    /// Collects all words from this node downward
    pub fn collect_words(&self, prefix: &str, results: &mut Vec<(String, u32, Vec<String>)>) {
        if self.is_end {
            results.push((prefix.to_string(), self.frequency, self.tags.clone()));
        }
        for (ch, node) in &self.children {
            let mut new_prefix = String::with_capacity(prefix.len() + ch.len_utf8());
            new_prefix.push_str(prefix);
            new_prefix.push(*ch);
            node.collect_words(&new_prefix, results);
        }
    }

    /// Returns the number of words in the subtree rooted at this node
    pub fn word_count(&self) -> usize {
        let mut count = if self.is_end { 1 } else { 0 };
        for node in self.children.values() {
            count += node.word_count();
        }
        count
    }
}

impl Default for TrieNode {
    fn default() -> Self {
        Self::new()
    }
}

/// Main Trie structure for efficient prefix-based autocompletion
#[derive(Debug, Clone)]
pub struct Trie {
    root: TrieNode,
    word_count: usize,
}

impl Trie {
    /// Creates a new empty Trie
    pub fn new() -> Self {
        Self {
            root: TrieNode::new(),
            word_count: 0,
        }
    }

    /// Builds a Trie from a list of words with frequencies and tags
    pub fn from_words(words: impl IntoIterator<Item = (String, u32, Vec<String>)>) -> Self {
        let mut trie = Self::new();
        for (word, freq, tags) in words {
            trie.insert(&word, freq, tags);
        }
        trie
    }

    /// Inserts a word with frequency and tags
    pub fn insert(&mut self, word: &str, frequency: u32, tags: Vec<String>) {
        if !self.contains(word) {
            self.word_count += 1;
        }
        self.root.insert(word, frequency, tags);
    }

    /// Checks if the Trie contains a complete word
    pub fn contains(&self, word: &str) -> bool {
        self.root
            .find_prefix(word)
            .map_or(false, |node| node.is_end)
    }

    /// Performs prefix search and returns matching words with scores
    pub fn prefix_search(&self, prefix: &str, max_results: usize) -> Vec<(String, u32)> {
        let mut results: Vec<(String, u32, Vec<String>)> = Vec::new();

        if let Some(node) = self.root.find_prefix(prefix) {
            let prefix_str = prefix.to_string();
            node.collect_words(&prefix_str, &mut results);
        }

        // Sort by frequency (descending) and take top results
        results.sort_by(|a, b| b.1.cmp(&a.1));
        results
            .into_iter()
            .take(max_results)
            .map(|(term, freq, _)| (term, freq))
            .collect()
    }

    /// Returns the total number of words in the Trie
    pub fn word_count(&self) -> usize {
        self.word_count
    }

    /// Clears all words from the Trie
    pub fn clear(&mut self) {
        self.root = TrieNode::new();
        self.word_count = 0;
    }
}

impl Default for Trie {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_trie_insert_and_contains() {
        let mut trie = Trie::new();
        trie.insert("hello", 10, vec!["greeting".to_string()]);
        trie.insert("help", 5, vec![]);
        trie.insert("world", 20, vec![]);

        assert!(trie.contains("hello"));
        assert!(trie.contains("help"));
        assert!(trie.contains("world"));
        assert!(!trie.contains("hel"));
        assert!(!trie.contains(""));
    }

    #[test]
    fn test_prefix_search() {
        let mut trie = Trie::new();
        trie.insert("apple", 10, vec![]);
        trie.insert("application", 15, vec![]);
        trie.insert("apply", 8, vec![]);
        trie.insert("banana", 20, vec![]);

        let results = trie.prefix_search("app", 10);
        assert_eq!(results.len(), 3);
        assert_eq!(results[0].0, "application"); // highest frequency
        assert_eq!(results[1].0, "apple");
        assert_eq!(results[2].0, "apply");
    }

    #[test]
    fn test_prefix_search_limited_results() {
        let mut trie = Trie::new();
        trie.insert("test1", 5, vec![]);
        trie.insert("test2", 10, vec![]);
        trie.insert("test3", 15, vec![]);
        trie.insert("test4", 20, vec![]);

        let results = trie.prefix_search("test", 2);
        assert_eq!(results.len(), 2);
        assert_eq!(results[0].0, "test4");
        assert_eq!(results[1].0, "test3");
    }

    #[test]
    fn test_word_count() {
        let mut trie = Trie::new();
        assert_eq!(trie.word_count(), 0);

        trie.insert("one", 1, vec![]);
        assert_eq!(trie.word_count(), 1);

        trie.insert("two", 1, vec![]);
        assert_eq!(trie.word_count(), 2);

        // Duplicate should not increase count
        trie.insert("one", 1, vec![]);
        assert_eq!(trie.word_count(), 2);
    }

    #[test]
    fn test_clear() {
        let mut trie = Trie::new();
        trie.insert("hello", 1, vec![]);
        trie.insert("world", 1, vec![]);
        
        trie.clear();
        
        assert_eq!(trie.word_count(), 0);
        assert!(!trie.contains("hello"));
        assert!(!trie.contains("world"));
    }

    #[test]
    fn test_empty_prefix_search() {
        let trie = Trie::new();
        let results = trie.prefix_search("test", 10);
        assert!(results.is_empty());
    }

    #[test]
    fn test_unicode_support() {
        let mut trie = Trie::new();
        trie.insert("こんにちは", 10, vec![]);
        trie.insert("こんばんは", 5, vec![]);

        assert!(trie.contains("こんにちは"));
        let results = trie.prefix_search("こん", 10);
        assert_eq!(results.len(), 2);
    }
}
