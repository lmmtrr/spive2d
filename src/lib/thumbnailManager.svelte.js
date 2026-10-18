import { invoke } from '@tauri-apps/api/core';
import { createRenderer, getRendererType } from './renderer/createRenderer.js';
import { SpineRenderer } from './renderer/SpineRenderer.js';
import { appState } from './appState.svelte.js';
import { findIdleAnimation } from './utils.js';
import { thumbnailCache } from './thumbnailCache.js';

const THUMBNAIL_SIZE = 256;
const SCORE_SIZE = 48;
const SAMPLE_PROGRESS = [0.25, 0.5, 0.75];
const CACHE_VERSION = 2;

let scoreCtx = null;
let spineRenderer = null;
let thumbnails = $state({});
let queue = [];
let queued = new Set();
let encoding = new Set();
let prefetchDir = null;
let prefetchList = [];
let processing = false;
let generation = 0;

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

function releaseSpineRenderer() {
  spineRenderer?.dispose();
  spineRenderer = null;
}

async function captureThumbnail(dirName, scene) {
  const reuseContext = getRendererType(scene) === 'spine';
  const renderer = reuseContext ? (spineRenderer ??= new SpineRenderer()) : createRenderer(scene);
  try {
    if ('setAlphaMode' in renderer) {
      renderer.setAlphaMode(appState.alphaMode);
    }
    if (typeof renderer.setTextureFilter === 'function') {
      renderer.setTextureFilter(appState.textureFilter);
    }
    await renderer.load(dirName, scene, {
      isPreload: true,
      thumbnail: true,
      reuseContext,
      canvasSize: THUMBNAIL_SIZE,
    });
    return await captureFrame(renderer);
  } catch (err) {
    if (reuseContext) releaseSpineRenderer();
    throw err;
  } finally {
    if (!reuseContext) renderer.dispose();
    else spineRenderer?._releaseScene();
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
  let sum = 0;
  let sumSq = 0;
  const count = data.length / 4;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    const v = lum * a + 0.5 * (1 - a);
    sum += v;
    sumSq += v * v;
  }
  const mean = sum / count;
  return Math.sqrt(Math.max(0, sumSq / count - mean * mean));
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
    releaseSpineRenderer();
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
    this.cancelAll();
    encoding.clear();
    for (const url of Object.values(thumbnails)) {
      if (url) URL.revokeObjectURL(url);
    }
    thumbnails = {};
  },
};
