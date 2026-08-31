import { appState } from './appState.svelte.js';
import { getRenderer } from './rendererStore.svelte.js';
import { showNotification } from './notificationStore.svelte.js';
import { exportQueue } from './exportQueue.svelte.js';
import { t } from './i18n.svelte.js';
import { sanitizeFilename } from './utils.js';
import { resolveLive2DSettings } from './renderer/Live2DCommon.js';
import { convertFileSrc, invoke } from '@tauri-apps/api/core';
import { downloadDir, join } from '@tauri-apps/api/path';
import { writeFile, mkdir, exists } from '@tauri-apps/plugin-fs';

const EXPRESSION_NAME = 'spive2d';
const IMAGE_EXTENSIONS = /\.(png|jpg|jpeg|webp)$/i;

let taskIdCounter = 0;

function normalizeDir(dirName) {
  return dirName.endsWith('/') ? dirName : `${dirName}/`;
}

function isWebDir(dirName) {
  return dirName.startsWith('http://') || dirName.startsWith('https://');
}

function dirPartOf(relPath) {
  return relPath.slice(0, relPath.lastIndexOf('/') + 1);
}

function commonDirPrefix(relPaths) {
  const dirs = relPaths.map(dirPartOf);
  if (dirs.length === 0) return '';
  return dirs.every(dir => dir === dirs[0]) ? dirs[0] : '';
}

function stripPrefix(relPath, prefix) {
  return prefix && relPath.startsWith(prefix) ? relPath.slice(prefix.length) : relPath;
}

async function readSourceFile(dirName, relPath) {
  const rawUrl = `${normalizeDir(dirName)}${relPath}`;
  const web = isWebDir(dirName);
  try {
    const res = await fetch(web ? rawUrl : convertFileSrc(rawUrl));
    if (res.ok) return new Uint8Array(await res.arrayBuffer());
  } catch { }
  if (web) {
    try {
      return new Uint8Array(await invoke('fetch_url_bytes', { url: rawUrl }));
    } catch { }
  }
  return null;
}

function toSegments(relPath) {
  return String(relPath)
    .replace(/\\/g, '/')
    .split('?')[0]
    .split('/')
    .filter(segment => segment && segment !== '.' && segment !== '..')
    .map(sanitizeFilename);
}

async function writeExportFile(targetDir, relPath, bytes) {
  const segments = toSegments(relPath);
  if (segments.length === 0) return false;
  if (segments.length > 1) {
    await mkdir(await join(targetDir, ...segments.slice(0, -1)), { recursive: true });
  }
  await writeFile(await join(targetDir, ...segments), bytes);
  return true;
}

function writeExportJson(targetDir, relPath, value) {
  return writeExportFile(targetDir, relPath, new TextEncoder().encode(JSON.stringify(value)));
}

async function createTargetDir(baseName) {
  const exportRoot = await join(await downloadDir(), 'spive2d_export');
  await mkdir(exportRoot, { recursive: true });
  let name = baseName;
  let dir = await join(exportRoot, name);
  let counter = 2;
  while (await exists(dir)) {
    name = `${baseName} (${counter})`;
    dir = await join(exportRoot, name);
    counter++;
  }
  await mkdir(dir, { recursive: true });
  return { dir, name };
}

async function copySourceFiles(dirName, targetDir, relPaths, prefix = '') {
  const copied = new Set();
  for (const relPath of relPaths) {
    if (!relPath || copied.has(relPath)) continue;
    const bytes = await readSourceFile(dirName, relPath);
    if (!bytes || bytes.length === 0) continue;
    if (await writeExportFile(targetDir, stripPrefix(relPath, prefix), bytes)) copied.add(relPath);
  }
  return copied;
}

async function listDirFiles(dirName, prefix = '') {
  if (isWebDir(dirName)) return [];
  try {
    const dirPath = `${normalizeDir(dirName)}${prefix}`.replace(/\/+$/, '');
    const listed = await invoke('list_dir_files', { dirPath });
    return Array.isArray(listed) ? listed.map(name => `${prefix}${name}`) : [];
  } catch {
    return [];
  }
}

function filterImages(relPaths, baseNames) {
  const images = relPaths.filter(relPath => IMAGE_EXTENSIONS.test(relPath));
  if (!baseNames || baseNames.length === 0) return images;
  const prefixes = baseNames.map(name => name.toLowerCase());
  return images.filter((relPath) => {
    const stem = relPath.replace(IMAGE_EXTENSIONS, '').toLowerCase();
    return prefixes.some(prefix => stem.startsWith(prefix) || prefix.startsWith(stem));
  });
}

function parseAtlasImageNames(atlasText) {
  return atlasText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => IMAGE_EXTENSIONS.test(line));
}

async function collectAtlasImages(dirName, atlasFiles) {
  const names = [];
  for (const atlasFile of atlasFiles) {
    const bytes = await readSourceFile(dirName, atlasFile);
    if (!bytes) continue;
    const dir = dirPartOf(atlasFile);
    for (const name of parseAtlasImageNames(new TextDecoder().decode(bytes))) {
      names.push(`${dir}${name}`);
    }
  }
  return names;
}

