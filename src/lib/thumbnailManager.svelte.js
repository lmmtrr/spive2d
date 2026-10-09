import { createRenderer } from './renderer/createRenderer.js';
import { appState } from './appState.svelte.js';
import { findIdleAnimation } from './utils.js';

const THUMBNAIL_SIZE = 256;
const SCORE_SIZE = 48;
const SAMPLE_PROGRESS = [0.25, 0.5, 0.75];

let scoreCtx = null;
let thumbnails = $state({});
let queue = [];
let queued = new Set();
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

async function generateThumbnail(dirName, scene) {
  const renderer = createRenderer(scene);
  try {
    if ('setAlphaMode' in renderer) {
      renderer.setAlphaMode(appState.alphaMode);
    }
    if (typeof renderer.setTextureFilter === 'function') {
      renderer.setTextureFilter(appState.textureFilter);
    }
    await renderer.load(dirName, scene, { isPreload: true });
    const canvas = await captureBestFrame(renderer);
    return canvas ? await canvasToObjectUrl(canvas) : null;
  } finally {
    renderer.dispose();
  }
}

async function captureBestFrame(renderer) {
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

async function processQueue() {
  if (processing) return;
  processing = true;
  const currentGeneration = generation;
  try {
    while (queue.length > 0 && currentGeneration === generation) {
      const { key, dirName, scene } = queue.shift();
      queued.delete(key);
      if (key in thumbnails) continue;
      let url = null;
      try {
        url = await generateThumbnail(dirName, scene);
      } catch (err) {
        console.warn('[ThumbnailManager] Failed to generate thumbnail:', err);
      }
      if (currentGeneration !== generation) {
        if (url) URL.revokeObjectURL(url);
        break;
      }
      thumbnails[key] = url;
    }
  } finally {
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
    if (key in thumbnails || queued.has(key)) return;
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
    for (const url of Object.values(thumbnails)) {
      if (url) URL.revokeObjectURL(url);
    }
    thumbnails = {};
  },
};
