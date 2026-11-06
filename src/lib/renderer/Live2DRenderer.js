import { BaseRenderer } from './BaseRenderer.js';
import {
  getLive2DFrameBox,
  fitLive2DBox,
  resolveLive2DModelSource,
  canUpdateLive2DCore,
  getCubism2MotionEntry,
  pinCubism2MotionEntry,
  getLive2DMotionDuration,
  registerLive2DMotionFiles,
  applyLive2DTextureScaleMode,
  resolveScaleMode,
  toIdArray,
  getMotionEntries,
  getMotionCurves,
  patchCoreRenderOrders,
  patchCubism2CoreAccessors,
  installLive2DDrawableFilter,
  toLive2DOpacity,
  setLive2DAutomaticMovements,
  setLive2DPhysics,
  queueLive2DPhysicsDrag,
  applyLive2DEnginePatches,
  ensureLive2DRuntimeReady,
  getLive2DTextureUrls,
  withLive2DTextureLoad,
  retainLive2DTextures,
  releaseLive2DTextures,
  CUBISM2_TIME_BASE,
} from './Live2DCommon.js';
import { createSorter, findIdleAnimation } from '../utils.js';
import { toTriangles, toTriangleUvs, alphaMapOf, sampleAlpha, meshAlphaAt, PICK_ALPHA_THRESHOLD } from '../pick.js';
import { showNotification } from '../notificationStore.svelte.js';
import { appState } from '../appState.svelte.js';

const sortByText = createSorter(item => item.name);
const sortById = createSorter(item => item.id);
const MAX_DELTA_MS = 100;
const FIXED_STEP_MS = 1000 / 60;
const MAX_STEPS_PER_FRAME = 20;
const INFLUENCE_CHUNK_MS = 24;
const INFLUENCE_MOVE_EPSILON = 1e-4;
const INFLUENCE_OPACITY_EPSILON = 0.004;
const INFLUENCE_ORDER_SCORE = 1e-3;
const VISIBLE_OPACITY = 0.004;
const PARAMETER_KEY_STEPS = 50;

class PixiAppManager {
  static #sharedApp = null;
  static #sharedCanvas = null;
  static #readyPromise = null;
  static #usageCount = 0;

  static acquire() {
    if (!this.#readyPromise) {
      const cvs = document.createElement('canvas');
      cvs.style.display = 'none';
      cvs.style.verticalAlign = 'top';
      cvs.style.opacity = '0';
      this.#sharedCanvas = cvs;
      const app = new PIXI.Application();
      this.#readyPromise = app.init({
        canvas: cvs,
        preference: 'webgl',
        preserveDrawingBuffer: true,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        resizeTo: window,
        hello: false,
      }).then(() => {
        this.#sharedApp = app;
        return app;
      });
    }
    this.#usageCount++;
    return { canvas: this.#sharedCanvas, ready: this.#readyPromise };
  }

  static release() {
    this.#usageCount--;
    if (this.#usageCount === 0 && this.#readyPromise) {
      const pending = this.#readyPromise;
      this.#readyPromise = null;
      this.#sharedApp = null;
      this.#sharedCanvas = null;
      pending.then(app => app.destroy({ removeView: false }, { children: true })).catch(() => { });
    }
  }

  static get app() {
    return this.#sharedApp;
  }
}

export class Live2DRenderer extends BaseRenderer {
  #canvas;
  #app = null;
  #appReady;
  #contentBox = null;
  #model = null;
  #textureUrls = [];
  #drawableOpacities = new Map();
  #opacities = null;
  #currentMotion = { group: null, index: null };
  #speed = 1.0;
  #isExport = false;
  #animations = [];
  #disposed = false;
  #renderTexture = null;
  #captureContainer = null;
  #paused = false;
  #updateFn = null;
  #lastTime = 0;
  #initialPartOpacities = new Map();
  #initialParameterValues = new Map();
  #parameterIds = [];
  #partIds = [];
  #drawableIds = [];
  #partIndexByName = new Map();
  #originalIdleGroup = 'Idle';
  #pointerMoveHandler = null;
  #pointerLeaveHandler = null;
  #beforeModelUpdateHandler = null;
  #lastFrameParameters = null;
  #baseParameters = null;
  #accumulatedMS = 0;
  #cubism2ElapsedMS = 0;
  #cubism2TimeSeconds = 0;
  #focusPoint = new PIXI.Point();
  #parameterInfluence = null;
  #pickTextures = null;
  #influenceToken = null;

