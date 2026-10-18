import { invoke } from '@tauri-apps/api/core';
import { createRenderer, getRendererType } from './renderer/createRenderer.js';
import { SpineRenderer } from './renderer/SpineRenderer.js';
import { SpineVersionManager } from './renderer/SpineVersionManager.js';
import { extraModelName } from './renderer/SpineRendererBase.js';
import { normalizeAtlasText, toSpineAssetUrl } from './renderer/SpineCommon.js';
import { prefetchTextures, clearTexturePrefetch } from './renderer/workerTextureLoader.js';
import { Live2DRenderer } from './renderer/Live2DRenderer.js';
import { appState } from './appState.svelte.js';
import { findIdleAnimation } from './utils.js';
import { thumbnailCache } from './thumbnailCache.js';

const THUMBNAIL_SIZE = 256;
const SCORE_SIZE = 48;
const SAMPLE_PROGRESS = [0.33, 0.66];
const CACHE_VERSION = 2;

let scoreCtx = null;
let sharedRenderers = {};
let thumbnails = $state({});
let queue = [];
let queued = new Set();
let encoding = new Set();
let prefetchDir = null;
let prefetchList = [];
let processing = false;
let generation = 0;
let scenePrefetchToken = 0;

function getKey(dirName, scene) {
  return `${dirName}::${scene.name}`;
}

function canvasToBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/webp', 0.9);
  });
}

async function getCacheKey(dirName, scene) {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(dirName)) return null;
  const baseName = scene.isMerged ? scene.files[0] : scene.name;
  if (!baseName) return null;
  const dir = dirName.endsWith('/') ? dirName : `${dirName}/`;
  const path = `${dir}${baseName}${scene.mainExt}`;
  try {
    const stamp = await invoke('get_file_stamp', { path });
    if (!stamp) return null;
    const files = scene.isMerged ? scene.files.join(',') : '';
    return [CACHE_VERSION, appState.alphaMode, appState.textureFilter, path, stamp, files].join('|');
  } catch (err) {
    return null;
  }
}

function getSharedRenderer(type) {
  if (type === 'spine') return (sharedRenderers.spine ??= new SpineRenderer());
  if (type === 'live2d') return (sharedRenderers.live2d ??= new Live2DRenderer());
  return null;
}

function releaseSharedRenderer(type) {
  sharedRenderers[type]?.dispose();
  delete sharedRenderers[type];
}

function releaseSharedRenderers() {
  for (const type of Object.keys(sharedRenderers)) releaseSharedRenderer(type);
}

async function captureThumbnail(dirName, scene) {
  const type = getRendererType(scene);
  const shared = getSharedRenderer(type);
  const reuseContext = type === 'spine';
  const renderer = shared || createRenderer(scene);
  try {
    if ('setAlphaMode' in renderer) {
      renderer.setAlphaMode(appState.alphaMode);
    }
    if (typeof renderer.setTextureFilter === 'function') {
      renderer.setTextureFilter(appState.textureFilter);
    }
    const startNextPrefetch = type === 'spine' ? prepareNextScene() : null;
    await renderer.load(dirName, scene, {
      isPreload: true,
      thumbnail: true,
      reuseContext,
      canvasSize: THUMBNAIL_SIZE,
      onAssetsReady: startNextPrefetch
        ? () => startNextPrefetch(renderer.getEffectiveAlphaMode() === 'unpack')
        : undefined,
    });
    return await captureFrame(renderer);
  } catch (err) {
    if (shared) releaseSharedRenderer(type);
    throw err;
  } finally {
    if (!shared) renderer.dispose();
    else if (reuseContext) sharedRenderers.spine?._releaseScene();
  }
}

async function captureFrame(renderer) {
  const animations = renderer.getAnimations() ?? [];
  const animation = findIdleAnimation(animations) || animations[0];
  if (!animation) return renderer.captureFrame(THUMBNAIL_SIZE, THUMBNAIL_SIZE);
  await renderer.setAnimation(animation.value);
  let best = null;
  let bestScore = -1;
  for (const progress of SAMPLE_PROGRESS) {
    renderer.seekAnimation(progress);
    const canvas = renderer.captureFrame(THUMBNAIL_SIZE, THUMBNAIL_SIZE);
    if (!canvas) continue;
    const score = scoreFrame(canvas);
    if (score > bestScore) {
      best = canvas;
      bestScore = score;
    }
  }
  return best;
}

function scoreFrame(canvas) {
  if (!scoreCtx) {
    const scoreCanvas = document.createElement('canvas');
    scoreCanvas.width = SCORE_SIZE;
    scoreCanvas.height = SCORE_SIZE;
    scoreCtx = scoreCanvas.getContext('2d', { willReadFrequently: true });
  }
  scoreCtx.clearRect(0, 0, SCORE_SIZE, SCORE_SIZE);
  scoreCtx.drawImage(canvas, 0, 0, SCORE_SIZE, SCORE_SIZE);
  const { data } = scoreCtx.getImageData(0, 0, SCORE_SIZE, SCORE_SIZE);
  const gray = 127.5 * 255;
  let sum = 0;
  let sumSq = 0;
  let transparent = 0;
  const count = data.length >> 2;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) {
      transparent++;
      continue;
    }
    const v = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) * a + 127.5 * (255 - a);
    sum += v;
    sumSq += v * v;
  }
  sum += transparent * gray;
  sumSq += transparent * gray * gray;
  const mean = sum / count;
  return Math.sqrt(Math.max(0, sumSq / count - mean * mean)) / (255 * 255);
}

