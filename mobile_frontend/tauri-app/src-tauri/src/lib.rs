#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_geolocation::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_biometric::init())
        // plugins
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        // register commands
        .invoke_handler(tauri::generate_handler![
            greet,
            notify,
            pick_file,
            save_dialog,
            read_file,
            save_file,
            open_url,
            copy_to_clipboard,
            fetch_secure_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
