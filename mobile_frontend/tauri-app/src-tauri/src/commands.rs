use tauri::AppHandle;
use tauri::Manager;
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_notification::NotificationExt;
use tauri_plugin_opener::OpenerExt;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub async fn notify(app: AppHandle, title: String, body: String) -> Result<(), String> {
    app.notification()
        .builder()
        .title(&title)
        .body(&body)
        .show()
        .map_err(|e| format!("notification failed: {e}"))
}

#[tauri::command]
pub async fn pick_file(app: AppHandle) -> Result<Option<String>, String> {
    let file = app.dialog().file().blocking_pick_file();
    Ok(file.map(|f| f.to_string()))
}

#[tauri::command]
pub async fn save_dialog(
    app: AppHandle,
    default_name: Option<String>,
) -> Result<Option<String>, String> {
    let mut builder = app.dialog().file();
    if let Some(name) = default_name {
        builder = builder.set_file_name(&name);
    }
    let path = builder.blocking_save_file();
    Ok(path.map(|p| p.to_string()))
}

#[tauri::command]
pub async fn read_file(_app: AppHandle, path: String) -> Result<String, String> {
    let path = std::path::PathBuf::from(&path);
    std::fs::read_to_string(&path).map_err(|e| format!("read failed: {e}"))
}

#[tauri::command]
pub async fn save_file(_app: AppHandle, path: String, contents: String) -> Result<(), String> {
    let path = std::path::PathBuf::from(&path);
    std::fs::write(&path, &contents).map_err(|e| format!("write failed: {e}"))
}

#[tauri::command]
pub async fn open_url(app: AppHandle, url: String) -> Result<(), String> {
    app.opener()
        .open_url(&url, None::<&str>)
        .map_err(|e| format!("open failed: {e}"))
}

#[tauri::command]
pub async fn copy_to_clipboard(app: AppHandle, text: String) -> Result<(), String> {
    app.clipboard()
        .write_text(text)
        .map_err(|e| format!("clipboard write failed: {e}"))
}

#[tauri::command]
pub async fn fetch_secure_data(app: AppHandle, key: String) -> Result<Option<String>, String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("path resolve failed: {e}"))?;

    let file_path = data_dir.join(format!("secure_{}", key));

    if !file_path.exists() {
        return Ok(None);
    }

    #[cfg(any(target_os = "android", target_os = "ios"))]
    {
        let authed = app
            .biometric()
            .authenticate(
                "Authenticate to access secure data",
                "Security Check",
                None::<&str>,
                None::<&str>,
            )
            .await
            .map_err(|e| format!("biometric auth failed: {e}"))?;

        if !authed {
            return Err("biometric authentication cancelled".into());
        }
    }

    let data =
        std::fs::read_to_string(&file_path).map_err(|e| format!("read secure data failed: {e}"))?;

    Ok(Some(data))
}
