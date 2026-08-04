import { convertFileSrc } from '@tauri-apps/api/core';
export function canUpdateLive2DCore(coreModel) {
  if (!coreModel) return false;
  const drawParam = coreModel.drawParamWebGL;
  if (!drawParam) return true;
  if (!drawParam.gl) return false;
  return Array.isArray(drawParam.textures) && drawParam.textures.some(texture => texture);
}

export const CUBISM2_TIME_BASE = 1e6;

export function getCubism2MotionEntry(model) {
  const motions = model?.internalModel?.motionManager?.queueManager?.motions;
  if (!Array.isArray(motions) || motions.length === 0) return null;
  const entry = motions[motions.length - 1];
  return entry && entry._$w0 ? entry : null;
}

export function pinCubism2MotionEntry(entry) {
  if (!entry) return;
  entry._$z2 = CUBISM2_TIME_BASE;
  entry._$bs = 0;
  entry._$Do = -1;
  entry._$9L = false;
}

export function registerLive2DMotionFiles(model, motionFiles) {
  const motionManager = model?.internalModel?.motionManager;
  if (!motionManager || !Array.isArray(motionFiles) || motionFiles.length === 0) return false;
  const declared = motionManager.definitions;
  if (declared && Object.values(declared).some(group => group?.length > 0)) return false;
  const definitions = { idle: motionFiles.map(file => ({ file })) };
  motionManager.definitions = definitions;
  motionManager.motionGroups = { idle: [] };
  if (model.internalModel.settings) {
    model.internalModel.settings.motions = definitions;
  }
  return true;
}

export function getLive2DMotionDuration(motion) {
  if (!motion) return 0;
  if (motion._loopDurationSeconds > 0) return motion._loopDurationSeconds;
  if (motion._motionData?.duration > 0) return motion._motionData.duration;
  if (typeof motion.getLoopDurationMSec === 'function') {
    const msec = motion.getLoopDurationMSec();
    if (msec > 0) return msec / 1000;
  }
  if (typeof motion.getDuration === 'function') {
    const seconds = motion.getDuration();
    if (seconds > 0) return seconds;
  }
  return 0;
}

