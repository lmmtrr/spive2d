import { Output, WebMOutputFormat, BufferTarget, CanvasSource } from 'mediabunny';
import { setupWorkerEnv } from './workerPolyfills.js';
import { SpineRendererBase } from './renderer/SpineRendererBase.js';

let currentTasks = new Map();
let libsLoaded = false;
let libsLoadedVersion = null;

async function loadLibraries(rendererType, version = null, libraryBaseUrl = null) {
  if (libsLoaded === rendererType && (rendererType !== 'spine' || libsLoadedVersion === version)) return;
  const isLive2D = rendererType === 'live2d';
  const isSpine = rendererType === 'spine';
  try {
    const origin = libraryBaseUrl || self.location.origin;
    setupWorkerEnv(self);
    if (isLive2D) {
      const scripts = [
        origin + '/lib/pixi.min.js',
        origin + '/lib/live2dcubismcore.min.js',
        origin + '/lib/live2d.min.js',
        origin + '/lib/index.min.js'
      ];
      for (const url of scripts) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        let code = await response.text();
        code += "\n;if(typeof PIXI !== 'undefined') self.PIXI = PIXI; if(typeof Live2DCubismCore !== 'undefined') self.Live2DCubismCore = Live2DCubismCore; if(typeof Live2D !== 'undefined') self.Live2D = Live2D;";
        (0, eval)(code);
      }
      if (!self.PIXI) throw new Error('PIXI failed to initialize');
      self.setupPIXISettings(self.PIXI);
    } else if (isSpine && version) {
      const url = `${origin}/lib/spine-webgl-${version}.js`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      let code = await response.text();
      code += "\n;if(typeof spine !== 'undefined') self.spine = spine;";
      (0, eval)(code);
      if (!self.spine) throw new Error(`Spine failed to initialize`);
      if (version[0] === '3') {
        if (self.spine.webgl) Object.assign(self.spine, self.spine.webgl);
        if (!self.spine.core) self.spine.core = self.spine;
      }
      self.spineLib = self.spine;
      libsLoadedVersion = version;
    }
    libsLoaded = rendererType;
  } catch (err) {
    console.error('Failed to load libraries in worker:', err);
    throw err;
  }
}

class WorkerLive2DRenderer {
  constructor(canvas) {
    const rendererOptions = {
      width: canvas.width,
      height: canvas.height,
      view: canvas,
      transparent: true,
      preserveDrawingBuffer: true,
      antialias: true,
      resolution: 1,
    };
    this.renderer = new PIXI.Renderer(rendererOptions);
    if (self.Live2D && self.Live2D.setGL) {
      self.Live2D.setGL(this.renderer.gl);
    }
    this.app = {
      renderer: this.renderer,
      stage: new PIXI.Container(),
      view: canvas,
      render: () => {
        this.renderer.render(this.app.stage);
      },
      destroy: (removeView) => {
        this.renderer.destroy(removeView);
        this.app.stage.destroy({ children: true });
      }
    };
    this.model = null;
    this._currentDuration = 0.1;
    this.parameterOverrides = new Map();
    this.partOverrides = new Map();
    this.drawableOverrides = new Map();
    this.hiddenDrawables = new Set();
    this.opacities = null;
    this.marginX = 0;
    this.marginY = 0;
    this.contentWidth = 0;
    this.contentHeight = 0;
    this.ignoreTransform = false;
    this._lastSeekTime = 0;
  }

  applySyncState(state) {
    if (!state) return;
    if (state.parameterOverrides) this.parameterOverrides = new Map(state.parameterOverrides);
    if (state.partOverrides) this.partOverrides = new Map(state.partOverrides);
    if (state.drawableOverrides) {
      this.drawableOverrides = new Map(state.drawableOverrides);
      for (const [index, visible] of this.drawableOverrides) {
        if (visible) this.hiddenDrawables.delete(index);
        else this.hiddenDrawables.add(index);
      }
    }
  }

