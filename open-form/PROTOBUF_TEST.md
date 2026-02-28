# 🧪 Protobuf Testing Guide

## Quick Test Page

A dedicated test page is available at:
**http://localhost:5173/test-protobuf.html**

This page provides a visual interface to test the autocomplete WASM module with protobuf packets.

## Using the Test Page

### Step 1: Initialize WASM
1. Open http://localhost:5173/test-protobuf.html
2. Click **"🚀 Initialize"**
3. Wait for status: **"Initialized ✅"**

### Step 2: Load Sample Data
Click **"📦 Load Words"** to load 15 sample expense terms

### Step 3: Test Queries
Try these queries:
- `cof` → Should find "Morning coffee", "Coffee shop"
- `lun` → Should find "Lunch meeting"
- `gas` → Should find "Gas refill"
- `elec` → Should find "Electricity bill"
- `coffe` (typo) → Should fuzzy match "Coffee" terms

### Step 4: Inspect Protobuf
Click **"📄 Generate Test Packet"** then **"🔍 Inspect Packet"** to see the encoded protobuf data

## Browser Console Testing

Open http://localhost:5173 and press **F12** to open the console.

### Available Test Commands

```javascript
// Run full test suite
window.testAutocomplete()

// Show protobuf packet details
window.printAutocompletePacket()

// Generate test packet object
const packet = window.generateAutocompletePacket()
console.log(packet)

// Encode custom word batch
const base64 = window.encodeWordBatchToBase64({
  entries: [
    { term: 'Test Term', frequency: 100, tags: ['test'] }
  ]
})
console.log('Encoded:', base64)

// Access sample words
console.log(window.sampleWords)
```

## Sample Protobuf Packet

Here's a ready-to-use protobuf packet you can send:

### WordBatch JSON
```json
{
  "entries": [
    { "term": "Morning coffee", "frequency": 50, "tags": ["food"] },
    { "term": "Lunch meeting", "frequency": 40, "tags": ["work"] },
    { "term": "Gas refill", "frequency": 30, "tags": ["transport"] }
  ]
}
```

### Encoded Base64
```
ChtKEk1Nb3JuaW5nIGNvZmZlZRAyGgRmb29kIhVKEkx1bmNoIG1lZXRpbmcQKBoaBHdvcmsiE0oMR2FzIHJlZmlsbBABGgd0cmFuc3BvcnQ=
```

### How to Use
```javascript
// In browser console
import('/src/services/autocomplete/service.ts').then(m => {
  const svc = m.autocompleteService
  svc.initialize().then(() => {
    const base64 = 'Cbt...' // paste full base64 above
    svc.sendProtobufPacket(base64)
    console.log('Words loaded:', svc.getWordCount())
    console.log('Query "cof":', svc.query('cof'))
  })
})
```

## Programmatic Testing

### Import Test Utilities

```typescript
import {
  SAMPLE_WORD_BATCH,
  encodeWordBatchToBase64,
  testWithProtobuf,
} from '@/services/autocomplete/test-data'

// Encode to base64
const base64 = encodeWordBatchToBase64(SAMPLE_WORD_BATCH)

// Run automated tests
await testWithProtobuf()
```

### Test in Your Code

```typescript
import { autocompleteService } from '@/services/autocomplete/service'
import { SAMPLE_WORD_BATCH } from '@/services/autocomplete/test-data'

async function test() {
  // Initialize
  await autocompleteService.initialize()
  
  // Load words
  await autocompleteService.loadWordsJson(SAMPLE_WORD_BATCH.entries)
  
  // Query
  const results = autocompleteService.query('cof', 5)
  console.table(results)
  
  // Get stats
  console.log('Word count:', autocompleteService.getWordCount())
}

test()
```

## Expected Results

### Query: "cof"
```
┌─────┬──────────────────┬───────┬──────────┐
│ #   │ Term             │ Score │ Type     │
├─────┼──────────────────┼───────┼──────────┤
│ 1   │ Morning coffee   │ 5000  │ Prefix   │
│ 2   │ Coffee shop      │ 3500  │ Prefix   │
│ 3   │ Cafe             │ 100   │ Wheeler  │
└─────┴──────────────────┴───────┴──────────┘
```

### Query: "coffe" (typo)
```
┌─────┬──────────────────┬───────┬──────────┐
│ #   │ Term             │ Score │ Type     │
├─────┼──────────────────┼───────┼──────────┤
│ 1   │ Morning coffee   │ 4     │ Wheeler  │
│ 2   │ Coffee shop      │ 4     │ Wheeler  │
└─────┴──────────────────┴───────┴──────────┘
```

## Performance Benchmarks

| Metric | Expected Value |
|--------|---------------|
| WASM Init | < 100ms |
| Load 30 Words | < 50ms |
| Query Response | < 10ms |
| Protobuf Encoding | < 5ms |

## Troubleshooting Test Page

### Issue: Test page doesn't load
**Fix:** Check browser console for import errors

### Issue: WASM fails to initialize
**Fix:** 
```bash
# Verify files exist
ls open-form/autocomplete/pkg/
# Should show autocomplete.js and autocomplete.wasm
```

### Issue: No results from queries
**Fix:** 
1. Check if words are loaded: `autocompleteService.getWordCount()`
2. Should show: `30` (or your loaded word count)
3. If 0, reload words: `autocompleteService.loadWordsJson(window.sampleWords)`

## Next Steps

After testing:
1. ✅ Verify all test queries work
2. ✅ Check protobuf encoding/decoding
3. ✅ Test fuzzy matching (typos)
4. ✅ Verify performance is acceptable
5. ✅ Integrate into your main app

---

**Happy Testing!** 🎉

For more details, see:
- `RUN_APP.md` - How to run the main app
- `TROUBLESHOOTING.md` - Debug guide
- `README_AUTOCOMPLETE.md` - Full documentation
