import { convertFileSrc } from '@tauri-apps/api/core';
import { open as tauriOpen } from '@tauri-apps/plugin-dialog';
import { openPath } from '@tauri-apps/plugin-opener';
import { downloadDir, join, dirname } from '@tauri-apps/api/path';
import { mkdir } from '@tauri-apps/plugin-fs';

export async function openDirectory() {
  return await tauriOpen({ multiple: false, directory: true }) || null;
}

export async function openSaveDirectory() {
  return await tauriOpen({ multiple: false, directory: true }) || null;
}

export async function openArchiveFile() {
  return await tauriOpen({
    multiple: false,
    filters: [{ name: 'Archive', extensions: ['zip', '7z'] }],
  }) || null;
}

export async function openCurrentDirectory(dirPath, sceneId) {
  if (!dirPath || dirPath.startsWith('http://') || dirPath.startsWith('https://')) return;
  const isWindows = navigator.userAgent.includes('Windows');
  const path = await join(dirPath, sceneId);
  const dir = await dirname(path);
  if (isWindows) await openPath(dir.replace(/\//g, '\\'));
  else await openPath(dir);
}

export async function openExportDirectory() {
  const isWindows = navigator.userAgent.includes('Windows');
  const dir = await downloadDir();
  const exportDir = await join(dir, 'spive2d_export');
  try {
    await mkdir(exportDir, { recursive: true });
  } catch (e) { }
  if (isWindows) await openPath(exportDir.replace(/\//g, '\\'));
  else await openPath(exportDir);
}

export async function openImageFile() {
  return await tauriOpen({
    multiple: false,
    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }],
  }) || null;
}

export function getAssetUrl(filePath) {
  return convertFileSrc(filePath);
}