  applyOverrides() {
    if (!this.model) return;
    const coreModel = this.model.internalModel.coreModel;
    for (const [index, value] of this.parameterOverrides) {
      coreModel._parameterValues[index] = value;
    }
    for (const [name, opacity] of this.partOverrides) {
      coreModel.setPartOpacityById(name, opacity);
    }
    if (self.Live2D && self.Live2D.setGL) {
      self.Live2D.setGL(this.renderer.gl);
    }
    coreModel.update();
    if (this.hiddenDrawables.size > 0 && !this.opacities && coreModel._model?.drawables?.opacities) {
      const wasmOpacities = coreModel._model.drawables.opacities;
      const renderer = this;
      this.opacities = new Proxy(wasmOpacities, {
        get(target, prop) {
          if (typeof prop === 'string') {
            const idx = Number(prop);
            if (!isNaN(idx) && renderer.hiddenDrawables.has(idx)) return 0;
          }
          const val = target[prop];
          return typeof val === 'function' ? val.bind(target) : val;
        }
      });
      coreModel._model.drawables.opacities = this.opacities;
    }
  }

  async load(modelUrl) {
    const { live2d: { Live2DModel } } = PIXI;
    try {
      this.model = await Live2DModel.from(modelUrl, { autoInteract: false, idleMotionGroup: 'None' });
      this.model.autoUpdate = false;
      this.app.stage.addChild(this.model);
      const { width, height } = this.app.view;
      const modelWidth = this.model.internalModel.originalWidth;
      const modelHeight = this.model.internalModel.originalHeight;
      const s = Math.min(width / modelWidth, height / modelHeight);
      this.model.scale.set(s);
      this.model.anchor.set(0.5, 0.5);
      this.model.position.set(width * 0.5, height * 0.5);
      if (this.model.internalModel && this.model.internalModel.breath) {
        this.model.internalModel.breath = null;
      }
    } catch (err) {
      console.error('Worker: Error loading model:', err);
      throw err;
    }
  }

  async setAnimation(value) {
    if (this.model && value) {
      let [group, indexStr] = value.split(',');
      const index = indexStr !== undefined ? Number(indexStr) : 0;
      if (!group && this.model.internalModel.settings.motions) {
        const groups = Object.keys(this.model.internalModel.settings.motions);
        if (groups.length > 0) {
          group = groups[0];
        }
      }
      try {
        await this.model.motion(group, index, PIXI.live2d.MotionPriority.FORCE);
        const mm = this.model.internalModel.motionManager;
        const mqm = mm?.queueManager;
        if (mqm?._motions?.length > 0) {
          const entry = mqm._motions[0];
          const m = entry._motion;
          if (m) {
            this._currentDuration = m._loopDurationSeconds ||
              (m._motionData && m._motionData.duration) ||
              (m.getDuration ? m.getDuration() : 0.1);
            m._fadeInSeconds = 0;
            m._fadeOutSeconds = 0;
            if (m._motionData?.curves) {
              for (const curve of m._motionData.curves) {
                curve.fadeInTime = -1;
                curve.fadeOutTime = -1;
              }
            }
          }
        } else {
          this._currentDuration = 0.1;
        }
      } catch (e) {
        console.error('Worker: Failed to play motion', e);
        this._currentDuration = 0.1;
      }
    }
  }

  setExpression(name) {
    if (this.model && name) {
      this.model.expression(name);
    }
  }

  getFPS() {
    if (!this.model) return 60;
    const mqm = this.model.internalModel.motionManager?.queueManager;
    if (mqm?._motions?.length > 0) {
      const motion = mqm._motions[0]._motion;
      if (motion) {
        return Math.max(60, motion._fps || (motion._motionData && motion._motionData.fps) || 60);
      }
    }
    return 60;
  }

