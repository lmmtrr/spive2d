import { createRenderer } from './createRenderer.js';
import { appState } from '../appState.svelte.js';

function isLive2D(scene) {
  const ext = scene?.mainExt || '';
  return ext.includes('.moc') || ext.includes('.model3.json') || ext.includes('.model.json');
}

class PreloadManager {
  #preloaded = null;
  #loadingPromise = null;
  #currentLoadId = 0;

  getKey(dirName, scene) {
    if (!dirName || !scene) return '';
    const sceneName = typeof scene === 'string' ? scene : scene.name;
    return `${dirName}::${sceneName}`;
  }

  async triggerPreload(dirName, scenes, currentIndex, options = {}) {
    if (!dirName || !Array.isArray(scenes) || scenes.length <= 1) return;
    const nextIndex = (currentIndex + 1) % scenes.length;
    const nextScene = scenes[nextIndex];
    if (isLive2D(nextScene)) {
      this.clear();
      return;
    }
    const key = this.getKey(dirName, nextScene);
    if (this.#preloaded?.key === key) return;
    this.clear();
    const loadId = ++this.#currentLoadId;
    const renderer = createRenderer(nextScene);
    if (typeof renderer.setAlphaMode === 'function') {
      renderer.setAlphaMode(appState.alphaMode);
    }
    if (typeof renderer.setTextureFilter === 'function') {
      renderer.setTextureFilter(appState.textureFilter);
    }
    const isPreload = true;
    const detectAlpha = typeof options === 'boolean' ? options : !!options?.detectAlpha;
    const loadingPromise = (async () => {
      try {
        await renderer.load(dirName, nextScene, { detectAlpha, isPreload });
        if (this.#currentLoadId === loadId) {
          this.#preloaded = {
            key,
            dirName,
            sceneName: nextScene.name,
            renderer,
            detectAlpha
          };
        } else {
          renderer.dispose();
        }
      } catch (err) {
        console.warn('[PreloadManager] Failed to preload next Spine scene:', err);
        renderer.dispose();
      } finally {
        if (this.#currentLoadId === loadId) {
          this.#loadingPromise = null;
        }
      }
    })();
    this.#loadingPromise = loadingPromise;
  }

  async consumePreloaded(dirName, scene) {
    const key = this.getKey(dirName, scene);
    if (!key) return null;
    if (this.#loadingPromise) {
      await this.#loadingPromise;
    }
    if (this.#preloaded && this.#preloaded.key === key) {
      const { renderer } = this.#preloaded;
      this.#preloaded = null;
      return renderer;
    }
    this.clear();
    return null;
  }

  clear() {
    this.#currentLoadId++;
    if (this.#preloaded?.renderer) {
      try {
        this.#preloaded.renderer.dispose();
      } catch (e) {
        console.error('[PreloadManager] Error disposing preloaded renderer:', e);
      }
    }
    this.#preloaded = null;
    this.#loadingPromise = null;
  }
}

export const preloadManager = new PreloadManager();
