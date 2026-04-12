use std::collections::{HashMap, HashSet};
use std::fs;
use std::fs::OpenOptions;
use std::io::Write;
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
    let os_success = match ext {
        "zip" => {
            if cfg!(target_os = "windows") {
                std::process::Command::new("tar")
                    .arg("-xf")
                    .arg(path)
                    .arg("-C")
                    .arg(temp_dir)
                    .stdout(std::process::Stdio::null())
                    .stderr(std::process::Stdio::null())
                    .status()
                    .map(|s| s.success())
                    .unwrap_or(false)
            } else {
                let success = std::process::Command::new("unzip")
                    .arg("-q")
                    .arg(path)
                    .arg("-d")
                    .arg(temp_dir)
                    .stdout(std::process::Stdio::null())
                    .stderr(std::process::Stdio::null())
                    .status()
                    .map(|s| s.success())
                    .unwrap_or(false);
                if !success {
                    std::process::Command::new("tar")
                        .arg("-xf")
                        .arg(path)
                        .arg("-C")
                        .arg(temp_dir)
                        .stdout(std::process::Stdio::null())
                        .stderr(std::process::Stdio::null())
                        .status()
                        .map(|s| s.success())
                        .unwrap_or(false)
                } else {
                    true
                }
            }
        }
        "7z" => {
            if cfg!(target_os = "windows") {
                std::process::Command::new("tar")
                    .arg("-xf")
                    .arg(path)
                    .arg("-C")
                    .arg(temp_dir)
                    .stdout(std::process::Stdio::null())
                    .stderr(std::process::Stdio::null())
                    .status()
                    .map(|s| s.success())
                    .unwrap_or(false)
            } else {
                let mut out_arg = std::ffi::OsString::from("-o");
                out_arg.push(temp_dir.as_os_str());                
                std::process::Command::new("7z")
                    .arg("x")
                    .arg(path)
                    .arg(&out_arg)
                    .arg("-y")
                    .stdout(std::process::Stdio::null())
                    .stderr(std::process::Stdio::null())
                    .status()
                    .map(|s| s.success())
                    .unwrap_or(false)
            }
        }
        _ => false,
    };
    if os_success {
        return Ok(());
    }
    match ext {
        "zip" => {
            let file =
                fs::File::open(path).map_err(|e| format!("Failed to open ZIP file: {}", e))?;
            let mut archive =
                zip::ZipArchive::new(file).map_err(|e| format!("Failed to read ZIP: {}", e))?;
            archive
                .extract(temp_dir)
                .map_err(|e| format!("Failed to extract ZIP: {}", e))?;
        }
        "7z" => {
            sevenz_rust2::decompress_file(path, temp_dir)
                .map_err(|e| format!("Failed to extract 7Z: {}", e))?;
        }
        _ => unreachable!(),
    }
    Ok(())
}