  constructor(isExport = false) {
    super(isExport);
    this.#isExport = isExport;
    const { canvas, ready } = PixiAppManager.acquire();
    this.#canvas = canvas;
    this.#appReady = ready.then(app => {
      if (!this.#disposed) this.#app = app;
      return app;
    });
  }

  getCanvas() {
    return this.#canvas;
  }

  async load(dirName, scene, options = {}) {
    const isPreload = typeof options === 'boolean' ? false : !!options?.isPreload;
    if (this.#disposed) return;
    await this.#appReady;
    if (this.#disposed) return;
    if (this.#updateFn && this.#app) {
      this.#app.ticker.remove(this.#updateFn);
      this.#updateFn = null;
    }
    if (this.#model) {
      this.#detachBeforeModelUpdate();
      if (!this.#isExport && this.#app && this.#app.stage) {
        this.#app.stage.removeChild(this.#model);
      }
      this.#destroyModel();
    }
    this.#lastFrameParameters = null;
    this.#baseParameters = null;
    if (!this.#isExport && this.#canvas && !isPreload) {
      this.#canvas.style.display = 'block';
    }
    const url = await resolveLive2DModelSource(dirName, scene);
    applyLive2DEnginePatches(PIXI);
    const { live2d: { Live2DModel } } = PIXI;
    try {
      await ensureLive2DRuntimeReady(PIXI);
      if (this.#disposed) return;
      PIXI.TextureSource.defaultOptions.scaleMode = resolveScaleMode(appState.textureFilter);
      let textureUrls = [];
      const model = await withLive2DTextureLoad(PIXI, async () => {
        const loaded = await Live2DModel.from(url, {
          autoHitTest: false,
          autoFocus: false,
          autoUpdate: false,
          ...(appState.enableIdle ? {} : { idleMotionGroup: 'None' })
        });
        textureUrls = getLive2DTextureUrls(loaded);
        retainLive2DTextures(textureUrls);
        return loaded;
      });
      if (this.#disposed || !this.#app) {
        model.destroy();
        releaseLive2DTextures(PIXI, textureUrls);
        return;
      }
      this.#model = model;
      this.#textureUrls = textureUrls;
      registerLive2DMotionFiles(model, scene?.motionFiles);
      if (typeof window !== 'undefined' && window.Live2D && window.Live2D.setGL && this.#app?.renderer?.gl) {
        window.Live2D.setGL(this.#app.renderer.gl);
      }
      this.setTextureFilter(appState.textureFilter);
      this.#originalIdleGroup = model.internalModel?.motionManager?.groups?.idle || 'Idle';
      setLive2DAutomaticMovements(model.internalModel, appState.enableBreathing, appState.enableBlinking);
      setLive2DPhysics(model.internalModel, appState.enablePhysics);
      this.#initialPartOpacities.clear();
      this.#initialParameterValues.clear();
      this.#drawableOpacities.clear();
      this.#opacities = null;
      this.#resetParameterInfluence();
      this.#pickTextures = null;
      const coreModel = model.internalModel?.coreModel;
      patchCubism2CoreAccessors(coreModel);
      this.#cacheModelIds(coreModel);
      if (coreModel) {
        patchCoreRenderOrders(coreModel);
        this.#partIds.forEach((name, index) => {
          this.#initialPartOpacities.set(name, coreModel.getPartOpacityByIndex(index));
        });
        this.#parameterIds.forEach((id, idx) => {
          this.#initialParameterValues.set(idx, coreModel._parameterValues[idx]);
        });
      }
      const { innerWidth: w, innerHeight: h } = window;
      model.anchor.set(0.5, 0.5);
      this.#contentBox = null;
      const { baseScale, dx, dy } = this.#fit(w, h);
      model.scale.set(baseScale);
      model.position.set(w * 0.5 - dx * baseScale, h * 0.5 - dy * baseScale);
      if (isPreload) {
        model.visible = false;
      }
      if (!this.#isExport && this.#app && this.#app.stage) {
        this.#app.stage.addChild(model);
      }
      const animations = options?.thumbnail
        ? await this.#findThumbnailAnimation()
        : await this.#filterAnimations(isPreload ? 1 : Infinity);
      if (this.#disposed || !this.#model) return;
      this.#animations = animations;
      if (animations.length > 0) {
        await this.setAnimation(animations[0].value);
      }
      if (this.#disposed || !this.#model) return;
      this.#model.automator.autoUpdate = false;
      this.#model.deltaTime = 0;
      this.#lastTime = performance.now();
      this.#accumulatedMS = 0;
      this.#beforeModelUpdateHandler = () => {
        this.#applyOverrides();
        this.#saveParameterSnapshot();
      };
      this.#model.internalModel.on('beforeModelUpdate', this.#beforeModelUpdateHandler);
      this.#updateFn = () => {
        if (this.#disposed || !this.#model) return;
        const internalModel = this.#model.internalModel;
        if (!internalModel) return;
        this.#model.deltaTime = 0;
        if (this.#paused) return;
        setLive2DAutomaticMovements(internalModel, appState.enableBreathing, appState.enableBlinking);
        setLive2DPhysics(internalModel, appState.enablePhysics);
        if (internalModel.motionManager && internalModel.motionManager.groups) {
          internalModel.motionManager.groups.idle = appState.enableIdle ? this.#originalIdleGroup : 'None';
        }
        if (!appState.enableMouseTracking && internalModel.focusController) {
          if (internalModel.focusController.targetX !== 0 || internalModel.focusController.targetY !== 0) {
            internalModel.focusController.focus(0, 0);
          }
        }
        const now = performance.now();
        const elapsedMS = Math.min(now - this.#lastTime, MAX_DELTA_MS);
        this.#lastTime = now;
        this.#accumulatedMS += elapsedMS * this.#speed;
        const stepMS = this.#stepSizeMS();
        let steps = 0;
        while (this.#accumulatedMS >= stepMS && steps < MAX_STEPS_PER_FRAME) {
          this.#stepModel(stepMS);
          this.#accumulatedMS -= stepMS;
          steps++;
        }
        if (steps === MAX_STEPS_PER_FRAME) this.#accumulatedMS = 0;
      };
      if (!isPreload) {
        this.#app.ticker.add(this.#updateFn);
        if (!this.#isExport) {
          this.#attachPointerListeners();
        }
      }
      model._spive2dSpeed = this.#speed;
      this.#hideMaskMosaicDrawables();
      this.#setupDrawableOpacitiesProxy();
    } catch (err) {
      showNotification("Live2DRenderer Error: " + (err.message || err), 'error');
      console.error(err);
    }
  }

  activate() {
    if (this.#disposed) return;
    if (!this.#isExport && this.#canvas) {
      this.#canvas.style.display = 'block';
      this.#canvas.style.opacity = '1';
    }
    if (this.#model) {
      this.#model.visible = true;
      this.resetTransform();
    }
    if (this.#updateFn && this.#app) {
      this.#lastTime = performance.now();
      this.#accumulatedMS = 0;
      this.#app.ticker.remove(this.#updateFn);
      this.#app.ticker.add(this.#updateFn);
    }
    if (!this.#isExport) {
      this.#attachPointerListeners();
    }
  }

  #attachPointerListeners() {
    this.#detachPointerListeners();
    this.#pointerMoveHandler = (e) => {
      if (appState.enableMouseTracking && this.#model) {
        this.#focusAt(e.clientX, e.clientY);
      }
    };
    this.#pointerLeaveHandler = () => {
      if (this.#model?.internalModel?.focusController) {
        this.#model.internalModel.focusController.focus(0, 0);
      }
    };
    window.addEventListener('pointermove', this.#pointerMoveHandler);
    window.addEventListener('pointerleave', this.#pointerLeaveHandler);
    document.addEventListener('mouseleave', this.#pointerLeaveHandler);
  }

  #detachPointerListeners() {
    if (this.#pointerMoveHandler) {
      window.removeEventListener('pointermove', this.#pointerMoveHandler);
      this.#pointerMoveHandler = null;
    }
    if (this.#pointerLeaveHandler) {
      window.removeEventListener('pointerleave', this.#pointerLeaveHandler);
      document.removeEventListener('mouseleave', this.#pointerLeaveHandler);
      this.#pointerLeaveHandler = null;
    }
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#detachPointerListeners();
    if (this.#updateFn && this.#app) {
      this.#app.ticker.remove(this.#updateFn);
      this.#updateFn = null;
    }
    if (this.#model) {
      this.#detachBeforeModelUpdate();
      if (!this.#isExport && this.#app && this.#app.stage) {
        this.#app.stage.removeChild(this.#model);
      }
      this.#destroyModel();
    }
    this.#lastFrameParameters = null;
    this.#baseParameters = null;
    this.#contentBox = null;
    this.#opacities = null;
    this.#resetParameterInfluence();
    this.#pickTextures = null;
    if (this.#renderTexture) {
      this.#renderTexture.destroy(true);
      this.#renderTexture = null;
    }
    if (this.#captureContainer) {
      this.#captureContainer.destroy({ children: false });
      this.#captureContainer = null;
    }
    PixiAppManager.release();
    this.#app = null;
  }

  resize(width, height) {
    if (this.#isExport || !this.#app) return;
    this.#app.renderer.resize(width, height);
  }

  #cacheModelIds(coreModel) {
    this.#parameterIds = toIdArray(coreModel?._parameterIds);
    this.#partIds = toIdArray(coreModel?._partIds);
    this.#drawableIds = toIdArray(coreModel?._drawableIds);
    this.#partIndexByName = new Map(this.#partIds.map((name, index) => [name, index]));
  }

  #setPartOpacity(coreModel, name, opacity) {
    const index = this.#partIndexByName.get(name);
    if (index === undefined) return;
    coreModel.setPartOpacityByIndex(index, opacity);
  }

  #getContentBox() {
    if (this.#contentBox) return this.#contentBox;
    const internalModel = this.#model?.internalModel;
    if (!internalModel) return null;
    const box = getLive2DFrameBox(internalModel);
    if (!box) {
      return { x: 0, y: 0, width: internalModel.originalWidth, height: internalModel.originalHeight };
    }
    this.#contentBox = box;
    return this.#contentBox;
  }

  #fit(viewWidth, viewHeight, marginX = 0, marginY = 0) {
    return fitLive2DBox(this.#model?.internalModel, this.#getContentBox(), viewWidth, viewHeight, marginX, marginY);
  }

  getOriginalSize() {
    if (!this.#model) return { width: 0, height: 0 };
    const { originalWidth, originalHeight } = this.#model.internalModel;
    const box = this.#getContentBox();
    if (!box || !(box.width > 0) || !(box.height > 0)) {
      return { width: Math.round(originalWidth), height: Math.round(originalHeight) };
    }
    const fit = Math.min(originalWidth / box.width, originalHeight / box.height);
    return { width: Math.round(box.width * fit), height: Math.round(box.height * fit) };
  }

  getFrameSize() {
    const box = this.#getContentBox();
    if (!box) return this.getOriginalSize();
    return { width: Math.round(box.width), height: Math.round(box.height) };
  }

  applyTransform(scale, moveX, moveY, rotate) {
    const previous = { scale: this._scale, moveX: this._moveX, moveY: this._moveY, rotate: this._rotate };
    super.applyTransform(scale, moveX, moveY, rotate);
    if (!this.#model) return;
    const { innerWidth: w, innerHeight: h } = window;
    const { baseScale, dx, dy } = this.#fit(w, h);
    const s = baseScale * scale;
    this.#model.scale.set(s);
    this.#model.position.set(w * 0.5 - dx * s + moveX, h * 0.5 - dy * s + moveY);
    this.#model.rotation = (rotate * Math.PI) / 180;
    if (previous.scale === scale && previous.rotate === rotate) {
      this.#queuePhysicsDrag(moveX - (previous.moveX || 0), moveY - (previous.moveY || 0));
    }
  }

  #queuePhysicsDrag(screenX, screenY) {
    if ((!screenX && !screenY) || this.#paused) return;
    const model = this.#model;
    const internalModel = model?.internalModel;
    const scale = model?.scale?.x;
    const height = this.#getContentBox()?.height || internalModel?.originalHeight;
    if (!internalModel || !(scale > 0) || !(height > 0)) return;
    const cos = Math.cos(-model.rotation);
    const sin = Math.sin(-model.rotation);
    const localX = (screenX * cos - screenY * sin) / scale / height;
    const localY = (screenX * sin + screenY * cos) / scale / height;
    queueLive2DPhysicsDrag(internalModel, localX, localY);
  }

  resetTransform(width = window.innerWidth, height = window.innerHeight) {
    super.resetTransform();
    if (!this.#model) return;
    const { baseScale, dx, dy } = this.#fit(width, height);
    this.#model.scale.set(baseScale);
    this.#model.position.set(width * 0.5 - dx * baseScale, height * 0.5 - dy * baseScale);
    this.#model.rotation = 0;
  }

  captureFrame(width, height, options = {}) {
    if (!this.#model || !this.#app) return null;
    width = Math.round(width);
    height = Math.round(height);
    const originalScale = this.#model.scale.clone();
    const originalPosition = this.#model.position.clone();
    const originalRotation = this.#model.rotation;
    const originalVisible = this.#model.visible;
    this.#model.visible = true;
    const marginX = options.marginX || 0;
    const marginY = options.marginY || 0;
    if (options.ignoreTransform) {
      const { baseScale, dx, dy } = this.#fit(width, height, marginX, marginY);
      this.#model.scale.set(baseScale);
      this.#model.position.set(width * 0.5 - dx * baseScale, height * 0.5 - dy * baseScale);
      this.#model.rotation = 0;
    } else {
      const userScale = this._scale || 1;
      const userMoveX = this._moveX || 0;
      const userMoveY = this._moveY || 0;
      const userRotate = this._rotate || 0;
      const { baseScale, dx, dy } = this.#fit(width, height, marginX, marginY);
      const screenBaseScale = this.#fit(window.innerWidth, window.innerHeight).baseScale;
      const scaleFactor = baseScale / screenBaseScale;
      const s = baseScale * userScale;
      this.#model.scale.set(s);
      this.#model.position.set(
        width * 0.5 - dx * s + userMoveX * scaleFactor,
        height * 0.5 - dy * s + userMoveY * scaleFactor
      );
      this.#model.rotation = (userRotate * Math.PI) / 180;
    }
    if (!this.#renderTexture ||
      this.#renderTexture.width !== width ||
      this.#renderTexture.height !== height) {
      if (this.#renderTexture) this.#renderTexture.destroy(true);
      this.#renderTexture = PIXI.RenderTexture.create({ width, height });
    }
    const wasOnStage = this.#model.parent === this.#app.stage;
    if (!this.#captureContainer) this.#captureContainer = new PIXI.Container();
    this.#captureContainer.addChild(this.#model);
    this.#app.renderer.render({ container: this.#captureContainer, target: this.#renderTexture });
    const canvas = this.#app.renderer.extract.canvas(this.#renderTexture);
    this.#captureContainer.removeChild(this.#model);
    if (wasOnStage) this.#app.stage.addChild(this.#model);
    this.#model.scale.copyFrom(originalScale);
    this.#model.position.copyFrom(originalPosition);
    this.#model.rotation = originalRotation;
    this.#model.visible = originalVisible;
    return canvas;
  }

  getAnimations() {
    return this.#animations;
  }

  async #filterAnimations(concurrency) {
    if (!this.#model) return [];
    const motions = this.#model.internalModel.motionManager.definitions;
    if (!motions) return [];
    const motionManager = this.#model.internalModel.motionManager;
    const entries = Object.entries(motions).flatMap(([groupName, anims]) =>
      anims.map((anim, i) => ({ groupName, anim, i }))
    );
    const result = [];
    let next = 0;
    const worker = async () => {
      while (next < entries.length) {
        if (this.#disposed || !this.#model || !this.#model.internalModel) return;
        const { groupName, anim, i } = entries[next++];
        try {
          const motion = await motionManager.loadMotion(groupName, i);
          if (getLive2DMotionDuration(motion) > 0) {
            result.push({
              name: (anim.file || anim.File || '').split('/').pop(),
              value: `${groupName},${i}`,
            });
          }
        } catch (e) {
          console.error(`Failed to load motion ${groupName},${i}:`, e);
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, worker));
    if (this.#disposed || !this.#model || !this.#model.internalModel) return [];
    return result.sort(sortByText);
  }

  async #findThumbnailAnimation() {
    if (!this.#model) return [];
    const motions = this.#model.internalModel.motionManager.definitions;
    if (!motions) return [];
    let candidates = Object.entries(motions)
      .flatMap(([groupName, anims]) => anims.map((anim, i) => ({
        name: (anim.file || anim.File || '').split('/').pop(),
        value: `${groupName},${i}`,
      })))
      .sort(sortByText);
    while (candidates.length > 0) {
      const candidate = findIdleAnimation(candidates) || candidates[0];
      candidates = candidates.filter(item => item !== candidate);
      const [groupName, index] = candidate.value.split(',');
      try {
        const motion = await this.#model.internalModel.motionManager.loadMotion(groupName, Number(index));
        if (this.#disposed || !this.#model || !this.#model.internalModel) return [];
        if (getLive2DMotionDuration(motion) > 0) return [candidate];
      } catch (e) {
        console.error(`Failed to load motion ${groupName},${index}:`, e);
      }
    }
    return [];
  }

  async setAnimation(value) {
    if (this.#disposed || !this.#model) return;
    if (value === '') {
      this.#currentMotion = { group: null, index: null };
      this.#cubism2ElapsedMS = 0;
      this.#cubism2TimeSeconds = 0;
      window.UtSystem?.setUserTimeMSec?.(0);
      if (this.#model.internalModel && this.#model.internalModel.motionManager) {
        this.#model.internalModel.motionManager.stopAllMotions();
      }
      const coreModel = this.#model.internalModel?.coreModel;
      if (coreModel) {
        this.#parameterIds.forEach((id, idx) => {
          const initialVal = this.#initialParameterValues.get(idx);
          if (initialVal !== undefined) {
            coreModel._parameterValues[idx] = initialVal;
          }
        });
        this.#partIds.forEach((name) => {
          const initialVal = this.#initialPartOpacities.get(name);
          if (initialVal !== undefined) {
            this.#setPartOpacity(coreModel, name, initialVal);
          }
        });
        this.#saveParameterSnapshot();
      }
      return;
    }
    const [group, index] = value.split(',');
    this.#currentMotion = { group, index: Number(index) };
    this.#cubism2ElapsedMS = 0;
    this.#cubism2TimeSeconds = 0;
    try {
      await this.#model.motion(group, Number(index), 3);
    } catch (e) {
      console.error('Failed to set animation:', e);
    }
  }

  getExpressions() {
    if (!this.#model) return null;
    const expressions = this.#model.internalModel.motionManager.expressionManager?.definitions;
    if (!expressions) return null;
    return [
      { name: 'Default', value: '' },
      ...expressions
        .map((expr, i) => ({
          name: (expr.file || expr.File || '').split('/').pop(),
          value: String(i),
        }))
        .sort(sortByText),
    ];
  }

  setExpression(value) {
    if (!this.#model) return;
    if (value === '') {
      this.#model.internalModel.motionManager.expressionManager?.resetExpression();
    } else {
      this.#model.expression(Number(value));
    }
  }

  getPropertyCategories() {
    return ['parameters', 'parts', 'drawables'];
  }

  getPropertyItems(category) {
    if (!this.#model) return [];
    const coreModel = this.#model.internalModel.coreModel;
    if (category === 'parameters') {
      return this.#parameterIds
        .map((id, index) => ({
          name: id,
          id,
          index,
          type: 'range',
          max: coreModel._parameterMaximumValues[index],
          min: coreModel._parameterMinimumValues[index],
          value: coreModel._parameterValues[index],
          step: (coreModel._parameterMaximumValues[index] - coreModel._parameterMinimumValues[index]) / 100,
          overridden: this.parameterOverrides.has(index),
        }))
        .sort(sortById);
    }
    if (category === 'parts') {
      return this.#partIds
        .map((name, index) => ({
          name,
          index,
          type: 'range',
          min: 0,
          max: 1,
          step: 0.01,
          value: coreModel.getPartOpacityByIndex(index),
          overridden: this.partOverrides.has(name),
        }))
        .sort(sortByText);
    }
    if (category === 'drawables') {
      return this.#drawableIds
        .map((name, index) => ({
          name,
          index,
          type: 'range',
          min: 0,
          max: 1,
          step: 0.01,
          value: this.#getDrawableOpacity(index),
          overridden: this.drawableOverrides.has(index),
        }))
        .sort(sortByText);
    }
    return [];
  }

  #getDrawableOpacity(index) {
    return this.#drawableOpacities.get(index) ?? 1;
  }

  #setDrawableOpacity(index, opacity) {
    if (opacity === 1) this.#drawableOpacities.delete(index);
    else this.#drawableOpacities.set(index, opacity);
  }

  #defaultDrawableOpacity(index) {
    return this.#drawableIds[index]?.includes('Mosaic') ? 0 : 1;
  }

  pickTargets(x, y, category) {
    if (category === 'parameters') return this.#pickParameters(x, y);
    return this.#pickShapes(x, y, category);
  }

  #pickShapes(x, y, category) {
    const model = this.#model;
    const internalModel = model?.internalModel;
    const coreModel = internalModel?.coreModel;
    if (!coreModel || this.#isExport) return [];
    const byPart = category === 'parts';
    const local = model.toModelPosition(new PIXI.Point(x, y));
    const isCubism2 = typeof coreModel.getDrawableVertexIndices !== 'function';
    const orders = isCubism2 ? null : coreModel.getDrawableRenderOrders?.();
    const context = isCubism2 ? coreModel.getModelContext?.() : null;
    const drawList = context?._$aS ?? null;
    const indicesOf = (i) => (isCubism2 ? coreModel.getIndexArray?.(i) : coreModel.getDrawableVertexIndices(i));
    let latestDraw = -Infinity;
    if (drawList) {
      for (const drawData of drawList) latestDraw = Math.max(latestDraw, drawData?.__spive2dDrawTime ?? -Infinity);
    }
    const partHidden = (part) => this.partOverrides.get(this.#partIds[part]) === 0;
    const parentPartOf = (part) => (isCubism2 ? -1 : coreModel._model?.parts?.parentIndices?.[part] ?? -1);
    const partOfDrawable = (i) =>
      isCubism2
        ? context?._$8b?.[i]?._$IP ?? -1
        : coreModel.getDrawableParentPartIndex?.(i) ?? coreModel._model?.drawables?.parentPartIndices?.[i] ?? -1;
    const targetPartOf = (i) => {
      const parent = partOfDrawable(i);
      for (let part = parent, guard = 0; part >= 0 && guard < 256; part = parentPartOf(part), guard++) {
        if (partHidden(part)) return part;
      }
      return parent;
    };
    const stateOf = (i) => {
      const drawableHidden = this.#getDrawableOpacity(i) === 0;
      const part = byPart ? targetPartOf(i) : -1;
      if (byPart && (part < 0 || drawableHidden)) return null;
      const userHidden = byPart ? partHidden(part) : drawableHidden;
      let visible;
      let order;
      if (drawList) {
        const drawData = drawList[i];
        if (!(drawData?.__spive2dDrawTime >= latestDraw - 4)) return null;
        visible = !userHidden && (drawData.__spive2dPartsOpacity ?? 1) > 0;
        order = drawData.__spive2dDrawSeq;
      } else {
        if (!userHidden && coreModel.getDrawableDynamicFlagIsVisible?.(i) === false) return null;
        visible = !userHidden && coreModel.getDrawableOpacity(i) > 0.004;
        order = orders ? orders[i] : i;
      }
      if (!visible && !userHidden) return null;
      return { part, order, hidden: !visible };
    };
    const textures = this.#getPickTextures();
    const alphaAt = (i) => meshAlphaAt(internalModel.getDrawableVertices(i), indicesOf(i), textures.uvsOf(i), textures.textureOf(i), textures.flipV, local.x, local.y);
    const covers = (i) => {
      if (alphaAt(i) <= PICK_ALPHA_THRESHOLD) return false;
      const masks = textures.masksOf(i);
      if (!masks) return true;
      return masks.some((m) => alphaAt(m) > PICK_ALPHA_THRESHOLD) !== textures.invertedOf(i);
    };
    const hits = new Map();
    for (let i = 0; i < this.#drawableIds.length; i++) {
      const state = stateOf(i);
      if (!state) continue;
      const key = byPart ? state.part : i;
      const existing = hits.get(key);
      if (existing && existing.order >= state.order) continue;
      if (!covers(i)) continue;
      hits.set(key, { key, order: state.order, hidden: state.hidden });
    }
    const sorted = [...hits.values()].sort((a, b) => b.order - a.order);
    const drawablesOfPart = (part) => {
      const result = [];
      for (let i = 0; i < this.#drawableIds.length; i++) if (stateOf(i)?.part === part) result.push(i);
      return result;
    };
    const screen = (drawables) => this.#screenTriangles(drawables);
    const chunks = (drawables) => this.#screenChunks(drawables);
    return sorted.map(({ key, hidden }) => {
      let triangles = null;
      let textured = null;
      let members = null;
      const membersOf = () => (members ??= byPart ? drawablesOfPart(key) : [key]);
      return {
        id: byPart ? `part:${key}` : key,
        name: byPart ? this.#partIds[key] : this.#drawableIds[key],
        hidden,
        get triangles() {
          return (triangles ??= screen(membersOf()));
        },
        get textured() {
          return (textured ??= chunks(membersOf()));
        },
      };
    });
  }

  #screenMapper() {
    const model = this.#model;
    const internalModel = model.internalModel;
    const point = new PIXI.Point();
    let first = true;
    return (vx, vy, out) => {
      point.set(vx, vy);
      internalModel.localTransform.apply(point, point);
      model.toGlobal(point, point, !first);
      first = false;
      out[0] = point.x;
      out[1] = point.y;
    };
  }

  #indicesOf(coreModel, i) {
    return typeof coreModel.getDrawableVertexIndices !== 'function'
      ? coreModel.getIndexArray?.(i)
      : coreModel.getDrawableVertexIndices(i);
  }

  #screenTriangles(drawables) {
    const internalModel = this.#model?.internalModel;
    const coreModel = internalModel?.coreModel;
    if (!coreModel) return new Float32Array(0);
    const map = this.#screenMapper();
    const chunks = [];
    for (const i of drawables) {
      const vertices = internalModel.getDrawableVertices(i);
      const indices = this.#indicesOf(coreModel, i);
      if (vertices && indices) chunks.push(toTriangles(vertices, indices, map));
    }
    if (chunks.length === 1) return chunks[0];
    const out = new Float32Array(chunks.reduce((n, c) => n + c.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      out.set(chunk, offset);
      offset += chunk.length;
    }
    return out;
  }

  #screenChunks(drawables) {
    const internalModel = this.#model?.internalModel;
    const coreModel = internalModel?.coreModel;
    if (!coreModel) return [];
    const textures = this.#getPickTextures();
    const map = this.#screenMapper();
    const cache = new Map();
    const shapeOf = (i) => {
      if (cache.has(i)) return cache.get(i);
      const vertices = internalModel.getDrawableVertices(i);
      const indices = this.#indicesOf(coreModel, i);
      const shape = vertices && indices
        ? {
          triangles: toTriangles(vertices, indices, map),
          uvs: toTriangleUvs(textures.uvsOf(i), indices, textures.flipV),
          map: textures.textureOf(i),
        }
        : null;
      cache.set(i, shape);
      return shape;
    };
    const chunks = [];
    for (const i of drawables) {
      const shape = shapeOf(i);
      if (!shape) continue;
      const masks = textures.masksOf(i);
      const clips = masks ? masks.map(shapeOf).filter(Boolean) : null;
      chunks.push({
        ...shape,
        clips: clips?.length ? clips : null,
        clipKey: masks ? masks.join(',') : null,
        inverted: textures.invertedOf(i),
      });
    }
    return chunks;
  }

  #getPickTextures() {
    if (this.#pickTextures) return this.#pickTextures;
    const model = this.#model;
    const coreModel = model.internalModel.coreModel;
    const isCubism2 = typeof coreModel.getDrawableVertexIndices !== 'function';
    const drawList = isCubism2 ? coreModel.getModelContext?.()?._$aS ?? null : null;
    const maps = (model.textures ?? []).map((texture) => alphaMapOf(texture?.source ?? texture?.baseTexture ?? null));
    const textureOf = (i) => maps[isCubism2 ? drawList?.[i]?.getTextureNo?.() : coreModel.getDrawableTextureIndex?.(i)] ?? null;
    const uvsOf = (i) => (isCubism2 ? drawList?.[i]?._$Qi : coreModel.getDrawableVertexUvs?.(i)) ?? null;
    const maskList = isCubism2 ? null : coreModel.getDrawableMasks?.();
    const maskCounts = isCubism2 ? null : coreModel.getDrawableMaskCounts?.();
    const masksOf = (i) => {
      const count = maskCounts?.[i] ?? 0;
      if (!(count > 0) || !maskList?.[i]) return null;
      const masks = Array.from(maskList[i]).slice(0, count).filter((m) => m >= 0);
      return masks.length > 0 ? masks : null;
    };
    const invertedOf = (i) => !isCubism2 && !!coreModel.getDrawableInvertedMaskBit?.(i);
    let straight = 0;
    let flipped = 0;
    for (let i = 0; i < this.#drawableIds.length; i++) {
      const map = textureOf(i);
      const uvs = uvsOf(i);
      const indices = this.#indicesOf(coreModel, i);
      if (!map || !uvs || !indices) continue;
      for (let k = 0; k + 2 < indices.length; k += 3) {
        const a = indices[k] * 2, b = indices[k + 1] * 2, c = indices[k + 2] * 2;
        const u = (uvs[a] + uvs[b] + uvs[c]) / 3;
        const v = (uvs[a + 1] + uvs[b + 1] + uvs[c + 1]) / 3;
        straight += sampleAlpha(map, u, v);
        flipped += sampleAlpha(map, u, 1 - v);
      }
    }
    this.#pickTextures = { textureOf, uvsOf, masksOf, invertedOf, flipV: flipped >= straight };
    return this.#pickTextures;
  }

  #drawableAlpha(coreModel, context, i) {
    if (context) {
      const drawContext = context._$8b?.[i];
      if (!drawContext || drawContext._$IS?.[0]) return 0;
      return drawContext._$7s ?? 1;
    }
    if (coreModel.getDrawableDynamicFlagIsVisible?.(i) === false) return 0;
    return coreModel.getDrawableOpacity(i) ?? 0;
  }

  #resetParameterInfluence() {
    this.#parameterInfluence = null;
    this.#influenceToken = null;
  }

  #getParameterInfluence() {
    if (!this.#parameterInfluence) {
      const token = {};
      this.#influenceToken = token;
      this.#parameterInfluence = this.#computeParameterInfluence(token);
    }
    return this.#parameterInfluence;
  }

  async #computeParameterInfluence(token) {
    const model = this.#model;
    const internalModel = model?.internalModel;
    const coreModel = internalModel?.coreModel;
    const values = coreModel?._parameterValues;
    if (!values || !canUpdateLive2DCore(coreModel)) return null;
    const context = typeof coreModel.getDrawableVertexIndices !== 'function' ? coreModel.getModelContext?.() : null;
    const count = this.#drawableIds.length;
    const paramCount = Math.min(this.#parameterIds.length, values.length);
    const mins = coreModel._parameterMinimumValues;
    const maxs = coreModel._parameterMaximumValues;
    const scores = Array.from({ length: count }, () => new Map());
    const ordersOf = () => (context ? null : coreModel.getDrawableRenderOrders?.() ?? null);
    const load = (source) => {
      for (let k = 0; k < values.length; k++) values[k] = source[k];
    };
    let p = 0;
    while (p < paramCount) {
      if (this.#model !== model || this.#influenceToken !== token) return null;
      const original = Float32Array.from(values);
      const snapshot = this.#lastFrameParameters;
      const base = Float32Array.from(snapshot?.length === values.length ? snapshot : values);
      for (const [index, value] of this.parameterOverrides) base[index] = value;
      load(base);
      coreModel.update();
      const baseVertices = [];
      const baseAlpha = new Float32Array(count);
      const baseOrders = Int32Array.from(ordersOf() ?? []);
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let i = 0; i < count; i++) {
        const vertices = internalModel.getDrawableVertices(i);
        baseVertices.push(vertices ? Float32Array.from(vertices) : null);
        baseAlpha[i] = this.#drawableAlpha(coreModel, context, i);
        if (!vertices) continue;
        for (let j = 0; j + 1 < vertices.length; j += 2) {
          const vx = vertices[j], vy = vertices[j + 1];
          if (vx < minX) minX = vx;
          if (vx > maxX) maxX = vx;
          if (vy < minY) minY = vy;
          if (vy > maxY) maxY = vy;
        }
      }
      const extent = Math.max(maxX - minX, maxY - minY);
      const scale = extent > 0 && Number.isFinite(extent) ? extent : 1;
      const deadline = performance.now() + INFLUENCE_CHUNK_MS;
      for (; p < paramCount && performance.now() < deadline; p++) {
        for (const target of [mins[p], maxs[p]]) {
          if (!(Math.abs(target - base[p]) > 1e-6)) continue;
          load(base);
          values[p] = target;
          coreModel.update();
          const orders = baseOrders.length > 0 ? ordersOf() : null;
          for (let i = 0; i < count; i++) {
            const before = baseVertices[i];
            const after = before ? internalModel.getDrawableVertices(i) : null;
            let moved = 0;
            if (after) {
              const n = Math.min(before.length, after.length);
              for (let j = 0; j < n; j++) {
                const d = Math.abs(after[j] - before[j]);
                if (d > moved) moved = d;
              }
            }
            moved /= scale;
            const faded = Math.abs(this.#drawableAlpha(coreModel, context, i) - baseAlpha[i]);
            const score = (moved > INFLUENCE_MOVE_EPSILON ? moved : 0)
              + (faded > INFLUENCE_OPACITY_EPSILON ? faded : 0)
              + (orders && orders[i] !== baseOrders[i] ? INFLUENCE_ORDER_SCORE : 0);
            if (score > (scores[i].get(p) ?? 0)) scores[i].set(p, score);
          }
        }
      }
      load(original);
      this.render();
      if (p < paramCount) await new Promise((resolve) => setTimeout(resolve, 0));
    }
    const byDrawable = scores.map((entries) => [...entries].sort((a, b) => b[1] - a[1]).map(([param]) => param));
    const byParam = Array.from({ length: paramCount }, () => []);
    byDrawable.forEach((params, i) => {
      for (const param of params) byParam[param].push(i);
    });
    return { byDrawable, byParam };
  }

  async #pickParameters(x, y) {
    const influence = await this.#getParameterInfluence();
    if (!influence || !this.#model || this.#isExport) return [];
    const drawables = this.#pickShapes(x, y, 'drawables').filter((item) => !item.hidden);
    const params = [];
    const seen = new Set();
    for (const item of drawables) {
      for (const param of influence.byDrawable[item.id] ?? []) {
        if (seen.has(param)) continue;
        seen.add(param);
        params.push(param);
      }
    }
    const coreModel = this.#model.internalModel.coreModel;
    const context = typeof coreModel.getDrawableVertexIndices !== 'function' ? coreModel.getModelContext?.() : null;
    const visible = (i) => {
      if (this.#getDrawableOpacity(i) === 0) return false;
      const partsOpacity = context ? context._$8b?.[i]?._$VS ?? 1 : 1;
      return this.#drawableAlpha(coreModel, context, i) * partsOpacity > VISIBLE_OPACITY;
    };
    const screen = (list) => this.#screenTriangles(list.filter(visible));
    const chunks = (list) => this.#screenChunks(list.filter(visible));
    const values = coreModel._parameterValues;
    const mins = coreModel._parameterMinimumValues;
    const maxs = coreModel._parameterMaximumValues;
    return params.map((param) => {
      let triangles = null;
      let textured = null;
      return {
        id: `param:${param}`,
        name: this.#parameterIds[param],
        hidden: false,
        range: {
          min: mins[param],
          max: maxs[param],
          value: this.parameterOverrides.get(param) ?? values[param],
          step: (maxs[param] - mins[param]) / PARAMETER_KEY_STEPS,
        },
        get triangles() {
          return (triangles ??= screen(influence.byParam[param]));
        },
        get textured() {
          return (textured ??= chunks(influence.byParam[param]));
        },
      };
    });
  }

  getHitAreas() {
    const internalModel = this.#model?.internalModel;
    if (!internalModel || this.#isExport) return [];
    const map = this.#screenMapper();
    const point = [0, 0];
    const quad = (minX, minY, maxX, maxY) => {
      const out = new Float32Array(8);
      const corners = [minX, minY, maxX, minY, maxX, maxY, minX, maxY];
      for (let k = 0; k < 4; k++) {
        map(corners[k * 2], corners[k * 2 + 1], point);
        out[k * 2] = point[0];
        out[k * 2 + 1] = point[1];
      }
      return out;
    };
    const result = [];
    for (const [name, area] of Object.entries(internalModel.hitAreas ?? {})) {
      let index = area?.index ?? -1;
      if (index < 0 && area?.id) index = internalModel.getDrawableIndex?.(area.id) ?? -1;
      const vertices = index >= 0 ? internalModel.getDrawableVertices(index) : null;
      if (!vertices || vertices.length < 2) continue;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let j = 0; j + 1 < vertices.length; j += 2) {
        const vx = vertices[j], vy = vertices[j + 1];
        if (vx < minX) minX = vx;
        if (vx > maxX) maxX = vx;
        if (vy < minY) minY = vy;
        if (vy > maxY) maxY = vy;
      }
      if (!(maxX >= minX) || !(maxY >= minY)) continue;
      result.push({ name, polygon: quad(minX, minY, maxX, maxY) });
    }
    const custom = internalModel.getCustomHitAreas?.();
    const width = internalModel.originalWidth || internalModel.width;
    const height = internalModel.originalHeight || internalModel.height;
    if (custom && width && height) {
      for (const [name, rect] of Object.entries(custom)) {
        const left = ((rect.minX + 1) / 2) * width;
        const right = ((rect.maxX + 1) / 2) * width;
        const top = ((1 - rect.maxY) / 2) * height;
        const bottom = ((1 - rect.minY) / 2) * height;
        result.push({ name, polygon: quad(left, top, right, bottom) });
      }
    }
    return result;
  }

  setTargetValue(id, value) {
    if (typeof id !== 'string' || !id.startsWith('param:') || !this.#model) return;
    const index = Number(id.slice(6));
    const name = this.#parameterIds[index];
    if (name === undefined) return;
    const coreModel = this.#model.internalModel.coreModel;
    const min = coreModel._parameterMinimumValues[index];
    const max = coreModel._parameterMaximumValues[index];
    this.updatePropertyItem('parameters', name, index, Math.min(max, Math.max(min, value)));
    this.render();
  }

  setTargetHidden(id, hidden) {
    if (typeof id === 'string' && id.startsWith('part:')) {
      const index = Number(id.slice(5));
      const name = this.#partIds[index];
      if (name === undefined) return;
      if (!hidden && (this.#initialPartOpacities.get(name) ?? 1) > 0) this.resetPropertyItem('parts', name, index);
      else this.updatePropertyItem('parts', name, index, hidden ? 0 : 1);
      this.render();
      return;
    }
    const name = this.#drawableIds[id];
    if (name === undefined) return;
    if (!hidden && this.#defaultDrawableOpacity(id) === 1) this.resetPropertyItem('drawables', name, id);
    else this.updatePropertyItem('drawables', name, id, hidden ? 0 : 1);
  }

  getPropertyValues(category) {
    if (category !== 'parameters' || !this.#model) return null;
    return this.#lastFrameParameters ?? this.#model.internalModel.coreModel._parameterValues ?? null;
  }

  updatePropertyItem(category, name, index, value) {
    if (!this.#model) return;
    const coreModel = this.#model.internalModel.coreModel;
    if (category === 'parts') this.#resetParameterInfluence();
    if (category === 'parameters') {
      coreModel._parameterValues[index] = value;
      this.parameterOverrides.set(index, value);
      if (this.#lastFrameParameters && index < this.#lastFrameParameters.length) {
        this.#lastFrameParameters[index] = value;
      }
    } else if (category === 'parts') {
      const opacity = toLive2DOpacity(value);
      this.#setPartOpacity(coreModel, name, opacity);
      this.partOverrides.set(name, opacity);
    } else if (category === 'drawables') {
      const opacity = toLive2DOpacity(value);
      this.#setDrawableOpacity(index, opacity);
      this.drawableOverrides.set(index, opacity);
      this.#setupDrawableOpacitiesProxy();
      this.render();
    }
  }

  resetPropertyItem(category, name, index) {
    if (!this.#model) return undefined;
    const coreModel = this.#model.internalModel.coreModel;
    let value;
    if (category === 'parts') this.#resetParameterInfluence();
    if (category === 'parameters') {
      this.parameterOverrides.delete(index);
      value = this.#initialParameterValues.get(index);
      if (!Number.isFinite(value) && typeof coreModel.getParameterDefaultValue === 'function') {
        value = coreModel.getParameterDefaultValue(index);
      }
      if (!Number.isFinite(value)) value = coreModel._parameterValues[index];
      coreModel._parameterValues[index] = value;
      this.#saveParameterSnapshot();
    } else if (category === 'parts') {
      this.partOverrides.delete(name);
      value = this.#initialPartOpacities.get(name) ?? 1;
      this.#setPartOpacity(coreModel, name, value);
    } else if (category === 'drawables') {
      this.drawableOverrides.delete(index);
      value = this.#defaultDrawableOpacity(index);
      this.#setDrawableOpacity(index, value);
      this.#setupDrawableOpacitiesProxy();
    } else {
      return undefined;
    }
    this.render();
    return value;
  }

  #getParameterDefaults() {
    const coreModel = this.#model?.internalModel?.coreModel;
    if (!coreModel || this.#parameterIds.length === 0) return null;
    const defaults = [];
    for (let index = 0; index < this.#parameterIds.length; index++) {
      let value;
      if (typeof coreModel.getParameterDefaultValue === 'function') {
        value = coreModel.getParameterDefaultValue(index);
      }
      if (!Number.isFinite(value)) value = this.#initialParameterValues.get(index);
      if (!Number.isFinite(value)) return null;
      defaults.push(value);
    }
    return defaults;
  }

  getModelEdits() {
    const parameters = [];
    for (const [rawIndex, value] of this.parameterOverrides) {
      const index = Number(rawIndex);
      const id = this.#parameterIds[index];
      if (id) parameters.push({ id, index, value: Number(value) });
    }
    const parts = [];
    for (const [name, opacity] of this.partOverrides) {
      parts.push({ id: name, opacity: Number(opacity) });
    }
    const drawables = [];
    for (const [rawIndex, value] of this.drawableOverrides) {
      const id = this.#drawableIds[Number(rawIndex)];
      const opacity = toLive2DOpacity(value);
      if (id) drawables.push({ id, visible: opacity > 0, opacity });
    }
    return { type: 'live2d', parameters, parameterDefaults: this.#getParameterDefaults(), parts, drawables };
  }

  resetOverrides(category) {
    super.resetOverrides(category);
    if (!this.#model) return;
    const coreModel = this.#model.internalModel.coreModel;
    if (category === 'parts') this.#resetParameterInfluence();
    if (category === 'parameters') {
      this.#parameterIds.forEach((id, index) => {
        const defVal = this.#initialParameterValues.has(index)
          ? this.#initialParameterValues.get(index)
          : (typeof coreModel.getParameterDefaultValue === 'function'
            ? coreModel.getParameterDefaultValue(index)
            : coreModel._parameterValues[index]);
        coreModel._parameterValues[index] = defVal;
      });
      this.#saveParameterSnapshot();
    } else if (category === 'parts') {
      this.#partIds.forEach((name) => {
        const defVal = this.#initialPartOpacities.has(name)
          ? this.#initialPartOpacities.get(name)
          : 1.0;
        this.#setPartOpacity(coreModel, name, defVal);
      });
    } else if (category === 'drawables') {
      this.#drawableOpacities.clear();
      this.#hideMaskMosaicDrawables();
    }
    this.render();
  }

  getAnimationDuration() {
    if (!this.#model) return 0;
    const cubism2Entry = getCubism2MotionEntry(this.#model);
    if (cubism2Entry) return getLive2DMotionDuration(cubism2Entry._$w0);
    const entry = getMotionEntries(this.#model.internalModel.motionManager?.queueManager)[0];
    if (entry?._motion) return getLive2DMotionDuration(entry._motion);
    return 0;
  }

  #applyCubism2Time(timeSeconds) {
    const entry = getCubism2MotionEntry(this.#model);
    if (!entry) return false;
    const duration = getLive2DMotionDuration(entry._$w0);
    if (!(duration > 0)) return false;
    pinCubism2MotionEntry(entry);
    const wrapped = ((timeSeconds % duration) + duration) % duration;
    this.#cubism2TimeSeconds = wrapped;
    window.UtSystem?.setUserTimeMSec?.(CUBISM2_TIME_BASE + wrapped * 1000);
    return true;
  }

  seekAnimation(progress) {
    if (!this.#model) return;
    const mm = this.#model.internalModel.motionManager;
    const mqm = mm?.queueManager;
    if (getCubism2MotionEntry(this.#model)) {
      const duration = this.getAnimationDuration();
      if (!(duration > 0)) return;
      this.#cubism2ElapsedMS = progress * duration * 1000;
      if (!this.#applyCubism2Time(progress * duration)) return;
      const coreModel = this.#model.internalModel.coreModel;
      mqm.updateParam(coreModel);
      this.#applyOverrides();
      this.#saveParameterSnapshot();
      this.#model.deltaTime = 0;
      this.render();
      return;
    }
    const entry = getMotionEntries(mqm)[0];
    if (entry?._motion) {
      const motion = entry._motion;
      let duration = motion._loopDurationSeconds ||
        (motion._motionData && motion._motionData.duration) ||
        (motion.getDuration ? motion.getDuration() : -1);
      if (duration > 0 || duration === -1) {
        if (duration === -1) duration = 3000;
        const targetTime = progress * duration;
        const internalModel = this.#model.internalModel;
        if (entry._motion) {
          entry._motion._fadeInSeconds = 0;
          entry._motion._fadeOutSeconds = 0;
          for (const curve of getMotionCurves(entry._motion)) {
            curve.fadeInTime = -1;
            curve.fadeOutTime = -1;
          }
        }
        const savedStateTime = entry._stateTimeSeconds;
        const coreModel = internalModel.coreModel;
        entry._startTimeSeconds = savedStateTime - targetTime;
        mm.update(coreModel, savedStateTime);
        coreModel.saveParameters?.();
        this.#applyOverrides();
        this.#saveParameterSnapshot();
        entry._startTimeSeconds = entry._stateTimeSeconds - targetTime;
        coreModel.update();
        coreModel.loadParameters?.();
        this.#model.deltaTime = 0;
        this.render();
        if (this.#app && !this.#model.automator?.autoUpdate) {
          this.#app.render();
        }
      }
    }
  }

  getCurrentTime() {
    if (!this.#model) return 0;
    if (getCubism2MotionEntry(this.#model)) return this.#cubism2TimeSeconds;
    const entry = getMotionEntries(this.#model.internalModel.motionManager?.queueManager)[0];
    if (entry) {
      const duration = this.getAnimationDuration();
      if (duration > 0) {
        let t = entry._stateTimeSeconds - entry._startTimeSeconds;
        return ((t % duration) + duration) % duration;
      }
    }
    return 0;
  }

  getFPS() {
    if (!this.#model) return 60;
    const cubism2Entry = getCubism2MotionEntry(this.#model);
    if (cubism2Entry) return Math.max(60, cubism2Entry._$w0._$D0 || 60);
    const motion = getMotionEntries(this.#model.internalModel.motionManager?.queueManager)[0]?._motion;
    if (motion) {
      return Math.max(60, motion._fps || (motion._motionData && motion._motionData.fps) || 60);
    }
    return 60;
  }

  setSpeed(speed) {
    this.#speed = speed;
    if (this.#model) {
      this.#model._spive2dSpeed = speed;
    }
  }

  getSyncState() {
    const state = super.getSyncState();
    if (this.#model) {
      const coreModel = this.#model.internalModel.coreModel;
      state.initialPartOpacities = this.#partIds.map((name, index) => [name, coreModel.getPartOpacityByIndex(index)]);
      state.initialParameterValues = this.#parameterIds.map((id, i) => [id, coreModel._parameterValues[i]]);
    }
    return state;
  }

  applySyncState(state) {
    if (!state) return;
    super.applySyncState(state);
    if (state.drawableOverrides) {
      for (const [index, value] of this.drawableOverrides) {
        this.#setDrawableOpacity(Number(index), toLive2DOpacity(value));
      }
    }
  }

  setPaused(paused) {
    if (!this.#model) return;
    this.#paused = paused;
    if (!paused) {
      this.#lastTime = performance.now();
    }
  }

  render() {
    if (this.#app) {
      if (typeof window !== 'undefined' && window.Live2D && window.Live2D.setGL && this.#app.renderer?.gl) {
        window.Live2D.setGL(this.#app.renderer.gl);
      }
    }
    if (this.#model) {
      const coreModel = this.#model.internalModel.coreModel;
      const base = this.#swapInParameterSnapshot(coreModel);
      this.#applyOverrides();
      if (canUpdateLive2DCore(coreModel)) {
        coreModel.update();
      }
      if (base) coreModel._parameterValues.set(base);
    }
    if (this.#app) {
      this.#app.render();
    }
  }

  setTextureFilter(filter) {
    if (this.#canvas) {
      if (filter === 'nearest') {
        this.#canvas.style.imageRendering = 'pixelated';
      } else {
        this.#canvas.style.imageRendering = 'auto';
      }
    }
    if (!this.#model) return;
    applyLive2DTextureScaleMode(this.#model, resolveScaleMode(filter));
    this.render();
  }

  #focusAt(clientX, clientY) {
    const internalModel = this.#model?.internalModel;
    if (!internalModel?.focusController) return;
    const { originalWidth, originalHeight } = internalModel;
    if (!(originalWidth > 0) || !(originalHeight > 0)) return;
    this.#focusPoint.x = clientX;
    this.#focusPoint.y = clientY;
    this.#model.toModelPosition(this.#focusPoint, this.#focusPoint, true);
    const x = (this.#focusPoint.x / originalWidth) * 2 - 1;
    const y = (this.#focusPoint.y / originalHeight) * 2 - 1;
    internalModel.focusController.focus(x, -y);
  }

  #stepSizeMS() {
    return FIXED_STEP_MS * Math.min(1, this.#speed > 0 ? this.#speed : 1);
  }

  #stepModel(stepMS) {
    const model = this.#model;
    if (!model || !model.internalModel) return;
    model.elapsedTime += stepMS;
    model.deltaTime = 0;
    if (this.#currentMotion.group !== null) {
      this.#cubism2ElapsedMS += stepMS;
      this.#applyCubism2Time(this.#cubism2ElapsedMS / 1000);
    }
    model.internalModel.update(stepMS, model.elapsedTime);
  }

  #destroyModel() {
    this.#model.destroy();
    this.#model = null;
    releaseLive2DTextures(PIXI, this.#textureUrls);
    this.#textureUrls = [];
  }

  #detachBeforeModelUpdate() {
    if (this.#beforeModelUpdateHandler && this.#model?.internalModel?.off) {
      this.#model.internalModel.off('beforeModelUpdate', this.#beforeModelUpdateHandler);
    }
    this.#beforeModelUpdateHandler = null;
  }

  #saveParameterSnapshot() {
    const values = this.#model?.internalModel?.coreModel?._parameterValues;
    if (!values || typeof values.length !== 'number') return;
    if (!this.#lastFrameParameters || this.#lastFrameParameters.length !== values.length) {
      this.#lastFrameParameters = new Float32Array(values.length);
    }
    this.#lastFrameParameters.set(values);
  }

  #swapInParameterSnapshot(coreModel) {
    const snapshot = this.#lastFrameParameters;
    if (!snapshot) return null;
    const values = coreModel?._parameterValues;
    if (!values || typeof values.set !== 'function') return null;
    if (values.length !== snapshot.length) return null;
    if (!this.#baseParameters || this.#baseParameters.length !== values.length) {
      this.#baseParameters = new Float32Array(values.length);
    }
    this.#baseParameters.set(values);
    values.set(snapshot);
    return this.#baseParameters;
  }

  #applyOverrides() {
    if (!this.#model) return;
    const coreModel = this.#model.internalModel.coreModel;
    for (const [index, value] of this.parameterOverrides) {
      coreModel._parameterValues[index] = value;
    }
    for (const [name, opacity] of this.partOverrides) {
      this.#setPartOpacity(coreModel, name, opacity);
    }
    if (this.#drawableOpacities.size > 0 && !this.#opacities) {
      this.#setupDrawableOpacitiesProxy();
    }
  }

  #hideMaskMosaicDrawables() {
    this.#drawableIds.forEach((name, index) => {
      if (name && name.includes('Mosaic')) {
        this.#setDrawableOpacity(index, 0);
      }
    });
  }

  #setupDrawableOpacitiesProxy() {
    if (this.#opacities) return;
    const coreModel = this.#model?.internalModel?.coreModel;
    if (!coreModel) return;
    this.#opacities = installLive2DDrawableFilter(coreModel, idx => this.#getDrawableOpacity(idx));
  }

  getModel() {
    return this.#model;
  }

  getCurrentMotion() {
    return { ...this.#currentMotion };
  }
}
