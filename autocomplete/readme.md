## Autocomplete (WASM Trie-based)

A high-performance Rust-based autocompletion engine compiled to WebAssembly, featuring dual-mode matching with Trie-based prefix search and Wheeler Transform fuzzy matching.

### Features

- **🚀 Dual-Mode Matching**
  - **Primary**: Packed Trie for O(m) prefix searches
  - **Secondary**: Wheeler Transform for fuzzy/typo tolerance
  - Automatic priority-based result merging

- **📦 Protobuf Support**
  - Efficient binary protocol for data exchange
  - Base64-encoded packet handling in WASM
  - Type-safe message definitions

- **🌐 WASM Ready**
  - JavaScript/TypeScript bindings
  - Zero-copy data transfer where possible
  - Optimized for web frontend integration

- **🎯 Configurable**
  - Adjustable max results
  - Edit distance threshold
  - Prefix match boost factor
  - Enable/disable Wheeler matching

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AutocompleteEngine                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐    ┌──────────────────────────┐   │
│  │   Trie (Prefix)      │    │ WheelerIndex (Fuzzy)     │   │
│  │  - Packed nodes      │    │  - Transform encoding    │   │
│  │  - Frequency scoring │    │  - Edit distance         │   │
│  │  - Tag support       │    │  - Pattern matching      │   │
│  └──────────┬───────────┘    └────────────┬─────────────┘   │
│             │                             │                 │
│             └──────────┬──────────────────┘                 │
│                        │                                    │
│              ┌─────────▼─────────┐                          │
│              │  Result Merger    │                          │
│              │  (Priority-based) │                          │
│              └─────────┬─────────┘                          │
└────────────────────────┼────────────────────────────────────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
    ┌──────▼──────┐ ┌────▼────┐ ┌─────▼─────┐
    │   WASM      │ │Protobuf │ │   JSON    │
    │  Bindings   │ │  Packets│ │   API     │
    └─────────────┘ └─────────┘ └───────────┘
```

### Installation

#### Prerequisites

```bash
# Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# WASM target
rustup target add wasm32-unknown-unknown

# WASM pack (optional, for bundling)
npm install -g @wasm-pack/wasm-pack

# Protobuf compiler
# Ubuntu/Debian
sudo apt-get install protobuf-compiler
# macOS
brew install protobuf
```

#### Build

```bash
cd autocomplete

# Build native library
cargo build --release

# Build WASM module
wasm-pack build --release --target web

# Run tests
cargo test

# Run with coverage (requires cargo-tarpaulin)
cargo tarpaulin --out Html
```

### Usage

#### Rust API

```rust
use autocomplete::engine::{AutocompleteEngine, AutocompleteConfig};

// Create engine with default config
let mut engine = AutocompleteEngine::new();

// Or with custom config
let config = AutocompleteConfig {
    max_results: 10,
    use_wheeler: true,
    wheeler_max_distance: 2,
    prefix_boost: 100,
};
let mut engine = AutocompleteEngine::with_config(config);

// Add words with frequency and tags
engine.add_words(vec![
    ("hello".to_string(), 10, vec!["greeting".to_string()]),
    ("help".to_string(), 5, vec![]),
    ("world".to_string(), 20, vec![]),
]);

// Query (combines prefix + Wheeler matching)
let results = engine.query("hel");
for result in results {
    println!("{} (score: {}, prefix: {}, wheeler: {})", 
             result.term, 
             result.score, 
             result.is_prefix_match,
             result.is_wheeler_match);
}

// Prefix-only query (faster)
let prefix_results = engine.prefix_query("hel", 10);

// Wheeler-only query (fuzzy)
let wheeler_results = engine.wheeler_query("helo", 1);
```

#### JavaScript/WASM API

```javascript
import init, { WasmAutocomplete } from './pkg/autocomplete.js';

await init();

// Create instance
const autocomplete = new WasmAutocomplete();

// Or with custom config
const autocomplete = WasmAutocomplete.with_config(
    10,   // max_results
    true, // use_wheeler
    2,    // wheeler_max_distance
    100   // prefix_boost
);

