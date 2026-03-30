import { appState } from './appState.svelte.js';
import { parseBackgroundImageUrl, loadImage } from './utils.js';
import { getRenderer } from './rendererStore.svelte.js';
import { SpineVersionManager } from './renderer/SpineVersionManager.js';
import { showNotification } from './notificationStore.svelte.js';
import { t } from './i18n.svelte.js';
import { writeFile, mkdir, exists } from '@tauri-apps/plugin-fs';
import { join, downloadDir } from '@tauri-apps/api/path';
import { exportQueue } from './exportQueue.svelte.js';
import {
  getFinalExportSize,
  resolveModelInfo,
  createOffscreenCanvas,
  drawBackground
} from './exportUtils.js';

const RECORDING_BITRATE = 12000000;
const RECORDING_FRAME_RATE = 60;

let taskIdCounter = 0;

class WorkerPool {
  constructor(workerUrl, size) {
    this.workers = [];
    this.idleWorkers = [];
    this.queue = [];
    for (let i = 0; i < size; i++) {
      const worker = new Worker(workerUrl, { type: 'module' });
      worker.onmessage = (e) => this._onMessage(i, e);
      this.workers.push({ worker, currentTask: null });
      this.idleWorkers.push(i);
    }
  }

  run(payload, transfer) {
    return new Promise((resolve, reject) => {
      this.queue.push({ payload, transfer, resolve, reject });
      this._processQueue();
    });
  }

  _processQueue() {
    while (this.queue.length > 0 && this.idleWorkers.length > 0) {
      const { payload, transfer, resolve, reject } = this.queue.shift();
      const workerIndex = this.idleWorkers.shift();
      const w = this.workers[workerIndex];
      w.currentTask = { resolve, reject };
      w.worker.postMessage(payload, transfer);
    }
  }

  _onMessage(index, e) {
    const w = this.workers[index];
    if (w.currentTask) {
      if (e.data.type === 'ERROR') w.currentTask.reject(e.data.error);
      else w.currentTask.resolve(e.data);
      w.currentTask = null;
    }
    this.idleWorkers.push(index);
    this._processQueue();
  }
}

const hardwareConcurrency = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;
const encoderPoolSize = Math.max(2, Math.min(8, hardwareConcurrency - 1));
const encoderPool = new WorkerPool(new URL('./pngEncoder.worker.js', import.meta.url), encoderPoolSize);

async function downloadCanvas(canvas, sceneText, animationName, suffix = '') {
  const safeName = animationName ? animationName.split('.')[0] : 'snapshot';
  const baseFilename = `${sceneText}_${safeName}${suffix}`;
  try {
    const baseDir = await downloadDir();
    const exportBaseDir = await join(baseDir, 'spive2d_export');
    await mkdir(exportBaseDir, { recursive: true });
    let finalFilename = `${baseFilename}.png`;
    let filePath = await join(exportBaseDir, finalFilename);
    let counter = 1;
    while (await exists(filePath)) {
      finalFilename = `${baseFilename} (${counter}).png`;
      filePath = await join(exportBaseDir, finalFilename);
      counter++;
    }
    let buffer;
    if (canvas.convertToBlob) {
      const blob = await canvas.convertToBlob({ type: 'image/png' });
      buffer = await blob.arrayBuffer();
    } else if (canvas.toBlob) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      buffer = await blob.arrayBuffer();
    } else {
      const dataUrl = canvas.toDataURL('image/png');
      const res = await fetch(dataUrl);
      buffer = await res.arrayBuffer();
    }
    await writeFile(filePath, new Uint8Array(buffer));
  } catch (err) {
    console.error('Failed to write image:', err);
  }
}

