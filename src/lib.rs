use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::Path;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, Manager};

#[derive(Default)]
struct AppState {
    temp_dirs: Mutex<Vec<tempfile::TempDir>>,
}

impl AppState {
    fn new() -> Self {
        Self {
            temp_dirs: Mutex::new(Vec::new()),
        }
    }
}

fn extract_archive(path: &str, temp_dir: &Path, ext: &str) -> Result<(), String> {
    match ext {
        "zip" => {
            let file = fs::File::open(path).map_err(|e| format!("Failed to open ZIP file: {}", e))?;
            let mut archive = zip::ZipArchive::new(file).map_err(|e| format!("Failed to read ZIP: {}", e))?;
            archive.extract(temp_dir).map_err(|e| format!("Failed to extract ZIP: {}", e))?;
        }
        "7z" => {
            sevenz_rust2::decompress_file(path, temp_dir).map_err(|e| format!("Failed to extract 7Z: {}", e))?;
        }
        _ => unreachable!(),
    }
    Ok(())
}

#[tauri::command]
async fn handle_dropped_path(path: String, app_handle: AppHandle) -> Result<HashMap<String, Vec<String>>, String> {
    app_handle.emit("progress", true).unwrap();
    let path_obj = Path::new(&path);
    if path_obj.is_dir() {
        get_subdir_files(path, app_handle)
    } else if path_obj.is_file() {
        match path_obj.extension().and_then(|e| e.to_str()).map(|e| e.to_lowercase()) {
            Some(ext) if ext == "zip" || ext == "7z" => {
                let temp_dir = tempfile::tempdir().map_err(|e| format!("Failed to create temp dir: {}", e))?;
                let temp_path = temp_dir.path().to_string_lossy().into_owned();
                extract_archive(&path, temp_dir.path(), &ext)?;
                let mut final_path = temp_path.clone();
                if let Ok(entries) = fs::read_dir(&temp_path) {
                    let entries: Vec<_> = entries.filter_map(|e| e.ok()).collect();
                    if entries.len() == 1 && entries[0].file_type().map(|ft| ft.is_dir()).unwrap_or(false) {
                        final_path = entries[0].path().to_string_lossy().into_owned();
                    }
                }
                let result = get_subdir_files(final_path, app_handle.clone());
                let state = app_handle.state::<AppState>();
                let mut temp_dirs = state.temp_dirs.lock().unwrap();
                temp_dirs.push(temp_dir);
                result
            }
            _ => {
                app_handle.emit("progress", false).unwrap();
                Err("Unsupported file type".to_string())
            }
        }
    } else {
        app_handle.emit("progress", false).unwrap();
        Err("Invalid path".to_string())
    }
}

#[tauri::command]
fn get_subdir_files(folder_path: String, app_handle: AppHandle) -> Result<HashMap<String, Vec<String>>, String> {
    let path = Path::new(&folder_path);
    let mut dir_files: HashMap<String, Vec<String>> = HashMap::new();
    if !path.exists() || !path.is_dir() {
        return Ok(dir_files);
    }
    let root_files = process_files(path, path)?;
    if !root_files.is_empty() {
        let normalized_folder_path = folder_path.replace(std::path::MAIN_SEPARATOR, "/");
        dir_files.insert(normalized_folder_path, root_files);
    }
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries {
            if let Ok(entry) = entry {
                let entry_path = entry.path();
                if entry_path.is_dir() {
                    let subdir_name = entry_path
                        .to_string_lossy()
                        .into_owned()
                        .replace(std::path::MAIN_SEPARATOR, "/");
                    let subdir_files = process_directory(&entry_path, &entry_path)?;
                    if !subdir_files.is_empty() {
                        dir_files.insert(subdir_name, subdir_files);
                    }
                }
            }
        }
    }
    app_handle.emit("progress", false).unwrap();
    Ok(dir_files)
}

