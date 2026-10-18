import { SpineRendererBase } from './SpineRendererBase.js';
import { SpineVersionManager } from './SpineVersionManager.js';
import { installWorkerTextureLoader } from './workerTextureLoader.js';
import { showNotification } from '../notificationStore.svelte.js';

export class SpineRenderer extends SpineRendererBase {
  #requestId = undefined;
  #lastFrameTime = 0;
  #isPreload = false;
  #aborted = false;

  constructor(isExport = false) {
    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    canvas.style.verticalAlign = 'top';
    canvas.style.opacity = '0';
    super(canvas, null, isExport);
  }

  getCanvas() {
    return this._canvas;
  }

  async load(dirName, scene, options = {}) {
    const reuseContext = typeof options === 'boolean' ? false : !!options?.reuseContext;
    if (reuseContext && this._ctx) {
      this.#cancelRenderLoop();
      this._releaseScene();
    } else {
      this.dispose();
    }
    this.#isPreload = typeof options === 'boolean' ? false : !!options?.isPreload;
    this._thumbnail = typeof options === 'boolean' ? false : !!options?.thumbnail;
    this._canvas.style.display = this.#isPreload ? 'none' : 'block';
    await SpineVersionManager.init();
    this.#throwIfAborted();
    const { version, isJson, path, data } = await SpineVersionManager.detectVersion(dirName, scene);
    this.#throwIfAborted();
    const spine = SpineVersionManager.getLib(version);
    if (!spine) {
      const msg = `Spine library for version ${version} not loaded.`;
      showNotification(msg, 'error');
      throw new Error(msg);
    }
    if (this._ctx && this._spine !== spine) this.dispose();
    this._spine = spine;
    this.spineVersion = version;
    this._prefetched = { path, data };
    const canvasSize = typeof options === 'boolean' ? undefined : options?.canvasSize;
    if (canvasSize) {
      this._canvas.width = canvasSize;
      this._canvas.height = canvasSize;
    } else {
      const dpr = window.devicePixelRatio || 1;
      this._canvas.width = Math.round(window.innerWidth * dpr);
      this._canvas.height = Math.round(window.innerHeight * dpr);
      this._canvas.style.width = `${window.innerWidth}px`;
      this._canvas.style.height = `${window.innerHeight}px`;
    }
    if (this._ctx) {
      this._setAlphaMode(this._alphaMode);
      const gl = this._ctx.gl;
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._effectiveAlphaMode === 'unpack');
    } else {
      await this.initCtx(this._alphaMode);
    }
    this.#throwIfAborted();
    this._detectAlphaOnLoad = typeof options === 'boolean' ? options : !!options?.detectAlpha;
    await this.loadAssets(dirName, scene, isJson);
    await this._waitForAssets();
    this.#throwIfAborted();
    await this.processLoadedAssets();
    this.#throwIfAborted();
  }

  abort() {
    this.#aborted = true;
    this.#cancelRenderLoop();
    if (this._ctx) this._releaseScene();
    this.dispose();
  }

  #throwIfAborted() {
    if (this.#aborted) throw new Error('Load aborted');
  }

  activate() {
    this.#isPreload = false;
    this._canvas.style.display = 'block';
    this.#lastFrameTime = Date.now() / 1000;
    if (!this.isExport && !this._paused && !this.#requestId) {
      this.#requestId = requestAnimationFrame(() => this.#renderLoop());
    }
    if (typeof this._revealCanvas === 'function') {
      this._revealCanvas();
    } else {
      this._canvas.style.opacity = '1';
    }
  }

  async _waitForAssets() {
    await super._waitForAssets();
    this.#lastFrameTime = Date.now() / 1000;
    if (!this.isExport && !this._paused && !this.#requestId && !this.#isPreload) {
      this.#requestId = requestAnimationFrame(() => this.#renderLoop());
    }
  }

  _installTextureLoader(assetManager) {
    installWorkerTextureLoader(assetManager, {
      premultiply: this._effectiveAlphaMode === 'unpack',
      probeAlpha: this._detectAlphaOnLoad && this._alphaMode !== 'npm'
    });
  }

  async setAlphaMode(mode) {
    await super.setAlphaMode(mode);
    this.#lastFrameTime = Date.now() / 1000;
  }

  #renderLoop() {
    if (this._paused || this.isExport) {
      this.#requestId = undefined;
      return;
    }
    const now = Date.now() / 1000;
    const delta = now - this.#lastFrameTime;
    this.#lastFrameTime = now;
    this.render(delta, { dpr: window.devicePixelRatio || 1 });
    if (this._fitRevealReady) this._revealCanvas();
    this.#requestId = requestAnimationFrame(() => this.#renderLoop());
  }

  render(delta = 0, options = {}) {
    super.render(delta, options);
  }

  applyTransform(scale, moveX, moveY, rotate) {
    super.applyTransform(scale, moveX, moveY, rotate);
    if (this._paused) {
      this.render(0, { dpr: window.devicePixelRatio || 1 });
    }
  }

  seekAnimation(progress) {
    super.seekAnimation(progress);
    if (!this._thumbnail) this.render(0, { dpr: window.devicePixelRatio || 1 });
  }

  setPaused(paused) {
    const wasPaused = this._paused;
    super.setPaused(paused);
    if (wasPaused && !paused && !this.isExport) {
      this.#lastFrameTime = Date.now() / 1000;
      if (!this.#requestId) {
        this.#requestId = requestAnimationFrame(() => this.#renderLoop());
      }
    }
  }

  resumeFromProgress(progress) {
    this.seekAnimation(progress);
    this.setPaused(false);
  }

  resize(width, height) {
    if (this.isExport || !this._canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this._canvas.width = Math.round(width * dpr);
    this._canvas.height = Math.round(height * dpr);
    this._canvas.style.width = `${width}px`;
    this._canvas.style.height = `${height}px`;
    if (this._paused) {
      this.render(0, { dpr });
    }
  }

  #cancelRenderLoop() {
    if (this.#requestId) {
      cancelAnimationFrame(this.#requestId);
      this.#requestId = undefined;
    }
  }

  dispose() {
    this.#cancelRenderLoop();
    super.dispose();
  }
}
