import { createRenderer } from './createRenderer.js';
import { appState } from '../appState.svelte.js';

class PreloadManager {
  #preloaded = null;
  #loadingPromise = null;
  #loadingKey = '';
  #loadingRenderer = null;
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
    const key = this.getKey(dirName, nextScene);
    if (this.#preloaded?.key === key) return;
    this.clear();
    const loadId = ++this.#currentLoadId;
    const renderer = createRenderer(nextScene);
    if ('setAlphaMode' in renderer) {
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
        if (this.#currentLoadId === loadId) {
          console.warn('[PreloadManager] Failed to preload next scene:', err);
        }
        renderer.dispose();
      } finally {
        if (this.#currentLoadId === loadId) {
          this.#loadingPromise = null;
          this.#loadingKey = '';
          this.#loadingRenderer = null;
        }
      }
    })();
    this.#loadingPromise = loadingPromise;
    this.#loadingKey = key;
    this.#loadingRenderer = renderer;
  }

  async consumePreloaded(dirName, scene) {
    const key = this.getKey(dirName, scene);
    if (!key) return null;
    if (this.#loadingPromise && this.#loadingKey === key) {
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
    if (this.#loadingRenderer) {
      try {
        if (typeof this.#loadingRenderer.abort === 'function') this.#loadingRenderer.abort();
        else this.#loadingRenderer.dispose();
      } catch (e) {
        console.error('[PreloadManager] Error aborting preload:', e);
      }
    }
    this.#loadingRenderer = null;
    this.#loadingPromise = null;
    this.#loadingKey = '';
  }
}

export const preloadManager = new PreloadManager();