fn process_files(dir_path: &Path, base_path: &Path) -> Result<Vec<String>, String> {
    let mut files_in_dir = Vec::new();
    let mut atlas_base_names = Vec::new();
    let mut moc_base_names = Vec::new();
    let mut moc3_base_names = Vec::new();
    if let Ok(entries) = fs::read_dir(dir_path) {
        for entry in entries {
            if let Ok(entry) = entry {
                let entry_path = entry.path();
                if entry_path.is_file() {
                    if let Some(ext) = entry_path.extension().and_then(|e| e.to_str()) {
                        match ext.to_lowercase().as_str() {
                            "atlas" => {
                                if let Some(stem) = entry_path.file_stem().and_then(|s| s.to_str()) {
                                    atlas_base_names.push(stem.to_string());
                                }
                            }
                            "moc" => {
                                if let Some(stem) = entry_path.file_stem().and_then(|s| s.to_str()) {
                                    moc_base_names.push(stem.to_string());
                                }
                            }
                            "moc3" => {
                                if let Some(stem) = entry_path.file_stem().and_then(|s| s.to_str()) {
                                    moc3_base_names.push(stem.to_string());
                                }
                            }
                            _ => {}
                        }
                    }
                }
            }
        }
    }
    for base_name in atlas_base_names {
        let json_file = format!("{}.json", base_name);
        let skel_file = format!("{}.skel", base_name);
        let json_path = dir_path.join(&json_file);
        let skel_path = dir_path.join(&skel_file);
        let json_exists = fs::metadata(&json_path).is_ok();
        let skel_exists = fs::metadata(&skel_path).is_ok();
        if json_exists {
            let relative_path = json_path
                .strip_prefix(base_path)
                .map(|p| p.to_string_lossy().into_owned().replace(std::path::MAIN_SEPARATOR, "/"))
                .unwrap_or(json_file.clone());
            files_in_dir.push(relative_path);
        } else if skel_exists {
            let relative_path = skel_path
                .strip_prefix(base_path)
                .map(|p| p.to_string_lossy().into_owned().replace(std::path::MAIN_SEPARATOR, "/"))
                .unwrap_or(skel_file.clone());
            files_in_dir.push(relative_path);
        }
    }
    for base_name in moc_base_names {
        let moc_file = format!("{}.moc", base_name);
        let moc_path = dir_path.join(&moc_file);
        if fs::metadata(&moc_path).is_ok() {
            let relative_path = moc_path
                .strip_prefix(base_path)
                .map(|p| p.to_string_lossy().into_owned().replace(std::path::MAIN_SEPARATOR, "/"))
                .unwrap_or(moc_file.clone());
            files_in_dir.push(relative_path);
        }
    }
    for base_name in moc3_base_names {
        let moc3_file = format!("{}.moc3", base_name);
        let moc3_path = dir_path.join(&moc3_file);
        if fs::metadata(&moc3_path).is_ok() {
            let relative_path = moc3_path
                .strip_prefix(base_path)
                .map(|p| p.to_string_lossy().into_owned().replace(std::path::MAIN_SEPARATOR, "/"))
                .unwrap_or(moc3_file.clone());
            files_in_dir.push(relative_path);
        }
    }
    files_in_dir.sort();
    Ok(files_in_dir)
}

fn process_directory(dir_path: &Path, base_path: &Path) -> Result<Vec<String>, String> {
    let mut files_in_dir = HashSet::new();
    let current_files = process_files(dir_path, base_path)?;
    files_in_dir.extend(current_files);
    for entry in fs::read_dir(dir_path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let entry_path = entry.path();
        if entry_path.is_dir() {
            let subdir_files = process_directory(&entry_path, base_path)?;
            files_in_dir.extend(subdir_files);
        }
    }
    let mut result: Vec<String> = files_in_dir.into_iter().collect();
    result.sort();
    Ok(result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState::new())
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                let app_handle = window.app_handle();
                let state = app_handle.state::<AppState>();
                let mut temp_dirs = state.temp_dirs.lock().unwrap();
                temp_dirs.clear();
            }
        })
        .invoke_handler(tauri::generate_handler![get_subdir_files, handle_dropped_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}