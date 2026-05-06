use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_fs::FsExt;
use tauri_plugin_notification::NotificationExt;
use tauri_plugin_opener::OpenerExt;

// --------------------
// BASIC
// --------------------

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// --------------------
// NOTIFICATIONS
// --------------------

#[tauri::command]
fn notify(app: tauri::AppHandle, title: String, body: String) {
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .unwrap();
}

// --------------------
// FILE SYSTEM
// --------------------

#[tauri::command]
async fn pick_file(app: tauri::AppHandle) -> Option<String> {
    app.dialog().file().pick_file().await.map(|p| p.to_string())
}

#[tauri::command]
async fn save_dialog(app: tauri::AppHandle) -> Option<String> {
    app.dialog().file().save_file().await.map(|p| p.to_string())
}

#[tauri::command]
async fn read_file(app: tauri::AppHandle, path: String) -> Result<String, String> {
    let data = app.fs().read(path).await.map_err(|e| e.to_string())?;
    Ok(String::from_utf8_lossy(&data).to_string())
}

#[tauri::command]
async fn save_file(app: tauri::AppHandle, path: String, contents: String) -> Result<(), String> {
    app.fs()
        .write(path, contents.as_bytes())
        .await
        .map_err(|e| e.to_string())
}

// --------------------
// SYSTEM
// --------------------

#[tauri::command]
fn open_url(app: tauri::AppHandle, url: String) {
    app.opener().open_url(url, None).unwrap();
}

#[tauri::command]
fn copy_to_clipboard(app: tauri::AppHandle, text: String) {
    app.clipboard().write_text(text).unwrap();
}

// --------------------
// SECURE FETCH (OPTIONAL)
// --------------------

#[tauri::command]
async fn fetch_secure_data() -> Result<String, String> {
    let client = reqwest::Client::new();

    let res = client
        .get("https://api.yourapp.com/data")
        // .header("Authorization", "Bearer YOUR_SECRET")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let text = res.text().await.map_err(|e| e.to_string())?;

    Ok(text)
}

// --------------------
// RUN
// --------------------

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
