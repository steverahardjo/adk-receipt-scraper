//! WASM bindings for the autocomplete engine.
//!
//! This module provides the JavaScript/TypeScript interface for the autocomplete engine,
//! enabling protobuf packet handling and autocomplete queries from web applications.

use wasm_bindgen::prelude::*;
use base64::{Engine as _, engine::general_purpose::STANDARD as BASE64};
use prost::Message;

use crate::engine::{AutocompleteEngine, AutocompleteConfig, AutocompleteEntry};
use crate::proto;

/// Main WASM autocomplete interface
#[wasm_bindgen]
pub struct WasmAutocomplete {
    engine: AutocompleteEngine,
}

#[wasm_bindgen]
impl WasmAutocomplete {
    /// Creates a new WasmAutocomplete instance with default configuration
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            engine: AutocompleteEngine::new(),
        }
    }

    /// Creates a new instance with custom configuration
    #[wasm_bindgen]
    pub fn with_config(
        max_results: u32,
        use_wheeler: bool,
        wheeler_max_distance: u32,
        prefix_boost: u32,
    ) -> Self {
        let config = AutocompleteConfig {
            max_results: max_results as usize,
            use_wheeler,
            wheeler_max_distance,
            prefix_boost,
        };
        Self {
            engine: AutocompleteEngine::with_config(config),
        }
    }

    /// Initializes the autocomplete engine from a protobuf WordBatch
    /// 
    /// # Arguments
    /// * `data` - Base64 encoded protobuf WordBatch message
    #[wasm_bindgen]
    pub fn init_from_protobuf(&mut self, data: &str) -> Result<bool, JsValue> {
        // Decode base64
        let decoded = BASE64
            .decode(data)
            .map_err(|e| JsValue::from_str(&format!("Failed to decode base64: {}", e)))?;

        // Parse protobuf
        let batch = proto::WordBatch::decode(&decoded[..])
            .map_err(|e| JsValue::from_str(&format!("Failed to parse protobuf: {}", e)))?;

        // Add words to engine
        let words: Vec<(String, u32, Vec<String>)> = batch
            .entries
            .into_iter()
            .map(|entry| {
                (
                    entry.term,
                    entry.frequency,
                    entry.tags,
                )
            })
            .collect();

        self.engine.add_words(words);
        Ok(true)
    }

    /// Adds words from a JSON string
    /// 
    /// # Arguments
    /// * `json` - JSON array of objects with {term, frequency, tags}
    #[wasm_bindgen]
    pub fn add_words_json(&mut self, json: &str) -> Result<(), JsValue> {
        let value: serde_json::Value = serde_json::from_str(json)
            .map_err(|e| JsValue::from_str(&format!("Invalid JSON: {}", e)))?;

        let arr = value.as_array()
            .ok_or_else(|| JsValue::from_str("Expected JSON array"))?;

        let words: Vec<(String, u32, Vec<String>)> = arr
            .iter()
            .filter_map(|v| {
                let obj = v.as_object()?;
                let term = obj.get("term")?.as_str()?.to_string();
                let frequency = obj.get("frequency")?.as_u64()? as u32;
                let tags = obj
                    .get("tags")?
                    .as_array()?
                    .iter()
                    .filter_map(|t| t.as_str().map(String::from))
                    .collect();
                Some((term, frequency, tags))
            })
            .collect();

        self.engine.add_words(words);
        Ok(())
    }

    /// Performs an autocomplete query
    /// 
    /// # Arguments
    /// * `query` - The search query string
    /// 
    /// # Returns
    /// JSON array of results with {term, score, is_prefix_match, is_wheeler_match}
    #[wasm_bindgen]
    pub fn query(&self, query: &str) -> String {
        let results = self.engine.query(query);
        self.results_to_json(&results)
    }

    /// Performs a query from a protobuf AutocompleteRequest
    /// 
    /// # Arguments
    /// * `request_data` - Base64 encoded protobuf AutocompleteRequest
    /// 
    /// # Returns
    /// Base64 encoded protobuf AutocompleteResponse
    #[wasm_bindgen]
    pub fn query_protobuf(&self, request_data: &str) -> Result<String, JsValue> {
        // Decode base64
        let decoded = BASE64
            .decode(request_data)
            .map_err(|e| JsValue::from_str(&format!("Failed to decode base64: {}", e)))?;

        // Parse request
        let request = proto::AutocompleteRequest::decode(&decoded[..])
            .map_err(|e| JsValue::from_str(&format!("Failed to parse request: {}", e)))?;

        // Perform query
        let results = if request.use_wheeler {
            self.engine.query(&request.query)
        } else {
            self.engine.prefix_query(&request.query, request.max_results as usize)
                .into_iter()
                .map(|r| AutocompleteEntry {
                    term: r.term,
                    score: r.score,
                    is_prefix_match: r.is_prefix_match,
                    is_wheeler_match: false,
                    frequency: r.frequency,
                })
                .collect()
        };

        // Build response
        let mut prefix_count = 0u32;
        let mut wheeler_count = 0u32;
        let response_results: Vec<proto::AutocompleteResult> = results
            .into_iter()
            .map(|r| {
                if r.is_prefix_match {
                    prefix_count += 1;
                }
                if r.is_wheeler_match {
                    wheeler_count += 1;
                }
                proto::AutocompleteResult {
                    term: r.term,
                    score: r.score,
                    is_prefix_match: r.is_prefix_match,
                    is_wheeler_match: r.is_wheeler_match,
                }
            })
            .collect();

        let response = proto::AutocompleteResponse {
            results: response_results,
            prefix_matches: prefix_count,
            wheeler_matches: wheeler_count,
        };

        // Encode response
        let mut encoded = Vec::new();
        response.encode(&mut encoded)
            .map_err(|e| JsValue::from_str(&format!("Failed to encode response: {}", e)))?;

        Ok(BASE64.encode(encoded))
    }

    /// Performs a prefix-only query (faster, no fuzzy matching)
    #[wasm_bindgen]
    pub fn prefix_query(&self, query: &str, max_results: u32) -> String {
        let results = self.engine.prefix_query(query, max_results as usize);
        self.results_to_json(&results)
    }

    /// Performs a Wheeler-only fuzzy query
    #[wasm_bindgen]
    pub fn wheeler_query(&self, query: &str, max_distance: u32) -> String {
        let results = self.engine.wheeler_query(query, max_distance);
        self.results_to_json(&results)
    }

    /// Returns the total word count
    #[wasm_bindgen]
    pub fn word_count(&self) -> u32 {
        self.engine.word_count() as u32
    }

    /// Clears all data from the engine
    #[wasm_bindgen]
    pub fn clear(&mut self) {
        self.engine.clear();
    }

    /// Updates configuration
    #[wasm_bindgen]
    pub fn set_config(
        &mut self,
        max_results: u32,
        use_wheeler: bool,
        wheeler_max_distance: u32,
        prefix_boost: u32,
    ) {
        let config = AutocompleteConfig {
            max_results: max_results as usize,
            use_wheeler,
            wheeler_max_distance,
            prefix_boost,
        };
        self.engine.set_config(config);
    }
}

