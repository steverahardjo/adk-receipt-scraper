# WASM Trie-Based Autocomplete with Expense Tracker

A high-performance autocompletion system built with Rust/WASM and Vue 3, featuring dual-mode matching (Trie prefix + Wheeler Transform fuzzy search) integrated into an expense tracking form.

## 📁 Project Structure

```
adk-exp_tracker/
├── autocomplete/          # Rust WASM autocomplete engine
│   ├── src/
│   │   ├── lib.rs        # Library root
│   │   ├── trie.rs       # Trie data structure
│   │   ├── wheeler.rs    # Wheeler Transform for fuzzy matching
│   │   ├── engine.rs     # Combined autocomplete engine
│   │   └── wasm.rs       # WASM bindings
│   ├── proto/
│   │   └── autocomplete.proto  # Protobuf definitions
│   ├── tests/
│   │   └── integration_tests.rs
│   └── Cargo.toml
│
└── open-form/            # Vue 3 frontend
    ├── src/
    │   ├── services/autocomplete/
    │   │   ├── protobuf.ts    # Protobuf encoder/decoder
    │   │   └── service.ts     # WASM service wrapper
    │   ├── composables/
    │   │   └── useAutocomplete.ts  # Vue composable
    │   ├── autocomplete.d.ts   # WASM type declarations
    │   └── App.vue        # Main form with autocomplete
    ├── autocomplete/pkg/  # Built WASM files
    └── package.json
```

## 🚀 Quick Start

### Prerequisites

```bash
# Required
Node.js >= 20.19.0
npm >= 10.0

# Optional (for WASM development)
Rust >= 1.70.0
wasm-pack >= 0.12.0
```

### Installation

```bash
# 1. Clone and navigate to project
cd adk-exp_tracker

# 2. Install frontend dependencies
cd open-form
npm install

# 3. (Optional) Rebuild WASM module
cd ../autocomplete
cargo build --target wasm32-unknown-unknown --release
cp target/wasm32-unknown-unknown/release/autocomplete.wasm ../open-form/autocomplete/pkg/
```

### Development

```bash
# Terminal 1: Start Vue dev server
cd open-form
npm run dev

# Open browser: http://localhost:5173
```

### Production Build

```bash
cd open-form
npm run build
npm run preview  # Preview production build
```

## 🎯 How to Use the App

### Basic Expense Entry

1. **Open the app** at http://localhost:5173
2. **Title Field** - Start typing (2+ characters)
   - Autocomplete suggestions appear automatically
   - Click any suggestion to fill the field
   - Use ↑↓ arrow keys to navigate, Enter to select
3. **Select Expense Type** - Click one of the category cards
4. **Enter Amount** - Input the expense amount
5. **Select Currency** - Click the currency dropdown
6. **Choose Date** - Pick from date picker
7. **Select Payment Method** - Click payment option
8. **Add Description** (optional) - Additional notes
9. **Submit** - Click "Save Expense"

### Testing the Autocomplete

#### Prefix Matching (Blue Badge)
Type exact prefixes to see fast Trie-based matches:

```
"cof"  → Coffee shop, Morning coffee
"lun"  → Lunch at office
"elec" → Electricity bill
"mov"  → Movie tickets
```

#### Fuzzy Matching (Red Badge)
Type with typos to see Wheeler Transform matching:

```
"coffe"     → Coffee shop (missing 'e')
"lunch"     → Lunch at office (partial match)
"grocery"   → Grocery shopping (typo tolerance)
"resturant" → Restaurant (misspelling)
```

#### Sample Pre-loaded Words

The app comes with 30 expense-related suggestions:
- Food: Morning coffee, Lunch at office, Dinner with friends, Grocery shopping
- Transport: Gas station, Bus fare, Taxi ride, Parking fee
- Bills: Electricity bill, Internet bill, Phone bill, Rent, Insurance
- Shopping: Online shopping, Supermarket, Convenience store
- Entertainment: Movie tickets, Gym membership
- Health: Pharmacy, Gym membership

## 🧪 Testing

### Run WASM Tests (Rust)

```bash
cd autocomplete

# Run all tests
cargo test

# Run with output
cargo test -- --nocapture

# Run specific test module
cargo test trie
cargo test wheeler
cargo test engine

# Generate coverage report (requires cargo-tarpaulin)
cargo install cargo-tarpaulin
cargo tarpaulin --out Html
```

**Expected Output:**
```
running 26 tests
test engine::tests::test_engine_basic_prefix ... ok
test trie::tests::test_prefix_search ... ok
test wheeler::tests::test_levenshtein_distance ... ok
...
test result: ok. 26 passed; 0 failed
```

### Run Frontend Tests (Vue)

```bash
cd open-form

# Type checking
npm run type-check

# Build (includes type checking)
npm run build

# Linting
npm run lint
```

### Manual Testing Checklist

