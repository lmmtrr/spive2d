use std::collections::{HashMap, HashSet};
use std::fs;
use std::fs::OpenOptions;
use std::io::{Read, Write};
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

#[derive(serde::Serialize, Clone)]
struct SceneData {
    name: String,
    #[serde(rename = "mainExt")]
    main_ext: String,
    #[serde(rename = "atlasExt")]
    atlas_ext: String,
    files: Vec<String>,
    #[serde(rename = "isMerged")]
    is_merged: bool,
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

fn find_all_files(dir: &Path) -> Vec<std::path::PathBuf> {
    let mut files = Vec::new();
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.is_dir() {
                files.extend(find_all_files(&path));
            } else {
                files.push(path);
            }
        }
    }
    files
}

fn is_definitely_not_unity_bundle(path: &Path) -> bool {
    if let Some(ext) = path.extension().and_then(|e| e.to_str()) {
        let ext_lower = ext.to_lowercase();
        match ext_lower.as_str() {
            "png" | "jpg" | "jpeg" | "webp" | "gif" | "bmp" | "tga" | "tiff" | "ico" => true,
            "json" | "txt" | "xml" | "yaml" | "yml" | "ini" | "conf" | "md" => true,
            "moc3" | "moc" => true,
            "skel" | "atlas" => true,
            "wav" | "mp3" | "ogg" | "flac" | "aac" | "m4a" | "wma" => true,
            "mp4" | "avi" | "mkv" | "mov" | "wmv" | "flv" | "webm" => true,
            "zip" | "7z" | "rar" | "tar" | "gz" | "bz2" | "xz" => true,
            "dll" | "exe" | "pdb" | "so" | "dylib" | "bin" => true,
            "html" | "css" | "js" | "ts" => true,
            _ => false,
        }
    } else {
        false
    }
}

fn get_model_group_key(path: &Path) -> String {
    let mut stem = path
        .file_name()
        .map(|s| s.to_string_lossy().to_string())
        .unwrap_or_else(|| "bundle".to_string());
    stem = stem.to_lowercase();
    for ext in &[".ab", ".asset", ".assets", ".assetbundle", ".bundle", ".bytes", ".prefab", ".unity3d"] {
        if stem.ends_with(ext) {
            stem = stem[..stem.len() - ext.len()].to_string();
        }
    }
    for marker in &["l2d_", "live2d_", "spine_", "chara_", "character_"] {
        if let Some(idx) = stem.find(marker) {
            let start_digits = idx + marker.len();
            let mut end_digits = start_digits;
            while end_digits < stem.len() && stem.as_bytes()[end_digits].is_ascii_digit() {
                end_digits += 1;
            }
            if end_digits > start_digits {
                stem = stem[..end_digits].to_string();
                break;
            }
        }
    }
    let suffixes = &[
        "texture", "textures", "tex",
        "moc", "moc3",
        "physics", "physics3",
        "pose", "pose3",
        "motion", "motion3",
        "expression", "expressions", "exp", "exp3",
        "userdata", "userdata3",
        "cdi", "cdi3",
        "postprocess", "postprocessing",
        "material", "materials", "mat",
        "controller", "controllers",
        "animator", "animation", "animations",
        "prefab", "prefabs",
        "asset", "assets",
        "bundle", "bundles",
        "model", "model3"
    ];
    let mut changed = true;
    while changed {
        changed = false;        
        if let Some(idx) = stem.rfind('_') {
            let part = &stem[idx + 1 ..];
            if part.len() >= 8 && part.chars().all(|c| c.is_ascii_hexdigit()) {
                stem = stem[..idx].to_string();
                changed = true;
                continue;
            }
        }        
        if let Some(idx) = stem.rfind('_') {
            let part = &stem[idx + 1 ..];
            if !part.is_empty() && part.len() <= 3 && part.chars().all(|c| c.is_ascii_digit()) {
                stem = stem[..idx].to_string();
                changed = true;
                continue;
            }
        }        
        if let Some(idx) = stem.rfind('_') {
            let suffix = &stem[idx..];
            let prefix = &stem[..idx];
            if prefix.contains(suffix) {
                stem = prefix.to_string();
                changed = true;
                continue;
            }
        }        
        for suffix in suffixes {
            let suffix_with_underscore = format!("_{}", suffix);
            if stem.ends_with(&suffix_with_underscore) {
                stem = stem[..stem.len() - suffix_with_underscore.len()].to_string();
                changed = true;
                break;
            }
            if stem.ends_with(suffix) {
                stem = stem[..stem.len() - suffix.len()].to_string();
                changed = true;
                break;
            }
        }        
        if stem.ends_with('_') || stem.ends_with('.') || stem.ends_with('-') {
            stem.pop();
            changed = true;
        }
    }
    let sanitized = stem.replace(|c: char| !c.is_alphanumeric() && c != '_' && c != '-', "");
    if sanitized.is_empty() {
        "bundle".to_string()
    } else {
        sanitized
    }
}

