import { SpineRendererBase } from './SpineRendererBase.js';
import { SpineVersionManager } from './SpineVersionManager.js';
import { showNotification } from '../notificationStore.svelte.js';

export class SpineRenderer extends SpineRendererBase {
  #requestId = undefined;
  #lastFrameTime = 0;
  #onFirstRender = null;
  #firstRender = true;

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

  async load(dirName, scene) {
    this.dispose();
    this._canvas.style.display = 'block';
    const { version, isJson } = await SpineVersionManager.detectVersion(dirName, scene);
    this._spine = SpineVersionManager.getLib(version);
    if (!this._spine) {
      const msg = `Spine library for version ${version} not loaded.`;
      showNotification(msg, 'error');
      throw new Error(msg);
    }
    const dpr = window.devicePixelRatio || 1;
    this._canvas.width = Math.round(window.innerWidth * dpr);
    this._canvas.height = Math.round(window.innerHeight * dpr);
    this._canvas.style.width = `${window.innerWidth}px`;
    this._canvas.style.height = `${window.innerHeight}px`;
    await this.initCtx(this._alphaMode);
    await this.loadAssets(dirName, scene, isJson);
    await this._waitForAssets();
    await this.processLoadedAssets();
  }

  async _waitForAssets() {
    await super._waitForAssets();
    this.#lastFrameTime = Date.now() / 1000;
    if (!this.isExport && !this._paused) {
      if (!this.#requestId) {
        this.#requestId = requestAnimationFrame(() => this.#renderLoop());
      }
    } else if (this.isExport) {
      this.#triggerFirstRender();
    }
  }

  async setAlphaMode(mode) {
    await super.setAlphaMode(mode);
    this.#lastFrameTime = Date.now() / 1000;
    if (this.isExport) {
      this.#triggerFirstRender();
    }
  }

  #renderLoop() {
    this.#requestId = undefined;
    if (this._paused || this.isExport) return;
    const now = Date.now() / 1000;
    const delta = now - this.#lastFrameTime;
    this.#lastFrameTime = now;
    this.render(delta, { dpr: window.devicePixelRatio || 1 });
    if (this.#firstRender) {
      this.#firstRender = false;
      this.#triggerFirstRender();
    }
    this.#requestId = requestAnimationFrame(() => this.#renderLoop());
  }

  #triggerFirstRender() {
    if (this.#onFirstRender) {
      this.#onFirstRender();
      this.#onFirstRender = null;
    }
  }

  render(delta = 0, options = {}) {
    super.render(delta, options);
  }

  seekAnimation(progress) {
    super.seekAnimation(progress);
    this.render(0, { dpr: window.devicePixelRatio || 1 });
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

  dispose() {
    if (this.#requestId) {
      cancelAnimationFrame(this.#requestId);
      this.#requestId = undefined;
    }
    super.dispose();
  }
}
