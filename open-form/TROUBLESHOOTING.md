# Autocomplete Troubleshooting Guide

## Issue: Autocomplete Not Working

### Check 1: Verify WASM Module Loads

Open browser console (F12) and look for:
```
[WASM] Autocomplete module initialized
[Autocomplete] WASM module initialized
[Autocomplete] Loaded 30 words
```

If you don't see these, the WASM isn't loading.

### Check 2: Verify File Paths

Ensure these files exist:
```bash
cd open-form
ls -la autocomplete/pkg/autocomplete.js
ls -la autocomplete/pkg/autocomplete.wasm
```

Expected output:
```
-rw-r--r-- autocomplete.js (6-7KB)
-rwxr-xr-x autocomplete.wasm (161KB)
```

### Check 3: Test WASM Import Manually

Open browser console on http://localhost:5173 and run:

```javascript
// Test if module can be imported
import('http://localhost:5173/autocomplete/pkg/autocomplete.js')
  .then(m => console.log('✅ WASM module loaded:', m))
  .catch(e => console.error('❌ Failed to load WASM:', e))
```

### Check 4: Verify Build Output

After `npm run build`, check:
```bash
ls -la dist/assets/autocomplete*.wasm
```

Should show the WASM file (~161KB).

### Common Fixes

#### Fix 1: Clear Cache and Rebuild
```bash
cd open-form
rm -rf node_modules/.vite
rm -rf dist
npm install
npm run build
npm run dev
```

#### Fix 2: Check TypeScript Types
```bash
# Ensure type declaration exists
ls types/wasm.d.ts
ls src/types/wasm.d.ts

# Rebuild with type checking
npm run type-check
```

#### Fix 3: Verify Vite Config
Ensure `vite.config.ts` has:
```typescript
export default defineConfig({
  // ... other config
  optimizeDeps: {
    exclude: ['autocomplete']
  }
})
```

#### Fix 4: Test in Browser Console

On http://localhost:5173, open console and type:
```javascript
// Check if service is working
import('http://localhost:5173/src/services/autocomplete/service.ts')
  .then(m => {
    console.log('Service loaded:', m);
    const svc = m.autocompleteService;
    console.log('Service ready:', svc.isReady());
    console.log('Word count:', svc.getWordCount());
  })
  .catch(e => console.error('Error:', e));
```

### Manual Testing Steps

1. **Open app**: http://localhost:5173
2. **Open Console**: F12 → Console tab
3. **Type in Title field**: Enter "cof" (3 characters)
4. **Watch for logs**:
   ```
   [useAutocomplete] Initialized with 30 words
   [useAutocomplete] Query: cof -> 3 suggestions
   ```
5. **Check dropdown**: Should appear below input with suggestions

### Expected Behavior

✅ **Working**:
- Type 2+ characters → dropdown appears after ~150ms
- Suggestions show with badges (blue "Prefix" or red "Match")
- Click suggestion → fills title field
- Console shows query logs

❌ **Not Working**:
- No dropdown appears
- Console shows errors about WASM import
- "WASM module not initialized" error

### Quick Debug Test

Add this to browser console:
```javascript
// Direct test of autocomplete
fetch('http://localhost:5173/autocomplete/pkg/autocomplete.wasm')
  .then(r => r.arrayBuffer())
  .then(buf => console.log('✅ WASM file accessible, size:', buf.byteLength, 'bytes'))
  .catch(e => console.error('❌ WASM file not accessible:', e));
```

If this fails → Vite isn't serving the WASM file correctly.

### Alternative: Use Production Build

If dev mode has issues:
```bash
cd open-form
npm run build
npm run preview
# Open: http://localhost:4173
```

### Still Not Working?

1. Check Node.js version: `node --version` (need >= 20.19)
2. Check npm version: `npm --version` (need >= 10)
3. Try different browser (Chrome/Edge recommended)
4. Disable browser extensions temporarily
5. Check for CORS errors in console

### Contact/Support

If none of the above works:
1. Copy console errors
2. Run: `npm run build 2>&1 | tee build.log`
3. Share build.log and console output