  setTransform(scale, x, y, rotation, originalWidth, originalHeight, screenBaseScale, ignoreTransform, contentWidth, contentHeight) {
    if (!this.model) return;
    const { width: canvasWidth, height: canvasHeight } = this.app.view;
    const baseScale = (contentWidth && contentHeight)
      ? Math.min(contentWidth / originalWidth, contentHeight / originalHeight)
      : Math.min((canvasWidth - 2 * this.marginX) / originalWidth, (canvasHeight - 2 * this.marginY) / originalHeight);
    if (ignoreTransform) {
      this.model.scale.set(baseScale);
      this.model.position.set(canvasWidth * 0.5, canvasHeight * 0.5);
      this.model.rotation = 0;
    } else {
      const scaleFactor = screenBaseScale ? (baseScale / screenBaseScale) : 1;
      this.model.scale.set(baseScale * (scale || 1));
      this.model.position.set(canvasWidth * 0.5 + (x || 0) * scaleFactor, canvasHeight * 0.5 + (y || 0) * scaleFactor);
      this.model.rotation = rotation || 0;
    }
  }

  seek(progress) {
    if (this.model) {
      const mm = this.model.internalModel.motionManager;
      const mqm = mm?.queueManager;
      const entry = mqm?._motions?.[0];
      if (entry?._motion) {
        const targetTime = progress * this._currentDuration;
        const savedStateTime = entry._stateTimeSeconds;
        entry._startTimeSeconds = savedStateTime - targetTime;
        mm.update(this.model.internalModel.coreModel, savedStateTime);
        this.applyOverrides();
        entry._startTimeSeconds = entry._stateTimeSeconds - targetTime;
        this.model.internalModel.coreModel.update();
        this.model.deltaTime = 0;
      }
    }
  }

  render() {
    this.app.render();
  }

  dispose() {
    if (this.model) {
      this.app.stage.removeChild(this.model);
      this.model.destroy();
    }
    this.app.destroy(true);
  }
}

class WorkerSpineRenderer extends SpineRendererBase {
  _currentDuration = 0.1;
  marginX = 0;
  marginY = 0;
  contentWidth = 0;
  contentHeight = 0;
  ignoreTransform = false;

  constructor(canvas, spineLib) {
    super(canvas, spineLib, true);
  }

  async load(dirName, scene, isFileJson, alphaMode = 'unpack') {
    await this.initCtx(alphaMode);
    await this.loadAssets(dirName, scene, isFileJson);
    await this._waitForAssets();
    await this.processLoadedAssets();
    this._currentDuration = this.getAnimationDuration();
  }

  setAnimation(value) {
    super.setAnimation(value);
    this._currentDuration = this.getAnimationDuration();
  }

  setTransform(scale, x, y, rotation, ignoreTransform, contentWidth, contentHeight) {
    this.ignoreTransform = ignoreTransform;
    this.contentWidth = contentWidth;
    this.contentHeight = contentHeight;
    if (ignoreTransform) {
      this.applyTransform(1, 0, 0, 0);
    } else {
      this.applyTransform(scale, x, y, rotation);
    }
  }

  seek(progress) {
    this.seekAnimation(progress);
  }

  render() {
    super.render(0, {
      marginX: this.marginX,
      marginY: this.marginY,
      contentWidth: this.contentWidth,
      contentHeight: this.contentHeight
    });
  }
}

async function processQueue(id) {
  const t = currentTasks.get(id);
  if (!t || t.isRendering || t.renderQueue.length === 0) return;
  t.isRendering = true;
  try {
    while (t.renderQueue.length > 0) {
      const { sampleTime, containerTime, sequence } = t.renderQueue.shift();
      if (t.renderer) {
        t.renderer.seek(sampleTime / (t.renderer._currentDuration || 0.1));
        t.renderer.render();
      }
      if (t.compositeCtx) {
        t.compositeCtx.clearRect(0, 0, t.canvas.width, t.canvas.height);
        if (t.bgBitmap) t.compositeCtx.drawImage(t.bgBitmap, 0, 0, t.canvas.width, t.canvas.height);
        else if (t.bgColor) { t.compositeCtx.fillStyle = t.bgColor; t.compositeCtx.fillRect(0, 0, t.canvas.width, t.canvas.height); }
        t.compositeCtx.drawImage(t.renderCanvas, 0, 0);
      }
      if (t.videoSource) {
        await t.videoSource.add(containerTime, 1 / t.fps);
        self.postMessage({ type: 'FRAME_ADDED', id });
      } else {
        const bitmap = await createImageBitmap(t.canvas);
        self.postMessage({ type: 'FRAME_RENDERED', id, frameIndex: sequence, bitmap }, { transfer: [bitmap] });
      }
    }
  } catch (err) { self.postMessage({ type: 'ERROR', id, error: err.message }); }
  finally { t.isRendering = false; }
}

