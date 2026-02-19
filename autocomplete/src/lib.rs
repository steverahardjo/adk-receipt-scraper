//! WASM Trie-based Autocomplete Engine
//!
//! This library provides a high-performance autocomplete system combining:
//! - **Trie-based prefix matching**: Fast exact prefix searches with packed node optimization
//! - **Wheeler Transform fuzzy matching**: Secondary matching for typos and partial matches
//! - **Protobuf support**: Efficient binary protocol for data exchange
//! - **WASM bindings**: Ready for web frontend integration
//!
//! # Architecture
//!
//! ```text
//! ┌─────────────────────────────────────────────────────────────┐
//!│                    AutocompleteEngine                        │
//!├─────────────────────────────────────────────────────────────┤
//!│  ┌──────────────────────┐    ┌──────────────────────────┐   │
//!│  │   Trie (Prefix)      │    │ WheelerIndex (Fuzzy)     │   │
//!│  │  - Packed nodes      │    │  - Transform encoding    │   │
//!│  │  - Frequency scoring │    │  - Edit distance         │   │
//!│  │  - Tag support       │    │  - Pattern matching      │   │
//!│  └──────────┬───────────┘    └────────────┬─────────────┘   │
//!│             │                             │                 │
//!│             └──────────┬──────────────────┘                 │
//!│                        │                                    │
//!│              ┌─────────▼─────────┐                          │
//!│              │  Result Merger    │                          │
//!│              │  (Priority-based) │                          │
//!│              └─────────┬─────────┘                          │
//!└────────────────────────┼────────────────────────────────────┘
//!                         │
//!           ┌─────────────┼─────────────┐
//!           │             │             │
//!    ┌──────▼──────┐ ┌────▼────┐ ┌─────▼─────┐
//!    │   WASM      │ │Protobuf │ │   JSON    │
//!    │  Bindings   │ │  Packets│ │   API     │
//!    └─────────────┘ └─────────┘ └───────────┘
//! ```
//!
//! # Usage
//!
//! ## Rust API
//!
//! ```rust
//! use autocomplete::engine::{AutocompleteEngine, AutocompleteConfig};
//!
//! // Create engine with default config
//! let mut engine = AutocompleteEngine::new();
//!
//! // Add words with frequency and tags
//! engine.add_words(vec![
//!     ("hello".to_string(), 10, vec!["greeting".to_string()]),
//!     ("help".to_string(), 5, vec![]),
//!     ("world".to_string(), 20, vec![]),
//! ]);
//!
//! // Query (combines prefix + Wheeler matching)
//! let results = engine.query("hel");
//! for result in results {
//!     println!("{} (score: {}, prefix: {})", 
//!              result.term, result.score, result.is_prefix_match);
//! }
//! ```
//!
//! ## WASM/JavaScript API
//!
//! ```javascript
//! import init, { WasmAutocomplete } from './autocomplete.js';
//!
//! await init();
//!
//! const autocomplete = new WasmAutocomplete();
//!
//! // Add words
//! autocomplete.add_words_json(JSON.stringify([
//!     { term: "hello", frequency: 10, tags: ["greeting"] },
//!     { term: "help", frequency: 5, tags: [] }
//! ]));
//!
//! // Query
//! const results = autocomplete.query("hel");
//! console.log(JSON.parse(results));
//! ```
//!
//! # Features
//!
//! - **Prefix Priority**: Exact prefix matches are always ranked higher
//! - **Fuzzy Fallback**: Wheeler transform handles typos and partial matches
//! - **Frequency Scoring**: Words with higher frequency score better
//! - **Configurable**: Adjust max results, edit distance, and boost factors
//! - **Unicode Support**: Works with any UTF-8 characters
//!
//! # Performance
//!
//! - Prefix search: O(m) where m is query length
//! - Wheeler matching: O(n * k) where n is word count, k is max edit distance
//! - Memory efficient packed Trie nodes

pub mod trie;
pub mod wheeler;
pub mod engine;
pub mod wasm;
pub mod proto;

// Re-export main types for convenience
pub use trie::{Trie, TrieNode};
pub use wheeler::WheelerIndex;
pub use engine::{AutocompleteEngine, AutocompleteConfig, AutocompleteEntry};
pub use wasm::WasmAutocomplete;
