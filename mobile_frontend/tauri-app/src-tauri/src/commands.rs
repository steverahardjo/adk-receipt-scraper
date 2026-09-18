use std::path::{Path, PathBuf};

use tauri::{AppHandle, Manager};
use tauri_plugin_clipboard_manager::ClipboardExt;
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_notification::NotificationExt;
use tauri_plugin_opener::OpenerExt;

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

/// Resolve a caller-supplied relative path against the app data directory.
/// Rejects absolute paths and any path that escapes the directory (e.g. `..`).
fn resolve_in_app_dir(app: &AppHandle, path: &str) -> Result<PathBuf, String> {
    let base = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("app data dir unavailable: {e}"))?;
    std::fs::create_dir_all(&base).map_err(|e| format!("create app data dir failed: {e}"))?;
    let base = base
        .canonicalize()
        .map_err(|e| format!("resolve app data dir failed: {e}"))?;

    let requested = Path::new(path);
    if requested.is_absolute() {
        return Err("absolute paths are not allowed".into());
    }
    let file_name = requested
        .file_name()
        .ok_or_else(|| "invalid file name".to_string())?;
    let parent = requested.parent().unwrap_or_else(|| Path::new(""));

    let parent_dir = base.join(parent);
    std::fs::create_dir_all(&parent_dir).map_err(|e| format!("create directory failed: {e}"))?;
    let parent_dir = parent_dir
        .canonicalize()
        .map_err(|e| format!("resolve path failed: {e}"))?;

    if !parent_dir.starts_with(&base) {
        return Err("path escapes app data directory".into());
    }
    Ok(parent_dir.join(file_name))
}

#[tauri::command]
pub async fn read_file(app: AppHandle, path: String) -> Result<String, String> {
    let path = resolve_in_app_dir(&app, &path)?;
    std::fs::read_to_string(&path).map_err(|e| format!("read failed: {e}"))
}

#[tauri::command]
pub async fn save_file(app: AppHandle, path: String, contents: String) -> Result<(), String> {
    let path = resolve_in_app_dir(&app, &path)?;
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
