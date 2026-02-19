//! Demo CLI for the autocomplete engine
//!
//! This demonstrates basic usage of the autocomplete system.

use autocomplete::engine::{AutocompleteEngine, AutocompleteConfig};

fn main() {
    println!("🚀 Autocomplete Engine Demo\n");

    // Create engine with custom config
    let config = AutocompleteConfig {
        max_results: 5,
        use_wheeler: true,
        wheeler_max_distance: 2,
        prefix_boost: 100,
    };
    let mut engine = AutocompleteEngine::with_config(config);

    // Add sample words
    let words = vec![
        ("autocomplete", 15, vec!["search", "ui"]),
        ("autofill", 10, vec!["form", "ui"]),
        ("automatic", 8, vec!["system"]),
        ("automation", 12, vec!["process"]),
        ("automaton", 5, vec!["machine"]),
        ("hello", 20, vec!["greeting"]),
        ("help", 15, vec!["support"]),
        ("held", 8, vec![]),
        ("hero", 10, vec![]),
        ("world", 25, vec!["greeting"]),
        ("work", 18, vec![]),
        ("word", 12, vec![]),
    ];

    engine.add_words(
        words
            .into_iter()
            .map(|(t, f, tags)| (t.to_string(), f, tags.into_iter().map(String::from).collect()))
            .collect::<Vec<_>>(),
    );

    println!("📚 Indexed {} words\n", engine.word_count());

    // Demo queries
    let queries = vec![
        ("auto", "Prefix match"),
        ("autofll", "Fuzzy match (typo)"),
        ("hel", "Prefix match"),
        ("helo", "Fuzzy match (typo)"),
        ("wor", "Prefix match"),
    ];

    for (query, description) in queries {
        println!("🔍 Query: '{}' ({})", query, description);
        let results = engine.query(query);
        
        if results.is_empty() {
            println!("   No results\n");
        } else {
            for (i, result) in results.iter().enumerate() {
                let match_type = if result.is_prefix_match {
                    "prefix"
                } else if result.is_wheeler_match {
                    "wheeler"
                } else {
                    "unknown"
                };
                println!(
                    "   {}. {} (score: {}, type: {})",
                    i + 1,
                    result.term,
                    result.score,
                    match_type
                );
            }
            println!();
        }
    }

    println!("✨ Demo complete!");
}
