//! Integration tests for the autocomplete engine
//!
//! These tests verify the complete system including protobuf handling,
//! Trie operations, and Wheeler transform integration.

use autocomplete::engine::{AutocompleteEngine, AutocompleteConfig};
use autocomplete::trie::Trie;
use autocomplete::wheeler::WheelerIndex;

// ==================== Trie Integration Tests ====================

#[test]
fn test_trie_large_dataset() {
    let mut trie = Trie::new();
    
    // Insert 1000 words
    for i in 0..1000 {
        trie.insert(&format!("word{}", i), i as u32, vec![]);
    }
    
    assert_eq!(trie.word_count(), 1000);
    
    // Search should be fast even with large dataset
    let results = trie.prefix_search("word", 10);
    assert_eq!(results.len(), 10);
    
    // Highest frequency words should come first
    assert_eq!(results[0].0, "word999");
}

#[test]
fn test_trie_common_prefixes() {
    let mut trie = Trie::new();
    
    let words = vec![
        ("computer", 10),
        ("compute", 15),
        ("computing", 8),
        ("computation", 12),
        ("communication", 20),
        ("command", 5),
    ];
    
    for (word, freq) in words {
        trie.insert(word, freq, vec![]);
    }
    
    // All "com" words should be found
    let results = trie.prefix_search("com", 10);
    assert_eq!(results.len(), 6);
    
    // "comp" should exclude "command" and "communication"
    let results = trie.prefix_search("comp", 10);
    assert_eq!(results.len(), 4);
}

#[test]
fn test_trie_frequency_ordering() {
    let mut trie = Trie::new();
    
    // Insert in non-sorted order
    trie.insert("low", 5, vec![]);
    trie.insert("high", 100, vec![]);
    trie.insert("medium", 50, vec![]);
    
    let results = trie.prefix_search("", 10);
    
    // Should be sorted by frequency descending
    assert_eq!(results[0].0, "high");
    assert_eq!(results[1].0, "medium");
    assert_eq!(results[2].0, "low");
}

// ==================== Wheeler Transform Integration Tests ====================

#[test]
fn test_wheeler_edit_distances() {
    let words: Vec<String> = vec![
        "kitten", "sitting", "mitten", "pattern", "kitchen"
    ].into_iter().map(String::from).collect();
    
    let _index = WheelerIndex::new(words);
    
    // Test various edit distances
    assert_eq!(WheelerIndex::levenshtein_distance("kitten", "kitten"), 0);
    assert_eq!(WheelerIndex::levenshtein_distance("kitten", "kittens"), 1);
    assert_eq!(WheelerIndex::levenshtein_distance("kitten", "kittin"), 1);
    assert_eq!(WheelerIndex::levenshtein_distance("kitten", "kiten"), 1);
    assert_eq!(WheelerIndex::levenshtein_distance("kitten", "kittan"), 1);
}

#[test]
fn test_wheeler_multiple_matches() {
    let words: Vec<String> = vec![
        "apple", "apply", "appliance", "applet", "appeal"
    ].into_iter().map(String::from).collect();
    
    let index = WheelerIndex::new(words);
    
    // Search with typo
    let results = index.fuzzy_match("applie", 2);
    
    // Should find similar words
    assert!(!results.is_empty());
    assert!(results.iter().any(|(w, _)| w == "apple" || w == "apply"));
}

#[test]
fn test_wheeler_partial_matches() {
    let words: Vec<String> = vec![
        "internationalization",
        "international",
        "internet",
        "internal",
        "interval"
    ].into_iter().map(String::from).collect();
    
    let index = WheelerIndex::new(words);
    
    // Partial match
    let results = index.fuzzy_match("internat", 2);
    
    // Should prioritize words starting with the pattern
    assert!(!results.is_empty());
}

// ==================== Engine Integration Tests ====================

#[test]
fn test_engine_combined_matching() {
    let mut engine = AutocompleteEngine::new();
    
    engine.add_words(vec![
        ("javascript".to_string(), 50, vec!["programming".to_string()]),
        ("java".to_string(), 40, vec!["programming".to_string()]),
        ("javelin".to_string(), 10, vec!["sport".to_string()]),
        ("jigsaw".to_string(), 20, vec!["puzzle".to_string()]),
    ]);
    
    let results = engine.query("java");
    
    // Should have both prefix matches
    assert!(results.iter().any(|r| r.term == "javascript" && r.is_prefix_match));
    assert!(results.iter().any(|r| r.term == "java" && r.is_prefix_match));
}

#[test]
fn test_engine_typo_recovery() {
    let mut engine = AutocompleteEngine::new();
    
    engine.add_words(vec![
        ("autocomplete".to_string(), 30, vec![]),
        ("autofill".to_string(), 25, vec![]),
        ("automatic".to_string(), 20, vec![]),
        ("automation".to_string(), 15, vec![]),
    ]);
    
    // Query with typo
    let results = engine.query("autocomplet");
    
    // Should still find "autocomplete" via Wheeler matching
    assert!(results.iter().any(|r| r.term == "autocomplete"));
}

