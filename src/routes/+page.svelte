<script>
  import { onMount } from 'svelte';
  import { appState } from '$lib/appState.svelte.js';
  import { getRenderer, setRenderer } from '$lib/rendererStore.js';
  import { createRenderer } from '$lib/renderer/createRenderer.js';
  import { getSortableKey, findMaxNumber } from '$lib/utils.js';
  import { getAssetUrl } from '$lib/fileManager.js';
  import { exportImage, exportAnimation, exportPNGSequence } from '$lib/exporter.js';
  import { createTransformAction } from '$lib/inputAction.js';
  import { loadPreference } from '$lib/preferences.js';
  import { showNotification } from '$lib/notificationStore.svelte.js';
  import { t } from '$lib/i18n.svelte.js';
  import { getShortcuts } from '$lib/shortcutKeys.js';
  import PreferencesDialog from './PreferencesDialog.svelte';
  import Sidebar from './Sidebar.svelte';
  import AnimationController from './AnimationController.svelte';
  import Notification from './Notification.svelte';
  import { invoke, convertFileSrc } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';
  import { downloadDir, join } from '@tauri-apps/api/path';
  import { mkdir } from '@tauri-apps/plugin-fs';

  if (typeof window !== 'undefined') {
    window.__TAURI__ = window.__TAURI__ || {};
    window.__TAURI__.core = window.__TAURI__.core || {};
    window.__TAURI__.core.convertFileSrc = convertFileSrc;
  }

  let dialogOpen = $state(true);
  let showSpinner = $state(false);
  let progressPercent = $state(0);
  let showProgress = $state(false);
  let canvasContainer = $state();
  let sidebar = $state();
  let animController = $state();
  let shortcuts = $state(getShortcuts());
  const transformAction = createTransformAction();
  let currentLoadId = 0;
  let loadingRenderers = [];

  function refreshShortcuts() {
    shortcuts = getShortcuts();
  }

  onMount(() => {
    initBackground();
    const unlistenProgress = listen('progress', (event) => {
      appState.processing = event.payload;
      showSpinner = event.payload;
      if (showSpinner) {
        dialogOpen = false;
      }
    });
    const unlistenDragDrop = listen('tauri://drag-drop', async (event) => {
      processPath(event.payload.paths);
    });
    return async () => {
      (await unlistenProgress)();
      (await unlistenDragDrop)();
    };
  });

  function initBackground() {
    const savedImagePath = loadPreference('spive2d_bg_image_path', '');
    const savedColor = loadPreference('spive2d_bg_color', '');
    if (savedImagePath) {
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = `url("${getAssetUrl(savedImagePath)}")`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
    } else if (savedColor) {
      document.body.style.backgroundColor = savedColor;
      document.body.style.backgroundImage = 'none';
    }
  }

  async function processPath(paths) {
    if (appState.processing || paths.length !== 1) return;
    const wasInitialized = appState.initialized;
    appState.initialized = false;
    try {
      const inputPath = paths[0];
      let dirFiles = {};
      if (inputPath.startsWith('http://') || inputPath.startsWith('https://')) {
        let url;
        try {
          url = new URL(inputPath);
        } catch {
          appState.initialized = wasInitialized;
          showNotification(t('invalidUrl'));
          return;
        }
        const urlString = url.toString();
        const lastSlashIndex = urlString.lastIndexOf('/');
        const dirName = urlString.substring(0, lastSlashIndex + 1);
        const fileNameWithExt = urlString.substring(lastSlashIndex + 1);
        let baseName = fileNameWithExt;
        let ext1 = '';
        let ext2 = '';
        if (fileNameWithExt.endsWith('.model3.json')) {
          baseName = fileNameWithExt.substring(0, fileNameWithExt.length - '.model3.json'.length);
          ext1 = '.model3.json';
          ext2 = '.moc3';
        } else if (fileNameWithExt.endsWith('.skel')) {
          baseName = fileNameWithExt.substring(0, fileNameWithExt.length - '.skel'.length);
          ext1 = '.skel';
          ext2 = '.atlas';
        } else if (fileNameWithExt.endsWith('.json')) {
          baseName = fileNameWithExt.substring(0, fileNameWithExt.length - '.json'.length);
          ext1 = '.json';
          ext2 = '.atlas';
        } else if (fileNameWithExt.endsWith('.asset')) {
          baseName = fileNameWithExt.substring(0, fileNameWithExt.length - '.asset'.length);
          ext1 = '.asset';
          ext2 = '.atlas';
        } else {
          appState.initialized = wasInitialized;
          showNotification(t('invalidUrl'));
          return;
        }
        dirFiles = {
          [dirName]: [
             [baseName, ext1, ext2]
          ]
        };
      } else {
        dirFiles = await invoke('handle_dropped_path', { path: inputPath });
      }
      const dirs = Object.keys(dirFiles);
      dirs.sort((a, b) => {
        const keyA = getSortableKey(a);
        const keyB = getSortableKey(b);
        return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
      });
      if (dirs.length === 0) {
        appState.initialized = wasInitialized;
        showNotification(t('noFilesFound'));
        return;
      }
      appState.directories = {
        files: dirFiles,
        entries: dirs,
        selectedDir: dirs[0],
        selectedScene: 0,
      };
      const previousSkins = getRenderer()?.getPropertyItems?.('skins')?.filter(item => item.checked).map(item => item.name) || [];
      disposeModel();
      await initModel(previousSkins);
      appState.initialized = true;
      dialogOpen = false;
    } catch (error) {
      console.error('Error handling dropped path:', error);
      appState.initialized = wasInitialized;
      if (error?.message?.startsWith('HTTP ')) {
        showNotification(t('resourceNotFound'));
      } else {
        showNotification(t('invalidUrl'));
      }
      showSpinner = false;
    }
  }

  async function initModel(previousSkins = []) {
    currentLoadId++;
    const loadId = currentLoadId;
    const previousAnimationName = sidebar?.getSelectedAnimationText() || '';
    const { files, selectedDir, selectedScene } = appState.directories;
    if (!files || !selectedDir) return;
    const scenes = files[selectedDir];
    if (!scenes || scenes.length === 0) return;
    const fileNames = scenes[selectedScene];
    const renderer = createRenderer(fileNames);
    loadingRenderers.push(renderer);
    const canvas = renderer.getCanvas();
    if (canvasContainer && !canvasContainer.contains(canvas)) {
      canvasContainer.appendChild(canvas);
    }
    if (renderer.setAlphaMode) {
      renderer.setAlphaMode(appState.alphaMode);
    }    
    try {
      await renderer.load(selectedDir, fileNames);
    } catch (e) {
      console.error(e);
      loadingRenderers = loadingRenderers.filter(r => r !== renderer);
      return;
    }
    if (loadId !== currentLoadId) {
      loadingRenderers = loadingRenderers.filter(r => r !== renderer);
      renderer.dispose();
      const canvas = renderer.getCanvas();
      if (canvasContainer?.contains(canvas)) {
        canvasContainer.removeChild(canvas);
      }
      return;
    }
    loadingRenderers = loadingRenderers.filter(r => r !== renderer);
    setRenderer(renderer);
    const rendererCanvas = renderer.getCanvas();
    requestAnimationFrame(() => {
      rendererCanvas.style.opacity = '1';
    });
    const categories = renderer.getPropertyCategories();
    appState.propertyCategory = categories[0] || 'parameters';
    appState.resetTransform();
    appState.resetAnimation();
    if (previousSkins.length > 0 && renderer.getPropertyItems && 'applySkins' in renderer && typeof renderer.applySkins === 'function') {
      const availableSkins = renderer.getPropertyItems('skins') || [];
      const matchingSkins = previousSkins.filter(skinName => availableSkins.some(s => s.name === skinName));
      if (matchingSkins.length > 0) {
        renderer.applySkins(matchingSkins);
      }
    }
    sidebar?.refreshProperties();
    const animations = renderer.getAnimations();
    if (animations.length > 0) {
      let targetAnim = animations[0].value;
      if (previousAnimationName) {
        const match = animations.find(a => a.name === previousAnimationName);
        if (match) {
          targetAnim = match.value;
        }
      }
      sidebar?.setSelectedAnimation(targetAnim);
      handleAnimationChange(targetAnim);
    }
  }

  function disposeModel() {
    currentLoadId++;
    const renderer = getRenderer();
    if (renderer) {
      renderer.dispose();
      const canvas = renderer.getCanvas();
      if (canvasContainer?.contains(canvas)) {
        canvasContainer.removeChild(canvas);
      }
      setRenderer(null);
    }
    for (const r of loadingRenderers) {
      r.dispose();
      const canvas = r.getCanvas();
      if (canvasContainer?.contains(canvas)) {
        canvasContainer.removeChild(canvas);
      }
    }
    loadingRenderers = [];
  }

  function handleDirChange(e) {
    const newDir = e.target.value;
    const oldDir = appState.directories.selectedDir;
    const oldScenes = appState.directories.files[oldDir] || [];
    const currentSceneStr = oldScenes.length > 0 && appState.directories.selectedScene >= 0 && appState.directories.selectedScene < oldScenes.length ? oldScenes[appState.directories.selectedScene][0] : '';
    const maxNumber = findMaxNumber(currentSceneStr || '');
    appState.directories.selectedDir = newDir;
    const scenes = appState.directories.files[newDir] || [];    
    let index = -1;
    if (maxNumber !== null) {
      index = scenes.findIndex(item => String(item[0]).includes(String(maxNumber)));
    }
    appState.directories.selectedScene = index === -1 ? 0 : index;
    const previousSkins = getRenderer()?.getPropertyItems?.('skins')?.filter(item => item.checked).map(item => item.name) || [];
    disposeModel();
    initModel(previousSkins);
  }

  function handleSceneChange(e) {
    const idx = e.target.selectedIndex;
    appState.directories.selectedScene = idx;
    const previousSkins = getRenderer()?.getPropertyItems?.('skins')?.filter(item => item.checked).map(item => item.name) || [];
    disposeModel();
    initModel(previousSkins);
  }

  function handleAnimationChange(value) {
    const renderer = getRenderer();
    renderer?.setAnimation(value);
    if (appState.animation.paused) {
      animController?.resetProgress();
      requestAnimationFrame(() => {
        renderer?.seekAnimation(0);
      });
    }
    sidebar?.refreshProperties();
  }

  function handleExpressionChange(value) {
    getRenderer()?.setExpression(value);
  }

  function handleKeyDown(e) {
    if (document.activeElement?.matches('input')) return;
    const key = e.key;
    if (key !== shortcuts.toggleDialog && !appState.initialized) return;
    if (key === shortcuts.prevDir) { navigateSelector('dirSelector', -1, handleDirChange); }
    else if (key === shortcuts.nextDir) { navigateSelector('dirSelector', 1, handleDirChange); }
    else if (key === shortcuts.prevScene) { navigateSelector('sceneSelector', -1, handleSceneChange); }
    else if (key === shortcuts.nextScene) { navigateSelector('sceneSelector', 1, handleSceneChange); }
    else if (key === shortcuts.prevAnim) { sidebar?.navigateAnimation(-1); }
    else if (key === shortcuts.nextAnim) { sidebar?.navigateAnimation(1); }
    else if (key === shortcuts.toggleDialog) { toggleDialog(); }
    else if (key === shortcuts.exportImage) { doExportImage(); }
    else if (key === shortcuts.exportAnim) { doExportAnimation(); }
    else if (key === shortcuts.exportPngSeq) { doExportPngSequence(); }
    else if (key === shortcuts.addToList) {
      invoke('append_to_list', { text: getSceneText() }).then(() => {
        showNotification(t('addedToList'), 'success');
      });
    }
    else { return; }
    focusBody();
  }

  function navigateSelector(selectorId, delta, handler) {
    if(selectorId === 'sceneSelector') {
      const ops = appState.directories.files[appState.directories.selectedDir] || [];
      if(ops.length <= 1) return;
      const newIndex = (appState.directories.selectedScene + delta + ops.length) % ops.length;
      handler({ target: { selectedIndex: newIndex }});
    } else if (selectorId === 'dirSelector') {
       const ops = appState.directories.entries || [];
       if(ops.length <= 1) return;
       const currentIndex = ops.indexOf(appState.directories.selectedDir);
       const newIndex = (currentIndex + delta + ops.length) % ops.length;
       handler({ target: { value: ops[newIndex] }});
    }
  }

  function toggleDialog() {
    if (showSpinner) return;
    dialogOpen = !dialogOpen;
  }

  function focusBody() {
    if (document.activeElement !== document.body) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      document.body.focus();
    }
  }

  function doExportImage() {
    const sceneText = getSceneText();
    const animText = sidebar?.getSelectedAnimationText() || '';
    exportImage(sceneText, animText);
  }

  function doExportAnimation() {
    const sceneText = getSceneText();
    const animText = sidebar?.getSelectedAnimationText() || '';
    exportAnimation(sceneText, animText, (progress) => {
      progressPercent = progress;
      showProgress = progress > 0;
    });
  }

  async function doExportPngSequence() {
    const sceneText = getSceneText();
    const animText = sidebar?.getSelectedAnimationText() || '';
    const safeName = animText ? animText.split('.')[0] : 'sequence';
    const baseDir = await downloadDir();
    const exportBaseDir = await join(baseDir, 'spive2d_export');
    const folderName = `${sceneText}_${safeName}_export`;
    const targetDir = await join(exportBaseDir, folderName);
    try {
      await mkdir(targetDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create export directory:', err);
    }
    exportPNGSequence(targetDir, sceneText, animText, (progress) => {
      progressPercent = progress;
      showProgress = progress > 0;
    });
  }

  function getSceneText() {
    const scenes = appState.directories.files?.[appState.directories.selectedDir] || [];
    const currentSceneStr = scenes.length > 0 && appState.directories.selectedScene >= 0 && appState.directories.selectedScene < scenes.length ? scenes[appState.directories.selectedScene][0] : '';
    return currentSceneStr ? currentSceneStr.split('/').filter(Boolean).pop() : 'scene';
  }

  function handleResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    appState.viewport = { width: w, height: h };
    const renderer = getRenderer();
    if (renderer && appState.initialized) {
      renderer.resize(w, h);
      renderer.applyTransform(
        appState.transform.scale,
        appState.transform.moveX,
        appState.transform.moveY,
        appState.transform.rotate
      );
    }
  }

  function handleContextMenu(e) {
    e.preventDefault();
  }