self.onmessage = async (e) => {
  const { type, id, ...p } = e.data;
  try {
    if (type === 'START_VIDEO' || type === 'START_PNG_SEQUENCE') {
      await loadLibraries(p.rendererType, p.spineVersion, p.libraryBaseUrl);
      self.useNonePMA = (p.rendererType === 'spine' && p.alphaMode !== 'unpack');
      const canvas = new OffscreenCanvas(p.width, p.height);
      const renderCanvas = new OffscreenCanvas(p.width, p.height);
      let renderer;
      if (p.rendererType === 'live2d') {
        renderer = new WorkerLive2DRenderer(renderCanvas);
        await renderer.load(p.modelUrl, p.alphaMode);
        if (p.transform) {
          renderer.marginX = p.marginX || 0;
          renderer.marginY = p.marginY || 0;
          renderer.setTransform(
            p.transform.scale,
            p.transform.x,
            p.transform.y,
            p.transform.rotation,
            p.transform.originalWidth,
            p.transform.originalHeight,
            p.transform.screenBaseScale,
            p.transform.ignoreTransform,
            p.contentWidth,
            p.contentHeight
          );
        }
        if (p.syncState) renderer.applySyncState(p.syncState);
        if (p.animName) await renderer.setAnimation(p.animName);
        if (p.exprName) renderer.setExpression(p.exprName);
        renderer.applyOverrides();
      } else {
        renderer = new WorkerSpineRenderer(renderCanvas, self.spineLib);
        await renderer.load(p.selectedDir, p.fileNames, p.isFileJson, p.alphaMode);
        renderer.marginX = p.marginX || 0;
        renderer.marginY = p.marginY || 0;
        renderer.setTransform(
          p.transform?.scale,
          p.transform?.x,
          p.transform?.y,
          p.transform?.rotation,
          p.transform?.ignoreTransform,
          p.contentWidth,
          p.contentHeight
        );
        if (!renderer._skeletons['0']) throw new Error('Main skeleton failed to load');
        if (p.syncState) {
          if (p.syncState.activeSkins) {
            renderer.applySkins(p.syncState.activeSkins);
          }
          renderer._attachmentsCache = p.syncState.attachmentsCache || {};
        }
        if (p.animName) await renderer.setAnimation(p.animName);
      }
      let output = null, videoSource = null;
      if (type === 'START_VIDEO') {
        output = new Output({ format: new WebMOutputFormat(), target: new BufferTarget() });
        videoSource = new CanvasSource(canvas, { codec: 'vp9', bitrate: p.bitrate, alpha: 'keep' });
        output.addVideoTrack(videoSource);
        await output.start();
      }
      currentTasks.set(id, { canvas, renderCanvas, compositeCtx: renderCanvas !== canvas ? canvas.getContext('2d') : null, bgBitmap: p.bgBitmap, bgColor: p.bgColor, renderer, output, videoSource, fps: p.fps, lastSampleTime: 0, ready: true, renderQueue: [], isRendering: false });
      self.postMessage({ type: 'READY', id, duration: renderer._currentDuration, fps: renderer.getFPS ? renderer.getFPS() : 60 });
    } else if (type === 'RENDER_FRAME') {
      const t = currentTasks.get(id);
      if (t) { t.renderQueue.push(p); processQueue(id); }
    } else if (type === 'FINISH_VIDEO') {
      const t = currentTasks.get(id);
      if (t) { await t.output.finalize(); const buffer = t.output.target.buffer; self.postMessage({ type: 'DONE_VIDEO', id, buffer }, { transfer: [buffer] }); currentTasks.delete(id); }
    }
  } catch (err) { self.postMessage({ type: 'ERROR', id, error: err.message }); }
};
