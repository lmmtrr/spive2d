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
async fn handle_dropped_path(path: String, app_handle: AppHandle) -> Result<HashMap<String, Vec<Vec<String>>>, String> {
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
fn get_subdir_files(folder_path: String, app_handle: AppHandle) -> Result<HashMap<String, Vec<Vec<String>>>, String> {
    let root_path = Path::new(&folder_path);
    let mut dir_files_map: HashMap<String, Vec<Vec<String>>> = HashMap::new();
    if !root_path.exists() || !root_path.is_dir() {
        app_handle.emit("progress", false).unwrap();
        return Ok(dir_files_map);
    }    
    match process_directory_with_subdirs(root_path, root_path) {
        Ok(subdir_map) => {
            dir_files_map.extend(subdir_map);
        }
        Err(e) => {
            app_handle.emit("progress", false).unwrap();
            return Err(e);
        }
    }
    app_handle.emit("progress", false).unwrap();
    Ok(dir_files_map)
}

fn process_directory_with_subdirs(dir_path: &Path, base_path: &Path) -> Result<HashMap<String, Vec<Vec<String>>>, String> {
    let mut dir_files_map = HashMap::new();    
    let current_file_groups = process_files(dir_path, base_path)?;
    if !current_file_groups.is_empty() {
        let mut normalized_path = dir_path.to_string_lossy().replace(std::path::MAIN_SEPARATOR, "/");
        if !normalized_path.ends_with('/') {
            normalized_path.push('/');
        }
        dir_files_map.insert(normalized_path, current_file_groups);
    }    
    for entry in fs::read_dir(dir_path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let entry_path = entry.path();
        if entry_path.is_dir() {
            let subdir_file_groups = process_directory(&entry_path, base_path)?;
            if !subdir_file_groups.is_empty() {
                let mut normalized_subdir_path = entry_path.to_string_lossy().replace(std::path::MAIN_SEPARATOR, "/");
                if !normalized_subdir_path.ends_with('/') {
                    normalized_subdir_path.push('/');
                }
                dir_files_map.insert(normalized_subdir_path, subdir_file_groups);
            }
        }
    }
    Ok(dir_files_map)
}

fn process_files(dir_path: &Path, base_path: &Path) -> Result<Vec<Vec<String>>, String> {
    let mut file_groups = Vec::new();
    let mut atlas_bases = HashSet::with_capacity(64);
    let mut atlas_original_extensions: HashMap<String, String> = HashMap::with_capacity(64);
    let mut file_paths = HashMap::with_capacity(256);
    let entries = fs::read_dir(dir_path).map_err(|e| e.to_string())?;
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let entry_path = entry.path();
        if !entry_path.is_file() {
            continue;
        }
        let filename = match entry_path.file_name().and_then(|f| f.to_str()) {
            Some(name) => name,
            None => continue,
        };
        let relative_path = entry_path
            .strip_prefix(base_path)
            .map(|p| p.to_string_lossy().into_owned().replace(std::path::MAIN_SEPARATOR, "/"))
            .unwrap_or_else(|_| filename.to_string());
        let filename_lower = filename.to_lowercase();
        file_paths.insert(filename_lower.clone(), relative_path.clone());
        if filename_lower.contains(".atlas") {
            if let Some(idx) = filename_lower.find(".atlas") {
                let base_name_part = &filename[..idx];
                let extension_part = &filename[idx..];
                if !base_name_part.to_lowercase().contains("_bg") {
                    atlas_bases.insert(base_name_part.to_string());
                    atlas_original_extensions.insert(base_name_part.to_string(), extension_part.to_string());
                }
            }
        } else if filename_lower.contains(".moc3") {
            let adjusted_path = if let Some(slash_pos) = relative_path.find('/') {
                &relative_path[slash_pos + 1..]
            } else {
                &relative_path
            };
            if let Some(moc3_pos) = filename_lower.find(".moc3") {
                let base_name_part = &adjusted_path[..adjusted_path.len() - (filename.len() - moc3_pos)];
                let extension_part = &filename[moc3_pos..];
                file_groups.push(vec![base_name_part.to_string(), extension_part.to_string()]);
            }
        } else if filename_lower.contains(".moc") && !filename_lower.contains(".moc3") {
            let adjusted_path = if let Some(slash_pos) = relative_path.find('/') {
                &relative_path[slash_pos + 1..]
            } else {
                &relative_path
            };
            if let Some(moc_pos) = filename_lower.find(".moc") {
                let base_name_part = &adjusted_path[..adjusted_path.len() - (filename.len() - moc_pos)];
                let extension_part = &filename[moc_pos..];
                file_groups.push(vec![base_name_part.to_string(), extension_part.to_string()]);
            }
        }
    }
    for base_name in &atlas_bases {
        let base_lower = base_name.to_lowercase();
        let atlas_extension = atlas_original_extensions.get(base_name).cloned().unwrap_or_default();
        let mut main_file_info: Option<(String, String, &str)> = None;
        for (_f_lc, rp) in &file_paths {
            let original_fn = Path::new(rp).file_name().and_then(|f| f.to_str()).unwrap_or("");
            if original_fn.is_empty() { continue; }
            let original_fn_lower = original_fn.to_lowercase();
            let target_pattern = format!("{}.skel", base_lower);
            if original_fn_lower.contains(&target_pattern) {
                let ext_part = &original_fn[base_lower.len()..];
                main_file_info = Some((rp.clone(), ext_part.to_string(), "skel"));
                break;
            }
        }
        if main_file_info.is_none() {
            for (_f_lc, rp) in &file_paths {
                let original_fn = Path::new(rp).file_name().and_then(|f| f.to_str()).unwrap_or("");
                if original_fn.is_empty() { continue; }
                let original_fn_lower = original_fn.to_lowercase();
                let target_pattern = format!("{}.json", base_lower);
                if original_fn_lower.contains(&target_pattern) {
                    let ext_part = &original_fn[base_lower.len()..];
                    main_file_info = Some((rp.clone(), ext_part.to_string(), "json"));
                    break;
                }
            }
        }
        if let Some((main_path, main_extension, _file_type)) = main_file_info {
            let base_name_for_group = main_path.trim_end_matches(&main_extension).to_string();            
            let adjusted_base_name = if let Some(slash_pos) = base_name_for_group.find('/') {
                &base_name_for_group[slash_pos + 1..]
            } else {
                &base_name_for_group
            };
            let mut file_group = vec![
                adjusted_base_name.to_string(),
                main_extension.clone(), 
                atlas_extension,
            ];
            let bg_files = find_background_files(&base_lower, &file_paths, &main_extension);
            file_group.extend(bg_files);
            file_groups.push(file_group);
        }
    }
    file_groups.sort_unstable_by(|a, b| a[0].cmp(&b[0]));
    Ok(file_groups)
}