export async function exportImage(sceneText, animationName) {
  const taskId = `image-${++taskIdCounter}`;
  const safeName = animationName ? animationName.split('.')[0] : 'snapshot';
  const baseFilename = `${sceneText}_${safeName}`;
  exportQueue.add({
    id: taskId,
    type: 'Image',
    name: baseFilename,
    progress: 100,
    status: 'processing'
  });
  try {
    const renderer = getRenderer();
    if (!renderer) {
      exportQueue.updateStatus(taskId, 'error');
      return;
    }
    const backgroundColor = document.body.style.backgroundColor;
    const backgroundImage = document.body.style.backgroundImage;
    const imageUrl = parseBackgroundImageUrl(backgroundImage);
    const { finalWidth, finalHeight, marginX, marginY } = getFinalExportSize(renderer);
    const capturedCanvas = renderer.captureFrame(finalWidth, finalHeight, {
      ignoreTransform: appState.exportBase === 'original',
      marginX,
      marginY
    });
    if (!capturedCanvas) {
      exportQueue.updateStatus(taskId, 'error');
      return;
    }
    const tempCanvas = createOffscreenCanvas(finalWidth, finalHeight);
    const ctx = tempCanvas.getContext('2d');
    if (imageUrl) {
      const img = await loadImage(imageUrl);
      drawBackground(ctx, finalWidth, finalHeight, img, null);
    } else {
      drawBackground(ctx, finalWidth, finalHeight, null, backgroundColor);
    }
    if (ctx && 'drawImage' in ctx) {
      ctx.drawImage(capturedCanvas, 0, 0);
    }
    await downloadCanvas(tempCanvas, sceneText, animationName);
    exportQueue.updateStatus(taskId, 'completed');
  } catch (err) {
    console.error('Failed to export image:', err);
    exportQueue.updateStatus(taskId, 'error');
  }
}

async function prepareExportContext(taskId, baseFilename, workerUrl) {
  const modelInfo = resolveModelInfo();
  if (!modelInfo) {
    exportQueue.updateStatus(taskId, 'error');
    return null;
  }
  const worker = new Worker(workerUrl, { type: 'module' });
  exportQueue.updateWorker(taskId, worker);
  let backgroundImageToRender = null;
  const backgroundColor = document.body.style.backgroundColor;
  const backgroundImage = document.body.style.backgroundImage;
  const imageUrl = parseBackgroundImageUrl(backgroundImage);
  if (imageUrl) {
    backgroundImageToRender = await loadImage(imageUrl);
  }
  const activeRenderer = getRenderer();
  const originalSize = activeRenderer?.getOriginalSize() || { width: 1, height: 1 };
  let spineVersion = null;
  let isFileJson = false;
  if (modelInfo.rendererType === 'spine') {
    const v = await SpineVersionManager.detectVersion(modelInfo.selectedDir, modelInfo.fileNames);
    spineVersion = v.version;
    isFileJson = v.isJson;
  }
  const screenBaseScale = Math.min(window.innerWidth / originalSize.width, window.innerHeight / originalSize.height);
  const transform = {
    scale: activeRenderer?._scale || 1,
    x: activeRenderer?._moveX || 0,
    y: activeRenderer?._moveY || 0,
    rotation: activeRenderer?._rotate || 0,
    originalWidth: originalSize.width,
    originalHeight: originalSize.height,
    screenBaseScale
  };

  return {
    ...modelInfo,
    worker,
    backgroundImageToRender,
    backgroundColor,
    activeRenderer,
    transform,
    syncState: activeRenderer?.getSyncState() || null,
    spineVersion,
    isFileJson
  };
}

async function saveExportedFile(baseFilename, extension, buffer) {
  const baseDir = await downloadDir();
  const exportBaseDir = await join(baseDir, 'spive2d_export');
  await mkdir(exportBaseDir, { recursive: true });
  let finalOutputFilename = `${baseFilename}.${extension}`;
  let filePath = await join(exportBaseDir, finalOutputFilename);
  let counter = 1;
  while (await exists(filePath)) {
    finalOutputFilename = `${baseFilename} (${counter}).${extension}`;
    filePath = await join(exportBaseDir, finalOutputFilename);
    counter++;
  }
  await writeFile(filePath, new Uint8Array(buffer));
  return finalOutputFilename;
}

