use tauri_plugin_clipboard_manager;
use tauri_plugin_deep_link;
use tauri_plugin_dialog;
use tauri_plugin_fs;
use tauri_plugin_geolocation;
use tauri_plugin_http;
use tauri_plugin_notification;
use tauri_plugin_opener;

#[cfg(any(target_os = "android", target_os = "ios"))]
use tauri_plugin_biometric;

mod commands;

use crate::commands::{
    copy_to_clipboard, fetch_secure_data, greet, notify, open_url, pick_file, read_file,
    save_dialog, save_file,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_geolocation::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init());

    #[cfg(any(target_os = "android", target_os = "ios"))]
    let builder = builder.plugin(tauri_plugin_biometric::init());

    builder
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
