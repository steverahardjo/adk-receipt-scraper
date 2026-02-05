## Autocomplete (frontend)
A rust implementation of a wasm trie operations for the fetched autcompletion data.

### Details
- App are written in rust and being exported as a wasm which later can be used as a frontend
- Trie are create3d and optimized for a prefix autcompletion:
  - a packed node as a field array.
  - Input are an array of words being send from backend.
  - Exploring how to enable fuzzy search alongside this trie.

