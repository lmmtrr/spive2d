import { appState } from './appState.svelte.js';
import { getRenderer } from './rendererStore.svelte.js';
import { convertFileSrc } from '@tauri-apps/api/core';

export function getFinalExportSize(renderer) {
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

export function resolveModelInfo() {
  const { files, selectedDir, selectedScene } = appState.directories;
  if (!files || !selectedDir || !files[selectedDir]) {
    return null;
  }
  const fileNames = files[selectedDir][selectedScene];
  const ext = fileNames[1];
  const isLive2D = ext.includes('.moc') || ext.includes('.model3.json') || ext.includes('.model.json');
  let modelUrl = '';
  if (isLive2D) {
    let ext_fixed = '.model3.json';
    if (fileNames[1].includes('.moc3')) ext_fixed = '.model3.json';
    else if (fileNames[1].includes('.moc')) ext_fixed = '.json';
    const rawUrl = `${selectedDir}${fileNames[0]}${ext_fixed}`;
    modelUrl = (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) ? rawUrl : convertFileSrc(rawUrl);
    modelUrl += (modelUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
  }
  return {
    fileNames: [...fileNames],
    selectedDir,
    selectedDirUrl: (selectedDir.startsWith('http://') || selectedDir.startsWith('https://')) ? selectedDir : convertFileSrc(selectedDir),
    isLive2D,
    modelUrl,
    rendererType: isLive2D ? 'live2d' : 'spine'
  };
}

export function createOffscreenCanvas(width = 1, height = 1) {
  return typeof OffscreenCanvas !== 'undefined'
    ? new OffscreenCanvas(width, height)
    : document.createElement('canvas');
}

export function drawBackground(ctx, width, height, bgImage, bgColor) {
  ctx.clearRect(0, 0, width, height);
  if (bgImage) ctx.drawImage(bgImage, 0, 0, width, height);
  else if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }
}
