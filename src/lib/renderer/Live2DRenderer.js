import { BaseRenderer } from './BaseRenderer.js';
import {
  getLive2DFrameBox,
  fitLive2DBox,
  resolveLive2DModelUrl,
  canUpdateLive2DCore,
  getCubism2MotionEntry,
  pinCubism2MotionEntry,
  getLive2DMotionDuration,
  registerLive2DMotionFiles,
  CUBISM2_TIME_BASE,
} from './Live2DCommon.js';
import { createSorter } from '../utils.js';
import { showNotification } from '../notificationStore.svelte.js';
import { appState } from '../appState.svelte.js';

const sortByText = createSorter(item => item.name);
const sortById = createSorter(item => item.id);
const MAX_DELTA_MS = 100;
const FIXED_STEP_MS = 1000 / 60;
const MAX_STEPS_PER_FRAME = 20;

class PixiAppManager {
  static #sharedApp = null;
  static #usageCount = 0;

  static acquire() {
    if (!this.#sharedApp) {
      const cvs = document.createElement('canvas');
      cvs.style.display = 'none';
      cvs.style.verticalAlign = 'top';
      cvs.style.opacity = '0';
      this.#sharedApp = new PIXI.Application({
        view: cvs,
        preserveDrawingBuffer: true,
        transparent: true,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });
      this.#sharedApp.resizeTo = window;
    }
    this.#usageCount++;
    return this.#sharedApp;
  }

  static release() {
    this.#usageCount--;
    if (this.#usageCount === 0 && this.#sharedApp) {
      this.#sharedApp.destroy(false, { children: true });
      this.#sharedApp = null;
    }
  }

  static get app() {
    return this.#sharedApp;
  }
}

export class Live2DRenderer extends BaseRenderer {
  #canvas;
  #app;
  #contentBox = null;
  #model = null;
  #hiddenDrawables = new Set();
  #opacities = null;
  #currentMotion = { group: null, index: null };
  #speed = 1.0;
  #isExport = false;
  #animations = [];
  #disposed = false;
  #renderTexture = null;
  #paused = false;
  #updateFn = null;
  #lastTime = 0;
  #initialPartOpacities = new Map();
  #initialParameterValues = new Map();
  #originalBreath = null;
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

  constructor(isExport = false) {
    super(isExport);
    this.#isExport = isExport;
    this.#app = PixiAppManager.acquire();
    this.#canvas = this.#app.view;
  }

  getCanvas() {
    return this.#canvas;
  }