</script>

<svelte:window
  onresize={handleResize}
  onkeydown={handleKeyDown}
/>

{#if showSpinner}
  <div id="spinner-backdrop">
    <div id="spinner"></div>
  </div>
{/if}

{#if showProgress}
  <div id="progressBarContainer">
    <div id="progressBar" style:width="{progressPercent}%"></div>
  </div>
{/if}

<div use:transformAction={{ appState, sidebar, animController, dialogOpen }}>
  <PreferencesDialog bind:open={dialogOpen} onPathSelected={processPath} onShortcutsChanged={refreshShortcuts} />
  <Sidebar
    bind:this={sidebar}
    onDirChange={handleDirChange}
    onSceneChange={handleSceneChange}
    onAnimationChange={handleAnimationChange}
    onExpressionChange={handleExpressionChange}
  />
  <div id="canvasContainer" bind:this={canvasContainer}></div>
</div>

<AnimationController bind:this={animController} />

<Notification />

<style>
  #spinner-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(3px);
    z-index: 2999;
  }

  #spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    border: 8px solid #eee;
    border-top: 8px solid #888;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  #progressBarContainer {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 600px;
    height: 25px;
    background-color: #eee;
    border-radius: 10px;
    border: var(--border-color);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    z-index: 3000;
  }

  #progressBar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #888;
    border-radius: 5px;
    transition: width 0.1s;
  }

  #canvasContainer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  #canvasContainer :global(canvas) {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
