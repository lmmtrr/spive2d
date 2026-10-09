<script>
  import { onMount } from 'svelte';
  import { appState } from '#lib/appState.svelte.js';
  import { getRenderer, setRenderer } from '#lib/rendererStore.svelte.js';
  import { createRenderer } from '#lib/renderer/createRenderer.js';
  import { preloadManager } from '#lib/renderer/preloadManager.js';
  import { filterSceneIndices, findIdleAnimation, sanitizeInputUrl } from '#lib/utils.js';
  import { getAssetUrl, getExportDirectory } from '#lib/fileManager.js';
  import { exportImage, exportAnimation, exportImageSequence } from '#lib/exporter.js';
  import { exportModelFiles } from '#lib/modelExporter.js';
  import { createTransformAction } from '#lib/inputAction.js';
  import { loadSetting, saveSetting } from '#lib/settings.js';
  import { showNotification } from '#lib/notificationStore.svelte.js';
  import { t } from '#lib/i18n.svelte.js';
  import { getShortcuts } from '#lib/shortcutKeys.js';
  import SettingsDialog from './SettingsDialog.svelte';
  import Sidebar from './Sidebar.svelte';
  import AnimationController from './AnimationController.svelte';
  import Notification from './Notification.svelte';
  import ExportQueue from './ExportQueue.svelte';
  import SceneThumbnailGrid from './SceneThumbnailGrid.svelte';
  import { thumbnailManager } from '#lib/thumbnailManager.svelte.js';
  import { invoke, convertFileSrc } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';
  import { join } from '@tauri-apps/api/path';
  import { mkdir } from '@tauri-apps/plugin-fs';
  import { getCurrentWindow } from '@tauri-apps/api/window';
  import { toggleFullscreen, exitFullscreen } from '#lib/windowManager.js';

  if (typeof window !== 'undefined') {
    window.__TAURI__ = window.__TAURI__ || {};
    window.__TAURI__.core = window.__TAURI__.core || {};
    window.__TAURI__.core.convertFileSrc = convertFileSrc;
  }

  let dialogOpen = $state(true);
  let sceneGridOpen = $state(false);
  let showSpinner = $state(false);
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
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modelUrl = params.get('model');
      if (modelUrl) {
        processPath([modelUrl]);
      }
      window.__APP_STATE__ = appState;
      window.__GET_RENDERER__ = getRenderer;
    }
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

  $effect(() => {
    const renderer = getRenderer();
    if (renderer && appState.initialized) {
      renderer.applyTransform(
        appState.transform.scale,
        appState.transform.moveX,
        appState.transform.moveY,
        appState.transform.rotate
      );
    }
  });

  function initBackground() {
    const savedImagePath = loadSetting('spive2d_bg_image_path', '');
    const savedColor = loadSetting('spive2d_bg_color', '');
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
    if (appState.processing || paths.length === 0) return;
    paths = paths.map(sanitizeInputUrl);
    const wasInitialized = appState.initialized;
    appState.initialized = false;
    try {
      const inputPath = paths[0];
      let dirFiles = {};
      const isLocalUnixPath = inputPath.startsWith('/') && (
        inputPath.startsWith('/Users/') || 
        inputPath.startsWith('/home/') || 
        inputPath.startsWith('/var/') || 
        inputPath.startsWith('/tmp/') || 
        inputPath.startsWith('/private/')
      );
      if (inputPath.startsWith('https://')) {
        let unityRes = null;
        let isUnity = false;
        let shouldInvokeBackend = false;
        try {
          showSpinner = true;
          let bytes;
          const fetched = await invoke('fetch_url_bytes', { url: inputPath });
          bytes = new Uint8Array(fetched);
          const header = String.fromCharCode(...bytes.slice(0, 8));
          isUnity = header.startsWith("UnityFS") || header.startsWith("UnityWeb") || header.startsWith("UnityRaw");
          if (isUnity && appState.skipUnity) {
            throw new Error('Unsupported file type');
          }
          let hasArchive = false;
          for (const p of paths) {
            try {
              const url = new URL(p, window.location.origin);
              const pathname = url.pathname.toLowerCase();
              if (pathname.endsWith('.zip') || pathname.endsWith('.7z')) {
                hasArchive = true;
                break;
              }
            } catch {}
          }
          shouldInvokeBackend = isUnity || hasArchive;
          if (shouldInvokeBackend) {
            unityRes = await invoke('handle_urls', { urls: paths, mergeSequential: appState.mergeSequential, skipUnity: appState.skipUnity });
          }
        } catch (e) {
          console.error(e);
          showNotification(e.message || String(e), 'error');
          appState.initialized = wasInitialized;
          return;
        } finally {
          showSpinner = false;
        }
        if (shouldInvokeBackend) {
          if (unityRes && Object.keys(unityRes).length > 0) {
            dirFiles = unityRes;
          } else {
            showNotification(t('noFilesFound'));
            appState.initialized = wasInitialized;
            return;
          }
        } else {
          const urlScenes = [];
          for (const path of paths) {
            let url;
            try {
              url = new URL(path, window.location.origin);
            } catch {
              continue;
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
            } else if (fileNameWithExt.endsWith('.meta.json')) {
              baseName = fileNameWithExt.substring(0, fileNameWithExt.length - '.meta.json'.length);
              ext1 = '.meta.json';
              ext2 = '';
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
              continue;
            }
            urlScenes.push({ dirName, scene: { name: baseName, mainExt: ext1, atlasExt: ext2, files: [], isMerged: false } });
          }
          if (urlScenes.length === 0) {
            appState.initialized = wasInitialized;
            showNotification(t('invalidUrl'));
            return;
          }
          let rootDir = urlScenes[0].dirName;
          for (const { dirName } of urlScenes) {
            while (!dirName.startsWith(rootDir)) {
              rootDir = rootDir.substring(0, rootDir.lastIndexOf('/', rootDir.length - 2) + 1);
            }
          }
          const scenes = [];
          for (const { dirName, scene } of urlScenes) {
            scene.name = dirName.substring(rootDir.length) + scene.name;
            if (!scenes.some(item => item.name === scene.name)) scenes.push(scene);
          }
          dirFiles = { [rootDir]: scenes };
        }
      } else {
        dirFiles = await invoke('handle_dropped_paths', { paths, mergeSequential: appState.mergeSequential, skipUnity: appState.skipUnity });
      }
      const rootDir = Object.keys(dirFiles)[0];
      if (!rootDir) {
        appState.initialized = wasInitialized;
        showNotification(t('noFilesFound'));
        return;
      }
      sceneGridOpen = false;
      thumbnailManager.clear();
      appState.directories = {
        files: dirFiles,
        selectedDir: rootDir,
        selectedScene: 0,
        sceneFilter: '',
      };
      const previousSkins = getRenderer()?.getPropertyItems?.('skins')?.filter(item => item.checked).map(item => item.name) || [];
      disposeModel();
      await initModel(previousSkins, { detectAlpha: true });
      appState.initialized = true;
      dialogOpen = false;
    } catch (error) {
      console.error('Error handling dropped path:', error);
      appState.initialized = wasInitialized;
      const errMsg = typeof error === 'string' ? error : (error?.message || String(error));
      if (errMsg.startsWith('HTTP ')) {
        showNotification(t('resourceNotFound'));
      } else if (errMsg.includes('Unsupported file type')) {
        showNotification(t('unsupportedFileType'));
      } else if (errMsg.includes('No supported Spine') || errMsg.includes('No valid files or models')) {
        showNotification(t('noSupportedModels'));
      } else if (errMsg.includes('Invalid path')) {
        showNotification(t('invalidPath'));
      } else {
        const inputPath = paths[0] || '';
        const isUrl = inputPath.startsWith('http://') || inputPath.startsWith('https://');
        if (isUrl) {
          showNotification(t('invalidUrl'));
        } else {
          showNotification(errMsg);
        }
      }
      showSpinner = false;
    }
  }

  async function initModel(previousSkins = [], options = {}) {
    const detectAlpha = typeof options === 'boolean' ? options : !!options?.detectAlpha;
    currentLoadId++;
    const loadId = currentLoadId;
    const previousAnimation = sidebar?.getSelectedAnimation() ?? '';
    const previousAnimationName = sidebar?.getSelectedAnimationText() || '';
    const { files, selectedDir, selectedScene } = appState.directories;
    if (!files || !selectedDir) return;
    const scenes = files[selectedDir];
    if (!scenes || scenes.length === 0) return;
    const fileNames = scenes[selectedScene];
    let renderer = await preloadManager.consumePreloaded(selectedDir, fileNames);
    if (renderer) {
      if (typeof renderer.activate === 'function') {
        renderer.activate();
      }
      const oldRenderer = getRenderer();
      if (oldRenderer && oldRenderer !== renderer) {
        oldRenderer.dispose();
        const oldCanvas = oldRenderer.getCanvas();
        if (canvasContainer?.contains(oldCanvas) && oldCanvas !== renderer.getCanvas()) {
          canvasContainer.removeChild(oldCanvas);
        }
      }
    } else {
      const oldRenderer = getRenderer();
      if (oldRenderer) {
        oldRenderer.dispose();
        const oldCanvas = oldRenderer.getCanvas();
        if (canvasContainer?.contains(oldCanvas)) {
          canvasContainer.removeChild(oldCanvas);
        }
        setRenderer(null);
      }
      renderer = createRenderer(fileNames);
      loadingRenderers.push(renderer);
      if (renderer['setAlphaMode']) {
        renderer['setAlphaMode'](appState.alphaMode);
      }
      if (renderer.setTextureFilter) {
        renderer.setTextureFilter(appState.textureFilter);
      }
      try {
        await renderer.load(selectedDir, fileNames, { detectAlpha });
      } catch (e) {
        console.error(e);
        loadingRenderers = loadingRenderers.filter(r => r !== renderer);
        return;
      }
      if (loadId !== currentLoadId) {
        loadingRenderers = loadingRenderers.filter(r => r !== renderer);
        renderer.dispose();
        return;
      }
      loadingRenderers = loadingRenderers.filter(r => r !== renderer);
    }
    const canvas = renderer.getCanvas();
    if (canvasContainer && !canvasContainer.contains(canvas)) {
      canvasContainer.appendChild(canvas);
    }
    const detectedAlphaMode = renderer.getAlphaMode?.();
    if (detectAlpha && detectedAlphaMode) {
      if (detectedAlphaMode !== appState.alphaMode) {
        appState.alphaMode = detectedAlphaMode;
        saveSetting('spive2d_alpha_mode', detectedAlphaMode);
      }
    } else if (typeof renderer.setAlphaMode === 'function' && renderer.getAlphaMode && renderer.getAlphaMode() !== appState.alphaMode) {
      await renderer.setAlphaMode(appState.alphaMode);
    }
    setRenderer(renderer);
    const rendererCanvas = renderer.getCanvas();
    requestAnimationFrame(() => {
      if (typeof renderer['_revealCanvas'] !== 'function') rendererCanvas.style.opacity = '1';
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
    sidebar?.setSelectedExpression('');
    sidebar?.refreshProperties();
    const animations = renderer.getAnimations();
    const keepSetupPose = appState.initialized && previousAnimation === '';
    if (keepSetupPose) {
      sidebar?.setSelectedAnimation('');
      handleAnimationChange('');
    } else if (animations.length > 0) {
      let targetAnim = animations[0].value;
      let foundMatch = false;
      if (previousAnimationName) {
        const match = animations.find(a => a.name === previousAnimationName);
        if (match) {
          targetAnim = match.value;
          foundMatch = true;
        }
      }
      if (!foundMatch) {
        const idleMatch = findIdleAnimation(animations);
        if (idleMatch) {
          targetAnim = idleMatch.value;
        }
      }
      sidebar?.setSelectedAnimation(targetAnim);
      handleAnimationChange(targetAnim);
    } else {
      sidebar?.setSelectedAnimation('');
      handleAnimationChange('');
    }
    preloadManager.triggerPreload(selectedDir, scenes, selectedScene, { detectAlpha });
  }

  function disposeModel(clearPreload = true) {
    currentLoadId++;
    if (clearPreload) {
      preloadManager.clear();
    }
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

  function handleSceneChange(e) {
    appState.directories.selectedScene = Number(e.target.value);
    const previousSkins = getRenderer()?.getPropertyItems?.('skins')?.filter(item => item.checked).map(item => item.name) || [];
    disposeModel(false);
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
    if (sceneGridOpen) return;
    if (document.activeElement?.matches('input, textarea')) return;
    const key = e.key.toLowerCase();    
    if ((key === 'w' || key === 'q') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      getCurrentWindow().close();
      return;
    }
    if (e.key === shortcuts.toggleFullscreen) {
      e.preventDefault();
      toggleFullscreen();
      return;
    }
    if (e.key === 'Escape' && !dialogOpen) {
      exitFullscreen();
      return;
    }
    if (e.key !== shortcuts.toggleDialog && !appState.initialized) return;
    if (e.key === shortcuts.prevScene) { navigateScene(-1); }
    else if (e.key === shortcuts.nextScene) { navigateScene(1); }
    else if (e.key === shortcuts.prevAnim) { sidebar?.navigateAnimation(-1); }
    else if (e.key === shortcuts.nextAnim) { sidebar?.navigateAnimation(1); }
    else if (e.key === shortcuts.exportImage) { doExportImage(); }
    else if (e.key === shortcuts.exportImageSeq) { doExportImageSequence(); }
    else if (e.key === shortcuts.exportAnim) { doExportAnimation(); }
    else if (e.key === shortcuts.exportModel) { doExportModel(); }
    else if (e.key === shortcuts.toggleDialog) { toggleDialog(); }
    else if (e.key === shortcuts.addToList) {
      invoke('append_to_list', { text: getSceneText(), customDir: appState.exportDir || null }).then(() => {
        showNotification(t('addedToList'), 'success');
      });
    }
    else { return; }
    focusBody();
  }

  function navigateScene(delta) {
    const { files, selectedDir, selectedScene, sceneFilter } = appState.directories;
    const indices = filterSceneIndices(files[selectedDir] || [], sceneFilter);
    const pos = indices.indexOf(selectedScene);
    if (indices.length === 0 || (pos !== -1 && indices.length === 1)) return;
    let newPos;
    if (pos !== -1) {
      newPos = (pos + delta + indices.length) % indices.length;
    } else if (delta > 0) {
      newPos = Math.max(0, indices.findIndex(i => i > selectedScene));
    } else {
      newPos = indices.findLastIndex(i => i < selectedScene);
      if (newPos === -1) newPos = indices.length - 1;
    }
    handleSceneChange({ target: { value: indices[newPos] }});
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
    let animText = sidebar?.getSelectedAnimationText() || '';
    if (!animText && sidebar) {
      animText = sidebar.getSelectedExpressionText() || '';
    }
    exportImage(sceneText, animText);
  }

  function doExportAnimation() {
    if (getRenderer()?.rendererType === 'layered') {
      return;
    }
    const sceneText = getSceneText();
    const animText = sidebar?.getSelectedAnimationText() || '';
    const animValue = sidebar?.getSelectedAnimation?.() || '';
    const exprValue = sidebar?.getSelectedExpression?.() || '';
    exportAnimation(sceneText, animText, animValue, exprValue);
  }

  function doExportModel() {
    exportModelFiles(getSceneText());
  }

  async function doExportImageSequence() {
    if (getRenderer()?.rendererType === 'layered') {
      return;
    }
    const sceneText = getSceneText();
    const animText = sidebar?.getSelectedAnimationText() || '';
    const animValue = sidebar?.getSelectedAnimation?.() || '';
    const safeName = animText ? animText.split('.')[0] : 'sequence';
    const exportBaseDir = await getExportDirectory();
    const folderName = `${sceneText}_${safeName}`;
    const targetDir = await join(exportBaseDir, folderName);
    try {
      await mkdir(targetDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create export directory:', err);
    }
    const exprValue = sidebar?.getSelectedExpression?.() || '';
    exportImageSequence(targetDir, sceneText, animText, animValue, exprValue);
  }

  function getSceneText() {
    const scenes = appState.directories.files?.[appState.directories.selectedDir] || [];
    const currentSceneStr = scenes.length > 0 && appState.directories.selectedScene >= 0 && appState.directories.selectedScene < scenes.length ? scenes[appState.directories.selectedScene].name : '';
    return currentSceneStr ? currentSceneStr.split('/').filter(Boolean).pop().replace(/^\u200B/, '') : 'scene';
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

<div use:transformAction={{ appState, sidebar, animController, dialogOpen: dialogOpen || sceneGridOpen }}>
  <SettingsDialog bind:open={dialogOpen} onPathSelected={processPath} onShortcutsChanged={refreshShortcuts} />
  <Sidebar
    bind:this={sidebar}
    onSceneChange={handleSceneChange}
    onAnimationChange={handleAnimationChange}
    onExpressionChange={handleExpressionChange}
    onSettingsClick={() => dialogOpen = true}
    onSceneGridClick={() => sceneGridOpen = true}
  />
  <SceneThumbnailGrid bind:open={sceneGridOpen} onSelect={(index) => handleSceneChange({ target: { value: index } })} />
  <div id="canvasContainer" bind:this={canvasContainer}></div>
</div>

<AnimationController bind:this={animController} />

<ExportQueue />
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
