import { appState } from './appState.svelte.js';
import { parseBackgroundImageUrl, loadImage } from './utils.js';
import { getRenderer } from './rendererStore.js';
import { showNotification } from './notificationStore.svelte.js';
import { t } from './i18n.svelte.js';
import { writeFile, mkdir, exists } from '@tauri-apps/plugin-fs';
import { join, downloadDir } from '@tauri-apps/api/path';

const RECORDING_BITRATE = 12000000;
const RECORDING_FRAME_RATE = 60;

function getSupportedMimeType() {
  const types = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm;codecs=h264',
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return 'video/webm';
}

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

export async function exportImage(sceneText, animationName) {
  const renderer = getRenderer();
  if (!renderer) return;
  const activeCanvas = renderer.getCanvas();
  const backgroundColor = document.body.style.backgroundColor;
  const backgroundImage = document.body.style.backgroundImage;
  const imageUrl = parseBackgroundImageUrl(backgroundImage);
  if (appState.exportOriginalSize) {
    await exportImageOriginalSize(renderer, sceneText, animationName, backgroundColor, imageUrl);
  } else {
    await exportImageWindowSize(activeCanvas, sceneText, animationName, backgroundColor, imageUrl);
  }
  showNotification(t('exportImageSuccess'), 'success');
}

async function exportImageOriginalSize(renderer, sceneText, animationName, backgroundColor, imageUrl) {
  const { width, height } = renderer.getOriginalSize();
  const capturedCanvas = renderer.captureFrame(width, height);
  if (!capturedCanvas) return;
  const tempCanvas = createOffscreenCanvas(width, height);
  const ctx = tempCanvas.getContext('2d');
  if (imageUrl) {
    const img = await loadImage(imageUrl);
    drawBackground(ctx, width, height, img, null);
  } else {
    drawBackground(ctx, width, height, null, backgroundColor);
  }
  ctx.drawImage(capturedCanvas, 0, 0, width, height);
  await downloadCanvas(tempCanvas, sceneText, animationName, '_original');
}

async function exportImageWindowSize(activeCanvas, sceneText, animationName, backgroundColor, imageUrl) {
  const tempCanvas = createOffscreenCanvas(activeCanvas.width, activeCanvas.height);
  const ctx = tempCanvas.getContext('2d');
  if (imageUrl) {
    const img = await loadImage(imageUrl);
    drawBackground(ctx, activeCanvas.width, activeCanvas.height, img, null);
  } else if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, activeCanvas.width, activeCanvas.height);
  }
  ctx.drawImage(activeCanvas, 0, 0, activeCanvas.width, activeCanvas.height);
  await downloadCanvas(tempCanvas, sceneText, animationName);
}
import { Output, WebMOutputFormat, BufferTarget, CanvasSource } from 'mediabunny';