#[tauri::command]
async fn handle_dropped_path(
    path: String,
    merge_sequential: bool,
    app_handle: AppHandle,
) -> Result<HashMap<String, Vec<SceneData>>, String> {
    app_handle.emit("progress", true).unwrap();
    let path_obj = Path::new(&path);
    if path_obj.is_dir() {
        let mut unity_bundles = Vec::new();
        let all_files = find_all_files(&path_obj);
        for file_path in &all_files {
            if is_definitely_not_unity_bundle(file_path) {
                continue;
            }
            if let Ok(mut f) = fs::File::open(file_path) {
                let mut header = [0u8; 8];
                if let Ok(n) = f.read(&mut header) {
                    if unityfs::is_unity_bundle(&header[..n]) {
                        unity_bundles.push(file_path.clone());
                    }
                }
            }
        }
        if !unity_bundles.is_empty() {
            let spive_temp_root = std::env::temp_dir().join("spive2d");
            let _ = std::fs::create_dir_all(&spive_temp_root);
            let temp_dir = tempfile::Builder::new()
                .prefix("model_")
                .tempdir_in(spive_temp_root)
                .map_err(|e| format!("Failed to create temp dir: {}", e))?;
            let temp_path = temp_dir.path().to_string_lossy().into_owned();
            let mut extracted_any = false;
            for bundle_path in unity_bundles {
                let group_key = get_model_group_key(&bundle_path);
                let bundle_out_dir = temp_dir.path().join(group_key);
                if let Err(e) = unityfs::extract_unity_assets_from_path(&bundle_path, &bundle_out_dir) {
                    eprintln!("Failed to extract bundle {:?}: {}", bundle_path, e);
                } else {
                    extracted_any = true;
                }
            }
            if !extracted_any {
                return Err("Failed to extract any Unity bundles in directory".to_string());
            }
            let result = get_subdir_files(temp_path, merge_sequential, app_handle.clone());
            let state = app_handle.state::<AppState>();
            let mut temp_dirs = state.temp_dirs.lock().unwrap();
            temp_dirs.push(temp_dir);
            if temp_dirs.len() > 2 {
                temp_dirs.remove(0);
            }
            return result;
        } else {
            get_subdir_files(path, merge_sequential, app_handle)
        }
    } else if path_obj.is_file() {
        let is_unity = if let Ok(mut f) = fs::File::open(&path_obj) {
            let mut header = [0u8; 8];
            if let Ok(n) = f.read(&mut header) {
                unityfs::is_unity_bundle(&header[..n])
            } else {
                false
            }
        } else {
            false
        };
        if is_unity {
            let spive_temp_root = std::env::temp_dir().join("spive2d");
            let _ = std::fs::create_dir_all(&spive_temp_root);
            let temp_dir = tempfile::Builder::new()
                .prefix("model_")
                .tempdir_in(spive_temp_root)
                .map_err(|e| format!("Failed to create temp dir: {}", e))?;
            let temp_path = temp_dir.path().to_string_lossy().into_owned();
            let group_key = get_model_group_key(&path_obj);
            let bundle_out_dir = temp_dir.path().join(group_key);
            unityfs::extract_unity_assets_from_path(&path_obj, &bundle_out_dir)
                .map_err(|e| format!("Failed to extract Unity assets: {}", e))?;
            let result = get_subdir_files(temp_path, merge_sequential, app_handle.clone());
            let state = app_handle.state::<AppState>();
            let mut temp_dirs = state.temp_dirs.lock().unwrap();
            temp_dirs.push(temp_dir);
            if temp_dirs.len() > 2 {
                temp_dirs.remove(0);
            }
            return result;
        }
        match path_obj
            .extension()
            .and_then(|e| e.to_str())
            .map(|e| e.to_lowercase())
        {
            Some(ext) if ext == "zip" || ext == "7z" => {
                let spive_temp_root = std::env::temp_dir().join("spive2d");
                let _ = std::fs::create_dir_all(&spive_temp_root);
                let temp_dir = tempfile::Builder::new()
                    .prefix("model_")
                    .tempdir_in(spive_temp_root)
                    .map_err(|e| format!("Failed to create temp dir: {}", e))?;
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
                if temp_dirs.len() > 2 {
                    temp_dirs.remove(0);
                }
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
fn handle_unity_bytes(
    bytes: Vec<u8>,
    merge_sequential: bool,
    app_handle: AppHandle,
) -> Result<Option<HashMap<String, Vec<SceneData>>>, String> {
    app_handle.emit("progress", true).unwrap();
    let header_len = std::cmp::min(bytes.len(), 8);
    let is_unity = unityfs::is_unity_bundle(&bytes[..header_len]);
    if is_unity {
        let spive_temp_root = std::env::temp_dir().join("spive2d");
        let _ = std::fs::create_dir_all(&spive_temp_root);
        let mut temp_file = tempfile::Builder::new()
            .prefix("download_")
            .suffix(".tmp")
            .tempfile_in(&spive_temp_root)
            .map_err(|e| {
                let _ = app_handle.emit("progress", false);
                format!("Failed to create download temp file: {}", e)
            })?;
        temp_file.write_all(&bytes).map_err(|e| {
            let _ = app_handle.emit("progress", false);
            format!("Failed to write downloaded bytes: {}", e)
        })?;
        let temp_file_path = temp_file.path().to_path_buf();
        let temp_dir = tempfile::Builder::new()
            .prefix("model_")
            .tempdir_in(&spive_temp_root)
            .map_err(|e| {
                let _ = app_handle.emit("progress", false);
                format!("Failed to create temp dir: {}", e)
            })?;
        let temp_path = temp_dir.path().to_string_lossy().into_owned();
        unityfs::extract_unity_assets_from_path(&temp_file_path, temp_dir.path())
            .map_err(|e| {
                let _ = app_handle.emit("progress", false);
                format!("Failed to extract Unity assets: {}", e)
            })?;
        let result = get_subdir_files(temp_path, merge_sequential, app_handle.clone());
        let state = app_handle.state::<AppState>();
        let mut temp_dirs = state.temp_dirs.lock().unwrap();
        temp_dirs.push(temp_dir);
        if temp_dirs.len() > 2 {
            temp_dirs.remove(0);
        }
        let _ = app_handle.emit("progress", false);
        result.map(Some)
    } else {
        let _ = app_handle.emit("progress", false);
        Ok(None)
    }
}

#[tauri::command]
async fn handle_urls(
    urls: Vec<String>,
    merge_sequential: bool,
    app_handle: AppHandle,
) -> Result<HashMap<String, Vec<SceneData>>, String> {
    app_handle.emit("progress", true).unwrap();
    let spive_temp_root = std::env::temp_dir().join("spive2d");
    let _ = std::fs::create_dir_all(&spive_temp_root);
    let temp_dir = tempfile::Builder::new()
        .prefix("model_")
        .tempdir_in(&spive_temp_root)
        .map_err(|e| {
            let _ = app_handle.emit("progress", false);
            format!("Failed to create temp dir: {}", e)
        })?;
    let temp_path = temp_dir.path().to_string_lossy().into_owned();
    let mut downloaded_any = false;
    for url in urls {
        let output = std::process::Command::new("curl")
            .arg("-sL")
            .arg("-A")
            .arg("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36")
            .arg(&url)
            .output();
        let output = match output {
            Ok(o) => o,
            Err(e) => {
                eprintln!("Failed to execute curl for url {}: {}", url, e);
                continue;
            }
        };
        if !output.status.success() {
            eprintln!("curl failed for url {} with status: {}", url, output.status);
            continue;
        }
        let bytes = output.stdout;
        if bytes.is_empty() {
            continue;
        }
        let header_len = std::cmp::min(bytes.len(), 8);
        let is_unity = unityfs::is_unity_bundle(&bytes[..header_len]);
        if is_unity {
            let url_without_query = url.split('?').next().unwrap_or(&url);
            let filename = url_without_query.rsplit('/').next().unwrap_or(url_without_query);
            let group_key = get_model_group_key(Path::new(filename));
            let bundle_out_dir = temp_dir.path().join(group_key);
            if let Err(e) = unityfs::extract_unity_assets(&bytes, &bundle_out_dir) {
                eprintln!("Failed to extract Unity assets from url {}: {}", url, e);
            } else {
                downloaded_any = true;
            }
        } else {
            let url_without_query = url.split('?').next().unwrap_or(&url);
            let filename = url_without_query.rsplit('/').next().unwrap_or(url_without_query);
            if !filename.is_empty() {
                let dest_path = temp_dir.path().join(filename);
                if let Err(e) = std::fs::write(&dest_path, &bytes) {
                    eprintln!("Failed to write downloaded file to {:?}: {}", dest_path, e);
                } else {
                    downloaded_any = true;
                    let ext = Path::new(filename)
                        .extension()
                        .and_then(|e| e.to_str())
                        .map(|e| e.to_lowercase());
                    if let Some(ext_str) = ext {
                        if ext_str == "zip" || ext_str == "7z" {
                            let path_str = dest_path.to_string_lossy().into_owned();
                            if let Err(e) = extract_archive(&path_str, temp_dir.path(), &ext_str) {
                                eprintln!("Failed to extract archive {:?}: {}", dest_path, e);
                            }
                        }
                    }
                }
            }
        }
    }
    if !downloaded_any {
        let _ = app_handle.emit("progress", false);
        return Err("Failed to download or extract any files from the provided URLs".to_string());
    }
    let result = get_subdir_files(temp_path, merge_sequential, app_handle.clone());
    let state = app_handle.state::<AppState>();
    let mut temp_dirs = state.temp_dirs.lock().unwrap();
    temp_dirs.push(temp_dir);
    if temp_dirs.len() > 2 {
        temp_dirs.remove(0);
    }
    let _ = app_handle.emit("progress", false);
    result
}

#[tauri::command]
async fn handle_dropped_paths(
    paths: Vec<String>,
    merge_sequential: bool,
    app_handle: AppHandle,
) -> Result<HashMap<String, Vec<SceneData>>, String> {
    app_handle.emit("progress", true).unwrap();
    if paths.len() == 1 {
        let result = handle_dropped_path(paths[0].clone(), merge_sequential, app_handle.clone()).await;
        let _ = app_handle.emit("progress", false);
        return result;
    }
    let spive_temp_root = std::env::temp_dir().join("spive2d");
    let _ = std::fs::create_dir_all(&spive_temp_root);
    let temp_dir = tempfile::Builder::new()
        .prefix("model_")
        .tempdir_in(&spive_temp_root)
        .map_err(|e| {
            let _ = app_handle.emit("progress", false);
            format!("Failed to create temp dir: {}", e)
        })?;
    let temp_path = temp_dir.path().to_string_lossy().into_owned();
    let mut added_any = false;
    for path in paths {
        let path_obj = Path::new(&path);
        if !path_obj.exists() {
            continue;
        }
        if path_obj.is_dir() {
            let mut unity_bundles = Vec::new();
            let all_files = find_all_files(&path_obj);
            for file_path in &all_files {
                if is_definitely_not_unity_bundle(file_path) {
                    continue;
                }
                if let Ok(mut f) = fs::File::open(file_path) {
                    let mut header = [0u8; 8];
                    if let Ok(n) = f.read(&mut header) {
                        if unityfs::is_unity_bundle(&header[..n]) {
                            unity_bundles.push(file_path.clone());
                        }
                    }
                }
            }
            if !unity_bundles.is_empty() {
                for bundle_path in unity_bundles {
                    let group_key = get_model_group_key(&bundle_path);
                    let bundle_out_dir = temp_dir.path().join(group_key);
                    if let Err(e) = unityfs::extract_unity_assets_from_path(&bundle_path, &bundle_out_dir) {
                        eprintln!("Failed to extract bundle {:?}: {}", bundle_path, e);
                    } else {
                        added_any = true;
                    }
                }
            } else {
                for file_path in all_files {
                    if let Ok(rel_path) = file_path.strip_prefix(&path_obj) {
                        let dest_path = temp_dir.path().join(rel_path);
                        if let Some(parent) = dest_path.parent() {
                            let _ = fs::create_dir_all(parent);
                        }
                        if fs::copy(&file_path, &dest_path).is_ok() {
                            added_any = true;
                        }
                    }
                }
            }
        } else if path_obj.is_file() {
            let is_unity = if let Ok(mut f) = fs::File::open(&path_obj) {
                let mut header = [0u8; 8];
                if let Ok(n) = f.read(&mut header) {
                    unityfs::is_unity_bundle(&header[..n])
                } else {
                    false
                }
            } else {
                false
            };
            if is_unity {
                let group_key = get_model_group_key(&path_obj);
                let bundle_out_dir = temp_dir.path().join(group_key);
                if let Err(e) = unityfs::extract_unity_assets_from_path(&path_obj, &bundle_out_dir) {
                    eprintln!("Failed to extract Unity assets from {:?}: {}", path_obj, e);
                } else {
                    added_any = true;
                }
            } else {
                match path_obj
                    .extension()
                    .and_then(|e| e.to_str())
                    .map(|e| e.to_lowercase())
                {
                    Some(ext) if ext == "zip" || ext == "7z" => {
                        if let Err(e) = extract_archive(&path, temp_dir.path(), &ext) {
                            eprintln!("Failed to extract archive {:?}: {}", path_obj, e);
                        } else {
                            added_any = true;
                        }
                    }
                    _ => {
                        if let Some(filename) = path_obj.file_name() {
                            let dest_path = temp_dir.path().join(filename);
                            if fs::copy(&path_obj, &dest_path).is_ok() {
                                added_any = true;
                            }
                        }
                    }
                }
            }
        }
    }
    if !added_any {
        let _ = app_handle.emit("progress", false);
        return Err("No valid files or models found in dropped paths".to_string());
    }
    let result = get_subdir_files(temp_path, merge_sequential, app_handle.clone());
    let state = app_handle.state::<AppState>();
    let mut temp_dirs = state.temp_dirs.lock().unwrap();
    temp_dirs.push(temp_dir);
    if temp_dirs.len() > 2 {
        temp_dirs.remove(0);
    }
    let _ = app_handle.emit("progress", false);
    result
}

fn list_files_recursive(dir: &Path) -> Vec<String> {
    let mut result = Vec::new();
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.filter_map(|e| e.ok()) {
            let path = entry.path();
            if path.is_dir() {
                let sub_files = list_files_recursive(&path);
                for sub in sub_files {
                    result.push(format!("{}/{}", entry.file_name().to_string_lossy(), sub));
                }
            } else {
                result.push(entry.file_name().to_string_lossy().into_owned());
            }
        }
    }
    result
}

#[tauri::command]
fn get_subdir_files(
    folder_path: String,
    merge_sequential: bool,
    app_handle: AppHandle,
) -> Result<HashMap<String, Vec<SceneData>>, String> {
    let root_path = Path::new(&folder_path);
    let mut dir_files_map: HashMap<String, Vec<SceneData>> = HashMap::new();
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
    if dir_files_map.is_empty() {
        let extracted = list_files_recursive(root_path);
        return Err(format!(
            "No supported Spine (.atlas) or Live2D (.moc3) models found in directory.\nExtracted files: {:?}",
            extracted
        ));
    }
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
async fn fetch_url_bytes(url: String) -> Result<Vec<u8>, String> {
    let output = std::process::Command::new("curl")
        .arg("-sL")
        .arg("-A")
        .arg("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36")
        .arg(&url)
        .output()
        .map_err(|e| format!("Failed to execute curl: {}", e))?;
    if !output.status.success() {
        return Err(format!(
            "curl failed with status: {}, stderr: {}",
            output.status,
            String::from_utf8_lossy(&output.stderr)
        ));
    }
    Ok(output.stdout)
}

#[tauri::command]
async fn clear_cache(current_path: Option<String>, app_handle: AppHandle) -> Result<(), String> {
    for window in app_handle.webview_windows().values() {
        window.clear_all_browsing_data().map_err(|e: tauri::Error| e.to_string())?;
    }
    let state = app_handle.state::<AppState>();
    let mut current_temp_base = None;
    let cp_norm = current_path.as_ref().map(|p| {
        Path::new(p.trim_end_matches(|c| c == '/' || c == '\\')).to_path_buf()
    });
    {
        let mut temp_dirs = state.temp_dirs.lock().unwrap();
        if let Some(ref cp) = cp_norm {
            let mut i = 0;
            while i < temp_dirs.len() {
                let dir_path = temp_dirs[i].path();
                if cp.starts_with(dir_path) {
                    current_temp_base = Some(dir_path.to_path_buf());
                    i += 1;
                } else {
                    temp_dirs.remove(i);
                }
            }
        } else {
            temp_dirs.clear();
        }
    }
    let spive_temp_root = std::env::temp_dir().join("spive2d");
    if spive_temp_root.exists() {
        if let Ok(entries) = fs::read_dir(&spive_temp_root) {
            for entry in entries.filter_map(|e| e.ok()) {
                let path = entry.path();
                if let Some(ref base) = current_temp_base {
                    if path == *base {
                        continue;
                    }
                }
                if path.is_dir() {
                    let _ = fs::remove_dir_all(&path);
                } else {
                    let _ = fs::remove_file(&path);
                }
            }
        }
    }
    Ok(())
}

fn compare_natural(a: &str, b: &str) -> std::cmp::Ordering {
    let mut a_chars = a.chars().peekable();
    let mut b_chars = b.chars().peekable();
    loop {
        match (a_chars.peek(), b_chars.peek()) {
            (Some(a_c), Some(b_c)) => {
                if a_c.is_ascii_digit() && b_c.is_ascii_digit() {
                    let mut a_num = 0u64;
                    let mut a_len = 0;
                    while let Some(&c) = a_chars.peek() {
                        if let Some(digit) = c.to_digit(10) {
                            a_num = a_num.wrapping_mul(10).wrapping_add(digit as u64);
                            a_chars.next();
                            a_len += 1;
                        } else {
                            break;
                        }
                    }
                    let mut b_num = 0u64;
                    let mut b_len = 0;
                    while let Some(&c) = b_chars.peek() {
                        if let Some(digit) = c.to_digit(10) {
                            b_num = b_num.wrapping_mul(10).wrapping_add(digit as u64);
                            b_chars.next();
                            b_len += 1;
                        } else {
                            break;
                        }
                    }
                    if a_num != b_num {
                        return a_num.cmp(&b_num);
                    }
                    if a_len != b_len {
                        return a_len.cmp(&b_len);
                    }
                } else {
                    let ac = a_chars.next().unwrap();
                    let bc = b_chars.next().unwrap();
                    if ac != bc {
                        return ac.cmp(&bc);
                    }
                }
            }
            (None, None) => return std::cmp::Ordering::Equal,
            (None, _) => return std::cmp::Ordering::Less,
            (_, None) => return std::cmp::Ordering::Greater,
        }
    }
}

fn process_directory_with_subdirs(
    dir_path: &Path,
    base_path: &Path,
    merge_sequential: bool,
) -> Result<HashMap<String, Vec<SceneData>>, String> {
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

fn is_live2d_texture_name(name: &str) -> bool {
    let name_lower = name.to_lowercase();
    if !name_lower.ends_with(".png") {
        return false;
    }
    let stem = &name_lower[..name_lower.len() - 4];
    if !stem.starts_with("texture") {
        return false;
    }
    let rest = if stem.starts_with("texture_") {
        &stem["texture_".len()..]
    } else {
        &stem["texture".len()..]
    };
    !rest.is_empty() && rest.chars().all(|c| c.is_ascii_digit())
}

fn auto_generate_model3_json(
    dir: &Path,
    moc_file_name: &str,
    moc_stem: &str,
    dir_files: &[String],
) -> Result<(), String> {
    let mut textures = Vec::new();
    let mut physics = None;
    let mut display_info = None;
    let mut userdata = None;
    let mut pose = None;
    let mut expressions = Vec::new();
    let mut motions = HashMap::new();
    for filename in dir_files {
        let filename_lower = filename.to_lowercase();
        if is_live2d_texture_name(filename) {
            textures.push(filename.clone());
        } else if filename_lower.ends_with(".physics3.json") {
            physics = Some(filename.clone());
        } else if filename_lower.ends_with(".cdi3.json") {
            display_info = Some(filename.clone());
        } else if filename_lower.ends_with(".userdata3.json") {
            userdata = Some(filename.clone());
        } else if filename_lower.ends_with(".pose3.json") {
            pose = Some(filename.clone());
        } else if filename_lower.ends_with(".exp3.json") {
            expressions.push(serde_json::json!({
                "Name": filename.strip_suffix(".exp3.json").unwrap_or(filename).to_string(),
                "File": filename.clone()
            }));
        } else if filename_lower.ends_with(".motion3.json") {
            let group = motions.entry("".to_string()).or_insert_with(Vec::new);
            group.push(serde_json::json!({
                "File": filename
            }));
        }
    }
    textures.sort();
    let mut file_references = serde_json::json!({
        "Moc": moc_file_name,
        "Textures": textures
    });
    if let Some(p) = physics {
        file_references["Physics"] = serde_json::Value::String(p);
    }
    if let Some(d) = display_info {
        file_references["DisplayInfo"] = serde_json::Value::String(d);
    }
    if let Some(u) = userdata {
        file_references["UserData"] = serde_json::Value::String(u);
    }
    if let Some(p_pose) = pose {
        file_references["Pose"] = serde_json::Value::String(p_pose);
    }
    if !expressions.is_empty() {
        file_references["Expressions"] = serde_json::Value::Array(expressions);
    }
    if !motions.is_empty() {
        file_references["Motions"] = serde_json::to_value(motions).unwrap_or(serde_json::Value::Null);
    }
    let model3_json = serde_json::json!({
        "Version": 3,
        "FileReferences": file_references
    });
    let output_path = dir.join(format!("{}.model3.json", moc_stem));
    let file = fs::File::create(output_path).map_err(|e| e.to_string())?;
    serde_json::to_writer_pretty(file, &model3_json).map_err(|e| e.to_string())?;
    Ok(())
}

fn process_files(dir_path: &Path, base_path: &Path, merge_sequential: bool) -> Result<Vec<SceneData>, String> {
    let mut file_groups = Vec::new();
    let mut atlas_bases = HashSet::with_capacity(64);
    let mut atlas_original_extensions: HashMap<String, String> = HashMap::with_capacity(64);
    let mut file_paths = HashMap::with_capacity(256);
    let mut all_atlas_info: HashMap<String, String> = HashMap::with_capacity(64);
    let mut dir_files = Vec::new();
    let mut moc3_files = Vec::new();
    let mut moc_files = Vec::new();
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
        dir_files.push(filename.to_string());
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
            let is_image = filename_lower.ends_with(".png") || filename_lower.ends_with(".jpg") || filename_lower.ends_with(".jpeg") || filename_lower.ends_with(".webp");
            if !is_image {
                if let Some(idx) = filename_lower.rfind(".atlas") {
                    let base_name_part = &filename[..idx];
                    let extension_part = &filename[idx..];
                    all_atlas_info.insert(base_name_part.to_string(), extension_part.to_string());
                }
            }
        } else if filename_lower.contains(".moc3") {
            moc3_files.push((filename.to_string(), relative_path.clone()));
        } else if filename_lower.contains(".moc") && !filename_lower.contains(".moc3") {
            moc_files.push((filename.to_string(), relative_path.clone()));
        }
    }
    for (filename, relative_path) in moc3_files {
        let filename_lower = filename.to_lowercase();
        let adjusted_path = if let Some(slash_pos) = relative_path.find('/') {
            &relative_path[slash_pos + 1..]
        } else {
            &relative_path
        };
        if let Some(moc3_pos) = filename_lower.find(".moc3") {
            let moc_stem = &filename[..moc3_pos];
            let model3_json_path = dir_path.join(format!("{}.model3.json", moc_stem));
            if !model3_json_path.exists() {
                let _ = auto_generate_model3_json(dir_path, &filename, moc_stem, &dir_files);
            }
            let base_name_part =
                &adjusted_path[..adjusted_path.len() - (filename.len() - moc3_pos)];
            let extension_part = &filename[moc3_pos..];
            file_groups.push(SceneData {
                name: base_name_part.to_string(),
                main_ext: extension_part.to_string(),
                atlas_ext: "".to_string(),
                files: Vec::new(),
                is_merged: false,
            });
        }
    }
    for (filename, relative_path) in moc_files {
        let filename_lower = filename.to_lowercase();
        let adjusted_path = if let Some(slash_pos) = relative_path.find('/') {
            &relative_path[slash_pos + 1..]
        } else {
            &relative_path
        };
        if let Some(moc_pos) = filename_lower.find(".moc") {
            let base_name_part =
                &adjusted_path[..adjusted_path.len() - (filename.len() - moc_pos)];
            let extension_part = &filename[moc_pos..];
            file_groups.push(SceneData {
                name: base_name_part.to_string(),
                main_ext: extension_part.to_string(),
                atlas_ext: "".to_string(),
                files: Vec::new(),
                is_merged: false,
            });
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
        let target_pattern_skel = format!("{}.skel", base_lower);
        for (filename_lower, rp) in &file_paths {
            if let Some(pos) = filename_lower.find(&target_pattern_skel) {
                if let Some(original_fn) = Path::new(rp).file_name().and_then(|f| f.to_str()) {
                    let ext_start = pos + base_lower.len();
                    if ext_start <= original_fn.len() {
                        let ext_part = &original_fn[ext_start..];
                        main_file_info = Some((rp.clone(), ext_part.to_string(), "skel"));
                        break;
                    }
                }
            }
        }
        if main_file_info.is_none() {
            let target_pattern_json = format!("{}.json", base_lower);
            for (filename_lower, rp) in &file_paths {
                if let Some(pos) = filename_lower.find(&target_pattern_json) {
                    if let Some(original_fn) = Path::new(rp).file_name().and_then(|f| f.to_str()) {
                        let ext_start = pos + base_lower.len();
                        if ext_start <= original_fn.len() {
                            let ext_part = &original_fn[ext_start..];
                            main_file_info = Some((rp.clone(), ext_part.to_string(), "json"));
                            break;
                        }
                    }
                }
            }
        }
        if main_file_info.is_none() {
            let target_pattern_asset = format!("{}.asset", base_lower);
            for (filename_lower, rp) in &file_paths {
                if let Some(pos) = filename_lower.find(&target_pattern_asset) {
                    if let Some(original_fn) = Path::new(rp).file_name().and_then(|f| f.to_str()) {
                        let ext_start = pos + base_lower.len();
                        if ext_start <= original_fn.len() {
                            let ext_part = &original_fn[ext_start..];
                            main_file_info = Some((rp.clone(), ext_part.to_string(), "asset"));
                            break;
                        }
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
            let mut bg_files = find_extra_files(&base_lower, "_bg", &file_paths, &main_extension);
            let fg_files = find_extra_files(&base_lower, "_fg", &file_paths, &main_extension);
            bg_files.extend(fg_files);
            file_groups.push(SceneData {
                name: adjusted_base_name.to_string(),
                main_ext: main_extension,
                atlas_ext: atlas_extension,
                files: bg_files,
                is_merged: false,
            });
        }
    }
    file_groups.sort_unstable_by(|a, b| compare_natural(&a.name, &b.name));
    if merge_sequential && file_groups.len() > 1 {
        if file_groups.len() > 20 {
            file_groups.truncate(20);
        }
        let mut main_ext = String::new();
        let mut atlas_ext = String::new();
        let mut all_bases = Vec::new();
        let mut is_compatible = true;
        for group in &file_groups {
            if main_ext.is_empty() {
                main_ext = group.main_ext.clone();
                atlas_ext = group.atlas_ext.clone();
            } else if main_ext != group.main_ext || atlas_ext != group.atlas_ext {
                is_compatible = false;
                break;
            }
            all_bases.push(group.name.clone());
            for extra in &group.files {
                let stem = Path::new(extra)
                    .file_stem()
                    .and_then(|s| s.to_str())
                    .unwrap_or(extra);
                all_bases.push(format!("{}{}", group.name, stem));
            }
        }
        if is_compatible && !all_bases.is_empty() {
            let folder_name = dir_path
                .file_name()
                .and_then(|f| f.to_str())
                .map(|s| s.to_string())
                .unwrap_or_else(|| {
                    all_bases[0]
                        .trim_end_matches(|c: char| c.is_ascii_digit() || c == '_' || c == '-')
                        .to_string()
                });
            return Ok(vec![SceneData {
                name: folder_name,
                main_ext,
                atlas_ext,
                files: all_bases,
                is_merged: true,
            }]);
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
    extra_files.sort_unstable_by(|a, b| compare_natural(a, b));
    extra_files
}

fn process_directory(dir_path: &Path, base_path: &Path, merge_sequential: bool) -> Result<Vec<SceneData>, String> {
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
    all_file_groups.sort_unstable_by(|a, b| compare_natural(&a.name, &b.name));
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
            handle_dropped_paths,
            handle_unity_bytes,
            handle_urls,
            append_to_list,
            clear_cache,
            fetch_url_bytes
        ])
        .plugin(tauri_plugin_dialog::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
