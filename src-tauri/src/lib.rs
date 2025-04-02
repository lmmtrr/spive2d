use std::collections::HashMap;
use std::collections::HashSet;
use std::fs;
use std::path::Path;

#[tauri::command]
fn get_subdir_files(folder_path: String) -> Result<HashMap<String, Vec<String>>, String> {
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
                                if let Some(stem) = entry_path.file_stem().and_then(|s| s.to_str())
                                {
                                    atlas_base_names.push(stem.to_string());
                                }
                            }
                            "moc" => {
                                if let Some(stem) = entry_path.file_stem().and_then(|s| s.to_str())
                                {
                                    moc_base_names.push(stem.to_string());
                                }
                            }
                            "moc3" => {
                                if let Some(stem) = entry_path.file_stem().and_then(|s| s.to_str())
                                {
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
                .map(|p| {
                    p.to_string_lossy()
                        .into_owned()
                        .replace(std::path::MAIN_SEPARATOR, "/")
                })
                .unwrap_or(json_file.clone());
            files_in_dir.push(relative_path);
        } else if skel_exists {
            let relative_path = skel_path
                .strip_prefix(base_path)
                .map(|p| {
                    p.to_string_lossy()
                        .into_owned()
                        .replace(std::path::MAIN_SEPARATOR, "/")
                })
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
                .map(|p| {
                    p.to_string_lossy()
                        .into_owned()
                        .replace(std::path::MAIN_SEPARATOR, "/")
                })
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
                .map(|p| {
                    p.to_string_lossy()
                        .into_owned()
                        .replace(std::path::MAIN_SEPARATOR, "/")
                })
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
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_subdir_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