export async function exportAnimation(sceneText, animationName, animationValue, expressionValue, onProgress) {
  if (typeof VideoEncoder === 'undefined') {
    showNotification(t('mediaRecorderNotSupported') || 'VideoEncoder API not supported', 'error');
    return;
  }
  const taskId = `video-${++taskIdCounter}`;
  const safeName = animationName ? animationName.split('.')[0] : 'animation';
  const baseFilename = `${sceneText}_${safeName}`;
  exportQueue.add({
    id: taskId,
    type: 'Video',
    name: baseFilename,
    progress: 0,
    status: 'processing'
  });
  const ctx = await prepareExportContext(taskId, baseFilename, new URL('./exporter.worker.js', import.meta.url));
  if (!ctx) return;
  const { rendererType, modelUrl, worker, backgroundImageToRender, backgroundColor, activeRenderer, transform, syncState, spineVersion, selectedDir, fileNames, isFileJson } = ctx;
  const bgBitmap = backgroundImageToRender ? await createImageBitmap(backgroundImageToRender) : null;
  const speed = appState.animation.speed || 1.0;
  let baseDuration = 0.1;
  let fps = RECORDING_FRAME_RATE;
  let totalFrames = 0;
  const { finalWidth: rawFinalWidth, finalHeight: rawFinalHeight, marginX, marginY } = getFinalExportSize(activeRenderer);
  const finalWidth = rawFinalWidth % 2 === 0 ? rawFinalWidth : rawFinalWidth + 1;
  const finalHeight = rawFinalHeight % 2 === 0 ? rawFinalHeight : rawFinalHeight + 1;
  let framesInFlight = 0;
  let currentRenderFrame = 0;
  let currentWorkerFrame = 0;
  let isRendering = false;
  const MAX_FRAMES_IN_FLIGHT = encoderPoolSize * 2;
  async function processNextFrames() {
    if (isRendering) return;
    isRendering = true;
    try {
      while (framesInFlight < MAX_FRAMES_IN_FLIGHT && currentRenderFrame < totalFrames) {
        const item = exportQueue.items.find(i => i.id === taskId);
        if (!item || item.status === 'cancelled') {
          return;
        }
        const frame = currentRenderFrame++;
        framesInFlight++;
        const sampleTime = (frame / fps) * speed;
        const containerTime = frame / fps;
        worker.postMessage({ type: 'RENDER_FRAME', id: taskId, sampleTime, containerTime, sequence: frame });
        if (frame % 5 === 0) await new Promise(r => setTimeout(r, 0));
      }
    } finally {
      isRendering = false;
    }
  }
  worker.onmessage = async (e) => {
    const item = exportQueue.items.find(i => i.id === taskId);
    if (!item || item.status === 'cancelled') {
      worker.terminate();
      return;
    }
    const { type, buffer, duration, fps: workerFps } = e.data;
    switch (type) {
      case 'READY':
        baseDuration = duration;
        fps = workerFps;
        totalFrames = Math.ceil((baseDuration / speed) * fps);
        await processNextFrames();
        break;
      case 'FRAME_ADDED':
        currentWorkerFrame++;
        framesInFlight--;
        exportQueue.updateProgress(taskId, (currentWorkerFrame / totalFrames) * 100);
        if (currentWorkerFrame >= totalFrames) {
          worker.postMessage({ type: 'FINISH_VIDEO', id: taskId });
        } else {
          processNextFrames();
        }
        break;
      case 'DONE_VIDEO':
        try {
          await saveExportedFile(baseFilename, 'webm', buffer);
          exportQueue.updateProgress(taskId, 100);
          exportQueue.updateStatus(taskId, 'completed');
        } catch (err) {
          console.error('Failed to write video:', err);
          exportQueue.updateStatus(taskId, 'error');
        } finally {
          worker.terminate();
        }
        break;
      case 'ERROR':
        exportQueue.updateStatus(taskId, 'error');
        worker.terminate();
        break;
    }
  };
  const videoPayload = {
    type: 'START_VIDEO',
    id: taskId,
    width: finalWidth,
    height: finalHeight,
    bitrate: RECORDING_BITRATE,
    fps: fps,
    rendererType,
    modelUrl: modelUrl,
    animName: animationValue,
    exprName: expressionValue,
    bgColor: backgroundColor,
    transform,
    syncState,
    duration: baseDuration,
    spineVersion,
    selectedDir,
    fileNames,
    isFileJson,
    marginX,
    marginY
  };
  const cleanVideoPayload = JSON.parse(JSON.stringify(videoPayload));
  cleanVideoPayload.selectedDir = ctx.selectedDirUrl || selectedDir;
  cleanVideoPayload.bgBitmap = bgBitmap;
  worker.postMessage(cleanVideoPayload, bgBitmap ? [bgBitmap] : []);
}

