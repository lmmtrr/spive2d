<script>
  import { appState } from '#lib/appState.svelte.js';
  import { getRenderer } from '#lib/rendererStore.svelte.js';
  import { t, getLocale, setLocale } from '#lib/i18n.svelte.js';
  import { openDirectory, openArchiveFile, openCurrentDirectory, openExportDirectory, selectExportDirectory, getExportDirectory, openImageFile, getAssetUrl } from '#lib/fileManager.js';
  import { saveSetting, removeSetting } from '#lib/settings.js';
  import { setWindowSize, getPhysicalWindowSize } from '#lib/windowManager.js';
  import { getShortcuts, saveShortcuts, resetShortcuts } from '#lib/shortcutKeys.js';
  import { showNotification } from '#lib/notificationStore.svelte.js';
  import { thumbnailCache } from '#lib/thumbnailCache.js';
  import { thumbnailManager } from '#lib/thumbnailManager.svelte.js';
  import { scrollAssist } from '#lib/scrollAssist.js';
  import { checkboxDrag } from '#lib/checkboxDrag.js';

  let { open = $bindable(false), onPathSelected, onShortcutsChanged } = $props();
  let windowWidth = $state(getPhysicalWindowSize().width);
  let windowHeight = $state(getPhysicalWindowSize().height);
  let originalWidth = $state(0);
  let originalHeight = $state(0);
  let mainOriginalWidth = $state(0);
  let mainOriginalHeight = $state(0);
  let locale = $state(getLocale());
  let urlInput = $state('');
  let dialogEl;
  let activeTab = $state('general');
  let exportDirPath = $state('');
  let shortcuts = $state(getShortcuts());
  let editingKey = $state(null);
  let shortcutQuery = $state('');
  const CHECKBOX_SETTINGS = [
    { key: 'skipUnity', storageKey: 'spive2d_skip_unity', labelKey: 'skipUnity' },
    { key: 'mergeSequential', storageKey: 'spive2d_merge_sequential', labelKey: 'mergeSequential' },
    { key: 'enableIdle', storageKey: 'spive2d_enable_idle', labelKey: 'enableIdle' },
    { key: 'enableBreathing', storageKey: 'spive2d_enable_breathing', labelKey: 'enableBreathing' },
    { key: 'enableBlinking', storageKey: 'spive2d_enable_blinking', labelKey: 'enableBlinking' },
    { key: 'showHitAreas', storageKey: 'spive2d_show_hit_areas', labelKey: 'showHitAreas' },
    { key: 'enableMouseTracking', storageKey: 'spive2d_enable_mouse_tracking', labelKey: 'enableMouseTracking' },
    { key: 'enablePhysics', storageKey: 'spive2d_enable_physics', labelKey: 'enablePhysics' },
  ];
  const checkboxOptions = $derived(
    CHECKBOX_SETTINGS
      .map((option) => ({ ...option, text: t(option.labelKey) }))
      .sort((a, b) => a.text.localeCompare(b.text, locale))
  );

  const isSpine = $derived.by(() => {
    if (!appState.directories?.files || !appState.directories?.selectedDir) return false;
    const scenes = appState.directories.files[appState.directories.selectedDir];
    const selectedScene = appState.directories.selectedScene;
    if (!scenes || selectedScene < 0 || selectedScene >= scenes.length) return false;
    const scene = scenes[selectedScene];
    if (!scene) return false;
    const ext = scene.mainExt;
    return !(ext.includes('.moc') || ext.includes('.model3.json') || ext.includes('.model.json'));
  });

  let isCurrentDirUrl = $derived(
    !!appState.directories?.selectedDir &&
    (appState.directories.selectedDir.startsWith('http://') ||
     appState.directories.selectedDir.startsWith('https://'))
  );

  const shortcutActions = [
    'prevScene', 'nextScene',
    'prevAnim', 'nextAnim', 'togglePause',
    'exportImage', 'exportImageSeq', 'exportAnim', 'exportModel',
    'toggleDialog', 'toggleSceneGrid', 'addToList', 'toggleFullscreen',
    'openDirectory',
    'openArchive',
    'openCurrentDirectory',
    'focusUrl',
    'focusFilter',
    'prevExpression',
    'nextExpression',
    'toggleSetupPose',
    'resetOverrides',
    'resetView',
    'resetScale',
    'resetRotation',
    'resetPositionX',
    'resetPositionY',
    'resetPosition',
    'cycleTextureFilter',
    'openBackgroundImage',
    'removeBackground',
    'openExportDirectory',
    'resetExportMarginX',
    'resetExportMarginY',
    'resetExportMargin',
    'resetExportScale',
    'toggleIdle',
    'toggleBreathing',
    'toggleBlinking',
    'toggleHitAreas',
    'toggleMouseTracking',
    'togglePhysics',
  ];

  const shortcutLabelKeys = {
    prevScene: 'shortcutPrevScene',
    nextScene: 'shortcutNextScene',
    prevAnim: 'shortcutPrevAnim',
    nextAnim: 'shortcutNextAnim',
    togglePause: 'shortcutTogglePause',
    toggleDialog: 'shortcutToggleDialog',
    toggleSceneGrid: 'shortcutToggleSceneGrid',
    exportImage: 'shortcutExportImage',
    exportImageSeq: 'shortcutExportImageSeq',
    exportAnim: 'shortcutExportAnim',
    exportModel: 'shortcutExportModel',
    addToList: 'shortcutAddToList',
    toggleFullscreen: 'shortcutToggleFullscreen',
    openDirectory: 'openDirectory',
    openArchive: 'openArchive',
    openCurrentDirectory: 'openCurrentDirectory',
    focusUrl: 'shortcutFocusUrl',
    focusFilter: 'shortcutFocusFilter',
    prevExpression: 'shortcutPrevExpression',
    nextExpression: 'shortcutNextExpression',
    toggleSetupPose: 'shortcutToggleSetupPose',
    resetOverrides: 'shortcutResetOverrides',
    resetView: 'resetView',
    resetScale: 'shortcutResetScale',
    resetRotation: 'shortcutResetRotation',
    resetPositionX: 'shortcutResetPositionX',
    resetPositionY: 'shortcutResetPositionY',
    resetPosition: 'shortcutResetPosition',
    cycleTextureFilter: 'shortcutCycleTextureFilter',
    openBackgroundImage: 'openImage',
    removeBackground: 'removeBackground',
    openExportDirectory: 'shortcutOpenExportDirectory',
    resetExportMarginX: 'shortcutResetExportMarginX',
    resetExportMarginY: 'shortcutResetExportMarginY',
    resetExportMargin: 'shortcutResetExportMargin',
    resetExportScale: 'shortcutResetExportScale',
    toggleIdle: 'shortcutToggleLive2DIdle',
    toggleBreathing: 'shortcutToggleLive2DBreathing',
    toggleBlinking: 'shortcutToggleLive2DBlinking',
    toggleHitAreas: 'shortcutToggleLive2DHitAreas',
    toggleMouseTracking: 'shortcutToggleLive2DMouseTracking',
    togglePhysics: 'shortcutToggleLive2DPhysics',
  };

  const visibleShortcutActions = $derived.by(() => {
    const query = shortcutQuery.trim().toLowerCase();
    const actions = shortcutActions
      .filter((a) => !query || t(shortcutLabelKeys[a]).toLowerCase().includes(query) || displayKey(shortcuts[a]).toLowerCase().includes(query))
      .sort((a, b) => t(shortcutLabelKeys[a]).localeCompare(t(shortcutLabelKeys[b]), locale));
    return [...actions.filter((a) => shortcuts[a]), ...actions.filter((a) => !shortcuts[a])];
  });

  function setCheckboxSetting(option, checked) {
    appState[option.key] = checked;
    saveSetting(option.storageKey, checked);
  }

  $effect(() => {
    if (open && dialogEl && !dialogEl.open) {
      dialogEl.showModal();
      updateOriginalSize();
      ({ width: windowWidth, height: windowHeight } = getPhysicalWindowSize());
      shortcuts = getShortcuts();
    } else if (!open && dialogEl?.open) {
      dialogEl.close();
      editingKey = null;
    }
  });

  $effect(() => {
    if (open && activeTab === 'export') refreshExportDirPath();
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
      const mainSize = renderer.getMainOriginalSize ? renderer.getMainOriginalSize() : size;
      mainOriginalWidth = mainSize.width;
      mainOriginalHeight = mainSize.height;
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

  function handleTextureFilterChange(e) {
    const val = e.target.value;
    appState.textureFilter = val;
    saveSetting('spive2d_texture_filter', val);
    const renderer = getRenderer();
    if (renderer && typeof renderer.setTextureFilter === 'function') {
      renderer.setTextureFilter(val);
    }
  }

  export async function handleOpenDirectory() {
    const path = await openDirectory();
    if (path) onPathSelected([path]);
  }

  export async function handleOpenArchive() {
    const path = await openArchiveFile();
    if (path) onPathSelected([path]);
  }

  export async function handleOpenCurrentDir() {
    if (!appState.initialized) return;
    const dir = appState.directories?.selectedDir;
    if (!dir || dir.startsWith('http://') || dir.startsWith('https://')) return;
    const scenes = appState.directories.files?.[dir] || [];
    const sceneInfo = scenes[appState.directories.selectedScene];
    const scene = sceneInfo ? sceneInfo.name : '';
    await openCurrentDirectory(dir, scene);
  }

  async function handleOpenExportDir() {
    await openExportDirectory();
  }

  async function refreshExportDirPath() {
    try {
      exportDirPath = await getExportDirectory();
    } catch (e) {
      showNotification(String(e), 'error');
    }
  }

  async function handleChangeExportDir() {
    const path = await selectExportDirectory();
    if (!path) return;
    appState.exportDir = path;
    await refreshExportDirPath();
  }

  async function handleResetExportDir() {
    appState.exportDir = '';
    await refreshExportDirPath();
  }

  export async function handleOpenImage() {
    const path = await openImageFile();
    if (!path) return;
    document.body.style.backgroundColor = '';
    document.body.style.backgroundImage = `url("${getAssetUrl(path)}")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    saveSetting('spive2d_bg_image_path', path);
    appState.background = { ...appState.background, imagePath: path };
  }

  export function focusUrl() {
    activeTab = 'general';
    open = true;
    requestAnimationFrame(() => {
      const input = document.getElementById('urlInput');
      if (!(input instanceof HTMLTextAreaElement)) return;
      input.focus();
      input.select();
    });
  }

  export function handleRemoveBackground() {
    document.body.style.backgroundColor = '';
    document.body.style.backgroundImage = `
      linear-gradient(45deg, #333 25%, transparent 0),
      linear-gradient(45deg, transparent 75%, #333 0),
      linear-gradient(45deg, #333 25%, transparent 0),
      linear-gradient(45deg, transparent 75%, #333 0)`;
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

  async function handleClearThumbnailCache() {
    try {
      await thumbnailCache.clear();
      thumbnailManager.clear();
      showNotification(t('clearThumbnailCacheSuccess'), 'success');
    } catch (e) {
      console.error('Failed to clear thumbnail cache:', e);
      showNotification(String(e), 'error');
    }
  }

  function handleResetState() {
    appState.resetTransform();
    appState.resetExportSettings();
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
      while (val > 360) val -= 360;
      while (val < -360) val += 360;
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
        w: originalWidth + (2 * mX / eS),
        h: originalHeight + (2 * mY / eS)
      };
    } else {
      const vw = windowWidth / dpr;
      const vh = windowHeight / dpr;
      const bs = Math.min(vw / mainOriginalWidth, vh / mainOriginalHeight);
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
    const rotate = appState.exportBase === 'original' ? 0 : (appState.transform.rotate * Math.PI / 180);
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
    const urls = urlInput.split(/[\s,]+/).map(u => u.trim()).filter(Boolean);
    if (urls.length > 0) {
      onPathSelected(urls);
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
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
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
      ({ width: windowWidth, height: windowHeight } = getPhysicalWindowSize());
    }
  }
</script>

<svelte:window onresize={handleResize} />

<dialog bind:this={dialogEl} use:checkboxDrag onclose={onDialogClose} closedby="any" autofocus class:lang-ja={locale === 'ja' || locale === 'ko'} onclick={handleDialogClick} class:wide={activeTab === 'export'}>
  <div class="tab-bar">
    <button id="tabBtnGeneral" class="tab-btn" class:active={activeTab === 'general'} onclick={() => activeTab = 'general'}>
      {t('tabGeneral')}
    </button>
    <button id="tabBtnExport" class="tab-btn" class:active={activeTab === 'export'} onclick={() => activeTab = 'export'}>
      {t('tabExport')}
    </button>
    <button id="tabBtnShortcuts" class="tab-btn" class:active={activeTab === 'shortcuts'} onclick={() => { activeTab = 'shortcuts'; }}>
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
          <option value="ko">한국어</option>
          <option value="zh">中文</option>
        </select>
      </div>
      <div class="input-row">
        <label for="textureFilterSelector">{t('textureFilter')}</label>
        <select id="textureFilterSelector" value={appState.textureFilter} onchange={handleTextureFilterChange}>
          <option value="nearest">{t('textureFilterNearest')}</option>
          <option value="linear">{t('textureFilterLinear')}</option>
          <option value="bicubic">{t('textureFilterBicubic')}</option>
          <option value="lanczos">{t('textureFilterLanczos')}</option>
        </select>
      </div>
      <hr>
      <div class="button-group">
        <button onclick={handleOpenDirectory}>{t('openDirectory')}</button>
        <button onclick={handleOpenArchive}>{t('openArchive')}</button>
        <button onclick={handleOpenCurrentDir} disabled={isCurrentDirUrl}>{t('openCurrentDirectory')}</button>
      </div>
      <hr>
      <div class="input-row" style="flex-direction: column; align-items: stretch; gap: 8px;">
        <textarea id="urlInput" placeholder={t('enterUrlPrompt')} bind:value={urlInput} rows="3"></textarea>
        <div style="display: flex; justify-content: flex-end;">
          <button id="loadUrlBtn" style="width: auto; margin: 0; padding: 0 15px;" onclick={handleLoadUrl}>{t('loadFromUrl')}</button>
        </div>
      </div>
      <hr>
      <div class="button-group background-row">
        <label class="color-swatch" title={t('backgroundColor').replace(/[:：]\s*$/, '')}>
          <input type="color" id="bgColorPicker" oninput={handleColorChange}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3a9 9 0 0 0 0 18c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
        </label>
        <button onclick={handleOpenImage}>{t('openImage')}</button>
        <button onclick={handleRemoveBackground}>{t('removeBackground')}</button>
      </div>
      <hr>
      {#each checkboxOptions as option (option.key)}
        <div class="input-row checkbox-row">
          <label style="display: flex; align-items: center; cursor: pointer; gap: 12px; width: 100%; white-space: nowrap;">
            <input type="checkbox" checked={appState[option.key]} onchange={(e) => setCheckboxSetting(option, e.currentTarget.checked)} style="margin: 0;">
            <span style="font-size: var(--ui-font-size); letter-spacing: 0.08em; font-weight: 500;">{option.text}</span>
          </label>
        </div>
      {/each}
      <hr>
      <div class="button-group">
        <button onclick={handleClearThumbnailCache}>{t('clearThumbnailCache')}</button>
      </div>
    </div>
  {/if}

  {#if activeTab === 'export'}
    <div class="tab-content export-tab-wrapper">
      <div class="export-col-left">
        <section>
          <h3 class="section-title">{t('exportSectionOutput')}</h3>
          <div class="input-row">
            <input type="text" readonly value={exportDirPath} title={exportDirPath}>
          </div>
          <div class="button-row">
            <button class="small-btn" onclick={handleChangeExportDir}>{t('changeExportDirectory')}</button>
            <button class="small-btn" onclick={handleResetExportDir} disabled={!appState.exportDir}>{t('resetExportDirectory')}</button>
            <button class="small-btn" onclick={handleOpenExportDir}>{t('openExportDirectory')}</button>
          </div>
        </section>

        <section>
          <h3 class="section-title">{t('exportSectionSize')}</h3>
          <div class="input-row">
            <span class="field-label">{t('exportSizeBase')}</span>
            <div class="choice-group">
              <label class="radio-label">
                <input type="radio" name="exportBase" value="window" checked={appState.exportBase === 'window'} onchange={handleExportBaseChange}>
                <span>{t('baseWindow')}</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="exportBase" value="original" checked={appState.exportBase === 'original'} onchange={handleExportBaseChange}>
                <span>{t('baseOriginal')}</span>
              </label>
            </div>
          </div>
          <div class="input-row grid-row">
            <label for="exportScale">{t('exportScale')}</label>
            <input type="number" id="exportScale" min="10" max="1000" bind:value={appState.exportScale} onchange={handleExportScaleValidate}>
            <span class="unit">%</span>
          </div>
          <div class="input-row grid-row">
            <label for="exportMarginX">{t('exportMargin')} X</label>
            <input type="number" id="exportMarginX" bind:value={appState.exportMarginX} onchange={handleExportMarginXValidate}>
            <label class="second-label" for="exportMarginY">{t('exportMargin')} Y</label>
            <input type="number" id="exportMarginY" bind:value={appState.exportMarginY} onchange={handleExportMarginYValidate}>
          </div>
        </section>

        <section>
          <h3 class="section-title">{t('exportSectionTransform')}</h3>
          <div class="input-row grid-row">
            <label for="transformScale">{t('transformScale')}</label>
            <input type="number" id="transformScale" step="0.1" bind:value={appState.transform.scale} onchange={handleTransformScaleValidate}>
            <label class="second-label" for="transformRotate">{t('transformRotate')}</label>
            <input type="number" id="transformRotate" step="1" bind:value={appState.transform.rotate} onchange={handleTransformRotateValidate}>
          </div>
          <div class="input-row grid-row">
            <label for="transformMoveX">{t('transformMove')} X</label>
            <input type="number" id="transformMoveX" step="10" bind:value={appState.transform.moveX} onchange={handleTransformMoveXValidate}>
            <label class="second-label" for="transformMoveY">{t('transformMove')} Y</label>
            <input type="number" id="transformMoveY" step="10" bind:value={appState.transform.moveY} onchange={handleTransformMoveYValidate}>
          </div>
        </section>

        <div class="button-row">
          <button class="small-btn" onclick={handleResetState}>{t('resetState')}</button>
        </div>
      </div>

      <div class="export-col-right">
        <section>
          <div class="preview-header">
            <h3 class="section-title">{t('exportPreview')}</h3>
            <div class="button-row">
              <button class="small-btn" onclick={resetPreviewView}>{t('resetView') || 'Reset View'}</button>
              <button class="small-btn" onclick={refreshPreviewScreenshot}>{t('refreshPreview')}</button>
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
          <div class="size-card">
            <div class="size-row main">
              <span>{t('resultingSize')}</span>
              <span id="exportResolutionValue" class="size-value">{exportResolution.width} x {exportResolution.height}</span>
            </div>
          </div>
        </section>

        <section>
          <h3 class="section-title">{t('exportSectionWindow')}</h3>
          <div class="input-row grid-row">
            <label for="windowWidth">{t('sizeWidth')}</label>
            <input type="number" id="windowWidth" min="100" max="10000" bind:value={windowWidth} onchange={handleWidthChange}>
            <label class="second-label" for="windowHeight">{t('sizeHeight')}</label>
            <input type="number" id="windowHeight" min="100" max="10000" bind:value={windowHeight} onchange={handleHeightChange}>
          </div>
          <div class="input-row">
            <span class="field-label">{t('originalSize')}</span>
            <span class="size-value muted">{originalWidth} x {originalHeight}</span>
          </div>
        </section>
      </div>
    </div>
  {/if}

  {#if activeTab === 'shortcuts'}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class="tab-content shortcut-tab" role="application" tabindex="-1" onkeydown={handleShortcutKeyDown}>
      <div class="search-wrapper">
        <input type="text" class="shortcut-search" placeholder={t('shortcutSearch')} bind:value={shortcutQuery} spellcheck="false">
        {#if shortcutQuery}
          <button class="search-clear-btn" onclick={() => shortcutQuery = ''} aria-label="clear">×</button>
        {/if}
      </div>
      <div class="shortcut-list" use:scrollAssist>
        {#each visibleShortcutActions as action (action)}
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
      </div>
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
    text-shadow: var(--text-shadow);
    border: var(--border-color);
    border-radius: 10px;
    padding: 0;
    width: 480px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    user-select: none;
    direction: rtl;
    font-size: var(--ui-font-size);
  }

  dialog > :global(*) {
    direction: ltr;
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
    font-size: var(--ui-font-size);
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

  dialog :global(.tab-content) {
    padding: 10px 25px;
  }

  dialog :global(.button-group) {
    display: flex;
    justify-content: center;
  }

  dialog :global(button:not(.tab-btn):not(.shortcut-key-btn)) {
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
    font-size: var(--ui-font-size);
    margin: 10px 0;
    cursor: pointer;
  }

  dialog.lang-ja :global(button:not(.tab-btn):not(.shortcut-key-btn)) {
    font-size: 12px;
  }

  dialog.lang-ja :global(input[type="text"]::placeholder) {
    font-size: var(--ui-font-size);
  }

  dialog :global(button:not(.tab-btn):not(.shortcut-key-btn):hover:not(:disabled)) {
    background-color: #555;
  }

  dialog :global(button:not(.tab-btn):not(.shortcut-key-btn):disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  dialog :global(hr) {
    border: 0;
    height: 1px;
    background-color: #999;
  }

  dialog :global(.input-row) {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  dialog :global(.input-row label) {
    flex-basis: 140px;
    flex-shrink: 0;
  }

  dialog :global(.input-row.checkbox-row) {
    margin: 0;
  }

  dialog :global(.input-row.checkbox-row > label) {
    padding: 4px 0;
  }

  dialog :global(.input-row input[type="number"]),
  dialog :global(.input-row input[type="text"]) {
    text-indent: 6px;
    border-radius: 6px;
    height: 30px;
    width: 100%;
    outline: none;
    color: var(--text-color);
    border: var(--border-color);
    background-color: #0006;
    text-shadow: var(--text-shadow);
    font-size: var(--ui-font-size);
    user-select: text;
  }

  dialog :global(.input-row input[readonly]) {
    background-color: #0009;
    color: var(--text-color);
    border: var(--border-color);
    opacity: 0.6;
    cursor: default;
  }

  dialog :global(.input-row textarea) {
    padding: 6px;
    border-radius: 6px;
    height: 80px;
    width: 100%;
    outline: none;
    color: var(--text-color);
    border: var(--border-color);
    background-color: #0006;
    text-shadow: var(--text-shadow);
    font-size: var(--ui-font-size);
    user-select: text;
    resize: vertical;
    font-family: inherit;
  }

  dialog :global(.radio-label) {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: var(--ui-font-size);
  }

  dialog :global(.radio-label input[type="radio"]) {
    margin: 0;
  }


  .background-row {
    align-items: center;
    gap: 8px;
  }

  .color-swatch {
    position: relative;
    flex: 0 0 auto;
    width: 40px;
    height: 40px;
    border: var(--border-color);
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
  }

  .color-swatch input {
    position: absolute;
    inset: -8px;
    width: calc(100% + 16px);
    height: calc(100% + 16px);
    padding: 0;
    border: none;
    cursor: pointer;
  }

  .color-swatch svg {
    position: absolute;
    inset: 9px;
    width: 20px;
    height: 20px;
    fill: #fff;
    filter: drop-shadow(0 0 1.5px #000) drop-shadow(0 0 1px #000);
    pointer-events: none;
  }

  .shortcut-tab {
    display: flex;
    flex-direction: column;
    height: min(640px, calc(100vh - 120px));
  }

  .shortcut-list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-left: 18px;
  }

  .search-wrapper {
    position: relative;
    margin-bottom: 10px;
  }

  .shortcut-search {
    text-indent: 6px;
    border-radius: 6px;
    height: 30px;
    width: 100%;
    outline: none;
    color: var(--text-color);
    border: var(--border-color);
    font-size: var(--ui-font-size);
    background-color: #0006;
    text-shadow: var(--text-shadow);
    padding-right: 30px;
    user-select: text;
  }

  .tab-content.shortcut-tab .search-clear-btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 30px;
    height: 30px;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    font-size: 18px;
  }

  .tab-content.shortcut-tab .search-clear-btn:hover:not(:disabled) {
    background: transparent;
  }

  .shortcut-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .shortcut-label {
    flex: 1;
    font-size: var(--ui-font-size);
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
    font-size: var(--ui-font-size);
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
    --label-w: 60px;
    --input-w: 72px;
    --pair-gap: 24px;
    display: flex;
    gap: 30px;
    padding-bottom: 16px;
  }

  .export-tab-wrapper .export-col-left {
    flex: 1;
    min-width: 320px;
  }

  .export-tab-wrapper .export-col-right {
    flex: 1;
    min-width: 340px;
    display: flex;
    flex-direction: column;
  }

  .export-tab-wrapper section {
    margin-bottom: 18px;
  }

  .export-tab-wrapper .section-title {
    margin: 0 0 10px;
    padding-bottom: 4px;
    border-bottom: 1px solid #fff2;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.05em;
    opacity: 0.85;
  }

  .export-tab-wrapper .input-row {
    gap: 8px;
    margin-bottom: 10px;
  }

  .export-tab-wrapper .input-row .field-label {
    flex: 0 0 auto;
    min-width: var(--label-w);
    font-size: var(--ui-font-size);
    white-space: nowrap;
  }

  .export-tab-wrapper .input-row.grid-row {
    display: grid;
    grid-template-columns: var(--label-w) var(--input-w) calc(var(--label-w) + var(--pair-gap)) var(--input-w);
    justify-content: start;
    column-gap: 8px;
  }

  .export-tab-wrapper .grid-row label,
  .export-tab-wrapper .grid-row .second-label {
    font-size: var(--ui-font-size);
    white-space: nowrap;
  }

  .export-tab-wrapper .grid-row .second-label {
    padding-left: var(--pair-gap);
  }

  .export-tab-wrapper .grid-row .unit {
    font-size: var(--ui-font-size);
    opacity: 0.8;
  }

  .export-tab-wrapper .input-row input[type="number"] {
    min-width: 0;
  }

  .export-tab-wrapper .choice-group .radio-label {
    flex-basis: auto;
  }

  .export-tab-wrapper .choice-group {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 15px;
  }

  .export-tab-wrapper .button-row {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }

  .export-tab-wrapper .small-btn {
    height: 28px !important;
    width: auto !important;
    padding: 0 12px !important;
    margin: 0 !important;
    font-size: 12px !important;
    border-radius: 5px !important;
    white-space: nowrap;
  }

  .export-tab-wrapper .preview-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
    border-bottom: 1px solid #fff2;
  }

  .export-tab-wrapper .preview-header .section-title {
    border-bottom: 0;
    margin: 0;
  }

  .export-tab-wrapper .preview-header .button-row {
    margin-bottom: 4px;
  }

  .export-tab-wrapper .preview-canvas-wrap {
    display: flex;
    justify-content: center;
    background: #1a1a1a;
    border-radius: 6px;
    padding: 6px;
    min-height: 40px;
  }

  .export-tab-wrapper .preview-canvas {
    display: block;
    border-radius: 3px;
    max-width: 100%;
    cursor: grab;
    touch-action: none;
  }

  .export-tab-wrapper .preview-canvas:active {
    cursor: grabbing;
  }

  .export-tab-wrapper .size-card {
    margin-top: 8px;
    padding: 8px 10px;
    border-radius: 6px;
    background: #0004;
    font-size: 13px;
  }

  .export-tab-wrapper .size-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 28px;
  }

  .export-tab-wrapper .size-row.main {
    font-weight: bold;
    color: #eef;
  }

  .export-tab-wrapper .size-value {
    font-family: monospace;
    font-size: var(--ui-font-size);
    white-space: nowrap;
  }

  .export-tab-wrapper .size-value.muted {
    opacity: 0.7;
  }
</style>
