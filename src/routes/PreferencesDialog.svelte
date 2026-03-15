<script>
  import { appState } from '$lib/appState.svelte.js';
  import { getRenderer } from '$lib/rendererStore.js';
  import { t, getLocale, setLocale } from '$lib/i18n.svelte.js';
  import { openDirectory, openArchiveFile, openCurrentDirectory, openExportDirectory, openImageFile, getAssetUrl } from '$lib/fileManager.js';
  import { savePreference, removePreference } from '$lib/preferences.js';
  import { setWindowSize } from '$lib/windowManager.js';
  import { getShortcuts, saveShortcuts, resetShortcuts } from '$lib/shortcutKeys.js';

  let { open = $bindable(false), onPathSelected, onShortcutsChanged } = $props();
  let windowWidth = $state(window.innerWidth);
  let windowHeight = $state(window.innerHeight);
  let aspectRatio = $state(window.innerHeight / window.innerWidth);
  let keepAspectRatio = $state(false);
  let originalWidth = $state(0);
  let originalHeight = $state(0);
  let locale = $state(getLocale());
  let urlInput = $state('');
  let dialogEl;
  let activeTab = $state('general');
  let shortcuts = $state(getShortcuts());
  let editingKey = $state(null);

  let isCurrentDirUrl = $derived(
    !!appState.directories?.selectedDir &&
    (appState.directories.selectedDir.startsWith('http://') ||
     appState.directories.selectedDir.startsWith('https://'))
  );

  const shortcutActions = [
    'prevDir', 'nextDir', 'prevScene', 'nextScene',
    'prevAnim', 'nextAnim', 'toggleDialog',
    'exportImage', 'exportPngSeq', 'exportAnim', 'addToList',
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
    exportPngSeq: 'shortcutExportPngSeq',
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
    savePreference('spive2d_bg_image_path', path);
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
    removePreference('spive2d_bg_image_path');
    removePreference('spive2d_bg_color');
    appState.background = { color: '', imagePath: '' };
  }

  function handleColorChange(e) {
    const color = e.target.value;
    document.body.style.backgroundColor = color;
    document.body.style.backgroundImage = 'none';
    savePreference('spive2d_bg_color', color);
    removePreference('spive2d_bg_image_path');
    appState.background = { color, imagePath: '' };
  }

  function handleWidthChange() {
    if (keepAspectRatio) {
      windowHeight = Math.round(windowWidth * aspectRatio);
    }
    validateAndResize();
  }

  function handleHeightChange() {
    if (keepAspectRatio) {
      windowWidth = Math.round(windowHeight / aspectRatio);
    }
    validateAndResize();
  }

  function validateAndResize() {
    windowWidth = Math.max(100, Math.min(10000, windowWidth));
    windowHeight = Math.max(100, Math.min(10000, windowHeight));
    setWindowSize(windowWidth, windowHeight);
    aspectRatio = windowHeight / windowWidth;
  }


  function handleResetState() {
    appState.resetTransform();
    const renderer = getRenderer();
    if (renderer) renderer.resetTransform();
  }

  function handleAspectRatioChange(e) {
    keepAspectRatio = e.target.checked;
    if (keepAspectRatio) {
      aspectRatio = windowHeight / windowWidth;
    }
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
    const baseW = appState.exportBase === 'original' ? originalWidth : window.innerWidth;
    const scale = (appState.exportScale ?? 100) / 100;
    const minMargin = Math.ceil((1 - baseW * scale) / 2);
    if (appState.exportMarginX == null) {
      appState.exportMarginX = 0;
    } else {
      appState.exportMarginX = Math.max(minMargin, Math.min(1000, appState.exportMarginX));
    }
  }

  function handleExportMarginYValidate() {
    const baseHeight = appState.exportBase === 'original' ? originalHeight : window.innerHeight;
    const scale = (appState.exportScale ?? 100) / 100;
    const minMargin = Math.ceil((1 - baseHeight * scale) / 2);
    if (appState.exportMarginY == null) {
      appState.exportMarginY = 0;
    } else {
      appState.exportMarginY = Math.max(minMargin, Math.min(1000, appState.exportMarginY));
    }
  }

  let exportResolution = $derived.by(() => {
    let baseW, baseHeight;
    if (appState.exportBase === 'original') {
      baseW = originalWidth;
      baseHeight = originalHeight;
    } else {
      baseW = window.innerWidth;
      baseHeight = window.innerHeight;
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

  $effect(() => {
    if (activeTab === 'export' && open && appState.initialized) {
      appState.exportBase;
      const _ow = originalWidth;
      const _oh = originalHeight;
      refreshPreviewScreenshot();
    }
  });

  $effect(() => {
    const _res = exportResolution;
    const _mx = appState.exportMarginX;
    const _my = appState.exportMarginY;
    if (activeTab === 'export' && previewImgUrl && previewCanvasEl) {
      drawPreview();
    }
  });

  function refreshPreviewScreenshot() {
    const renderer = getRenderer();
    if (!renderer) return;
    try {
      if (appState.exportBase === 'original' && originalWidth > 0 && originalHeight > 0) {
        const captured = renderer.captureFrame(originalWidth, originalHeight, { ignoreTransform: true });
        if (captured) {
          previewImgUrl = captured.toDataURL('image/png');
          return;
        }
      }
      const canvas = renderer.getCanvas();
      if (canvas && canvas.width > 0 && canvas.height > 0) {
        previewImgUrl = canvas.toDataURL('image/png');
      }
    } catch (e) {
      console.warn('Preview capture failed', e);
    }
  }

  function drawPreview() {
    if (!previewCanvasEl || !previewImgUrl) return;
    const exportW = exportResolution.width;
    const exportH = exportResolution.height;
    if (exportW <= 0 || exportH <= 0) return;
    const marginX = appState.exportMarginX ?? 0;
    const marginY = appState.exportMarginY ?? 0;
    const MAX_W = 380;
    const MAX_H = 200;
    const ratio = exportW / exportH;
    let pw = MAX_W;
    let ph = Math.round(MAX_W / ratio);
    if (ph > MAX_H) { ph = MAX_H; pw = Math.round(MAX_H * ratio); }
    pw = Math.max(pw, 2);
    ph = Math.max(ph, 2);
    previewCanvasEl.width = pw;
    previewCanvasEl.height = ph;
    const ctx = previewCanvasEl.getContext('2d');
    const scaleF = pw / exportW;
    const cx = Math.round(marginX * scaleF);
    const cy = Math.round(marginY * scaleF);
    const cw = Math.round(pw - 2 * marginX * scaleF);
    const ch = Math.round(ph - 2 * marginY * scaleF);
    const tile = 8;
    for (let y = 0; y < ph; y += tile) {
      for (let x = 0; x < pw; x += tile) {
        ctx.fillStyle = ((Math.floor(x / tile) + Math.floor(y / tile)) % 2 === 0) ? '#555' : '#333';
        ctx.fillRect(x, y, Math.min(tile, pw - x), Math.min(tile, ph - y));
      }
    }
    if (cw > 0 && ch > 0) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, cx, cy, cw, ch);
        ctx.fillStyle = 'rgba(80, 130, 220, 0.35)';
        if (cy > 0) ctx.fillRect(0, 0, pw, cy);
        if (ph - cy - ch > 0) ctx.fillRect(0, cy + ch, pw, ph - cy - ch);
        if (cx > 0) ctx.fillRect(0, cy, cx, ch);
        if (pw - cx - cw > 0) ctx.fillRect(cx + cw, cy, pw - cx - cw, ch);
        ctx.strokeStyle = 'rgba(160, 190, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx + 0.5, cy + 0.5, cw - 1, ch - 1);
      };
      img.src = previewImgUrl;
    }
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
      if (!keepAspectRatio) {
        aspectRatio = windowHeight / windowWidth;
      }
    }
  }