export async function exportImageSequence(targetDir, sceneText, animationName, animationValue, expressionValue, onProgress) {
  const taskId = `png-${++taskIdCounter}`;
  const safeName = animationName ? animationName.split('.')[0] : 'sequence';
  const baseFilename = `${sceneText}_${safeName}`;
  exportQueue.add({
    id: taskId,
    type: 'PNG Sequence',
    name: baseFilename,
    progress: 0,
    status: 'processing'
  });
  const ctx = await prepareExportContext(taskId, baseFilename, new URL('./exporter.worker.js', import.meta.url));
  if (!ctx) return;
  const { rendererType, modelUrl, worker, backgroundImageToRender, backgroundColor, activeRenderer, transform, syncState, spineVersion, selectedDir, fileNames, isFileJson } = ctx;
  const bgBitmap = backgroundImageToRender ? await createImageBitmap(backgroundImageToRender) : null;
  const speed = appState.animation.speed || 1.0;
  let baseDuration = 0.1;
  let fps = RECORDING_FRAME_RATE;
  let totalFrames = 0;
  const { finalWidth, finalHeight, marginX, marginY } = getFinalExportSize(activeRenderer);
  const writePromises = [];
  let framesProcessed = 0;
  let framesInFlight = 0;
  let currentRenderFrame = 0;
  let isRendering = false;
  const MAX_FRAMES_IN_FLIGHT = encoderPoolSize * 2;
  async function processNextFrames() {
    if (isRendering) return;
    isRendering = true;
    try {
      while (framesInFlight < MAX_FRAMES_IN_FLIGHT && currentRenderFrame < totalFrames) {
        const item = exportQueue.items.find(i => i.id === taskId);
        if (!item || item.status === 'cancelled') {
          return;
        }
        const frame = currentRenderFrame++;
        framesInFlight++;
        const sampleTime = (frame / fps) * speed;
        worker.postMessage({ type: 'RENDER_FRAME', id: taskId, sampleTime, sequence: frame });
        if (frame % 5 === 0) await new Promise(r => setTimeout(r, 0));
      }
    } finally {
      isRendering = false;
    }
  }
  const onWorkerMessage = async (data) => {
    const item = exportQueue.items.find(i => i.id === taskId);
    if (!item || item.status === 'cancelled') {
      worker.terminate();
      return;
    }
    const { type, duration, fps: workerFps, bitmap, frameIndex, buffer } = data;
    switch (type) {
      case 'READY':
        baseDuration = duration;
        fps = workerFps;
        totalFrames = Math.ceil((baseDuration / speed) * fps);
        await processNextFrames();
        break;
      case 'FRAME_RENDERED':
        encoderPool.run({ type: 'PROCESS_FRAME_PNG', id: taskId, bitmap, frameIndex }, [bitmap])
          .then(result => onWorkerMessage(result))
          .catch(err => onWorkerMessage({ type: 'ERROR', error: err }));
        break;
      case 'FRAME_PNG_DONE':
        framesInFlight--;
        const bytes = new Uint8Array(buffer);
        const frameStr = String(frameIndex).padStart(4, '0');
        const filename = `${sceneText}_${safeName}_${frameStr}.png`;
        const p = join(targetDir, filename).then(filePath => writeFile(filePath, bytes));
        writePromises.push(p);
        framesProcessed++;
        exportQueue.updateProgress(taskId, (framesProcessed / totalFrames) * 100);
        if (writePromises.length >= 50) {
          const currentPromises = [...writePromises];
          writePromises.length = 0;
          await Promise.all(currentPromises);
        }
        if (framesProcessed >= totalFrames) {
          if (writePromises.length > 0) await Promise.all(writePromises);
          exportQueue.updateProgress(taskId, 100);
          exportQueue.updateStatus(taskId, 'completed');
          worker.postMessage({ type: 'FINISH_PNG_SEQUENCE', id: taskId });
          worker.terminate();
        } else {
          await processNextFrames();
        }
        break;
      case 'ERROR':
        exportQueue.updateStatus(taskId, 'error');
        worker.terminate();
        break;
    }
  };
  worker.onmessage = (e) => onWorkerMessage(e.data);
  const pngPayload = {
    type: 'START_PNG_SEQUENCE',
    id: taskId,
    width: finalWidth,
    height: finalHeight,
    rendererType,
    modelUrl: modelUrl,
    animName: animationValue,
    exprName: expressionValue,
    bgColor: backgroundColor,
    transform: transform,
    syncState,
    duration: baseDuration,
    fps: RECORDING_FRAME_RATE,
    spineVersion,
    selectedDir,
    fileNames,
    isFileJson,
    marginX,
    marginY
  };
  const cleanPngPayload = JSON.parse(JSON.stringify(pngPayload));
  cleanPngPayload.selectedDir = ctx.selectedDirUrl || selectedDir;
  cleanPngPayload.bgBitmap = bgBitmap;
  worker.postMessage(cleanPngPayload, bgBitmap ? [bgBitmap] : []);
}