export async function exportAnimation(sceneText, animationName, onProgress) {
  if (appState.processing) return;
  const renderer = getRenderer();
  if (!renderer) return;
  if (typeof VideoEncoder === 'undefined') {
    showNotification(t('mediaRecorderNotSupported') || 'VideoEncoder API not supported', 'error');
    return;
  }
  appState.processing = true;
  const activeCanvas = renderer.getCanvas();
  const originalVisibility = activeCanvas.style.visibility;
  activeCanvas.style.visibility = 'hidden';
  const originalPausedState = appState.animation.paused;
  const createOffscreenCanvas = (width = 1, height = 1) => {
    return typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(width, height)
      : document.createElement('canvas');
  };
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
  let targetWidth = activeCanvas.width;
  let targetHeight = activeCanvas.height;
  let useOriginalSize = appState.exportOriginalSize;
  if (useOriginalSize) {
    const { width, height } = renderer.getOriginalSize();
    targetWidth = width;
    targetHeight = height;
  }
  if (targetWidth % 2 !== 0) targetWidth += 1;
  if (targetHeight % 2 !== 0) targetHeight += 1;
  if (compositingCanvas) {
    compositingCanvas.width = targetWidth;
    compositingCanvas.height = targetHeight;
  }
  const tempCanvas = createOffscreenCanvas(targetWidth, targetHeight);
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
  const baseDuration = renderer.getAnimationDuration() || 0.1;
  const fps = renderer.getFPS?.() || RECORDING_FRAME_RATE;
  const totalFrames = Math.ceil(baseDuration * fps);

  function cleanup() {
    activeCanvas.style.visibility = originalVisibility;
    appState.processing = false;
    renderer.setPaused(originalPausedState);
    if (renderer.setSeeking) renderer.setSeeking(false);
    if (!originalPausedState) {
      appState.animation.paused = false;
    }
    if (onProgress) onProgress(0);
  }

  const safeName = animationName ? animationName.split('.')[0] : 'animation';
  renderer.setPaused(true);
  if (renderer.setSeeking) renderer.setSeeking(true);
  try {
    const output = new Output({
      format: new WebMOutputFormat(),
      target: new BufferTarget()
    });
    const videoSource = new CanvasSource(tempCanvas, {
      codec: 'vp9',
      bitrate: RECORDING_BITRATE,
    });
    output.addVideoTrack(videoSource);
    await output.start();
    if (renderer.stepAnimation) {
      if (renderer.seekAnimation) renderer.seekAnimation(0);
    }
    for (let frame = 0; frame < totalFrames; frame++) {
      if (!appState.processing) {
        break;
      }
      const time = frame / fps;
      const progress = baseDuration > 0 ? time / baseDuration : 0;
      if (renderer.stepAnimation) {
        if (frame > 0) {
          renderer.stepAnimation(1 / fps);
        }
      } else {
        renderer.seekAnimation(progress);
      }
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      let capturedCanvas;
      if (useOriginalSize) {
        capturedCanvas = renderer.captureFrame(targetWidth, targetHeight);
      } else {
        capturedCanvas = activeCanvas;
      }
      if (!capturedCanvas) continue;
      if (compositingCanvas) {
        const ctx = compositingCanvas.getContext('2d');
        drawBackground(ctx, targetWidth, targetHeight, backgroundImageToRender, backgroundColor);
        ctx.drawImage(capturedCanvas, 0, 0, targetWidth, targetHeight);
        tempCtx.clearRect(0, 0, targetWidth, targetHeight);
        tempCtx.drawImage(compositingCanvas, 0, 0, targetWidth, targetHeight);
      } else {
        tempCtx.clearRect(0, 0, targetWidth, targetHeight);
        tempCtx.drawImage(capturedCanvas, 0, 0, targetWidth, targetHeight);
      }
      await videoSource.add(time, 1 / fps);
      if (onProgress) {
        onProgress((frame / totalFrames) * 100);
      }
    }
    if (appState.processing) {
      await output.finalize();
      const buffer = output.target.buffer;
      const baseFilename = `${sceneText}_${safeName}`;
      try {
        const baseDir = await downloadDir();
        const exportBaseDir = await join(baseDir, 'spive2d_export');
        await mkdir(exportBaseDir, { recursive: true });
        let finalFilename = `${baseFilename}.webm`;
        let filePath = await join(exportBaseDir, finalFilename);
        let counter = 1;
        while (await exists(filePath)) {
          finalFilename = `${baseFilename} (${counter}).webm`;
          filePath = await join(exportBaseDir, finalFilename);
          counter++;
        }
        await writeFile(filePath, new Uint8Array(buffer));
        showNotification(t('exportAnimationSuccess'), 'success');
      } catch (err) {
        console.error('Failed to write video:', err);
        showNotification(t('exportAnimationError'), 'error');
      }
    }
  } catch (err) {
    console.error('Animation export error:', err);
    showNotification(t('exportAnimationError'), 'error');
  } finally {
    cleanup();
  }
}