- [ ] Type "cof" in Title → See "Coffee shop" suggestion
- [ ] Type "coffe" (typo) → See fuzzy match suggestions
- [ ] Click a suggestion → Title field fills automatically
- [ ] Use Arrow Down → Highlight next suggestion
- [ ] Use Enter → Select highlighted suggestion
- [ ] Use Escape → Close dropdown
- [ ] Type 1 character → No dropdown (minLength = 2)
- [ ] Submit form without title → Error shown
- [ ] Submit complete form → Success animation

## 🔧 Configuration

### Autocomplete Settings

In `App.vue`, modify the composable options:

```typescript
const { suggestions, isOpen, ... } = useAutocomplete(titleRef, {
  minLength: 2,        // Characters before triggering
  debounceMs: 150,     // Delay before query
  maxSuggestions: 5,   // Max results to show
  useWheeler: true,    // Enable fuzzy matching
})
```

### Add Custom Words

In `service.ts`, modify `SAMPLE_EXPENSE_WORDS`:

```typescript
export const SAMPLE_EXPENSE_WORDS = [
  { term: 'Your Custom Term', frequency: 50, tags: ['category'] },
  // ... more words
]
```

### Protobuf Configuration

Proto definitions in `autocomplete/proto/autocomplete.proto`:

```protobuf
message AutocompleteRequest {
    string query = 1;
    uint32 max_results = 2;
    bool use_wheeler = 3;
    uint32 wheeler_max_distance = 4;
}
```

## 📊 Performance

| Metric | Value |
|--------|-------|
| WASM Size | 161 KB (66 KB gzipped) |
| Prefix Search | O(m) where m = query length |
| Fuzzy Search | O(n × k) where n = words, k = edit distance |
| Test Coverage | 45 tests passing |
| Load Time | < 100ms on typical connection |

## 🛠️ Troubleshooting

### WASM Module Not Loading

```bash
# Check if WASM file exists
ls open-form/autocomplete/pkg/autocomplete.wasm

# Rebuild if missing
cd autocomplete
cargo build --target wasm32-unknown-unknown --release
cp target/wasm32-unknown-unknown/release/autocomplete.wasm ../open-form/autocomplete/pkg/
```

### TypeScript Errors

```bash
# Clear cache and reinstall
cd open-form
rm -rf node_modules/.vite
npm install
npm run build
```

### Autocomplete Not Showing

1. Open browser DevTools Console
2. Look for `[Autocomplete]` logs
3. Check if WASM initialized: `[Autocomplete] WASM module initialized`
4. Verify word count: Should show `Loaded 30 words`

### Build Fails

```bash
# Clean and rebuild
cd open-form
rm -rf dist node_modules
npm install
npm run build
```

## 📖 API Reference

### WASM Methods (Rust → JavaScript)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `new()` | - | WasmAutocomplete | Create new instance |
| `with_config()` | maxResults, useWheeler, maxDistance, boost | WasmAutocomplete | Create with custom config |
| `init_from_protobuf()` | base64Data | boolean | Load words from protobuf |
| `add_words_json()` | jsonString | void | Load words from JSON |
| `query()` | searchTerm | string (JSON) | Get suggestions |
| `word_count()` | - | number | Get indexed word count |
| `clear()` | - | void | Clear all data |

### Vue Composable

```typescript
const {
  suggestions,      // Ref<AutocompleteSuggestion[]>
  isLoading,        // Ref<boolean>
  isOpen,           // Ref<boolean>
  selectedIndex,    // Ref<number>
  selectSuggestion, // (index: number) => void
  handleKeydown,    // (e: KeyboardEvent) => void
  close,            // () => void
  open,             // () => void
} = useAutocomplete(inputRef, options)
```

## 🎨 UI Features

- **Dark Mode** - Toggle with sun/moon button
- **Responsive Design** - Works on mobile and desktop
- **Keyboard Navigation** - Full keyboard support
- **Loading States** - Spinner during WASM queries
- **Success Animation** - Overlay on successful submission
- **Error Validation** - Real-time form validation

## 📝 Example Protobuf Usage

### Send Words to WASM

```typescript
import { ProtobufCodec } from './protobuf'

const batch = {
  entries: [
    { term: 'Coffee', frequency: 10, tags: ['food'] },
    { term: 'Tea', frequency: 5, tags: ['food'] }
  ]
}

const encoded = ProtobufCodec.encodeWordBatch(batch)
const base64 = btoa(String.fromCharCode(...encoded))
autocompleteInstance.init_from_protobuf(base64)
```

### Query and Parse Results

```typescript
// Query
const resultsJson = autocompleteInstance.query('cof')
const results = JSON.parse(resultsJson)

// Results format:
[
  {
    term: "Coffee",
    score: 1000,
    is_prefix_match: true,
    is_wheeler_match: false,
    frequency: 10
  }
]
```

## 🔐 Security Notes

- WASM runs in sandboxed browser environment
- No server-side processing (client-side only)
- Protobuf encoding validates input data
- No external API calls (offline-capable)

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review test files for usage examples
3. Check browser console for error logs

---

**Built with:** Rust 🦀 + WebAssembly + Vue 3 + TypeScript + Protobuf
