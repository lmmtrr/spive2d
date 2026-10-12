import { createRenderer, getRendererType } from './renderer/createRenderer.js';
import { SpineRenderer } from './renderer/SpineRenderer.js';
import { appState } from './appState.svelte.js';
import { findIdleAnimation } from './utils.js';

const THUMBNAIL_SIZE = 256;
const SAMPLE_PROGRESS = 0.5;

let spineRenderer = null;
let thumbnails = $state({});
let queue = [];
let queued = new Set();
let encoding = new Set();
let processing = false;
let generation = 0;

function getKey(dirName, scene) {
  return `${dirName}::${scene.name}`;
}

function canvasToObjectUrl(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(blob => resolve(blob ? URL.createObjectURL(blob) : null), 'image/webp', 0.9);
  });
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
  if (animation) {
    await renderer.setAnimation(animation.value);
    renderer.seekAnimation(SAMPLE_PROGRESS);
  }
  return renderer.captureFrame(THUMBNAIL_SIZE, THUMBNAIL_SIZE);
}

function storeThumbnail(key, canvas, currentGeneration) {
  if (!canvas) {
    thumbnails[key] = null;
    return;
  }
  encoding.add(key);
  canvasToObjectUrl(canvas).then((url) => {
    if (currentGeneration !== generation) {
      if (url) URL.revokeObjectURL(url);
      return;
    }
    encoding.delete(key);
    thumbnails[key] = url;
  });
}

async function processQueue() {
  if (processing) return;
  processing = true;
  const currentGeneration = generation;
  try {
    while (queue.length > 0 && currentGeneration === generation) {
      const { key, dirName, scene } = queue.shift();
      queued.delete(key);
      if (key in thumbnails || encoding.has(key)) continue;
      let canvas = null;
      try {
        canvas = await captureThumbnail(dirName, scene);
      } catch (err) {
        console.warn('[ThumbnailManager] Failed to generate thumbnail:', err);
      }
      if (currentGeneration !== generation) break;
      storeThumbnail(key, canvas, currentGeneration);
    }
  } finally {
    releaseSpineRenderer();
    processing = false;
  }
  if (currentGeneration !== generation && queue.length > 0) processQueue();
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
    if (key in thumbnails || queued.has(key) || encoding.has(key)) return;
    queued.add(key);
    queue.push({ key, dirName, scene });
    processQueue();
  },

  cancel(dirName, scene) {
    const key = getKey(dirName, scene);
    if (!queued.delete(key)) return;
    queue = queue.filter(item => item.key !== key);
  },

  cancelAll() {
    queue = [];
    queued.clear();
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