function isRemoteDir(dirName) {
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(dirName);
}

function getAtlasPaths(dirName, scene) {
  const dir = dirName.endsWith('/') ? dirName : `${dirName}/`;
  const names = scene.isMerged
    ? scene.files
    : [scene.name, ...scene.files.map(file => extraModelName(scene, file)).filter(Boolean)];
  return names.map(name => `${dir}${name}${scene.atlasExt}`);
}

async function getTextureUrls(atlasPath) {
  const res = await fetch(toSpineAssetUrl(atlasPath));
  if (!res.ok) return [];
  const text = normalizeAtlasText(await res.text());
  const parent = atlasPath.substring(0, atlasPath.lastIndexOf('/') + 1);
  return text.split('\n')
    .filter(line => !line.includes(':') && /\.(png|jpg|jpeg|webp)$/i.test(line))
    .map(page => toSpineAssetUrl(`${parent}${page}`));
}

async function findNextScene() {
  const item = peekItem();
  if (!item || getRendererType(item.scene) !== 'spine' || isRemoteDir(item.dirName)) return null;
  try {
    const cacheKey = await getCacheKey(item.dirName, item.scene);
    if (cacheKey && await thumbnailCache.get(cacheKey)) return null;
    const urls = (await Promise.all(getAtlasPaths(item.dirName, item.scene).map(getTextureUrls))).flat();
    return { item, urls };
  } catch (err) {
    return null;
  }
}

function prepareNextScene() {
  const token = ++scenePrefetchToken;
  const next = findNextScene();
  return (premultiply) => {
    next.then((found) => {
      if (!found || token !== scenePrefetchToken) return;
      SpineVersionManager.prefetchMainFile(found.item.dirName, found.item.scene);
      if (found.urls.length > 0) prefetchTextures(found.urls, premultiply);
    });
  };
}

function cancelScenePrefetch() {
  scenePrefetchToken++;
  SpineVersionManager.clearPrefetchedMainFile();
  clearTexturePrefetch();
}

function storeThumbnail(key, canvas, cacheKey, currentGeneration) {
  if (!canvas) {
    thumbnails[key] = null;
    return;
  }
  encoding.add(key);
  canvasToBlob(canvas).then((blob) => {
    if (blob && cacheKey) thumbnailCache.put(cacheKey, blob);
    if (currentGeneration !== generation) return;
    encoding.delete(key);
    thumbnails[key] = blob ? URL.createObjectURL(blob) : null;
  });
}

function isPending(key) {
  return key in thumbnails || queued.has(key) || encoding.has(key);
}

function nextItem() {
  if (queue.length > 0) {
    const item = queue.shift();
    queued.delete(item.key);
    return item;
  }
  while (prefetchList.length > 0) {
    const scene = prefetchList.shift();
    const key = getKey(prefetchDir, scene);
    if (!isPending(key)) return { key, dirName: prefetchDir, scene };
  }
  return null;
}

function peekItem() {
  if (queue.length > 0) return queue[0];
  const scene = prefetchList.find(scene => !isPending(getKey(prefetchDir, scene)));
  return scene ? { key: getKey(prefetchDir, scene), dirName: prefetchDir, scene } : null;
}

function hasWork() {
  return queue.length > 0 || prefetchList.length > 0;
}

async function processQueue() {
  if (processing) return;
  processing = true;
  const currentGeneration = generation;
  try {
    while (currentGeneration === generation) {
      const item = nextItem();
      if (!item) break;
      const { key, dirName, scene } = item;
      if (key in thumbnails || encoding.has(key)) continue;
      const cacheKey = await getCacheKey(dirName, scene);
      const cached = cacheKey ? await thumbnailCache.get(cacheKey) : null;
      if (currentGeneration !== generation) break;
      if (cached) {
        thumbnails[key] = URL.createObjectURL(cached);
        continue;
      }
      let canvas = null;
      try {
        canvas = await captureThumbnail(dirName, scene);
      } catch (err) {
        console.warn('[ThumbnailManager] Failed to generate thumbnail:', err);
      }
      if (currentGeneration !== generation) break;
      storeThumbnail(key, canvas, cacheKey, currentGeneration);
    }
  } finally {
    cancelScenePrefetch();
    releaseSharedRenderers();
    processing = false;
  }
  if (currentGeneration !== generation && hasWork()) processQueue();
}

export const thumbnailManager = {
  getThumbnail(dirName, scene) {
    return thumbnails[getKey(dirName, scene)];
  },

  hasThumbnail(dirName, scene) {
    return getKey(dirName, scene) in thumbnails;
  },

  request(dirName, scene) {
    const key = getKey(dirName, scene);
    if (isPending(key)) return;
    queued.add(key);
    queue.push({ key, dirName, scene });
    processQueue();
  },

  cancel(dirName, scene) {
    const key = getKey(dirName, scene);
    if (!queued.delete(key)) return;
    queue = queue.filter(item => item.key !== key);
  },

  prefetch(dirName, scenes) {
    prefetchDir = dirName;
    prefetchList = [...scenes];
    if (prefetchList.length > 0) processQueue();
  },

  cancelAll() {
    queue = [];
    queued.clear();
    prefetchList = [];
  },

  clear() {
    generation++;
    cancelScenePrefetch();
    this.cancelAll();
    encoding.clear();
    for (const url of Object.values(thumbnails)) {
      if (url) URL.revokeObjectURL(url);
    }
    thumbnails = {};
  },
};
