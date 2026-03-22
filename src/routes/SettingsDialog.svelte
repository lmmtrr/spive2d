<script>
  import { appState } from '$lib/appState.svelte.js';
  import { getRenderer } from '$lib/rendererStore.svelte.js';
  import { t, getLocale, setLocale } from '$lib/i18n.svelte.js';
  import { openDirectory, openArchiveFile, openCurrentDirectory, openExportDirectory, openImageFile, getAssetUrl } from '$lib/fileManager.js';
  import { saveSetting, removeSetting } from '$lib/settings.js';
  import { setWindowSize } from '$lib/windowManager.js';
  import { getShortcuts, saveShortcuts, resetShortcuts } from '$lib/shortcutKeys.js';
  import { invoke } from '@tauri-apps/api/core';
  import { showNotification } from '$lib/notificationStore.svelte.js';

  let { open = $bindable(false), onPathSelected, onShortcutsChanged } = $props();
  let windowWidth = $state(window.innerWidth);
  let windowHeight = $state(window.innerHeight);
  let originalWidth = $state(0);
  let originalHeight = $state(0);
  let locale = $state(getLocale());
  let urlInput = $state('');
  let dialogEl;
  let activeTab = $state('general');
  let shortcuts = $state(getShortcuts());
  let editingKey = $state(null);

  const isSpine = $derived.by(() => {
    if (!appState.directories?.files || !appState.directories?.selectedDir) return false;
    const scenes = appState.directories.files[appState.directories.selectedDir];
    const selectedScene = appState.directories.selectedScene;
    if (!scenes || selectedScene < 0 || selectedScene >= scenes.length) return false;
    const scene = scenes[selectedScene];
    if (!scene || scene.length < 2) return false;
    const ext = scene[1];
    return !(ext.includes('.moc') || ext.includes('.model3.json') || ext.includes('.model.json'));
  });

  let isCurrentDirUrl = $derived(
    !!appState.directories?.selectedDir &&
    (appState.directories.selectedDir.startsWith('http://') ||
     appState.directories.selectedDir.startsWith('https://'))
  );

  const shortcutActions = [
    'prevDir', 'nextDir', 'prevScene', 'nextScene',
    'prevAnim', 'nextAnim', 
    'exportImage', 'exportImageSeq', 'exportAnim',
    'toggleDialog', 'addToList',
  ];

  const shortcutLabelKeys = {
    prevDir: 'shortcutPrevDir',
    nextDir: 'shortcutNextDir',
    prevScene: 'shortcutPrevScene',
    nextScene: 'shortcutNextScene',
    prevAnim: 'shortcutPrevAnim',
    nextAnim: 'shortcutNextAnim',
    toggleDialog: 'shortcutToggleDialog',
    exportImage: 'shortcutExportImage',
    exportImageSeq: 'shortcutExportImageSeq',
    exportAnim: 'shortcutExportAnim',
    addToList: 'shortcutAddToList',
  };

  $effect(() => {
    if (open && dialogEl && !dialogEl.open) {
      dialogEl.showModal();
      updateOriginalSize();
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
      shortcuts = getShortcuts();
    } else if (!open && dialogEl?.open) {
      dialogEl.close();
      editingKey = null;
    }
  });

  $effect(() => {
    if (open && appState.initialized) {
      appState.directories?.selectedScene;
      appState.directories?.selectedDir;
      appState.transform;
      setTimeout(updateOriginalSize, 10);
    }
  });

  function updateOriginalSize() {
    const renderer = getRenderer();
    if (renderer && appState.initialized) {
      const size = renderer.getOriginalSize();
      originalWidth = size.width;
      originalHeight = size.height;
    }
  }

  function onDialogClose() {
    open = false;
    editingKey = null;
  }

  function handleLanguageChange(e) {
    locale = e.target.value;
    setLocale(locale);
  }

  async function handleOpenDirectory() {
    const path = await openDirectory();
    if (path) onPathSelected([path]);
  }

  async function handleOpenArchive() {
    const path = await openArchiveFile();
    if (path) onPathSelected([path]);
  }

  async function handleOpenCurrentDir() {
    if (!appState.initialized) return;
    const dir = appState.directories?.selectedDir;
    if (!dir || dir.startsWith('http://') || dir.startsWith('https://')) return;
    const scenes = appState.directories.files?.[dir] || [];
    const sceneInfo = scenes[appState.directories.selectedScene];
    const scene = sceneInfo ? sceneInfo[0] : '';
    await openCurrentDirectory(dir, scene);
  }

  async function handleOpenExportDir() {
    await openExportDirectory();
  }

  async function handleOpenImage() {
    const path = await openImageFile();
    if (!path) return;
    document.body.style.backgroundColor = '';
    document.body.style.backgroundImage = `url("${getAssetUrl(path)}")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    saveSetting('spive2d_bg_image_path', path);
    appState.background = { ...appState.background, imagePath: path };
  }

  function handleRemoveImage() {
    document.body.style.backgroundColor = '';
    document.body.style.backgroundImage = `
      linear-gradient(45deg, #fff 25%, transparent 0),
      linear-gradient(45deg, transparent 75%, #fff 0),
      linear-gradient(45deg, #fff 25%, transparent 0),
      linear-gradient(45deg, transparent 75%, #fff 0)`;
    document.body.style.backgroundSize = '32px 32px';
    document.body.style.backgroundPosition = '0 0, 16px 16px, 16px 16px, 32px 32px';
    removeSetting('spive2d_bg_image_path');
    removeSetting('spive2d_bg_color');
    appState.background = { color: '', imagePath: '' };
  }

  function handleColorChange(e) {
    const color = e.target.value;
    document.body.style.backgroundColor = color;
    document.body.style.backgroundImage = 'none';
    saveSetting('spive2d_bg_color', color);
    removeSetting('spive2d_bg_image_path');
    appState.background = { color, imagePath: '' };
  }

  function handleWidthChange() {
    validateAndResize();
  }

  function handleHeightChange() {
    validateAndResize();
  }

  function validateAndResize() {
    windowWidth = Math.max(100, Math.min(10000, windowWidth));
    windowHeight = Math.max(100, Math.min(10000, windowHeight));
    setWindowSize(windowWidth, windowHeight);
  }

  async function handleClearCache() {
    try {
      await invoke('clear_cache');
      showNotification(t('clearCacheSuccess'), 'success');
    } catch (e) {
      console.error('Failed to clear cache:', e);
    }
  }

  function handleResetState() {
    appState.resetTransform();
    const renderer = getRenderer();
    if (renderer) renderer.resetTransform();
  }

  function handleExportBaseChange(e) {
    appState.exportBase = e.target.value;
  }

  function handleExportScaleValidate() {
    if (appState.exportScale == null) {
      appState.exportScale = 100;
    } else {
      appState.exportScale = Math.max(10, Math.min(1000, appState.exportScale));
    }
    handleExportMarginXValidate();
    handleExportMarginYValidate();
  }

  function handleExportMarginXValidate() {
    const baseW = appState.exportBase === 'original' ? originalWidth : windowWidth;
    const scale = (appState.exportScale ?? 100) / 100;
    const minMargin = Math.ceil((1 - baseW * scale) / 2);
    if (appState.exportMarginX == null) {
      appState.exportMarginX = 0;
    } else {
      appState.exportMarginX = Math.max(minMargin, Math.min(1000, appState.exportMarginX));
    }
  }

  function handleExportMarginYValidate() {
    const baseHeight = appState.exportBase === 'original' ? originalHeight : windowHeight;
    const scale = (appState.exportScale ?? 100) / 100;
    const minMargin = Math.ceil((1 - baseHeight * scale) / 2);
    if (appState.exportMarginY == null) {
      appState.exportMarginY = 0;
    } else {
      appState.exportMarginY = Math.max(minMargin, Math.min(1000, appState.exportMarginY));
    }
  }

  function handleTransformScaleValidate() {
    if (appState.transform.scale == null) {
      appState.transform.scale = 1;
    } else {
      appState.transform.scale = Math.max(appState.SCALE_MIN, Math.min(appState.SCALE_MAX, appState.transform.scale));
    }
  }

  function handleTransformMoveXValidate() {
    if (appState.transform.moveX == null) {
      appState.transform.moveX = 0;
    } else {
      appState.transform.moveX = Math.max(-5000, Math.min(5000, appState.transform.moveX));
    }
  }

  function handleTransformMoveYValidate() {
    if (appState.transform.moveY == null) {
      appState.transform.moveY = 0;
    } else {
      appState.transform.moveY = Math.max(-5000, Math.min(5000, appState.transform.moveY));
    }
  }

  function handleTransformRotateValidate() {
    if (appState.transform.rotate == null) {
      appState.transform.rotate = 0;
    } else {
      let val = appState.transform.rotate;
      while (val > Math.PI) val -= 2 * Math.PI;
      while (val < -Math.PI) val += 2 * Math.PI;
      appState.transform.rotate = val;
    }
  }

  let exportResolution = $derived.by(() => {
    let baseW, baseHeight;
    if (appState.exportBase === 'original') {
      baseW = originalWidth;
      baseHeight = originalHeight;
    } else {
      baseW = windowWidth;
      baseHeight = windowHeight;
    }
    const scale = (appState.exportScale ?? 100) / 100;
    const marginX = appState.exportMarginX ?? 0;
    const marginY = appState.exportMarginY ?? 0;
    return {
      width: Math.round(baseW * scale + marginX * 2),
      height: Math.round(baseHeight * scale + marginY * 2)
    };
  });

  let previewCanvasEl = $state(null);
  let previewImgUrl = $state('');
  let previewImage = $state(null);
  
  $effect(() => {
    if (previewImgUrl) {
      const img = new Image();
      img.onload = () => {
        previewImage = img;
        drawPreview();
      };
      img.src = previewImgUrl;
    } else {
      previewImage = null;
    }
  });

  let previewZoom = $state(1.0);
  let previewOffset = $state({ x: 0, y: 0 });
  let isDraggingPreview = $state(false);
  let lastMousePos = { x: 0, y: 0 };

  function handlePreviewWheel(e) {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = Math.pow(1.1, delta / 100);
    const newZoom = Math.max(0.1, Math.min(20, previewZoom * factor));
    const mouseX = previewCanvasEl.width / 2;
    const mouseY = previewCanvasEl.height / 2;
    const worldX = (mouseX - previewOffset.x) / previewZoom;
    const worldY = (mouseY - previewOffset.y) / previewZoom;
    previewZoom = newZoom;
    previewOffset.x = mouseX - worldX * previewZoom;
    previewOffset.y = mouseY - worldY * previewZoom;
    drawPreview();
  }

  function handlePreviewMouseDown(e) {
    isDraggingPreview = true;
    lastMousePos = { x: e.clientX, y: e.clientY };
  }

  function handlePreviewMouseMove(e) {
    if (!isDraggingPreview) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;
    previewOffset.x += dx;
    previewOffset.y += dy;
    lastMousePos = { x: e.clientX, y: e.clientY };
    drawPreview();
  }

  function handlePreviewMouseUp() {
    isDraggingPreview = false;
  }

  function resetPreviewView() {
    previewZoom = 1.0;
    previewOffset = { x: 0, y: 0 };
    drawPreview();
  }

  $effect(() => {
    if (activeTab === 'export' && open && appState.initialized) {
      const _ow = originalWidth;
      const _oh = originalHeight;
      refreshPreviewScreenshot();
    }
  });

  $effect(() => {
    const _res = exportResolution;
    const _mx = appState.exportMarginX;
    const _my = appState.exportMarginY;
    const _trans = appState.transform;
    const _base = appState.exportBase;
    const _w = windowWidth;
    const _h = windowHeight;
    if (activeTab === 'export' && previewImgUrl && previewCanvasEl) {
      drawPreview();
    }
  });

  function refreshPreviewScreenshot() {
    const renderer = getRenderer();
    if (!renderer) return;
    try {
      const size = renderer.getOriginalSize();
      if (size.width <= 0 || size.height <= 0) return;
      const marginX = Math.round(size.width * 0.3);
      const marginY = Math.round(size.height * 0.3);
      let width = size.width + marginX * 2;
      let height = size.height + marginY * 2;
      const MAX_CAPTURE_SIZE = 1024;
      if (width > MAX_CAPTURE_SIZE || height > MAX_CAPTURE_SIZE) {
        const scale = Math.min(MAX_CAPTURE_SIZE / width, MAX_CAPTURE_SIZE / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const captured = renderer.captureFrame(width, height, {
        ignoreTransform: true,
        marginX: marginX * (width / (size.width + marginX * 2)),
        marginY: marginY * (height / (size.height + marginY * 2))
      });
      if (captured) {
        previewImgUrl = captured.toDataURL('image/png');
        return;
      }
    } catch (e) {
      console.warn('Preview capture failed', e);
    }
  }

  function drawPreview() {
    if (!previewCanvasEl || !previewImage) return;
    const mX = appState.exportMarginX ?? 0;
    const mY = appState.exportMarginY ?? 0;
    const eS = (appState.exportScale ?? 100) / 100;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
    let crop;
    if (appState.exportBase === 'original') {
      crop = {
        cx: originalWidth / 2,
        cy: originalHeight / 2,
        w: originalWidth + (2 * mX / (eS * dpr)),
        h: originalHeight + (2 * mY / (eS * dpr))
      };
    } else {
      const vw = windowWidth;
      const vh = windowHeight;
      const bs = Math.min(vw / originalWidth, vh / originalHeight);
      const us = appState.transform.scale;
      const S = bs * us;
      const mx = appState.transform.moveX;
      const my = appState.transform.moveY;
      const orthoW = (vw + (2 * mX / (eS * dpr))) / S;
      const orthoH = (vh + (2 * mY / (eS * dpr))) / S;
      crop = {
        cx: (originalWidth / 2) - (mx / S),
        cy: (originalHeight / 2) - (my / S),
        w: orthoW,
        h: orthoH
      };
    }
    const MAX_W = 380;
    const MAX_H = 200;
    const ratio = (crop.w && crop.h) ? crop.w / crop.h : 1;
    let pw = MAX_W;
    let ph = Math.round(MAX_W / ratio);
    if (ph > MAX_H) { ph = MAX_H; pw = Math.round(MAX_H * ratio); }
    pw = Math.max(pw, 2);
    ph = Math.max(ph, 2);
    if (previewCanvasEl.width !== pw || previewCanvasEl.height !== ph) {
      previewCanvasEl.width = pw;
      previewCanvasEl.height = ph;
    }
    const ctx = previewCanvasEl.getContext('2d');
    ctx.clearRect(0, 0, pw, ph);
    const scaleF = pw / crop.w;
    const tile = 8;
    for (let y = 0; y < ph; y += tile) {
      for (let x = 0; x < pw; x += tile) {
        ctx.fillStyle = ((Math.floor(x / tile) + Math.floor(y / tile)) % 2 === 0) ? '#555' : '#333';
        ctx.fillRect(x, y, Math.min(tile, pw - x), Math.min(tile, ph - y));
      }
    }
    ctx.save();
    ctx.translate(previewOffset.x, previewOffset.y);
    ctx.scale(previewZoom, previewZoom);
    const mcx = pw / 2 + (originalWidth / 2 - crop.cx) * scaleF;
    const mcy = ph / 2 + (originalHeight / 2 - crop.cy) * scaleF;
    ctx.save();
    ctx.translate(mcx, mcy);
    const rotate = appState.exportBase === 'original' ? 0 : (appState.transform.rotate * (isSpine ? Math.PI : 1));
    ctx.rotate(rotate);
    const imgW = (originalWidth * 1.6) * scaleF;
    const imgH = (originalHeight * 1.6) * scaleF;
    ctx.drawImage(previewImage, -imgW / 2, -imgH / 2, imgW, imgH);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.moveTo(-10000, -10000);
    ctx.lineTo(10000, -10000);
    ctx.lineTo(10000, 10000);
    ctx.lineTo(-10000, 10000);
    ctx.closePath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, ph);
    ctx.lineTo(pw, ph);
    ctx.lineTo(pw, 0);
    ctx.closePath();
    ctx.fill('evenodd');
    ctx.restore();
    ctx.strokeStyle = 'rgba(160, 190, 255, 0.9)';
    ctx.lineWidth = 1 / previewZoom;
    ctx.strokeRect(0, 0, pw, ph);
    const cs = 10 / previewZoom;
    ctx.beginPath();
    ctx.moveTo(pw / 2 - cs, ph / 2); ctx.lineTo(pw / 2 + cs, ph / 2);
    ctx.moveTo(pw / 2, ph / 2 - cs); ctx.lineTo(pw / 2, ph / 2 + cs);
    ctx.stroke();
    ctx.restore();
  }

  function handleLoadUrl() {
    if (urlInput.trim()) {
      onPathSelected([urlInput.trim()]);
    }
  }

  function startEditingKey(e, action) {
    e.stopPropagation();
    if (editingKey === action) {
      shortcuts[action] = '';
      saveShortcuts(shortcuts);
      onShortcutsChanged?.();
      editingKey = null;
    } else {
      if (editingKey) {
        shortcuts[editingKey] = '';
        saveShortcuts(shortcuts);
        onShortcutsChanged?.();
      }
      editingKey = action;
    }
  }

  function handleDialogClick() {
    if (editingKey) {
      shortcuts[editingKey] = '';
      saveShortcuts(shortcuts);
      onShortcutsChanged?.();
      editingKey = null;
    }
  }

  function handleShortcutKeyDown(e) {
    if (!editingKey) return;
    e.preventDefault();
    e.stopPropagation();
    const key = e.key;
    if (key === 'Escape') {
      editingKey = null;
      return;
    }
    if (key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Meta') return;
    for (const action of shortcutActions) {
      if (action !== editingKey && shortcuts[action] === key) {
        shortcuts[action] = '';
      }
    }
    shortcuts[editingKey] = key;
    saveShortcuts(shortcuts);
    onShortcutsChanged?.();
    editingKey = null;
  }

  function handleResetShortcuts() {
    shortcuts = resetShortcuts();
    onShortcutsChanged?.();
    editingKey = null;
  }

  function displayKey(key) {
    if (!key) return '—';
    if (key === ' ') return 'Space';
    if (key === 'ArrowUp') return '↑';
    if (key === 'ArrowDown') return '↓';
    if (key === 'ArrowLeft') return '←';
    if (key === 'ArrowRight') return '→';
    return key.length === 1 ? key.toUpperCase() : key;
  }

  function handleResize() {
    if (open && dialogEl?.open) {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    }
  }
</script>

<svelte:window onresize={handleResize} />

<dialog bind:this={dialogEl} onclose={onDialogClose} closedby="any" autofocus class:lang-ja={locale === 'ja'} onclick={handleDialogClick} class:wide={activeTab === 'export'}>
  <div class="tab-bar">
    <button class="tab-btn" class:active={activeTab === 'general'} onclick={() => activeTab = 'general'}>
      {t('tabGeneral')}
    </button>
    <button class="tab-btn" class:active={activeTab === 'export'} onclick={() => activeTab = 'export'}>
      {t('tabExport')}
    </button>
    <button class="tab-btn" class:active={activeTab === 'shortcuts'} onclick={() => { activeTab = 'shortcuts'; }}>
      {t('tabShortcuts')}
    </button>
  </div>

  {#if activeTab === 'general'}
    <div class="tab-content">
      <div class="input-row">
        <label for="languageSelector">{t('language')}</label>
        <select id="languageSelector" value={locale} onchange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="zh">中文</option>
        </select>
      </div>
      <hr>
      <div class="button-group">
        <button onclick={handleOpenDirectory}>{t('openDirectory')}</button>
        <button onclick={handleOpenArchive}>{t('openArchive')}</button>
        <button onclick={handleOpenCurrentDir} disabled={isCurrentDirUrl}>{t('openCurrentDirectory')}</button>
      </div>
      <hr>
      <div class="input-row">
        <input type="text" placeholder={t('enterUrlPrompt')} bind:value={urlInput} onkeydown={(e) => e.key === 'Enter' && handleLoadUrl()} style="margin-right: 10px;">
        <button style="width: auto; margin: 0; padding: 0 15px;" onclick={handleLoadUrl}>{t('loadFromUrl')}</button>
      </div>
      <hr>
      <div class="input-row">
        <label for="bgColorPicker">{t('backgroundColor')}</label>
        <input type="color" id="bgColorPicker" oninput={handleColorChange}>
      </div>
      <div class="button-group">
        <button onclick={handleOpenImage}>{t('openImage')}</button>
        <button onclick={handleRemoveImage}>{t('removeImage')}</button>
      </div>
      <hr>
      <div class="button-group">
        <button onclick={handleClearCache}>{t('clearCache')}</button>
      </div>
    </div>
  {/if}

  {#if activeTab === 'export'}
    <div class="tab-content export-tab-wrapper">
      <div class="export-col-left">
        <div class="button-group" style="justify-content: flex-start; gap: 10px;">
          <button onclick={handleResetState} style="width: auto; padding: 0 15px;">{t('resetState')}</button>
          <button onclick={handleOpenExportDir} style="width: auto; padding: 0 15px;">{t('openExportDirectory')}</button>
        </div>
        <div class="input-row radio-group" style="gap: 15px; margin-top: 10px;">
          <span>{t('exportSizeBase')}</span>
          <label class="radio-label">
            <input type="radio" name="exportBase" value="window" checked={appState.exportBase === 'window'} onchange={handleExportBaseChange}>
            <span>{t('baseWindow')}</span>
          </label>
          <label class="radio-label">
            <input type="radio" name="exportBase" value="original" checked={appState.exportBase === 'original'} onchange={handleExportBaseChange}>
            <span>{t('baseOriginal')}</span>
          </label>
        </div>
        <div class="input-row">
          <label for="exportScale">{t('exportScale')}</label>
          <input type="number" id="exportScale" min="10" max="1000" bind:value={appState.exportScale} onchange={handleExportScaleValidate}>
          <span style="margin-left: 8px;">%</span>
        </div>
        <div class="input-row">
          <label for="exportMarginX">{t('exportMarginX')}</label>
          <input type="number" id="exportMarginX" bind:value={appState.exportMarginX} onchange={handleExportMarginXValidate}>
        </div>
        <div class="input-row">
          <label for="exportMarginY">{t('exportMarginY')}</label>
          <input type="number" id="exportMarginY" bind:value={appState.exportMarginY} onchange={handleExportMarginYValidate}>
        </div>
        <hr>
        <div class="input-row">
          <label for="transformScale">{t('transformScale')}</label>
          <input type="number" id="transformScale" step="0.1" bind:value={appState.transform.scale} onchange={handleTransformScaleValidate}>
        </div>
        <div class="input-row">
          <label for="transformRotate">{t('transformRotate')}</label>
          <input type="number" id="transformRotate" step="0.01" bind:value={appState.transform.rotate} onchange={handleTransformRotateValidate}>
        </div>
        <div class="input-row">
          <label for="transformMoveX">{t('transformMoveX')}</label>
          <input type="number" id="transformMoveX" step="10" bind:value={appState.transform.moveX} onchange={handleTransformMoveXValidate}>
        </div>
        <div class="input-row">
          <label for="transformMoveY">{t('transformMoveY')}</label>
          <input type="number" id="transformMoveY" step="10" bind:value={appState.transform.moveY} onchange={handleTransformMoveYValidate}>
        </div>
      </div>

      <div class="export-col-right">
        <div class="preview-section">
          <div class="preview-header">
            <span class="preview-title">{t('exportPreview')}</span>
            <div style="display: flex; gap: 8px;">
              <button class="preview-refresh-btn" onclick={resetPreviewView}>{t('resetView') || 'Reset View'}</button>
              <button class="preview-refresh-btn" onclick={refreshPreviewScreenshot}>{t('refreshPreview')}</button>
            </div>
          </div>
          <div class="preview-canvas-wrap">
            <canvas
              bind:this={previewCanvasEl}
              class="preview-canvas"
              onwheel={handlePreviewWheel}
              onmousedown={handlePreviewMouseDown}
              onmousemove={handlePreviewMouseMove}
              onmouseup={handlePreviewMouseUp}
              onmouseleave={handlePreviewMouseUp}
            ></canvas>
          </div>
        </div>
        <div class="input-row result-row" style="margin: 12px 0 8px 0;">
          <span class="label">{t('resultingSize')}</span>
          <span class="value">{exportResolution.width} x {exportResolution.height}</span>
        </div>

        <div style="margin-top: 10px;">
          <div class="input-row">
            <label for="windowWidth" style="flex-basis: 140px;">{t('windowWidth')}</label>
            <input type="number" id="windowWidth" min="100" max="10000" bind:value={windowWidth} onchange={handleWidthChange}>
          </div>
          <div class="input-row">
            <label for="windowHeight" style="flex-basis: 140px;">{t('windowHeight')}</label>
            <input type="number" id="windowHeight" min="100" max="10000" bind:value={windowHeight} onchange={handleHeightChange}>
          </div>
          <div class="input-row">
            <label for="originalWidth" style="flex-basis: 140px;">{t('originalWidth')}</label>
            <input type="text" id="originalWidth" readonly value={originalWidth}>
          </div>
          <div class="input-row">
            <label for="originalHeight" style="flex-basis: 140px;">{t('originalHeight')}</label>
            <input type="text" id="originalHeight" readonly value={originalHeight}>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if activeTab === 'shortcuts'}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class="tab-content shortcut-tab" role="application" tabindex="-1" onkeydown={handleShortcutKeyDown}>
      {#each shortcutActions as action}
        <div class="shortcut-row">
          <span class="shortcut-label">{t(shortcutLabelKeys[action])}</span>
          <button
            class="shortcut-key-btn"
            class:editing={editingKey === action}
            onclick={(e) => startEditingKey(e, action)}
          >
            {editingKey === action ? t('pressKey') : displayKey(shortcuts[action])}
          </button>
        </div>
      {/each}
      <hr>
      <div class="button-group">
        <button onclick={handleResetShortcuts}>{t('shortcutResetDefaults')}</button>
      </div>
    </div>
  {/if}
</dialog>

<style>
  dialog {
    background: var(--sidebar-color);
    color: var(--text-color);
    border: var(--border-color);
    border-radius: 10px;
    padding: 0;
    width: 480px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    user-select: none;
  }

  dialog.wide {
    width: 760px;
  }



  .tab-bar {
    display: flex;
    border-bottom: 1px solid #999;
  }

  .tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 42px;
    padding: 0 16px;
    border: none;
    border-radius: 10px 10px 0 0;
    background: transparent;
    color: var(--text-color);
    text-shadow: var(--text-shadow);
    font-size: 14px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.15s, background-color 0.15s;
  }

  .tab-btn:hover {
    opacity: 0.85;
    background-color: #fff1;
  }

  .tab-btn.active {
    opacity: 1;
    background-color: #fff1;
    border-bottom: 2px solid var(--text-color);
  }

  .tab-content {
    padding: 10px 25px;
  }

  .button-group {
    display: flex;
    justify-content: center;
  }

  dialog button:not(.tab-btn):not(.shortcut-key-btn) {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 160px;
    height: 40px;
    padding: 10px;
    border-radius: 6px;
    outline: none;
    border: var(--border-color);
    background-color: var(--sidebar-color);
    color: var(--text-color);
    text-shadow: var(--text-shadow);
    font-size: 14px;
    margin: 10px 0;
    cursor: pointer;
  }

  dialog.lang-ja button:not(.tab-btn):not(.shortcut-key-btn) {
    font-size: 10.6px;
  }

  dialog.lang-ja input[type="text"]::placeholder {
    font-size: 14px;
  }

  dialog button:not(.tab-btn):not(.shortcut-key-btn):hover:not(:disabled) {
    background-color: #555;
  }

  dialog button:not(.tab-btn):not(.shortcut-key-btn):disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  hr {
    border: 0;
    height: 1px;
    background-color: #999;
  }

  .input-row {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .input-row label {
    flex-basis: 140px;
    flex-shrink: 0;
  }

  .input-row input[type="number"],
  .input-row input[type="text"] {
    text-indent: 6px;
    border-radius: 6px;
    height: 35px;
    width: 100%;
    outline: none;
    color: var(--text-color);
    border: var(--border-color);
    background-color: #0006;
    font-size: 15px;
    user-select: text;
  }
  
  .input-row input[readonly] {
    background-color: #0009;
    color: var(--text-color);
    border: var(--border-color);
    opacity: 0.6;
    cursor: default;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  .radio-label input[type="radio"] {
    margin: 0;
  }


  .result-row {
    font-weight: bold;
    color: #eef;
    justify-content: space-between;
  }

  .result-row .value {
    font-family: monospace;
    font-size: 16px;
  }

  .shortcut-tab {
    overflow-y: auto;
  }

  .preview-section {
    margin-bottom: 4px;
  }

  .preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .preview-title {
    font-size: 13px;
    opacity: 0.8;
  }

  .preview-refresh-btn {
    height: 26px !important;
    width: auto !important;
    padding: 0 12px !important;
    margin: 0 !important;
    font-size: 12px !important;
    border-radius: 5px !important;
  }

  .preview-canvas-wrap {
    display: flex;
    justify-content: center;
    background: #1a1a1a;
    border-radius: 6px;
    padding: 6px;
    min-height: 40px;
  }

  .preview-canvas {
    display: block;
    border-radius: 3px;
    max-width: 100%;
    cursor: grab;
    touch-action: none;
  }

  .preview-canvas:active {
    cursor: grabbing;
  }

  .shortcut-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .shortcut-label {
    flex: 1;
    font-size: 14px;
  }

  .shortcut-key-btn {
    min-width: 100px;
    height: 32px;
    padding: 0 12px;
    border-radius: 6px;
    border: var(--border-color);
    background-color: #0006;
    color: var(--text-color);
    text-shadow: var(--text-shadow);
    font-size: 14px;
    font-family: monospace;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.15s, border-color 0.15s;
  }

  .shortcut-key-btn:hover {
    background-color: #fff1;
  }

  .shortcut-key-btn.editing {
    background-color: #fff2;
    border-color: #aaf;
    animation: pulse-border 1s ease-in-out infinite;
  }

  @keyframes pulse-border {
    0%, 100% { border-color: #aaf; }
    50% { border-color: #66f; }
  }

  .export-tab-wrapper {
    display: flex;
    gap: 30px;
    padding-bottom: 20px;
  }

  .export-col-left {
    flex: 1;
    min-width: 320px;
  }

  .export-col-right {
    flex: 1;
    min-width: 340px;
    display: flex;
    flex-direction: column;
  }
</style>
