import { appState } from './appState.svelte.js';
import { parseBackgroundImageUrl, loadImage } from './utils.js';
import { getRenderer } from './rendererStore.js';
import { createRenderer } from './renderer/createRenderer.js';
import { showNotification } from './notificationStore.svelte.js';
import { t } from './i18n.svelte.js';
import { writeFile, mkdir, exists } from '@tauri-apps/plugin-fs';
import { join, downloadDir } from '@tauri-apps/api/path';
import { exportQueue } from './exportQueue.svelte.js';

const RECORDING_BITRATE = 12000000;
const RECORDING_FRAME_RATE = 60;

let taskIdCounter = 0;

function createOffscreenCanvas(width = 1, height = 1) {
  return typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(width, height)
    : document.createElement('canvas');
}

function drawBackground(ctx, width, height, bgImage, bgColor) {
  ctx.clearRect(0, 0, width, height);
  if (bgImage) ctx.drawImage(bgImage, 0, 0, width, height);
  else if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }
}

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
    } else {
      const dataUrl = canvas.toDataURL('image/png');
      const base64 = dataUrl.split(',')[1];
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      buffer = bytes.buffer;
    }
    await writeFile(filePath, new Uint8Array(buffer));
  } catch (err) {
    console.error('Failed to write image:', err);
  }
}