function patchSpineJson(text, edits) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  const patchNamed = (list, table) => {
    if (!Array.isArray(list)) return;
    for (const [name, props] of Object.entries(table || {})) {
      const target = list.find(item => item && item.name === name);
      if (!target) continue;
      for (const [prop, value] of Object.entries(props)) {
        target[prop] = value;
      }
    }
  };
  patchNamed(data.bones, edits.bones);
  patchNamed(data.ik, edits.ik);
  patchNamed(data.transform, edits.transform);
  patchNamed(data.path, edits.path);
  const slots = Array.isArray(data.slots) ? data.slots : null;
  for (const hidden of edits.hiddenAttachments || []) {
    const slot = slots && ((hidden.slotName && slots.find(s => s && s.name === hidden.slotName)) || slots[hidden.slotIndex]);
    if (slot && slot.attachment === hidden.name) delete slot.attachment;
  }
  return JSON.stringify(data);
}

async function exportSpineModel(dirName, renderer, targetDir) {
  const edits = renderer.getModelEdits();
  if (!edits) return null;
  const sourceFiles = await renderer.getSourceFiles();
  const baseNames = edits.skeletons.map(skeleton => skeleton.fileName);
  const prefix = commonDirPrefix(baseNames);
  const atlasImages = await collectAtlasImages(dirName, sourceFiles.filter(file => /\.(atlas|txt)$/i.test(file)));
  const dirFiles = await listDirFiles(dirName, prefix);
  const copied = await copySourceFiles(dirName, targetDir, [
    ...sourceFiles,
    ...atlasImages,
    ...filterImages(dirFiles, baseNames)
  ], prefix);
  if (!Array.from(copied).some(file => IMAGE_EXTENSIONS.test(file))) {
    await copySourceFiles(dirName, targetDir, filterImages(dirFiles), prefix);
  }
  if (!edits.isJson) return true;
  for (const skeleton of edits.skeletons) {
    const relPath = `${skeleton.fileName}${edits.mainExt}`;
    const bytes = await readSourceFile(dirName, relPath);
    if (!bytes) continue;
    const patched = patchSpineJson(new TextDecoder().decode(bytes), skeleton);
    if (!patched) continue;
    await writeExportFile(targetDir, stripPrefix(relPath, prefix), new TextEncoder().encode(patched));
  }
  return true;
}

function collectLive2DReferences(settingsJson, isCubism2) {
  const refs = [];
  const add = (value) => {
    if (typeof value === 'string' && value.length > 0) refs.push(value);
  };
  const addMotionGroups = (groups, fileKey, soundKey) => {
    for (const group of Object.values(groups || {})) {
      for (const motion of group || []) {
        add(motion?.[fileKey]);
        add(motion?.[soundKey]);
      }
    }
  };
  if (isCubism2) {
    add(settingsJson.model);
    (settingsJson.textures || []).forEach(add);
    add(settingsJson.physics);
    add(settingsJson.pose);
    (settingsJson.expressions || []).forEach(expression => add(expression?.file));
    addMotionGroups(settingsJson.motions, 'file', 'sound');
  } else {
    const fileReferences = settingsJson.FileReferences || {};
    add(fileReferences.Moc);
    (fileReferences.Textures || []).forEach(add);
    add(fileReferences.Physics);
    add(fileReferences.Pose);
    add(fileReferences.DisplayInfo);
    add(fileReferences.UserData);
    (fileReferences.Expressions || []).forEach(expression => add(expression?.File));
    addMotionGroups(fileReferences.Motions, 'File', 'Sound');
  }
  return refs;
}

