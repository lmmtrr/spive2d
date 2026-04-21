import { BaseRenderer } from './BaseRenderer.js';
import { createSorter } from '../utils.js';
import { convertFileSrc } from '@tauri-apps/api/core';
import { showNotification } from '../notificationStore.svelte.js';

const sortByText = createSorter(item => item.name);
const sortById = createSorter(item => item.id);

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
  #model = null;
  #hiddenDrawables = new Set();
  #opacities = null;
  #currentMotion = { group: null, index: null };
  #speed = 1.0;
  #isExport = false;
  #animations = [];
  #disposed = false;
  #renderTexture = null;

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
    if (this.#model) {
      if (!this.#isExport && this.#app && this.#app.stage) {
        this.#app.stage.removeChild(this.#model);
      }
      this.#model.destroy();
      this.#model = null;
    }
    if (!this.#isExport && this.#canvas) {
      this.#canvas.style.display = 'block';
    }
    let ext = '.model3.json';
    if (scene.mainExt.includes('.moc3')) ext = '.model3.json';
    else if (scene.mainExt.includes('.moc')) ext = '.json';
    const rawUrl = `${dirName}${scene.name}${ext}`;
    let url = (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
      ? rawUrl
      : convertFileSrc(rawUrl);
    url += (url.includes('?') ? '&' : '?') + 't=' + Date.now();
    const { live2d: { Live2DModel } } = PIXI;
    try {
      const model = await Live2DModel.from(url, { autoInteract: false, idleMotionGroup: 'None' });
      if (this.#disposed) {
        model.destroy();
        return;
      }
      if (!this.#app) {
        model.destroy();
        return;
      }
      this.#model = model;
      const { innerWidth: w, innerHeight: h } = window;
      const s = Math.min(
        w / model.internalModel.originalWidth,
        h / model.internalModel.originalHeight
      );
      model.scale.set(s);
      model.anchor.set(0.5, 0.5);
      model.position.set(w * 0.5, h * 0.5);
      if (!this.#isExport && this.#app && this.#app.stage) {
        this.#app.stage.addChild(model);
      }
      if (model.internalModel && model.internalModel.breath) {
        model.internalModel.breath = null;
      }
      const animations = await this.#filterAnimations();
      if (this.#disposed || !this.#model) return;
      this.#animations = animations;
      if (animations.length > 0) {
        await this.setAnimation(animations[0].value);
      }
      if (this.#disposed || !this.#model) return;
      const originalUpdate = this.#model.update;
      this.#model.update = function (dt) {
        originalUpdate.call(this, dt * this._spive2dSpeed);
      };
      this.#model._spive2dSpeed = this.#speed;
    } catch (err) {
      showNotification("Live2DRenderer Error: " + (err.message || err), 'error');
      console.error(err);
    }
  }

  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    if (!this.#isExport && this.#canvas) {
      this.#canvas.style.display = 'none';
    }
    if (this.#model) {
      if (!this.#isExport && this.#app && this.#app.stage) {
        this.#app.stage.removeChild(this.#model);
      }
      this.#model.destroy();
      this.#model = null;
    }
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

  getOriginalSize() {
    if (!this.#model) return { width: 0, height: 0 };
    return {
      width: Math.round(this.#model.internalModel.originalWidth),
      height: Math.round(this.#model.internalModel.originalHeight),
    };
  }

  applyTransform(scale, moveX, moveY, rotate) {
    super.applyTransform(scale, moveX, moveY, rotate);
    if (!this.#model) return;
    const { innerWidth: w, innerHeight: h } = window;
    const baseScale = Math.min(
      w / this.#model.internalModel.originalWidth,
      h / this.#model.internalModel.originalHeight
    );
    this.#model.scale.set(baseScale * scale);
    this.#model.position.set(w * 0.5 + moveX, h * 0.5 + moveY);
    this.#model.rotation = rotate;
  }

  resetTransform(width = window.innerWidth, height = window.innerHeight) {
    super.resetTransform();
    if (!this.#model) return;
    const s = Math.min(
      width / this.#model.internalModel.originalWidth,
      height / this.#model.internalModel.originalHeight
    );
    this.#model.scale.set(s);
    this.#model.position.set(width * 0.5, height * 0.5);
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
      const s = Math.min(
        (width - 2 * marginX) / this.#model.internalModel.originalWidth,
        (height - 2 * marginY) / this.#model.internalModel.originalHeight
      );
      this.#model.scale.set(s);
      this.#model.position.set(width * 0.5, height * 0.5);
      this.#model.rotation = 0;
    } else {
      const userScale = this._scale || 1;
      const userMoveX = this._moveX || 0;
      const userMoveY = this._moveY || 0;
      const userRotate = this._rotate || 0;
      const baseScale = Math.min(
        (width - 2 * marginX) / this.#model.internalModel.originalWidth,
        (height - 2 * marginY) / this.#model.internalModel.originalHeight
      );
      const screenBaseScale = Math.min(window.innerWidth / this.#model.internalModel.originalWidth, window.innerHeight / this.#model.internalModel.originalHeight);
      const scaleFactor = baseScale / screenBaseScale;
      this.#model.scale.set(baseScale * userScale);
      this.#model.position.set(width * 0.5 + userMoveX * scaleFactor, height * 0.5 + userMoveY * scaleFactor);
      this.#model.rotation = userRotate;
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
          const duration = motion?._loopDurationSeconds ||
            (motion?._motionData && motion._motionData.duration) ||
            (motion?.getDuration ? motion.getDuration() : 0);
          if (duration > 0) {
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
    const [group, index] = value.split(',');
    this.#currentMotion = { group, index: Number(index) };
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
      if (!this.#opacities && coreModel._model?.drawables?.opacities) {
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
      this.render();
    }
  }

  getAnimationDuration() {
    if (!this.#model) return 0;
    const mqm = this.#model.internalModel.motionManager?.queueManager;
    if (mqm?._motions?.length > 0) {
      const entry = mqm._motions[0];
      const motion = entry._motion;
      if (motion) {
        return motion._loopDurationSeconds ||
          (motion._motionData && motion._motionData.duration) ||
          (motion.getDuration ? motion.getDuration() : 0);
      }
    }
    return 0;
  }

  seekAnimation(progress) {
    if (!this.#model) return;
    const mm = this.#model.internalModel.motionManager;
    const mqm = mm?.queueManager;
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
        entry._startTimeSeconds = savedStateTime - targetTime;
        mm.update(internalModel.coreModel, savedStateTime);
        this.#applyOverrides();
        entry._startTimeSeconds = entry._stateTimeSeconds - targetTime;
        internalModel.coreModel.update();
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
    return {
      ...super.getSyncState(),
    };
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
    if (paused) {
      if (this.#model.autoUpdate) this.#model.autoUpdate = false;
    } else {
      const { group, index } = this.#currentMotion;
      if (group !== null && index !== null) {
        this.#model.motion(group, index, 3).then(() => {
          this.#model.autoUpdate = true;
        });
      } else {
        this.#model.autoUpdate = true;
      }
    }
  }

  render() {
    if (this.#model) {
      this.#applyOverrides();
      this.#model.internalModel.coreModel.update();
    }
    if (this.#app) {
      this.#app.render();
    }
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
    if (this.drawableOverrides.size > 0 && !this.#opacities) {
      this.getPropertyItems('drawables');
    }
  }

  getModel() {
    return this.#model;
  }

  getCurrentMotion() {
    return { ...this.#currentMotion };
  }
}