#[tauri::command]
async fn handle_dropped_path(
    path: String,
    merge_sequential: bool,
    app_handle: AppHandle,
) -> Result<HashMap<String, Vec<Vec<String>>>, String> {
    app_handle.emit("progress", true).unwrap();
    let path_obj = Path::new(&path);
    if path_obj.is_dir() {
        get_subdir_files(path, merge_sequential, app_handle)
    } else if path_obj.is_file() {
        match path_obj
            .extension()
            .and_then(|e| e.to_str())
            .map(|e| e.to_lowercase())
        {
            Some(ext) if ext == "zip" || ext == "7z" => {
                let temp_dir =
                    tempfile::tempdir().map_err(|e| format!("Failed to create temp dir: {}", e))?;
                let temp_path = temp_dir.path().to_string_lossy().into_owned();
                extract_archive(&path, temp_dir.path(), &ext)?;
                let mut final_path = temp_path.clone();
                if let Ok(entries) = fs::read_dir(&temp_path) {
                    let entries: Vec<_> = entries.filter_map(|e| e.ok()).collect();
                    if entries.len() == 1
                        && entries[0]
                            .file_type()
                            .map(|ft| ft.is_dir())
                            .unwrap_or(false)
                    {
                        final_path = entries[0].path().to_string_lossy().into_owned();
                    }
                }
                let result = get_subdir_files(final_path, merge_sequential, app_handle.clone());
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
fn get_subdir_files(
    folder_path: String,
    merge_sequential: bool,
    app_handle: AppHandle,
) -> Result<HashMap<String, Vec<Vec<String>>>, String> {
    let root_path = Path::new(&folder_path);
    let mut dir_files_map: HashMap<String, Vec<Vec<String>>> = HashMap::new();
    if !root_path.exists() || !root_path.is_dir() {
        app_handle.emit("progress", false).unwrap();
        return Ok(dir_files_map);
    }
    match process_directory_with_subdirs(root_path, root_path, merge_sequential) {
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

#[tauri::command]
fn append_to_list(app_handle: AppHandle, text: String) -> Result<(), String> {
    let download_dir = app_handle.path().download_dir().map_err(|e| e.to_string())?;
    let export_dir = download_dir.join("spive2d_export");
    fs::create_dir_all(&export_dir).map_err(|e| e.to_string())?;
    let file_path = export_dir.join("spive2d_list.txt");
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(file_path)
        .map_err(|e| e.to_string())?;
    writeln!(file, "{}", text).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn clear_cache(app_handle: AppHandle) -> Result<(), String> {
    for window in app_handle.webview_windows().values() {
        window.clear_all_browsing_data().map_err(|e: tauri::Error| e.to_string())?;
    }
    Ok(())
}

fn process_directory_with_subdirs(
    dir_path: &Path,
    base_path: &Path,
    merge_sequential: bool,
) -> Result<HashMap<String, Vec<Vec<String>>>, String> {
    let mut dir_files_map = HashMap::new();
    let current_file_groups = process_files(dir_path, base_path, merge_sequential)?;
    if !current_file_groups.is_empty() {
        let mut normalized_path = dir_path
            .to_string_lossy()
            .replace(std::path::MAIN_SEPARATOR, "/");
        if !normalized_path.ends_with('/') {
            normalized_path.push('/');
        }
        dir_files_map.insert(normalized_path, current_file_groups);
    }
    for entry in fs::read_dir(dir_path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let entry_path = entry.path();
        if entry_path.is_dir() {
            let subdir_file_groups = process_directory(&entry_path, base_path, merge_sequential)?;
            if !subdir_file_groups.is_empty() {
                let mut normalized_subdir_path = entry_path
                    .to_string_lossy()
                    .replace(std::path::MAIN_SEPARATOR, "/");
                if !normalized_subdir_path.ends_with('/') {
                    normalized_subdir_path.push('/');
                }
                dir_files_map.insert(normalized_subdir_path, subdir_file_groups);
            }
        }
    }
    Ok(dir_files_map)
}

fn process_files(dir_path: &Path, base_path: &Path, merge_sequential: bool) -> Result<Vec<Vec<String>>, String> {
    let mut file_groups = Vec::new();
    let mut atlas_bases = HashSet::with_capacity(64);
    let mut atlas_original_extensions: HashMap<String, String> = HashMap::with_capacity(64);
    let mut file_paths = HashMap::with_capacity(256);
    let mut all_atlas_info: HashMap<String, String> = HashMap::with_capacity(64);
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
            .map(|p| {
                p.to_string_lossy()
                    .into_owned()
                    .replace(std::path::MAIN_SEPARATOR, "/")
            })
            .unwrap_or_else(|_| filename.to_string());
        let filename_lower = filename.to_lowercase();
        file_paths.insert(filename_lower.clone(), relative_path.clone());
        if filename_lower.contains(".atlas") {
            if let Some(idx) = filename_lower.find(".atlas") {
                let base_name_part = &filename[..idx];
                let extension_part = &filename[idx..];
                all_atlas_info.insert(base_name_part.to_string(), extension_part.to_string());
            }
        } else if filename_lower.contains(".moc3") {
            let adjusted_path = if let Some(slash_pos) = relative_path.find('/') {
                &relative_path[slash_pos + 1..]
            } else {
                &relative_path
            };
            if let Some(moc3_pos) = filename_lower.find(".moc3") {
                let base_name_part =
                    &adjusted_path[..adjusted_path.len() - (filename.len() - moc3_pos)];
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
                let base_name_part =
                    &adjusted_path[..adjusted_path.len() - (filename.len() - moc_pos)];
                let extension_part = &filename[moc_pos..];
                file_groups.push(vec![base_name_part.to_string(), extension_part.to_string()]);
            }
        }
    }
    let mut potential_extra_atlases = HashSet::new();
    for (base_name, extension) in &all_atlas_info {
        let base_name_lower = base_name.to_lowercase();
        if base_name_lower.contains("_bg") || base_name_lower.contains("_fg") {
            potential_extra_atlases.insert(base_name.clone());
        } else {
            atlas_bases.insert(base_name.clone());
            atlas_original_extensions.insert(base_name.clone(), extension.clone());
        }
    }
    for extra_base_name in potential_extra_atlases {
        let extra_base_name_lower = extra_base_name.to_lowercase();
        for suffix in ["_bg", "_fg"] {
            if let Some(pos) = extra_base_name_lower.rfind(suffix) {
                let corresponding_base_name_lower = &extra_base_name_lower[..pos];
                let has_corresponding_normal_atlas = atlas_bases
                    .iter()
                    .any(|b| b.to_lowercase() == *corresponding_base_name_lower);
                if !has_corresponding_normal_atlas {
                    atlas_bases.insert(extra_base_name.clone());
                    if let Some(extension) = all_atlas_info.get(&extra_base_name) {
                        atlas_original_extensions.insert(extra_base_name.clone(), extension.clone());
                    }
                }
                break;
            }
        }
    }
    for base_name in &atlas_bases {
        let base_lower = base_name.to_lowercase();
        let atlas_extension = atlas_original_extensions
            .get(base_name)
            .cloned()
            .unwrap_or_default();
        let mut main_file_info: Option<(String, String, &str)> = None;
        for rp in file_paths.values() {
            let original_fn = Path::new(rp)
                .file_name()
                .and_then(|f| f.to_str())
                .unwrap_or("");
            if original_fn.is_empty() {
                continue;
            }
            let original_fn_lower = original_fn.to_lowercase();
            let target_pattern = format!("{}.skel", base_lower);
            if let Some(pos) = original_fn_lower.find(&target_pattern) {
                let ext_start = pos + base_lower.len();
                if ext_start <= original_fn.len() {
                    let ext_part = &original_fn[ext_start..];
                    main_file_info = Some((rp.clone(), ext_part.to_string(), "skel"));
                    break;
                }
            }
        }
        if main_file_info.is_none() {
            for rp in file_paths.values() {
                let original_fn = Path::new(rp)
                    .file_name()
                    .and_then(|f| f.to_str())
                    .unwrap_or("");
                if original_fn.is_empty() {
                    continue;
                }
                let original_fn_lower = original_fn.to_lowercase();
                let target_pattern = format!("{}.json", base_lower);
                if let Some(pos) = original_fn_lower.find(&target_pattern) {
                    let ext_start = pos + base_lower.len();
                    if ext_start <= original_fn.len() {
                        let ext_part = &original_fn[ext_start..];
                        main_file_info = Some((rp.clone(), ext_part.to_string(), "json"));
                        break;
                    }
                }
            }
        }
        if main_file_info.is_none() {
            for rp in file_paths.values() {
                let original_fn = Path::new(rp)
                    .file_name()
                    .and_then(|f| f.to_str())
                    .unwrap_or("");
                if original_fn.is_empty() {
                    continue;
                }
                let original_fn_lower = original_fn.to_lowercase();
                let target_pattern = format!("{}.asset", base_lower);
                if let Some(pos) = original_fn_lower.find(&target_pattern) {
                    let ext_start = pos + base_lower.len();
                    if ext_start <= original_fn.len() {
                        let ext_part = &original_fn[ext_start..];
                        main_file_info = Some((rp.clone(), ext_part.to_string(), "asset"));
                        break;
                    }
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
            let bg_files = find_extra_files(&base_lower, "_bg", &file_paths, &main_extension);
            file_group.extend(bg_files);
            let fg_files = find_extra_files(&base_lower, "_fg", &file_paths, &main_extension);
            file_group.extend(fg_files);
            file_groups.push(file_group);
        }
    }
    file_groups.sort_unstable_by(|a, b| a[0].cmp(&b[0]));
    if merge_sequential && file_groups.len() > 1 {
        if file_groups.len() > 20 {
            file_groups.truncate(20);
        }
        let mut merged_group = Vec::new();
        let mut main_ext = String::new();
        let mut atlas_ext = String::new();
        let mut all_bases = Vec::new();
        let mut is_compatible = true;
        for group in &file_groups {
            if group.len() < 3 {
                is_compatible = false;
                break;
            }
            if main_ext.is_empty() {
                main_ext = group[1].clone();
                atlas_ext = group[2].clone();
            } else if main_ext != group[1] || atlas_ext != group[2] {
                is_compatible = false;
                break;
            }
            all_bases.push(group[0].clone());
            for i in 3..group.len() {
                all_bases.push(format!("{}{}", group[0], group[i].split('.').next().unwrap_or(&group[i])));
            }
        }
        if is_compatible && !all_bases.is_empty() {
            merged_group.push("MERGED".to_string());
            merged_group.push(main_ext);
            merged_group.push(atlas_ext);
            merged_group.extend(all_bases);
            return Ok(vec![merged_group]);
        }
    }
    Ok(file_groups)
}

fn find_extra_files(
    base_name_lower: &str,
    suffix: &str,
    file_paths: &HashMap<String, String>,
    main_model_extension: &str,
) -> Vec<String> {
    let mut extra_files = Vec::new();
    let prefix_for_match = format!("{}{}", base_name_lower, suffix);
    let main_model_extension_lower = main_model_extension.to_lowercase();
    for (filename_lower, path) in file_paths {
        if filename_lower.starts_with(&prefix_for_match)
            && filename_lower.ends_with(&main_model_extension_lower)
        {
            let stem_part_lower =
                &filename_lower[..filename_lower.len() - main_model_extension_lower.len()];
            if stem_part_lower.starts_with(&prefix_for_match)
                && stem_part_lower.len() >= prefix_for_match.len()
            {
                let filename_part_original_case = if let Some(last_slash) = path.rfind('/') {
                    &path[last_slash + 1..]
                } else {
                    path
                };
                if base_name_lower.len() <= filename_part_original_case.len() {
                    extra_files.push(filename_part_original_case[base_name_lower.len()..].to_string());
                }
            }
        }
    }
    extra_files.sort_unstable();
    extra_files
}

fn process_directory(dir_path: &Path, base_path: &Path, merge_sequential: bool) -> Result<Vec<Vec<String>>, String> {
    let mut all_file_groups = Vec::new();
    let current_file_groups = process_files(dir_path, base_path, merge_sequential)?;
    all_file_groups.extend(current_file_groups);
    for entry in fs::read_dir(dir_path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let entry_path = entry.path();
        if entry_path.is_dir() {
            let subdir_file_groups = process_directory(&entry_path, base_path, merge_sequential)?;
            all_file_groups.extend(subdir_file_groups);
        }
    }
    all_file_groups.sort_unstable_by(|a, b| a[0].cmp(&b[0]));
    Ok(all_file_groups)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|_app| {
            #[cfg(debug_assertions)]
            _app.get_webview_window("main").unwrap().open_devtools();
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
        .invoke_handler(tauri::generate_handler![
            get_subdir_files,
            handle_dropped_path,
            append_to_list,
            clear_cache
        ])
        .plugin(tauri_plugin_dialog::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