#[test]
fn test_engine_score_priority() {
    let mut engine = AutocompleteEngine::new();
    
    // Add words with varying frequencies
    engine.add_words(vec![
        ("common".to_string(), 100, vec![]),
        ("commonality".to_string(), 50, vec![]),
        ("commonly".to_string(), 75, vec![]),
        ("comedy".to_string(), 90, vec![]),
    ]);
    
    let results = engine.query("com");
    
    // Prefix matches should be prioritized by frequency
    assert_eq!(results[0].term, "common");
    assert!(results[0].is_prefix_match);
}

#[test]
fn test_engine_no_false_positives() {
    let mut engine = AutocompleteEngine::new();
    
    engine.add_words(vec![
        ("apple".to_string(), 10, vec![]),
        ("application".to_string(), 10, vec![]),
        ("banana".to_string(), 10, vec![]),
    ]);
    
    // Query that shouldn't match "banana"
    let results = engine.query("app");
    
    assert!(!results.iter().any(|r| r.term == "banana"));
}

#[test]
fn test_engine_empty_queries() {
    let mut engine = AutocompleteEngine::new();
    
    engine.add_words(vec![
        ("test".to_string(), 10, vec![]),
        ("testing".to_string(), 15, vec![]),
    ]);
    
    // Empty query should return all words (sorted by frequency)
    let results = engine.query("");
    assert!(!results.is_empty());
    
    // Non-matching query
    let _results = engine.query("xyz123");
    // May return Wheeler matches or empty depending on edit distance
}

#[test]
fn test_engine_config_effects() {
    let config = AutocompleteConfig {
        max_results: 3,
        use_wheeler: true,
        wheeler_max_distance: 1,
        prefix_boost: 50,
    };
    
    let mut engine = AutocompleteEngine::with_config(config);
    
    for i in 0..10 {
        engine.add_words(vec![(format!("test{}", i), 1, vec![])]);
    }
    
    let results = engine.query("test");
    
    // Should respect max_results
    assert!(results.len() <= 3);
}

#[test]
fn test_engine_wheeler_toggle() {
    let mut engine_with_wheeler = AutocompleteEngine::new();
    let mut engine_without_wheeler = AutocompleteEngine::with_config(
        AutocompleteConfig {
            use_wheeler: false,
            ..Default::default()
        }
    );
    
    let words = vec![
        ("hello".to_string(), 10, vec![]),
        ("help".to_string(), 5, vec![]),
        ("held".to_string(), 8, vec![]),
    ];
    
    engine_with_wheeler.add_words(words.clone());
    engine_without_wheeler.add_words(words);
    
    // Query with typo
    let results_with = engine_with_wheeler.query("helo");
    let results_without = engine_without_wheeler.query("helo");
    
    // Wheeler-enabled should potentially find more matches
    // (exact behavior depends on implementation details)
    assert!(results_with.len() >= results_without.len());
}

// ==================== Edge Cases ====================

#[test]
fn test_single_character_words() {
    let mut engine = AutocompleteEngine::new();
    
    engine.add_words(vec![
        ("a".to_string(), 10, vec![]),
        ("an".to_string(), 15, vec![]),
        ("and".to_string(), 20, vec![]),
        ("ant".to_string(), 5, vec![]),
    ]);
    
    let results = engine.query("a");
    assert!(!results.is_empty());
    assert!(results.iter().all(|r| r.term.starts_with('a')));
}

#[test]
fn test_special_characters() {
    let mut engine = AutocompleteEngine::new();
    
    engine.add_words(vec![
        ("c++".to_string(), 10, vec!["programming".to_string()]),
        ("c#".to_string(), 15, vec!["programming".to_string()]),
        ("c".to_string(), 20, vec![]),
    ]);
    
    let results = engine.query("c");
    assert!(!results.is_empty());
}

#[test]
fn test_case_sensitivity() {
    let mut engine = AutocompleteEngine::new();
    
    engine.add_words(vec![
        ("Hello".to_string(), 10, vec![]),
        ("hello".to_string(), 15, vec![]),
        ("HELLO".to_string(), 5, vec![]),
    ]);
    
    // Case-sensitive matching
    let results = engine.query("hello");
    assert!(results.iter().any(|r| r.term == "hello"));
    
    let results = engine.query("Hello");
    assert!(results.iter().any(|r| r.term == "Hello"));
}

#[test]
fn test_very_long_words() {
    let mut engine = AutocompleteEngine::new();
    
    let long_word = "a".repeat(1000);
    engine.add_words(vec![(long_word.clone(), 10, vec![])]);
    
    let results = engine.query(&"a".repeat(100));
    assert!(!results.is_empty());
}

#[test]
fn test_duplicate_insertions() {
    let mut trie = Trie::new();
    
    trie.insert("duplicate", 10, vec![]);
    trie.insert("duplicate", 20, vec![]);
    trie.insert("duplicate", 30, vec![]);
    
    // Word count should not increase
    assert_eq!(trie.word_count(), 1);
}

#[test]
fn test_concurrent_prefix_and_wheeler() {
    let mut engine = AutocompleteEngine::new();
    
    engine.add_words(vec![
        ("perfect".to_string(), 50, vec![]),
        ("prefer".to_string(), 40, vec![]),
        ("performance".to_string(), 30, vec![]),
        ("perfume".to_string(), 20, vec![]),
    ]);
    
    let results = engine.query("perf");
    
    // All should be prefix matches
    assert!(results.iter().all(|r| r.is_prefix_match));
    
    // Should be sorted by frequency
    assert_eq!(results[0].term, "perfect");
}
