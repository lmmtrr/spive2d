import { convertFileSrc } from '@tauri-apps/api/core';
export function canUpdateLive2DCore(coreModel) {
  if (!coreModel) return false;
  const drawParam = coreModel.drawParamWebGL;
  if (!drawParam) return true;
  if (!drawParam.gl) return false;
  return Array.isArray(drawParam.textures) && drawParam.textures.some(texture => texture);
}

export const CUBISM2_TIME_BASE = 1e6;

export function csmToArray(container) {
  if (!container) return [];
  if (Array.isArray(container)) return container.filter(Boolean);
  if (typeof container.at !== 'function') return [];
  const size = typeof container.getSize === 'function'
    ? container.getSize()
    : (typeof container._size === 'number' ? container._size : 0);
  const items = [];
  for (let i = 0; i < size; i++) {
    const item = container.at(i);
    if (item) items.push(item);
  }
  return items;
}

function idToString(id) {
  if (typeof id === 'string') return id;
  const wrapped = id?._id ?? id?.getString?.();
  if (typeof wrapped === 'string') return wrapped;
  if (typeof wrapped?.s === 'string') return wrapped.s;
  return String(id);
}

export function toIdArray(container) {
  return csmToArray(container).map(idToString);
}

export function getMotionEntries(queueManager) {
  return csmToArray(queueManager?._motions);
}

export function getMotionCurves(motion) {
  return csmToArray(motion?._motionData?.curves);
}

export function patchCoreRenderOrders(coreModel) {
  const native = coreModel?._model;
  if (!native || native.drawables?.renderOrders) return;
  if (typeof native.getRenderOrders !== 'function') return;
  coreModel.getDrawableRenderOrders = () => native.getRenderOrders();
}

export function parseLive2DJSON(text) {
  if (typeof text !== 'string') return text;
  const stripped = text.replace(/^﻿/, '').trim();
  try {
    return JSON.parse(stripped);
  } catch {
    return JSON.parse(stripped.replace(/,\s*([}\]])/g, '$1'));
  }
}

function toArrayBuffer(bytes) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

const SEGMENT_POINT_COUNTS = {
  0: { points: 1, stride: 3 },
  1: { points: 3, stride: 7 },
  2: { points: 1, stride: 3 },
  3: { points: 1, stride: 3 },
};

function repairMotion3Meta(json) {
  const meta = json?.Meta;
  const curves = json?.Curves;
  if (!meta || typeof meta !== 'object' || !Array.isArray(curves)) return false;
  let segmentCount = 0;
  let pointCount = 0;
  for (const curve of curves) {
    const segments = curve?.Segments;
    if (!Array.isArray(segments)) return false;
    let i = 0;
    while (i < segments.length) {
      if (i === 0) {
        pointCount += 1;
        i += 2;
      }
      const segment = SEGMENT_POINT_COUNTS[segments[i]];
      if (!segment || i + segment.stride > segments.length) return false;
      pointCount += segment.points;
      i += segment.stride;
      segmentCount += 1;
    }
  }
  let changed = false;
  const apply = (key, value) => {
    if (meta[key] === value) return;
    meta[key] = value;
    changed = true;
  };
  apply('CurveCount', curves.length);
  apply('TotalSegmentCount', segmentCount);
  apply('TotalPointCount', pointCount);
  return changed;
}

function normalizeJSONBuffer(buffer) {
  if (!(buffer instanceof ArrayBuffer)) return buffer;
  const bytes = new Uint8Array(buffer);
  const hasBOM = bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF;
  let i = hasBOM ? 3 : 0;
  while (i < bytes.length && bytes[i] <= 0x20) i++;
  if (bytes[i] !== 0x7B) return buffer;
  const text = new TextDecoder().decode(bytes.subarray(hasBOM ? 3 : 0));
  let repaired = null;
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    repaired = text.replace(/,\s*([}\]])/g, '$1');
    try {
      json = JSON.parse(repaired);
    } catch {
      return buffer;
    }
  }
  const encode = (value) => toArrayBuffer(new TextEncoder().encode(value));
  if (repairMotion3Meta(json)) return encode(JSON.stringify(json));
  if (repaired !== null) return encode(repaired);
  return hasBOM ? encode(text) : buffer;
}

function patchLenientJSONLoader(pixi) {
  const loader = pixi?.live2d?.XHRLoader;
  if (!loader || loader.__spive2dLenientJSON) return;
  const createXHR = loader.createXHR;
  loader.createXHR = function (target, url, type, onload, onerror) {
    if (type === 'arraybuffer') {
      return createXHR.call(this, target, url, type, buffer => onload(normalizeJSONBuffer(buffer)), onerror);
    }
    if (type !== 'json') return createXHR.call(this, target, url, type, onload, onerror);
    return createXHR.call(this, target, url, 'text', (text) => {
      let json;
      try {
        json = parseLive2DJSON(text);
      } catch (e) {
        onerror(new Error(`Failed to parse JSON: ${url} (${e.message})`));
        return;
      }
      onload(json);
    }, onerror);
  };
  loader.__spive2dLenientJSON = true;
}

function patchModelSettingsResolveURL(pixi) {
  const proto = pixi?.live2d?.ModelSettings?.prototype;
  if (!proto || proto.__spive2dEncodedPathResolve) return;
  const original = proto.resolveURL;
  proto.resolveURL = function (path) {
    const lastEncodedSlash = typeof this.url === 'string' ? this.url.lastIndexOf('%2F') : -1;
    if (lastEncodedSlash === -1 || /^[a-z][a-z0-9+.-]*:/i.test(path)) {
      return original.call(this, path);
    }
    return original.call(this, this.url.slice(0, lastEncodedSlash + 3) + path);
  };
  proto.__spive2dEncodedPathResolve = true;
}

function patchCubismMocReleaseOrder(pixi) {
  const proto = pixi?.live2d?.CubismInternalModel?.prototype;
  if (!proto || proto.__spive2dMocReleaseOrder) return;
  const original = proto.destroy;
  proto.destroy = function () {
    const moc = this.__moc;
    if (moc) this.__moc = undefined;
    try {
      return original.apply(this, arguments);
    } finally {
      if (moc && moc._moc) {
        if (typeof moc._modelCount === 'number') moc._modelCount = 0;
        moc.release();
      }
    }
  };
  proto.__spive2dMocReleaseOrder = true;
}

export function applyLive2DEnginePatches(pixi) {
  patchModelSettingsResolveURL(pixi);
  patchLenientJSONLoader(pixi);
  patchCubismMocReleaseOrder(pixi);
}

export async function ensureLive2DRuntimeReady(pixi) {
  await pixi?.live2d?.cubismReady?.();
}

export function resolveScaleMode(filter) {
  return filter === 'nearest' ? 'nearest' : 'linear';
}

export function applyLive2DTextureScaleMode(model, scaleMode) {
  const textures = model?.textures;
  if (!Array.isArray(textures)) return;
  for (const texture of textures) {
    const source = texture?.source;
    if (!source || source.scaleMode === scaleMode) continue;
    source.scaleMode = scaleMode;
    source.style?.update();
  }
}

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
        const json = parseLive2DJSON(await res.text());
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