export async function exportPNGSequence(targetDir, sceneText, animationName, onProgress) {
  if (appState.processing) return;
  const renderer = getRenderer();
  if (!renderer) return;
  appState.processing = true;
  const activeCanvas = renderer.getCanvas();
  const originalVisibility = activeCanvas.style.visibility;
  activeCanvas.style.visibility = 'hidden';
  const originalPausedState = appState.animation.paused;
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
  let targetWidth = activeCanvas.width;
  let targetHeight = activeCanvas.height;
  let useOriginalSize = appState.exportOriginalSize;
  if (useOriginalSize) {
    const { width, height } = renderer.getOriginalSize();
    targetWidth = width;
    targetHeight = height;
  }
  if (compositingCanvas) {
    compositingCanvas.width = targetWidth;
    compositingCanvas.height = targetHeight;
  }
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = targetWidth;
  tempCanvas.height = targetHeight;
  const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
  const baseDuration = renderer.getAnimationDuration() || 0.1;
  const fps = renderer.getFPS?.() || RECORDING_FRAME_RATE;
  const totalFrames = Math.ceil(baseDuration * fps);

  function cleanup() {
    activeCanvas.style.visibility = originalVisibility;
    appState.processing = false;
    renderer.setPaused(originalPausedState);
    if (renderer.setSeeking) renderer.setSeeking(false);
    if (!originalPausedState) {
      appState.animation.paused = false;
    }
    if (onProgress) onProgress(0);
  }

  const safeName = animationName ? animationName.split('.')[0] : 'sequence';
  renderer.setPaused(true);
  if (renderer.setSeeking) renderer.setSeeking(true);
  const writePromises = [];
  try {
    if (renderer.stepAnimation) {
      if (renderer.seekAnimation) renderer.seekAnimation(0);
    }
    for (let frame = 0; frame < totalFrames; frame++) {
      if (!appState.processing) break;
      const time = frame / fps;
      const progress = baseDuration > 0 ? time / baseDuration : 0;
      if (renderer.stepAnimation) {
        if (frame > 0) {
          renderer.stepAnimation(1 / fps);
        }
      } else {
        renderer.seekAnimation(progress);
      }
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      let capturedCanvas;
      if (useOriginalSize) {
        capturedCanvas = renderer.captureFrame(targetWidth, targetHeight);
      } else {
        capturedCanvas = activeCanvas;
      }
      if (!capturedCanvas) continue;
      if (compositingCanvas) {
        const ctx = compositingCanvas.getContext('2d');
        drawBackground(ctx, targetWidth, targetHeight, backgroundImageToRender, backgroundColor);
        ctx.drawImage(capturedCanvas, 0, 0, targetWidth, targetHeight);
        tempCtx.clearRect(0, 0, targetWidth, targetHeight);
        tempCtx.drawImage(compositingCanvas, 0, 0, targetWidth, targetHeight);
      } else {
        tempCtx.clearRect(0, 0, targetWidth, targetHeight);
        tempCtx.drawImage(capturedCanvas, 0, 0, targetWidth, targetHeight);
      }
      const blob = await new Promise(resolve => tempCanvas.toBlob(resolve, 'image/png'));
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const frameStr = String(frame).padStart(4, '0');
      const filename = `${sceneText}_${safeName}_${frameStr}.png`;
      const filePath = await join(targetDir, filename);
      writePromises.push(writeFile(filePath, bytes).catch(e => {
        console.error(`Failed to write frame ${frame}:`, e);
      }));
      if (writePromises.length >= 10) {
        await Promise.all(writePromises);
        writePromises.length = 0;
      }
      if (onProgress) {
        onProgress((frame / totalFrames) * 100);
      }
      await new Promise(r => setTimeout(r, 0)); // yield
    }
    if (writePromises.length > 0) {
      await Promise.all(writePromises);
    }
    showNotification(t('exportPngSeqSuccess') || 'PNG Sequence exported', 'success');
  } catch (err) {
    console.error('Sequence export error:', err);
    showNotification(t('exportPngSeqError') || 'PNG Sequence export failed', 'error');
  } finally {
    cleanup();
  }
}