// Add words from JSON
autocomplete.add_words_json(JSON.stringify([
    { term: "hello", frequency: 10, tags: ["greeting"] },
    { term: "help", frequency: 5, tags: [] },
    { term: "world", frequency: 20, tags: [] }
]));

// Add words from Protobuf (base64 encoded)
const wordBatchBase64 = "..."; // Base64 encoded WordBatch
autocomplete.init_from_protobuf(wordBatchBase64);

// Query
const results = autocomplete.query("hel");
console.log(JSON.parse(results));
// Output: [
//   { term: "hello", score: 1000, is_prefix_match: true, is_wheeler_match: false, frequency: 10 },
//   { term: "help", score: 500, is_prefix_match: true, is_wheeler_match: false, frequency: 5 }
// ]

// Prefix-only query
const prefixResults = autocomplete.prefix_query("hel", 10);

// Wheeler-only query
const wheelerResults = autocomplete.wheeler_query("helo", 1);

// Query with Protobuf
const requestBase64 = "..."; // Base64 encoded AutocompleteRequest
const responseBase64 = autocomplete.query_protobuf(requestBase64);

// Get word count
const count = autocomplete.word_count();

// Clear all data
autocomplete.clear();
```

#### Protobuf Messages

```protobuf
// Word entry with metadata
message WordEntry {
    string term = 1;
    uint32 frequency = 2;
    repeated string tags = 3;
}

// Batch of words to add
message WordBatch {
    repeated WordEntry entries = 1;
}

// Autocomplete request
message AutocompleteRequest {
    string query = 1;
    uint32 max_results = 2;
    bool use_wheeler = 3;
    uint32 wheeler_max_distance = 4;
}

// Autocomplete response
message AutocompleteResponse {
    repeated AutocompleteResult results = 1;
    uint32 prefix_matches = 2;
    uint32 wheeler_matches = 3;
}

message AutocompleteResult {
    string term = 1;
    uint32 score = 2;
    bool is_prefix_match = 3;
    bool is_wheeler_match = 4;
}
```

### Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `max_results` | `u32` | 10 | Maximum number of results to return |
| `use_wheeler` | `bool` | true | Enable Wheeler transform for fuzzy matching |
| `wheeler_max_distance` | `u32` | 2 | Maximum edit distance for Wheeler matching |
| `prefix_boost` | `u32` | 100 | Score multiplier for prefix matches |

### Performance

- **Prefix Search**: O(m) where m is query length
- **Wheeler Matching**: O(n × k) where n is word count, k is max edit distance
- **Memory**: Efficient packed Trie nodes with HashMap children
- **WASM Size**: ~50-100KB gzipped (depending on optimization)

### Testing

```bash
# Run all tests
cargo test

# Run with verbose output
cargo test -- --nocapture

# Run specific test module
cargo test trie

# Run integration tests
cargo test --test integration_tests

# Generate coverage report
cargo install cargo-tarpaulin
cargo tarpaulin --out Html
```

### Project Structure

```
autocomplete/
├── Cargo.toml              # Package configuration
├── build.rs                # Protobuf build script
├── proto/
│   └── autocomplete.proto  # Protobuf message definitions
├── src/
│   ├── lib.rs              # Library root and documentation
│   ├── main.rs             # CLI demo
│   ├── trie.rs             # Trie implementation
│   ├── wheeler.rs          # Wheeler Transform implementation
│   ├── engine.rs           # Combined autocomplete engine
│   └── wasm.rs             # WASM bindings
└── tests/
    └── integration_tests.rs # Integration tests
```

### Algorithms

#### Packed Trie

The Trie uses a packed node representation with HashMap-based children storage:
- Memory efficient for sparse character distributions
- O(1) average case child lookup
- Supports Unicode characters natively

#### Wheeler Transform

The Wheeler Transform provides fuzzy matching capabilities:
- Similar to Burrows-Wheeler Transform but optimized for pattern matching
- Enables efficient edit distance calculations
- Handles typos, partial matches, and character transpositions

### License

MIT

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `cargo test`
5. Submit a pull request