fn find_background_files(
    base_name_lower: &str,
    file_paths: &HashMap<String, String>,
    main_model_extension: &str
) -> Vec<String> {
    let mut bg_files = Vec::new();
    let bg_prefix_for_match = format!("{}_bg", base_name_lower);
    let main_model_extension_lower = main_model_extension.to_lowercase();
    for (filename_lower, path) in file_paths {
        if filename_lower.starts_with(&bg_prefix_for_match) && filename_lower.ends_with(&main_model_extension_lower) {
            let stem_part_lower = &filename_lower[..filename_lower.len() - main_model_extension_lower.len()];
            if stem_part_lower.starts_with(&bg_prefix_for_match) && stem_part_lower.len() >= bg_prefix_for_match.len() {
                let filename_part_original_case = if let Some(last_slash) = path.rfind('/') {
                    &path[last_slash + 1..]
                } else {
                    path
                };
                bg_files.push(filename_part_original_case[base_name_lower.len()..].to_string());
            }
        }
    }
    bg_files.sort_unstable();
    bg_files
}

fn process_directory(dir_path: &Path, base_path: &Path) -> Result<Vec<Vec<String>>, String> {
    let mut all_file_groups = Vec::new();
    let current_file_groups = process_files(dir_path, base_path)?;
    all_file_groups.extend(current_file_groups);
    for entry in fs::read_dir(dir_path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let entry_path = entry.path();
        if entry_path.is_dir() {
            let subdir_file_groups = process_directory(&entry_path, base_path)?;
            all_file_groups.extend(subdir_file_groups);
        }
    }
    all_file_groups.sort_unstable_by(|a, b| a[0].cmp(&b[0]));
    Ok(all_file_groups)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_webview_window("main").unwrap().open_devtools();
            Ok(())
        })
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