export function getLive2DFrameBox(internalModel) {
  if (!internalModel) return null;
  const canvasBox = { x: 0, y: 0, width: internalModel.originalWidth, height: internalModel.originalHeight };
  const core = internalModel.coreModel;
  if (canUpdateLive2DCore(core)) {
    core.update?.();
  }
  const count = core?.getDrawableCount?.() ?? internalModel?.getDrawableIDs?.()?.length ?? 0;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let drawn = 0, insideCanvas = 0;
  for (let i = 0; i < count; i++) {
    if (core?.getDrawableDynamicFlagIsVisible?.(i) === false) continue;
    if (core?.getDrawableOpacity?.(i) === 0) continue;
    const vertices = internalModel?.getDrawableVertices?.(i);
    if (!vertices || typeof vertices.length !== 'number') continue;
    let pMinX = Infinity, pMinY = Infinity, pMaxX = -Infinity, pMaxY = -Infinity;
    for (let j = 0; j < vertices.length; j += 2) {
      const x = vertices[j], y = vertices[j + 1];
      if (!isFinite(x) || !isFinite(y)) continue;
      if (x < pMinX) pMinX = x;
      if (x > pMaxX) pMaxX = x;
      if (y < pMinY) pMinY = y;
      if (y > pMaxY) pMaxY = y;
    }
    if (pMinX === Infinity) continue;
    drawn++;
    const centreX = (pMinX + pMaxX) * 0.5;
    const centreY = (pMinY + pMaxY) * 0.5;
    if (centreX >= 0 && centreX <= canvasBox.width && centreY >= 0 && centreY <= canvasBox.height) {
      insideCanvas++;
    }
    if (pMinX < minX) minX = pMinX;
    if (pMaxX > maxX) maxX = pMaxX;
    if (pMinY < minY) minY = pMinY;
    if (pMaxY > maxY) maxY = pMaxY;
  }
  if (!(maxX > minX) || !(maxY > minY)) return null;
  const CANVAS_IS_THE_FRAME = 0.75;
  if (drawn > 0 && insideCanvas / drawn >= CANVAS_IS_THE_FRAME) return canvasBox;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function fitLive2DBox(internalModel, box, viewWidth, viewHeight, marginX = 0, marginY = 0) {
  if (!internalModel || !box) return { baseScale: 1, dx: 0, dy: 0 };
  const usableWidth = Math.max(1, viewWidth - 2 * marginX);
  const usableHeight = Math.max(1, viewHeight - 2 * marginY);
  return {
    baseScale: Math.min(usableWidth / box.width, usableHeight / box.height),
    dx: (box.x + box.width * 0.5) - internalModel.originalWidth * 0.5,
    dy: (box.y + box.height * 0.5) - internalModel.originalHeight * 0.5,
  };
}

function isValidLive2DSettings(json) {
  if (!json || typeof json !== 'object') return false;
  if (json.Version !== undefined || json.FileReferences !== undefined) {
    if (json.FileReferences && (json.FileReferences.Moc || json.FileReferences.Textures)) {
      return true;
    }
  }
  if (typeof json.model === 'string') {
    return Array.isArray(json.textures) && json.textures.length > 0;
  }
  return false;
}

export async function resolveLive2DModelUrl(dirName, scene) {
  const sceneName = scene.name;
  const mainExt = scene.mainExt || '';
  let candidates = [];
  if (sceneName === 'model') {
    candidates = [
      'model.json',
      'model3.json',
      'model.model.json',
    ];
  } else if (sceneName === 'model3') {
    candidates = [
      'model3.json',
      'model.json',
    ];
  } else if (mainExt.includes('.moc3')) {
    candidates = [
      `${sceneName}.model3.json`,
      `${sceneName}.json`,
      'model3.json',
      'model.json',
    ];
  } else if (mainExt.includes('.moc')) {
    candidates = [
      `${sceneName}.model.json`,
      `${sceneName}.json`,
      'model.json',
      `${sceneName}.model3.json`,
    ];
  } else if (mainExt.endsWith('.json')) {
    candidates = [
      sceneName.endsWith('.json') ? sceneName : `${sceneName}${mainExt}`,
      `${sceneName}.model.json`,
      `${sceneName}.model3.json`,
      `${sceneName}.json`,
      'model.json',
      'model3.json',
    ];
  } else {
    candidates = [
      `${sceneName}.model3.json`,
      `${sceneName}.model.json`,
      `${sceneName}.json`,
      'model3.json',
      'model.json',
    ];
  }
  candidates = [...new Set(candidates)].filter(c => c && !c.endsWith('.model.model.json') && !c.endsWith('.model3.model3.json'));
  for (const candidate of candidates) {
    const rawUrl = `${dirName}${candidate}`;
    const url = (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
      ? rawUrl
      : convertFileSrc(rawUrl);
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const cleanedText = text.replace(/^\uFEFF/, '').trim().replace(/,\s*([}\]])/g, '$1');
        const json = JSON.parse(cleanedText);
        if (isValidLive2DSettings(json)) {
          return url + (url.includes('?') ? '&' : '?') + 't=' + Date.now();
        }
      }
    } catch {
      continue;
    }
  }
  let ext = '.model3.json';
  if (mainExt.includes('.moc3')) ext = sceneName === 'model3' ? '.json' : '.model3.json';
  else if (mainExt.includes('.moc')) ext = sceneName === 'model' ? '.json' : '.model.json';
  const fallbackRaw = `${dirName}${sceneName}${ext}`;
  const fallbackUrl = (fallbackRaw.startsWith('http://') || fallbackRaw.startsWith('https://'))
    ? fallbackRaw
    : convertFileSrc(fallbackRaw);
  return fallbackUrl + (fallbackUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
}