function getFinalExportSize(renderer) {
  let baseWidth, baseHeight;
  if (appState.exportBase === 'original' && renderer) {
    const size = renderer.getOriginalSize();
    baseWidth = size.width;
    baseHeight = size.height;
  } else {
    const activeCanvas = getRenderer()?.getCanvas() || { width: window.innerWidth, height: window.innerHeight };
    baseWidth = activeCanvas.width;
    baseHeight = activeCanvas.height;
  }
  const scale = appState.exportScale / 100;
  const marginX = Math.round(appState.exportMarginX);
  const marginY = Math.round(appState.exportMarginY);
  const contentWidth = Math.round(baseWidth * scale);
  const contentHeight = Math.round(baseHeight * scale);
  return {
    contentWidth,
    contentHeight,
    finalWidth: contentWidth + marginX * 2,
    finalHeight: contentHeight + marginY * 2,
    marginX,
    marginY
  };
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
    const { contentWidth, contentHeight, finalWidth, finalHeight, marginX, marginY } = getFinalExportSize(renderer);
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

export async function exportAnimation(sceneText, animationName, expressionName, onProgress) {
  const activeRenderer = getRenderer();
  if (!activeRenderer) return;
  if (typeof VideoEncoder === 'undefined') {
    showNotification(t('mediaRecorderNotSupported') || 'VideoEncoder API not supported', 'error');
    return;
  }
  const taskIdCounterValue = ++taskIdCounter;
  const taskId = `video-${taskIdCounterValue}`;
  const safeName = animationName ? animationName.split('.')[0] : 'animation';
  const baseFilename = `${sceneText}_${safeName}`;
  const worker = new Worker(new URL('./exporter.worker.js', import.meta.url), { type: 'module' });
  exportQueue.add({
    id: taskId,
    type: 'Video',
    name: baseFilename,
    progress: 0,
    status: 'processing',
    worker: worker
  });
  let compositingCanvas = null;
  let backgroundImageToRender = null;
  const backgroundColor = document.body.style.backgroundColor;
  const backgroundImage = document.body.style.backgroundImage;
  const imageUrl = parseBackgroundImageUrl(backgroundImage);
  if (imageUrl) {
    backgroundImageToRender = await loadImage(imageUrl);
    compositingCanvas = createOffscreenCanvas(1, 1);
  } else if (backgroundColor) {
    compositingCanvas = createOffscreenCanvas(1, 1);
  }
  const { files, selectedDir, selectedScene } = appState.directories;
  if (!files || !selectedDir || !files[selectedDir]) {
    exportQueue.updateStatus(taskId, 'error');
    worker.terminate();
    return;
  }
  const fileNames = files[selectedDir][selectedScene];
  const hiddenRenderer = createRenderer(fileNames, true);
  if (hiddenRenderer.setAlphaMode) {
    hiddenRenderer.setAlphaMode(appState.alphaMode);
  }
  try {
    await hiddenRenderer.load(selectedDir, fileNames);
  } catch (err) {
    console.error('Failed to load hidden renderer for export', err);
    exportQueue.updateStatus(taskId, 'error');
    worker.terminate();
    return;
  }
  const allSkins = activeRenderer.getPropertyItems?.('skins') || [];
  if (allSkins.length > 0 && 'applySkins' in hiddenRenderer && typeof hiddenRenderer.applySkins === 'function') {
    const activeSkins = allSkins.filter(item => item.checked).map(item => item.name);
    hiddenRenderer.applySkins(activeSkins);
  }
  const activeParams = activeRenderer.getPropertyItems?.('parameters') || [];
  for (const p of activeParams) {
    hiddenRenderer.updatePropertyItem('parameters', p.name, p.index, p.value);
  }
  const syncVisibilityProps = ['attachments', 'parts', 'drawables'];
  for (const propCategory of syncVisibilityProps) {
    const props = activeRenderer.getPropertyItems?.(propCategory) || [];
    for (const p of props) {
      if (p.type === 'checkbox' && p.checked === false) {
        hiddenRenderer.updatePropertyItem(propCategory, p.name, p.index, false);
      }
    }
  }
  const activeLayout = appState.transform;
  hiddenRenderer.applyTransform(activeLayout.scale, activeLayout.moveX, activeLayout.moveY, activeLayout.rotate);
  let targetAnim = hiddenRenderer.getAnimations()?.[0]?.value;
  if (animationName) {
    const match = hiddenRenderer.getAnimations().find(a => a.name === animationName);
    if (match) targetAnim = match.value;
  }
  if (targetAnim) {
    const p = hiddenRenderer.setAnimation(targetAnim);
    if (p && typeof p.then === 'function') {
      await p;
      await new Promise(r => setTimeout(r, 50));
    }
  }
  if (expressionName && 'setExpression' in hiddenRenderer && typeof hiddenRenderer.setExpression === 'function') {
    hiddenRenderer.setExpression(expressionName);
  }
  hiddenRenderer.setPaused(true);
  const { contentWidth, contentHeight, finalWidth: rawFinalWidth, finalHeight: rawFinalHeight, marginX, marginY } = getFinalExportSize(activeRenderer);
  const finalWidth = rawFinalWidth % 2 === 0 ? rawFinalWidth : rawFinalWidth + 1;
  const finalHeight = rawFinalHeight % 2 === 0 ? rawFinalHeight : rawFinalHeight + 1;
  if ('resize' in hiddenRenderer && typeof hiddenRenderer.resize === 'function') {
    hiddenRenderer.resize(contentWidth, contentHeight);
  }
  if (compositingCanvas) {
    compositingCanvas.width = finalWidth;
    compositingCanvas.height = finalHeight;
  }
  const baseDuration = hiddenRenderer.getAnimationDuration() || 0.1;
  const fps = hiddenRenderer.getFPS?.() || RECORDING_FRAME_RATE;
  const totalFrames = Math.ceil(baseDuration * fps);

  function cleanup() {
    hiddenRenderer.dispose();
  }

  worker.onmessage = async (e) => {
    const item = exportQueue.items.find(i => i.id === taskId);
    if (!item || item.status === 'cancelled') {
      worker.terminate();
      cleanup();
      return;
    }
    if (e.data.type === 'STARTED') {
      if ('stepAnimation' in hiddenRenderer && typeof hiddenRenderer.stepAnimation === 'function' && 'seekAnimation' in hiddenRenderer && typeof hiddenRenderer.seekAnimation === 'function') {
        hiddenRenderer.seekAnimation(0);
      }
      processNextFrame(0);
    } else if (e.data.type === 'FRAME_ADDED') {
      currentWorkerFrame++;
      exportQueue.updateProgress(taskId, (currentWorkerFrame / totalFrames) * 100);
      processNextFrame(currentWorkerFrame);
    } else if (e.data.type === 'DONE_VIDEO') {
      const buffer = e.data.buffer;
      try {
        const baseDir = await downloadDir();
        const exportBaseDir = await join(baseDir, 'spive2d_export');
        await mkdir(exportBaseDir, { recursive: true });
        let finalOutputFilename = `${baseFilename}.webm`;
        let filePath = await join(exportBaseDir, finalOutputFilename);
        let counter = 1;
        while (await exists(filePath)) {
          finalOutputFilename = `${baseFilename} (${counter}).webm`;
          filePath = await join(exportBaseDir, finalOutputFilename);
          counter++;
        }
        await writeFile(filePath, new Uint8Array(buffer));
        exportQueue.updateStatus(taskId, 'completed');
      } catch (err) {
        console.error('Failed to write video:', err);
        exportQueue.updateStatus(taskId, 'error');
      } finally {
        worker.terminate();
        cleanup();
      }
    } else if (e.data.type === 'ERROR') {
      exportQueue.updateStatus(taskId, 'error');
      console.error('Worker error:', e.data.error);
      worker.terminate();
      cleanup();
    }
  };

  worker.postMessage({
    type: 'START_VIDEO',
    id: taskId,
    width: finalWidth,
    height: finalHeight,
    bitrate: RECORDING_BITRATE,
    fps: fps
  });

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = finalWidth;
  tempCanvas.height = finalHeight;
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

  let currentWorkerFrame = 0;

  async function processNextFrame(frame) {
    const item = exportQueue.items.find(i => i.id === taskId);
    if (!item || item.status === 'cancelled') {
      cleanup();
      return;
    }
    if (frame >= totalFrames) {
      worker.postMessage({ type: 'FINISH_VIDEO', id: taskId });
      return;
    }
    const time = frame / fps;
    const progress = baseDuration > 0 ? time / baseDuration : 0;
    if ('stepAnimation' in hiddenRenderer && typeof hiddenRenderer.stepAnimation === 'function') {
      if (frame > 0) hiddenRenderer.stepAnimation(1 / fps);
    } else if ('seekAnimation' in hiddenRenderer && typeof hiddenRenderer.seekAnimation === 'function') {
      hiddenRenderer.seekAnimation(progress);
    }
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    let capturedCanvas;
    if ('captureFrame' in hiddenRenderer && typeof hiddenRenderer.captureFrame === 'function') {
      capturedCanvas = hiddenRenderer.captureFrame(finalWidth, finalHeight, {
        ignoreTransform: appState.exportBase === 'original',
        marginX,
        marginY
      });
    } else {
      capturedCanvas = hiddenRenderer.getCanvas();
    }
    if (compositingCanvas && capturedCanvas) {
      const ctx = compositingCanvas.getContext('2d');
      drawBackground(ctx, finalWidth, finalHeight, backgroundImageToRender, backgroundColor);
      ctx.drawImage(capturedCanvas, 0, 0);
      tempCtx.clearRect(0, 0, finalWidth, finalHeight);
      tempCtx.drawImage(compositingCanvas, 0, 0, finalWidth, finalHeight);
    } else if (capturedCanvas) {
      tempCtx.clearRect(0, 0, finalWidth, finalHeight);
      tempCtx.drawImage(capturedCanvas, 0, 0);
    }
    createImageBitmap(tempCanvas).then((bitmap) => {
      if (item.status !== 'cancelled') {
        worker.postMessage({ type: 'ADD_FRAME_VIDEO', id: taskId, bitmap, time }, [bitmap]);
      }
    });
  }
}

export async function exportPNGSequence(targetDir, sceneText, animationName, expressionName, onProgress) {
  const activeRenderer = getRenderer();
  if (!activeRenderer) return;
  taskIdCounter++;
  const taskId = `png-${taskIdCounter}`;
  const safeName = animationName ? animationName.split('.')[0] : 'sequence';
  const baseFilename = `${sceneText}_${safeName}`;
  const worker = new Worker(new URL('./exporter.worker.js', import.meta.url), { type: 'module' });
  exportQueue.add({
    id: taskId,
    type: 'PNG Sequence',
    name: baseFilename,
    progress: 0,
    status: 'processing',
    worker: worker
  });
  let compositingCanvas = null;
  let backgroundImageToRender = null;
  const backgroundColor = document.body.style.backgroundColor;
  const backgroundImage = document.body.style.backgroundImage;
  const imageUrl = parseBackgroundImageUrl(backgroundImage);
  if (imageUrl) {
    backgroundImageToRender = await loadImage(imageUrl);
    compositingCanvas = createOffscreenCanvas(1, 1);
  } else if (backgroundColor) {
    compositingCanvas = createOffscreenCanvas(1, 1);
  }
  const { files, selectedDir, selectedScene } = appState.directories;
  if (!files || !selectedDir || !files[selectedDir]) {
    exportQueue.updateStatus(taskId, 'error');
    worker.terminate();
    return;
  }
  const fileNames = files[selectedDir][selectedScene];
  const hiddenRenderer = createRenderer(fileNames, true);
  if (hiddenRenderer.setAlphaMode) {
    hiddenRenderer.setAlphaMode(appState.alphaMode);
  }
  try {
    await hiddenRenderer.load(selectedDir, fileNames);
  } catch (err) {
    console.error('Failed to load hidden renderer for export', err);
    exportQueue.updateStatus(taskId, 'error');
    worker.terminate();
    return;
  }
  const allSkins = activeRenderer.getPropertyItems?.('skins') || [];
  if (allSkins.length > 0 && 'applySkins' in hiddenRenderer && typeof hiddenRenderer.applySkins === 'function') {
    const activeSkins = allSkins.filter(item => item.checked).map(item => item.name);
    hiddenRenderer.applySkins(activeSkins);
  }
  const activeParams = activeRenderer.getPropertyItems?.('parameters') || [];
  for (const p of activeParams) {
    hiddenRenderer.updatePropertyItem('parameters', p.name, p.index, p.value);
  }
  const syncVisibilityProps = ['attachments', 'parts', 'drawables'];
  for (const propCategory of syncVisibilityProps) {
    const props = activeRenderer.getPropertyItems?.(propCategory) || [];
    for (const p of props) {
      if (p.type === 'checkbox' && p.checked === false) {
        hiddenRenderer.updatePropertyItem(propCategory, p.name, p.index, false);
      }
    }
  }
  const activeLayout = appState.transform;
  hiddenRenderer.applyTransform(activeLayout.scale, activeLayout.moveX, activeLayout.moveY, activeLayout.rotate);
  let targetAnim = hiddenRenderer.getAnimations()?.[0]?.value;
  if (animationName) {
    const match = hiddenRenderer.getAnimations().find(a => a.name === animationName);
    if (match) targetAnim = match.value;
  }
  if (targetAnim) {
    const p = hiddenRenderer.setAnimation(targetAnim);
    if (p && typeof p.then === 'function') {
      await p;
      await new Promise(r => setTimeout(r, 50));
    }
  }
  if (expressionName && 'setExpression' in hiddenRenderer && typeof hiddenRenderer.setExpression === 'function') {
    hiddenRenderer.setExpression(expressionName);
  }
  hiddenRenderer.setPaused(true);
  const { contentWidth, contentHeight, finalWidth, finalHeight, marginX, marginY } = getFinalExportSize(activeRenderer);
  if ('resize' in hiddenRenderer && typeof hiddenRenderer.resize === 'function') {
    hiddenRenderer.resize(contentWidth, contentHeight);
  }
  if (compositingCanvas) {
    compositingCanvas.width = finalWidth;
    compositingCanvas.height = finalHeight;
  }
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = finalWidth;
  tempCanvas.height = finalHeight;
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
  const baseDuration = hiddenRenderer.getAnimationDuration() || 0.1;
  const fps = hiddenRenderer.getFPS?.() || RECORDING_FRAME_RATE;
  const totalFrames = Math.ceil(baseDuration * fps);

  function cleanup() {
    hiddenRenderer.dispose();
  }

  const writePromises = [];
  let framesProcessed = 0;

  worker.onmessage = async (e) => {
    const item = exportQueue.items.find(i => i.id === taskId);
    if (!item || item.status === 'cancelled') return;
    if (e.data.type === 'FRAME_PNG_DONE') {
      const buffer = e.data.buffer;
      const frameIndex = e.data.frameIndex;
      const bytes = new Uint8Array(buffer);
      const frameStr = String(frameIndex).padStart(4, '0');
      const filename = `${sceneText}_${safeName}_${frameStr}.png`;
      const p = join(targetDir, filename).then(filePath => writeFile(filePath, bytes)).catch(err => {
        console.error(`Failed to write frame ${frameIndex}:`, err);
      });
      writePromises.push(p);
      framesProcessed++;
      exportQueue.updateProgress(taskId, (framesProcessed / totalFrames) * 100);
      if (writePromises.length >= 10) {
        await Promise.all(writePromises);
        writePromises.length = 0;
      }
      if (framesProcessed >= totalFrames) {
        if (writePromises.length > 0) {
          await Promise.all(writePromises);
        }
        exportQueue.updateStatus(taskId, 'completed');
        worker.terminate();
        cleanup();
      }
    } else if (e.data.type === 'ERROR') {
      console.error('Sequence worker error:', e.data.error);
      exportQueue.updateStatus(taskId, 'error');
      worker.terminate();
      cleanup();
    }
  };

  let currentWorkerFrame = 0;

  async function processNextFrame() {
    const item = exportQueue.items.find(i => i.id === taskId);
    if (!item || item.status === 'cancelled') {
      cleanup();
      return;
    }
    if (currentWorkerFrame >= totalFrames) return;
    const frame = currentWorkerFrame;
    const time = frame / fps;
    const progress = baseDuration > 0 ? time / baseDuration : 0;
    if ('stepAnimation' in hiddenRenderer && typeof hiddenRenderer.stepAnimation === 'function') {
      if (frame > 0) hiddenRenderer.stepAnimation(1 / fps);
    } else if ('seekAnimation' in hiddenRenderer && typeof hiddenRenderer.seekAnimation === 'function') {
      hiddenRenderer.seekAnimation(progress);
    }
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    let capturedCanvas;
    if ('captureFrame' in hiddenRenderer && typeof hiddenRenderer.captureFrame === 'function') {
      capturedCanvas = hiddenRenderer.captureFrame(finalWidth, finalHeight, {
        ignoreTransform: appState.exportBase === 'original',
        marginX,
        marginY
      });
    } else {
      capturedCanvas = hiddenRenderer.getCanvas();
    }
    if (compositingCanvas && capturedCanvas) {
      const ctx = compositingCanvas.getContext('2d');
      drawBackground(ctx, finalWidth, finalHeight, backgroundImageToRender, backgroundColor);
      ctx.drawImage(capturedCanvas, 0, 0);
      tempCtx.clearRect(0, 0, finalWidth, finalHeight);
      tempCtx.drawImage(compositingCanvas, 0, 0, finalWidth, finalHeight);
    } else if (capturedCanvas) {
      tempCtx.clearRect(0, 0, finalWidth, finalHeight);
      tempCtx.drawImage(capturedCanvas, 0, 0);
    }
    createImageBitmap(tempCanvas).then((bitmap) => {
      if (item.status !== 'cancelled') {
        worker.postMessage({ type: 'PROCESS_FRAME_PNG', id: taskId, bitmap, frameIndex: frame }, [bitmap]);
        currentWorkerFrame++;
        setTimeout(processNextFrame, 0);
      }
    });
  }
  if ('seekAnimation' in hiddenRenderer && typeof hiddenRenderer.seekAnimation === 'function') {
    hiddenRenderer.seekAnimation(0);
  }
  processNextFrame();
}
