# 🚀 How to Run the Autocomplete App

## Quick Start (Copy & Paste)

```bash
# 1. Navigate to the frontend directory
cd open-form

# 2. Install dependencies (if not done)
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser to:
# http://localhost:5173
```

## ✅ Testing the Autocomplete

### Step 1: Open the App
Navigate to **http://localhost:5173** in your browser (Chrome/Edge recommended)

### Step 2: Open Developer Console
Press **F12** to open DevTools → Console tab

### Step 3: Verify WASM Loaded
You should see these console messages:
```
[WASM] Autocomplete module initialized
[Autocomplete] WASM module initialized
[Autocomplete] Loaded 30 words
```

### Step 4: Test the Title Field
1. Click on the **Title** input field
2. Type **"cof"** (3 characters)
3. Wait ~150ms - a dropdown should appear with suggestions
4. You should see:
   - **"Coffee shop"** (blue "Prefix" badge)
   - **"Morning coffee"** (blue "Prefix" badge)

### Step 5: Try Fuzzy Matching
1. Clear the title field
2. Type **"coffe"** (missing the 'e')
3. You should see suggestions with red "Match" badges (Wheeler fuzzy matching)

### Step 6: Select a Suggestion
- **Mouse**: Click on any suggestion
- **Keyboard**: Use ↑↓ arrow keys, then press Enter

The selected text will fill the Title field automatically!

## 🎯 Sample Search Terms to Try

| Type This | Expected Results |
|-----------|------------------|
| `cof` | Coffee shop, Morning coffee, Cafe |
| `lun` | Lunch at office |
| `gas` | Gas station |
| `elec` | Electricity bill |
| `mov` | Movie tickets |
| `gro` | Grocery shopping |
| `res` | Restaurant, Rent |
| `coffe` (typo) | Coffee shop (fuzzy match) |
| `lunch` | Lunch at office (partial match) |

## 🔧 If Autocomplete Doesn't Work

### Check 1: Console Errors
Open F12 Console - look for errors starting with `[WASM]` or `[Autocomplete]`

### Check 2: Verify Files Exist
```bash
cd open-form
ls -la autocomplete/pkg/
# Should show:
# - autocomplete.js (~7KB)
# - autocomplete.wasm (~161KB)
```

### Check 3: Test WASM Loading
In browser console (F12), run:
```javascript
fetch('http://localhost:5173/autocomplete/pkg/autocomplete.wasm')
  .then(r => r.arrayBuffer())
  .then(buf => console.log('✅ WASM size:', buf.byteLength, 'bytes'))
  .catch(e => console.error('❌ Error:', e))
```

Expected: `✅ WASM size: 161327 bytes`

### Check 4: Quick Fix
```bash
cd open-form
# Clear cache
rm -rf node_modules/.vite
rm -rf dist

# Rebuild
npm run build

# Restart dev server
npm run dev
```

### Still Not Working?
See **TROUBLESHOOTING.md** for detailed debugging steps.

## 📦 Production Build

```bash
cd open-form
npm run build
npm run preview
# Open: http://localhost:4173
```

## 🧪 Run Tests

### Rust WASM Tests
```bash
cd ../autocomplete
cargo test
# Expected: 45 tests passing
```

### Frontend Type Check
```bash
cd open-form
npm run type-check
```

## 📊 Expected Performance

- **Initial Load**: < 2 seconds
- **Autocomplete Response**: < 50ms (after typing)
- **WASM Module Size**: 161 KB (66 KB gzipped)
- **Word Count**: 30 pre-loaded expense terms

## 🎨 Features Demo

1. **Prefix Matching** (Blue Badge)
   - Type exact word beginnings
   - Ultra-fast Trie-based search
   
2. **Fuzzy Matching** (Red Badge)
   - Type with typos or partial words
   - Wheeler Transform finds matches
   
3. **Keyboard Navigation**
   - ↑↓ : Navigate suggestions
   - Enter : Select highlighted
   - Escape : Close dropdown
   
4. **Dark Mode**
   - Click sun/moon icon (top right)
   - Autocomplete works in both modes

## 💡 Pro Tips

- Type at least **2 characters** to trigger suggestions
- Wait **150ms** (debounce) before suggestions appear
- Maximum **5 suggestions** shown at once
- Suggestions are **scored** by frequency and match type
- **Prefix matches** are prioritized over fuzzy matches

## 🆘 Need Help?

1. Check **Console** (F12) for error messages
2. Verify you're on **http://localhost:5173** (not file://)
3. Try a **different browser** (Chrome/Edge work best)
4. See **TROUBLESHOOTING.md** for detailed help
5. Check **README_AUTOCOMPLETE.md** for full documentation

---

**Happy Autocompleting!** 🎉