function findPatternOffsets(bytes, pattern, limit = 2) {
  const offsets = [];
  const last = bytes.length - pattern.length;
  const first = pattern[0];
  for (let i = 0; i <= last; i++) {
    if (bytes[i] !== first) continue;
    let matched = true;
    for (let j = 1; j < pattern.length; j++) {
      if (bytes[i + j] !== pattern[j]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      offsets.push(i);
      if (offsets.length >= limit) break;
    }
  }
  return offsets;
}

function patchMocDefaults(bytes, defaults, parameters) {
  if (!Array.isArray(defaults) || defaults.length === 0) return null;
  for (const littleEndian of [true, false]) {
    const pattern = new Uint8Array(defaults.length * 4);
    const patternView = new DataView(pattern.buffer);
    defaults.forEach((value, index) => patternView.setFloat32(index * 4, value, littleEndian));
    const offsets = findPatternOffsets(bytes, pattern);
    if (offsets.length !== 1) continue;
    const patched = bytes.slice();
    const view = new DataView(patched.buffer, patched.byteOffset, patched.byteLength);
    for (const parameter of parameters) {
      if (!Number.isInteger(parameter.index) || parameter.index < 0 || parameter.index >= defaults.length) continue;
      view.setFloat32(offsets[0] + parameter.index * 4, parameter.value, littleEndian);
    }
    return patched;
  }
  return null;
}

function buildExpressionFile(parameters, isCubism2) {
  if (isCubism2) {
    return {
      type: 'Live2D Expression',
      fade_in: 0,
      fade_out: 0,
      params: parameters.map(parameter => ({ id: parameter.id, val: parameter.value, calc: 'set' }))
    };
  }
  return {
    Type: 'Live2D Expression',
    FadeInTime: 0,
    FadeOutTime: 0,
    Parameters: parameters.map(parameter => ({ Id: parameter.id, Value: parameter.value, Blend: 'Overwrite' }))
  };
}

function registerExpression(settingsJson, isCubism2, expressionFile) {
  if (isCubism2) {
    const list = Array.isArray(settingsJson.expressions) ? settingsJson.expressions : [];
    settingsJson.expressions = [
      ...list.filter(expression => expression && expression.name !== EXPRESSION_NAME),
      { name: EXPRESSION_NAME, file: expressionFile }
    ];
    return;
  }
  settingsJson.FileReferences = settingsJson.FileReferences || {};
  const list = Array.isArray(settingsJson.FileReferences.Expressions) ? settingsJson.FileReferences.Expressions : [];
  settingsJson.FileReferences.Expressions = [
    ...list.filter(expression => expression && expression.Name !== EXPRESSION_NAME),
    { Name: EXPRESSION_NAME, File: expressionFile }
  ];
}

async function exportLive2DModel(dirName, scene, renderer, targetDir) {
  const settings = await resolveLive2DSettings(dirName, scene);
  const prefix = dirPartOf(settings.file);
  const settingsName = stripPrefix(settings.file, prefix);
  let settingsJson = settings.json;
  if (!settingsJson) {
    const bytes = await readSourceFile(dirName, settings.file);
    if (bytes) {
      try {
        settingsJson = JSON.parse(new TextDecoder().decode(bytes));
      } catch { }
    }
  }
  if (!settingsJson) return null;
  const isCubism2 = typeof settingsJson.model === 'string';
  const references = collectLive2DReferences(settingsJson, isCubism2);
  const extraMotions = scene.motionFiles || [];
  await copySourceFiles(
    dirName,
    targetDir,
    [...references, ...extraMotions].map(ref => `${prefix}${ref}`),
    prefix
  );
  const edits = renderer.getModelEdits() || {};
  const parameters = edits.parameters || [];
  let settingsModified = false;
  if (parameters.length > 0) {
    const mocFile = isCubism2 ? settingsJson.model : settingsJson.FileReferences?.Moc;
    const mocBytes = mocFile ? await readSourceFile(dirName, `${prefix}${mocFile}`) : null;
    const patchedMoc = mocBytes ? patchMocDefaults(mocBytes, edits.parameterDefaults, parameters) : null;
    if (patchedMoc) {
      await writeExportFile(targetDir, mocFile, patchedMoc);
    } else {
      const base = settingsName
        .replace(/\.model3\.json$/i, '')
        .replace(/\.model\.json$/i, '')
        .replace(/\.json$/i, '') || 'model';
      const expressionFile = `${base}.${EXPRESSION_NAME}.${isCubism2 ? 'exp.json' : 'exp3.json'}`;
      await writeExportJson(targetDir, expressionFile, buildExpressionFile(parameters, isCubism2));
      registerExpression(settingsJson, isCubism2, expressionFile);
      settingsModified = true;
    }
  }
  if (settingsModified) {
    await writeExportJson(targetDir, settingsName, settingsJson);
  } else {
    const bytes = await readSourceFile(dirName, settings.file);
    if (bytes) await writeExportFile(targetDir, settingsName, bytes);
  }
  return true;
}

function isLive2DScene(scene) {
  const mainExt = scene.mainExt || '';
  return mainExt.includes('.moc') || mainExt.includes('.model3.json') || mainExt.includes('.model.json');
}

export async function exportModelFiles(sceneText) {
  const renderer = getRenderer();
  const { files, selectedDir, selectedScene } = appState.directories;
  const scene = files?.[selectedDir]?.[selectedScene];
  if (!renderer || !scene || !selectedDir || renderer.rendererType === 'layered') {
    showNotification(t('exportModelUnsupported'), 'error');
    return;
  }
  const baseFilename = sanitizeFilename(sceneText);
  const taskId = `model-${++taskIdCounter}`;
  exportQueue.add({
    id: taskId,
    type: 'Model',
    name: baseFilename,
    progress: 100,
    status: 'processing'
  });
  try {
    const { dir, name } = await createTargetDir(baseFilename);
    const exported = isLive2DScene(scene)
      ? await exportLive2DModel(selectedDir, scene, renderer, dir)
      : await exportSpineModel(selectedDir, renderer, dir);
    if (!exported) {
      exportQueue.updateStatus(taskId, 'error');
      showNotification(t('exportModelError'), 'error');
      return;
    }
    exportQueue.updateStatus(taskId, 'completed');
    showNotification(`${t('exportModelSuccess')}: ${name}`, 'success');
  } catch (err) {
    console.error('Failed to export model files:', err);
    exportQueue.updateStatus(taskId, 'error');
    showNotification(`${t('exportModelError')}: ${err?.message || err}`, 'error');
  }
}