  async load(dirName, scene) {
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
      this.#model.destroy();
      this.#model = null;
    }
    this.#lastFrameParameters = null;
    this.#baseParameters = null;
    if (!this.#isExport && this.#canvas) {
      this.#canvas.style.display = 'block';
    }
    const url = await resolveLive2DModelUrl(dirName, scene);
    const { live2d: { Live2DModel } } = PIXI;
    try {
      const scaleMode = appState.textureFilter === 'nearest' ? PIXI.SCALE_MODES.NEAREST : PIXI.SCALE_MODES.LINEAR;
      PIXI.settings.SCALE_MODE = scaleMode;
      const model = await Live2DModel.from(url, {
        autoInteract: false,
        ...(appState.enableIdleAndBreathing ? {} : { idleMotionGroup: 'None' })
      });
      if (this.#disposed) {
        model.destroy();
        return;
      }
      if (!this.#app) {
        model.destroy();
        return;
      }
      this.#model = model;
      registerLive2DMotionFiles(model, scene?.motionFiles);
      if (typeof window !== 'undefined' && window.Live2D && window.Live2D.setGL && this.#app?.renderer?.gl) {
        window.Live2D.setGL(this.#app.renderer.gl);
      }
      this.setTextureFilter(appState.textureFilter);
      this.#originalBreath = model.internalModel?.breath || null;
      this.#originalIdleGroup = model.internalModel?.motionManager?.groups?.idle || 'Idle';
      if (!appState.enableIdleAndBreathing) {
        if (model.internalModel) {
          model.internalModel.breath = null;
        }
      }
      this.#initialPartOpacities.clear();
      this.#initialParameterValues.clear();
      this.#hiddenDrawables.clear();
      this.#opacities = null;
      const coreModel = model.internalModel?.coreModel;
      if (coreModel) {
        if (coreModel._partIds) {
          coreModel._partIds.forEach((name) => {
            this.#initialPartOpacities.set(name, coreModel.getPartOpacityById(name));
          });
        }
        if (coreModel._parameterIds) {
          coreModel._parameterIds.forEach((id, idx) => {
            this.#initialParameterValues.set(idx, coreModel._parameterValues[idx]);
          });
        }
      }
      const { innerWidth: w, innerHeight: h } = window;
      model.anchor.set(0.5, 0.5);
      this.#contentBox = null;
      const { baseScale, dx, dy } = this.#fit(w, h);
      model.scale.set(baseScale);
      model.position.set(w * 0.5 - dx * baseScale, h * 0.5 - dy * baseScale);
      if (!this.#isExport && this.#app && this.#app.stage) {
        this.#app.stage.addChild(model);
      }
      const animations = await this.#filterAnimations();
      if (this.#disposed || !this.#model) return;
      this.#animations = animations;
      if (animations.length > 0) {
        await this.setAnimation(animations[0].value);
      }
      if (this.#disposed || !this.#model) return;
      this.#model.autoUpdate = false;
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
        internalModel.breath = appState.enableIdleAndBreathing ? this.#originalBreath : null;
        if (internalModel.motionManager && internalModel.motionManager.groups) {
          internalModel.motionManager.groups.idle = appState.enableIdleAndBreathing ? this.#originalIdleGroup : 'None';
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
      this.#app.ticker.add(this.#updateFn);
      if (!this.#isExport) {
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
      model._spive2dSpeed = this.#speed;
      this.#hideMaskMosaicDrawables();
      this.#setupDrawableOpacitiesProxy();
    } catch (err) {
      showNotification("Live2DRenderer Error: " + (err.message || err), 'error');
      console.error(err);
    }
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    if (this.#pointerMoveHandler) {
      window.removeEventListener('pointermove', this.#pointerMoveHandler);
      this.#pointerMoveHandler = null;
    }
    if (this.#pointerLeaveHandler) {
      window.removeEventListener('pointerleave', this.#pointerLeaveHandler);
      document.removeEventListener('mouseleave', this.#pointerLeaveHandler);
      this.#pointerLeaveHandler = null;
    }
    if (this.#updateFn && this.#app) {
      this.#app.ticker.remove(this.#updateFn);
      this.#updateFn = null;
    }
    if (this.#model) {
      this.#detachBeforeModelUpdate();
      if (!this.#isExport && this.#app && this.#app.stage) {
        this.#app.stage.removeChild(this.#model);
      }
      this.#model.destroy();
      this.#model = null;
    }
    this.#lastFrameParameters = null;
    this.#baseParameters = null;
    this.#contentBox = null;
    this.#opacities = null;
    if (this.#renderTexture) {
      this.#renderTexture.destroy(true);
      this.#renderTexture = null;
    }
    PixiAppManager.release();
    this.#app = null;
  }

  resize(width, height) {
    if (this.#isExport || !this.#app) return;
    this.#app.renderer.resize(width, height);
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
    super.applyTransform(scale, moveX, moveY, rotate);
    if (!this.#model) return;
    const { innerWidth: w, innerHeight: h } = window;
    const { baseScale, dx, dy } = this.#fit(w, h);
    const s = baseScale * scale;
    this.#model.scale.set(s);
    this.#model.position.set(w * 0.5 - dx * s + moveX, h * 0.5 - dy * s + moveY);
    this.#model.rotation = (rotate * Math.PI) / 180;
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
    if (!this.#model) return null;
    width = Math.round(width);
    height = Math.round(height);
    const originalScale = this.#model.scale.clone();
    const originalPosition = this.#model.position.clone();
    const originalRotation = this.#model.rotation;
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
    this.#app.renderer.render(this.#model, { renderTexture: this.#renderTexture });
    const canvas = this.#app.renderer.extract.canvas(this.#renderTexture);
    this.#model.scale.copyFrom(originalScale);
    this.#model.position.copyFrom(originalPosition);
    this.#model.rotation = originalRotation;
    return canvas;
  }

  getAnimations() {
    return this.#animations;
  }

  async #filterAnimations() {
    if (!this.#model) return [];
    const motions = this.#model.internalModel.motionManager.definitions;
    if (!motions) return [];
    const result = [];
    for (const [groupName, anims] of Object.entries(motions)) {
      for (let i = 0; i < anims.length; i++) {
        const anim = anims[i];
        try {
          const motion = await this.#model.internalModel.motionManager.loadMotion(groupName, i);
          if (this.#disposed || !this.#model || !this.#model.internalModel) return result;
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
    }
    return result.sort(sortByText);
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
        if (coreModel._parameterIds) {
          coreModel._parameterIds.forEach((id, idx) => {
            const initialVal = this.#initialParameterValues.get(idx);
            if (initialVal !== undefined) {
              coreModel._parameterValues[idx] = initialVal;
            }
          });
        }
        if (coreModel._partIds) {
          coreModel._partIds.forEach((name) => {
            const initialVal = this.#initialPartOpacities.get(name);
            if (initialVal !== undefined) {
              coreModel.setPartOpacityById(name, initialVal);
            }
          });
        }
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
      this.#model.expression(
        this.#model.internalModel.motionManager.ExpressionManager?.defaultExpression
      );
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
      if (!coreModel._parameterIds) return [];
      return coreModel._parameterIds
        .map((id, index) => ({
          name: id,
          id,
          index,
          type: 'range',
          max: coreModel._parameterMaximumValues[index],
          min: coreModel._parameterMinimumValues[index],
          value: coreModel._parameterValues[index],
          step: (coreModel._parameterMaximumValues[index] - coreModel._parameterMinimumValues[index]) / 100,
        }))
        .sort(sortById);
    }
    if (category === 'parts') {
      const partIds = coreModel?._partIds;
      if (!partIds) return [];
      return partIds
        .map((name, index) => ({
          name,
          index,
          type: 'checkbox',
          checked: coreModel.getPartOpacityById(name) > 0,
        }))
        .sort(sortByText);
    }
    if (category === 'drawables') {
      if (!coreModel?._drawableIds) return [];
      return coreModel._drawableIds
        .map((name, index) => {
          let isVisible = !this.#hiddenDrawables.has(index);
          return {
            name,
            index,
            type: 'checkbox',
            checked: isVisible,
          };
        })
        .sort(sortByText);
    }
    return [];
  }

  updatePropertyItem(category, name, index, value) {
    if (!this.#model) return;
    const coreModel = this.#model.internalModel.coreModel;
    if (category === 'parameters') {
      coreModel._parameterValues[index] = value;
      this.parameterOverrides.set(index, value);
    } else if (category === 'parts') {
      coreModel.setPartOpacityById(name, value ? 1 : 0);
      this.partOverrides.set(name, value ? 1 : 0);
    } else if (category === 'drawables') {
      if (value) {
        this.#hiddenDrawables.delete(index);
        this.drawableOverrides.set(index, true);
      } else {
        this.#hiddenDrawables.add(index);
        this.drawableOverrides.set(index, false);
      }
      this.#setupDrawableOpacitiesProxy();
      this.render();
    }
  }

  resetOverrides(category) {
    super.resetOverrides(category);
    if (!this.#model) return;
    const coreModel = this.#model.internalModel.coreModel;
    if (category === 'parameters') {
      if (coreModel._parameterIds) {
        coreModel._parameterIds.forEach((id, index) => {
          const defVal = this.#initialParameterValues.has(index)
            ? this.#initialParameterValues.get(index)
            : (typeof coreModel.getParameterDefaultValue === 'function'
              ? coreModel.getParameterDefaultValue(index)
              : coreModel._parameterValues[index]);
          coreModel._parameterValues[index] = defVal;
        });
        this.#saveParameterSnapshot();
      }
    } else if (category === 'parts') {
      if (coreModel && coreModel._partIds) {
        coreModel._partIds.forEach((name) => {
          const defVal = this.#initialPartOpacities.has(name)
            ? this.#initialPartOpacities.get(name)
            : 1.0;
          coreModel.setPartOpacityById(name, defVal);
        });
      }
    } else if (category === 'drawables') {
      this.#hiddenDrawables.clear();
      this.#hideMaskMosaicDrawables();
    }
    this.render();
  }

  getAnimationDuration() {
    if (!this.#model) return 0;
    const cubism2Entry = getCubism2MotionEntry(this.#model);
    if (cubism2Entry) return getLive2DMotionDuration(cubism2Entry._$w0);
    const mqm = this.#model.internalModel.motionManager?.queueManager;
    if (mqm?._motions?.length > 0) {
      const entry = mqm._motions[0];
      const motion = entry._motion;
      if (motion) return getLive2DMotionDuration(motion);
    }
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
    const entry = mqm?._motions?.[0];
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
          if (entry._motion._motionData?.curves) {
            for (const curve of entry._motion._motionData.curves) {
              curve.fadeInTime = -1;
              curve.fadeOutTime = -1;
            }
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
        if (this.#app && !this.#model.autoUpdate) {
          this.#app.render();
        }
      }
    }
  }

  getCurrentTime() {
    if (!this.#model) return 0;
    if (getCubism2MotionEntry(this.#model)) return this.#cubism2TimeSeconds;
    const mqm = this.#model.internalModel.motionManager?.queueManager;
    if (mqm?._motions?.length > 0) {
      const entry = mqm._motions[0];
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
    const mqm = this.#model.internalModel.motionManager?.queueManager;
    if (mqm?._motions?.length > 0) {
      const motion = mqm._motions[0]._motion;
      if (motion) {
        return Math.max(60, motion._fps || (motion._motionData && motion._motionData.fps) || 60);
      }
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
      const partIds = coreModel?._partIds;
      if (partIds) {
        state.initialPartOpacities = partIds.map(name => [name, coreModel.getPartOpacityById(name)]);
      }
      if (coreModel._parameterIds) {
        state.initialParameterValues = coreModel._parameterIds.map((id, i) => [id, coreModel._parameterValues[i]]);
      }
    }
    return state;
  }

  applySyncState(state) {
    if (!state) return;
    super.applySyncState(state);
    if (state.drawableOverrides) {
      for (const [index, visible] of this.drawableOverrides) {
        if (visible) this.#hiddenDrawables.delete(index);
        else this.#hiddenDrawables.add(index);
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
    const mode = filter === 'nearest' ? PIXI.SCALE_MODES.NEAREST : PIXI.SCALE_MODES.LINEAR;
    const updateTextureScaleMode = (object) => {
      if (!object) return;
      if (object.texture && object.texture.baseTexture) {
        object.texture.baseTexture.scaleMode = mode;
        object.texture.baseTexture.update();
      }
      if (object.children) {
        object.children.forEach(updateTextureScaleMode);
      }
    };
    updateTextureScaleMode(this.#model);
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
      coreModel.setPartOpacityById(name, opacity);
    }
    if (this.#hiddenDrawables.size > 0 && !this.#opacities) {
      this.#setupDrawableOpacitiesProxy();
    }
  }

  #hideMaskMosaicDrawables() {
    const coreModel = this.#model?.internalModel?.coreModel;
    if (!coreModel || !coreModel._drawableIds) return;
    coreModel._drawableIds.forEach((name, index) => {
      if (name && name.includes('Mosaic')) {
        this.#hiddenDrawables.add(index);
      }
    });
  }

  #setupDrawableOpacitiesProxy() {
    if (this.#opacities) return;
    const coreModel = this.#model?.internalModel?.coreModel;
    if (!coreModel || !coreModel._model?.drawables?.opacities) return;
    const wasmOpacities = coreModel._model.drawables.opacities;
    const renderer = this;
    this.#opacities = new Proxy(wasmOpacities, {
      get(target, prop) {
        if (typeof prop === 'string') {
          const idx = Number(prop);
          if (!isNaN(idx) && renderer.#hiddenDrawables.has(idx)) return 0;
        }
        const val = target[prop];
        return typeof val === 'function' ? val.bind(target) : val;
      }
    });
    coreModel._model.drawables.opacities = this.#opacities;
  }

  getModel() {
    return this.#model;
  }

  getCurrentMotion() {
    return { ...this.#currentMotion };
  }
}