</script>

<svelte:window onresize={handleResize} />

<dialog bind:this={dialogEl} onclose={onDialogClose} closedby="any" autofocus class:lang-ja={locale === 'ja'} onclick={handleDialogClick}>
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
      <div class="button-group">
        <button onclick={handleOpenImage}>{t('openImage')}</button>
        <button onclick={handleRemoveImage}>{t('removeImage')}</button>
      </div>
      <div class="input-row">
        <label for="bgColorPicker">{t('backgroundColor')}</label>
        <input type="color" id="bgColorPicker" oninput={handleColorChange}>
      </div>
    </div>
  {/if}

  {#if activeTab === 'export'}
    <div class="tab-content">
      <div class="button-group">
        <button onclick={handleResetState}>{t('resetState')}</button>
        <button onclick={handleOpenExportDir}>{t('openExportDirectory')}</button>
      </div>
      <div class="input-row radio-group" style="gap: 20px;">
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
      <div class="input-row result-row">
        <span class="label">{t('resultingSize')}</span>
        <span class="value">{exportResolution.width} x {exportResolution.height}</span>
      </div>
      <hr>
      <div class="preview-section">
        <div class="preview-header">
          <span class="preview-title">{t('exportPreview')}</span>
          <button class="preview-refresh-btn" onclick={refreshPreviewScreenshot}>{t('refreshPreview')}</button>
        </div>
        <div class="preview-canvas-wrap">
          <canvas bind:this={previewCanvasEl} class="preview-canvas"></canvas>
        </div>
      </div>
      <hr>
      <label class="checkbox-label" for="aspectRatioToggle">
        <input type="checkbox" id="aspectRatioToggle" onchange={handleAspectRatioChange}>
        <span>{t('keepAspectRatio')}</span>
      </label>
      <div class="input-row">
        <label for="windowWidth">{t('windowWidth')}</label>
        <input type="number" id="windowWidth" min="100" max="10000" bind:value={windowWidth} onchange={handleWidthChange}>
      </div>
      <div class="input-row">
        <label for="windowHeight">{t('windowHeight')}</label>
        <input type="number" id="windowHeight" min="100" max="10000" bind:value={windowHeight} onchange={handleHeightChange}>
      </div>
      <div class="input-row">
        <label for="originalWidth">{t('originalWidth')}</label>
        <input type="text" id="originalWidth" readonly value={originalWidth}>
      </div>
      <div class="input-row">
        <label for="originalHeight">{t('originalHeight')}</label>
        <input type="text" id="originalHeight" readonly value={originalHeight}>
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

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 12px;
  }

  .checkbox-label input[type="checkbox"] {
    position: relative;
    top: 1px;
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
</style>