impl WasmAutocomplete {
    /// Converts results to JSON string
    fn results_to_json(&self, results: &[AutocompleteEntry]) -> String {
        use serde_json::json;
        
        let json_results: Vec<_> = results
            .iter()
            .map(|r| {
                json!({
                    "term": r.term,
                    "score": r.score,
                    "is_prefix_match": r.is_prefix_match,
                    "is_wheeler_match": r.is_wheeler_match,
                    "frequency": r.frequency,
                })
            })
            .collect();

        serde_json::to_string(&json_results).unwrap_or_else(|_| "[]".to_string())
    }
}

impl Default for WasmAutocomplete {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use wasm_bindgen_test::*;

    #[wasm_bindgen_test]
    fn test_wasm_new() {
        let autocomplete = WasmAutocomplete::new();
        assert_eq!(autocomplete.word_count(), 0);
    }

    #[wasm_bindgen_test]
    fn test_wasm_add_words_json() {
        let mut autocomplete = WasmAutocomplete::new();
        let json = r#"[
            {"term": "hello", "frequency": 10, "tags": ["greeting"]},
            {"term": "help", "frequency": 5, "tags": []}
        ]"#;
        
        autocomplete.add_words_json(json).unwrap();
        assert_eq!(autocomplete.word_count(), 2);
    }

    #[wasm_bindgen_test]
    fn test_wasm_query() {
        let mut autocomplete = WasmAutocomplete::new();
        let json = r#"[
            {"term": "hello", "frequency": 10, "tags": []},
            {"term": "help", "frequency": 5, "tags": []},
            {"term": "world", "frequency": 20, "tags": []}
        ]"#;
        
        autocomplete.add_words_json(json).unwrap();
        let results = autocomplete.query("hel");
        
        assert!(results.contains("hello"));
        assert!(results.contains("help"));
    }

    #[wasm_bindgen_test]
    fn test_wasm_prefix_query() {
        let mut autocomplete = WasmAutocomplete::new();
        let json = r#"[
            {"term": "test", "frequency": 10, "tags": []},
            {"term": "testing", "frequency": 15, "tags": []}
        ]"#;
        
        autocomplete.add_words_json(json).unwrap();
        let results = autocomplete.prefix_query("test", 10);
        
        assert!(results.contains("test"));
        assert!(results.contains("testing"));
    }

    #[wasm_bindgen_test]
    fn test_wasm_clear() {
        let mut autocomplete = WasmAutocomplete::new();
        let json = r#"[{"term": "hello", "frequency": 10, "tags": []}]"#;
        
        autocomplete.add_words_json(json).unwrap();
        assert_eq!(autocomplete.word_count(), 1);
        
        autocomplete.clear();
        assert_eq!(autocomplete.word_count(), 0);
    }
}
