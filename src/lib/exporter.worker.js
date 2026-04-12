import { Output, WebMOutputFormat, BufferTarget, CanvasSource } from 'mediabunny';
import { setupWorkerEnv } from './workerPolyfills.js';

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
      const oldLog = console.log;
      console.log = (...args) => {
        const firstArg = args[0];
        if (typeof firstArg === 'string' && (firstArg.includes('[CSM]') || firstArg.includes('Live2D Cubism') || firstArg.includes('Live2D 2.1'))) {
          return;
        }
        oldLog.apply(console, args);
      };
      try {
        for (const url of scripts) {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);
          let code = await response.text();
          code += "\n;if(typeof PIXI !== 'undefined') self.PIXI = PIXI; if(typeof Live2DCubismCore !== 'undefined') self.Live2DCubismCore = Live2DCubismCore; if(typeof Live2D !== 'undefined') self.Live2D = Live2D;";
          (0, eval)(code);
        }
      } finally {
        console.log = oldLog;
      }
      if (!self.PIXI) {
        throw new Error('PIXI failed to initialize after eval');
      }
      self.setupPIXISettings(self.PIXI);
    } else if (isSpine && version) {
      const url = `${origin}/lib/spine-webgl-${version}.js`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      let code = await response.text();
      code += "\n;if(typeof spine !== 'undefined') self.spine = spine;";
      (0, eval)(code);
      if (!self.spine) {
        throw new Error(`Spine failed to initialize after eval (version: ${version})`);
      }
      if (version[0] === '3') {
        if (self.spine.webgl) {
          Object.assign(self.spine, self.spine.webgl);
        }
        if (!self.spine.core) {
          self.spine.core = self.spine;
        }
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
    this.bgSprite = null;
    this.bgRect = null;
    this._currentDuration = 0.1;
    this.parameterOverrides = new Map();
    this.partOverrides = new Map();
    this.drawableOverrides = new Map();
    this.hiddenDrawables = new Set();
    this.opacities = null;
    this.marginX = 0;
    this.marginY = 0;
  }

  setupBackground(bgBitmap, bgColor) {
    if (bgColor) {
      this.bgRect = new PIXI.Graphics();
      this.bgRect.beginFill(this.parseColor(bgColor));
      this.bgRect.drawRect(0, 0, this.app.view.width, this.app.view.height);
      this.bgRect.endFill();
      this.app.stage.addChildAt(this.bgRect, 0);
    }
    if (bgBitmap) {
      const texture = PIXI.Texture.from(bgBitmap);
      this.bgSprite = new PIXI.Sprite(texture);
      this.bgSprite.width = this.app.view.width;
      this.bgSprite.height = this.app.view.height;
      this.app.stage.addChildAt(this.bgSprite, bgColor ? 1 : 0);
    }
  }

  parseColor(colorStr) {
    if (!colorStr) return 0x000000;
    if (colorStr.startsWith('#')) return parseInt(colorStr.slice(1), 16);
    if (colorStr.startsWith('rgb')) {
      const match = colorStr.match(/\d+/g);
      if (match) return (match[0] << 16) | (match[1] << 8) | match[2];
    }
    return 0x000000;
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
        const mqm = this.model.internalModel.motionManager?.queueManager;
        if (mqm?._motions?.length > 0) {
          const entry = mqm._motions[0];
          const m = entry._motion;
          if (m) {
            this._currentDuration = m._loopDurationSeconds ||
              (m._motionData && m._motionData.duration) ||
              (m.getDuration ? m.getDuration() : 0.1);
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

  setTransform(scale, x, y, rotation, originalWidth, originalHeight, screenBaseScale) {
    if (!this.model) return;
    const { width: canvasWidth, height: canvasHeight } = this.app.view;
    const baseScale = Math.min((canvasWidth - 2 * this.marginX) / originalWidth, (canvasHeight - 2 * this.marginY) / originalHeight);
    const scaleFactor = screenBaseScale ? (baseScale / screenBaseScale) : 1;
    this.model.scale.set(baseScale * (scale || 1));
    this.model.position.set(canvasWidth * 0.5 + (x || 0) * scaleFactor, canvasHeight * 0.5 + (y || 0) * scaleFactor);
    this.model.rotation = rotation || 0;
  }

  render() {
    this.app.render();
  }

  dispose() {
    if (this.model) {
      this.app.stage.removeChild(this.model);
      this.model.destroy();
    }
    if (this.bgSprite) {
      this.app.stage.removeChild(this.bgSprite);
      this.bgSprite.destroy(true);
    }
    if (this.bgRect) {
      this.app.stage.removeChild(this.bgRect);
      this.bgRect.destroy();
    }
    if (this.app) {
      this.app.destroy(false);
    }
  }
}

class WorkerSpineRenderer {
  constructor(canvas, spineLib) {
    this.canvas = canvas;
    this.spine = spineLib;
    this.ctx = new spineLib.ManagedWebGLRenderingContext(canvas, { preserveDrawingBuffer: true });
    this.shader = spineLib.Shader.newTwoColoredTextured(this.ctx);
    this.batcher = new spineLib.PolygonBatcher(this.ctx);
    this.skeletonRenderer = new spineLib.SkeletonRenderer(this.ctx);
    this.mvp = new spineLib.Matrix4();
    this.assetManager = null;
    this.skeletons = {};
    this.alphaMode = 'unpack';
    this.transform = { scale: 1, x: 0, y: 0, rotation: 0 };
    this.syncState = null;
    this.parameterOverrides = new Map();
    this.partOverrides = new Map();
    this.drawableOverrides = new Map();
    this._currentDuration = 0.1;
    this.attachmentsCache = {};
    this.dirName = '';
    this.marginX = 0;
    this.marginY = 0;
    this.bgColor = null;
    this.bgBitmap = null;
    this.fileNames = [];
  }

  setupBackground(bgBitmap, bgColor) {
    this.bgBitmap = bgBitmap;
    this.bgColor = bgColor;
  }

  async load(dirName, fileNames, isFileJson) {
    this.fileNames = fileNames;
    const isWebUrl = dirName.startsWith('http://') || dirName.startsWith('https://') || dirName.startsWith('asset://');
    this.assetManager = new this.spine.AssetManager(this.ctx.gl, isWebUrl ? dirName : '');
    const baseName = fileNames[0];
    const skelExt = fileNames[1];
    const atlasExt = fileNames[2];
    const makePath = (name, ext) => isWebUrl ? `${name}${ext}` : `${dirName}${name}${ext}`;

    const loadModel = (name) => {
      if (!isFileJson) this.assetManager.loadBinary(makePath(name, skelExt));
      else this.assetManager.loadText(makePath(name, skelExt));
      this.assetManager.loadTextureAtlas(makePath(name, atlasExt));
    };

    loadModel(baseName);
    for (let i = 3; i < fileNames.length; i++) {
      const name2 = `${baseName}${fileNames[i].split('.')[0]}`;
      loadModel(name2);
    }

    await new Promise(resolve => {
      const check = () => {
        if (this.assetManager.isLoadingComplete()) resolve();
        else setTimeout(check, 10);
      };
      check();
    });

    this.skeletons['0'] = this._loadSkeleton(baseName, fileNames, isFileJson);
    for (let i = 3; i < fileNames.length; i++) {
      const name2 = `${baseName}${fileNames[i].split('.')[0]}`;
      this.skeletons[String(i - 2)] = this._loadSkeleton(name2, fileNames, isFileJson);
    }
    this._currentDuration = this.getAnimationDuration();
  }

  _loadSkeleton(fileName, fileNames, isFileJson) {
    const atlasPath = this.dirName.startsWith('http') ? `${fileName}${fileNames[2]}` : `${this.dirName}${fileName}${fileNames[2]}`;
    const atlas = this.assetManager.get(atlasPath);
    const atlasLoader = new this.spine.AtlasAttachmentLoader(atlas);
    const skeletonLoader = isFileJson ? new this.spine.SkeletonJson(atlasLoader) : new this.spine.SkeletonBinary(atlasLoader);
    const skeletonData = skeletonLoader.readSkeletonData(this.assetManager.get(this.dirName.startsWith('http') ? `${fileName}${fileNames[1]}` : `${this.dirName}${fileName}${fileNames[1]}`));
    const skeleton = new this.spine.Skeleton(skeletonData);
    let initialSkinName;
    if (skeleton.data.skins[0].name === 'default' && skeleton.data.skins.length > 1)
      initialSkinName = skeleton.data.skins[1].name;
    else
      initialSkinName = skeleton.data.skins[0].name;
    const newSkin = new this.spine.Skin('_');
    const initialSkin = skeleton.data.findSkin(initialSkinName);
    if (initialSkin) newSkin.addSkin(initialSkin);
    skeleton.setSkin(newSkin);
    const bounds = this._calculateBounds(skeleton);
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform(2);
    const stateData = new this.spine.AnimationStateData(skeleton.data);
    const state = new this.spine.AnimationState(stateData);
    return { skeleton, state, bounds };
  }

  _calculateBounds(skeleton) {
    const offset = new this.spine.Vector2();
    const size = new this.spine.Vector2();
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform(2);
    skeleton.getBounds(offset, size, []);
    return { offset, size };
  }

  applySyncState(state) {
    if (!state) return;
    this.syncState = state;
    if (state.activeSkins) {
      const names = state.activeSkins;
      for (const key in this.skeletons) {
        const skeleton = this.skeletons[key]?.skeleton;
        if (skeleton) {
          const newSkin = new this.spine.Skin('_');
          for (const skinName of names) {
            const skin = skeleton.data.findSkin(skinName);
            if (skin) newSkin.addSkin(skin);
          }
          skeleton.setSkin(newSkin);
          skeleton.setToSetupPose();
        }
      }
    }
    if (state.attachmentsCache) {
      this.attachmentsCache = state.attachmentsCache;
    }
    if (state.parameterOverrides) {
      this.parameterOverrides = new Map(state.parameterOverrides);
    }
    if (state.partOverrides) {
      this.partOverrides = new Map(state.partOverrides);
    }
    if (state.drawableOverrides) {
      this.drawableOverrides = new Map(state.drawableOverrides);
    }
  }

  async setAnimation(value) {
    if (!value) return;
    for (const key in this.skeletons) {
      const { skeleton, state } = this.skeletons[key];
      state.setAnimation(0, value, true);
    }
    this._currentDuration = this.getAnimationDuration();
  }

  setExpression(value) { }

  getAnimationDuration() {
    const state = this.skeletons['0']?.state;
    if (state && state.tracks[0] && state.tracks[0].animation) {
      return state.tracks[0].animation.duration;
    }
    return 0.1;
  }

  getFPS() { return 60; }

  setTransform(scale, x, y, rotation) {
    this.transform = { scale, x, y, rotation };
  }

  seek(progress) {
    for (const key in this.skeletons) {
      const { skeleton, state } = this.skeletons[key];
      const entry = state.tracks[0];
      if (entry) {
        entry.trackTime = entry.animation.duration * progress;
        state.apply(skeleton);
        skeleton.updateWorldTransform(2);
      }
    }
  }

  render() {
    const gl = this.ctx.gl;
    const { width, height } = this.canvas;
    const dpr = 1;
    this._updateMVP(width, height, dpr);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const sortedKeys = Object.keys(this.skeletons).sort((a, b) => {
      const getLayer = (k) => {
        if (k === '0') return 0;
        const index = parseInt(k) + 2;
        const name = (this.fileNames[index] || '').toLowerCase();
        if (name.includes('_fg')) return 1;
        if (name.includes('_bg')) return -1;
        return -0.5;
      };
      const la = getLayer(a);
      const lb = getLayer(b);
      if (la !== lb) return la - lb;
      return parseInt(b) - parseInt(a);
    });
    for (const key of sortedKeys) {
      const { skeleton, state } = this.skeletons[key];
      this._syncHiddenAttachments(skeleton, key);
      this.applyOverrides(skeleton);
      this.shader.bind();
      this.shader.setUniformi(this.spine.Shader.SAMPLER, 0);
      this.shader.setUniform4x4f(this.spine.Shader.MVP_MATRIX, this.mvp.values);
      this.batcher.begin(this.shader);
      this.skeletonRenderer.premultipliedAlpha = true;
      this.skeletonRenderer.draw(this.batcher, skeleton);
      this.batcher.end();
      this.shader.unbind();
    }
  }

  _updateMVP(canvasWidth, canvasHeight, dpr) {
    const logicalWidth = canvasWidth / dpr;
    const logicalHeight = canvasHeight / dpr;
    const bounds = this.skeletons['0'].bounds;
    const centerX = bounds.offset.x + bounds.size.x * 0.5;
    const centerY = bounds.offset.y + bounds.size.y * 0.5;
    const scaleX = bounds.size.x / (logicalWidth - 2 * this.marginX);
    const scaleY = bounds.size.y / (logicalHeight - 2 * this.marginY);
    let scale = Math.max(scaleX, scaleY);
    const { scale: userScale, x: userMoveX, y: userMoveY, rotation: userRotate } = this.transform;
    scale /= userScale;
    const width = logicalWidth * scale;
    const height = logicalHeight * scale;
    const viewCenterX = centerX - userMoveX * scale;
    const viewCenterY = centerY + userMoveY * scale;
    this.mvp.ortho2d(viewCenterX - width * 0.5, viewCenterY - height * 0.5, width, height);
    if (userRotate) {
      const cos = Math.cos(Math.PI * userRotate);
      const sin = Math.sin(Math.PI * userRotate);
      const t1 = new this.spine.Matrix4();
      t1.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, centerX, centerY, 0, 1]);
      const rot = new this.spine.Matrix4();
      rot.set([cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      const t2 = new this.spine.Matrix4();
      t2.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -centerX, -centerY, 0, 1]);
      this.mvp.multiply(t1);
      this.mvp.multiply(rot);
      this.mvp.multiply(t2);
    }
    this.ctx.gl.viewport(0, 0, canvasWidth, canvasHeight);
  }

  _syncHiddenAttachments(skeleton, id) {
    if (!this.attachmentsCache) return;
    Object.values(this.attachmentsCache).forEach(([slotIndex, cachedAttachment]) => {
      if (cachedAttachment.isSkeleton) return;
      const targetSkelId = cachedAttachment.skeletonId || '0';
      if (String(targetSkelId) !== String(id)) return;
      const slot = skeleton.slots[slotIndex];
      if (slot && slot.attachment && (slot.attachment.name === cachedAttachment.name)) {
        slot.attachment = null;
      }
    });
  }

  applyOverrides(skeleton) {
    if (this.parameterOverrides.size > 0) {
      const items = this._getParameterItems(skeleton);
      for (const [name, value] of this.parameterOverrides.entries()) {
        const item = items.find(i => i.name === name);
        if (item && item._target && item._prop) {
          item._target[item._prop] = value;
        }
      }
    }
  }

  _getParameterItems(skel) {
    if (!skel) return [];
    const items = [];
    if (skel.ikConstraints) {
      for (const ik of skel.ikConstraints) {
        items.push({ name: `IK: ${ik.data.name}`, _target: ik, _prop: 'mix' });
      }
    }
    if (skel.transformConstraints) {
      for (const tc of skel.transformConstraints) {
        for (const prop of ['mixRotate', 'mixX', 'mixY', 'mixScaleX', 'mixScaleY', 'mixShearY']) {
          if (tc[prop] !== undefined) {
            const label = prop.replace(/([A-Z])/g, ' $1').trim();
            items.push({ name: `TF ${tc.data.name}: ${label}`, _target: tc, _prop: prop });
          }
        }
      }
    }
    if (skel.pathConstraints) {
      for (const pc of skel.pathConstraints) {
        for (const prop of ['mixRotate', 'mixX', 'mixY']) {
          if (pc[prop] !== undefined) {
            const label = prop.replace(/([A-Z])/g, ' $1').trim();
            items.push({ name: `Path ${pc.data.name}: ${label}`, _target: pc, _prop: prop });
          }
        }
      }
    }
    if (skel.bones) {
      for (const bone of skel.bones) {
        items.push({ name: `Bone ${bone.data.name}: x`, _target: bone, _prop: 'x' });
        items.push({ name: `Bone ${bone.data.name}: y`, _target: bone, _prop: 'y' });
      }
    }
    return items;
  }

  dispose() {
    if (this.assetManager && typeof this.assetManager.dispose === 'function') this.assetManager.dispose();
    if (this.batcher && typeof this.batcher.dispose === 'function') this.batcher.dispose();
    if (this.shader && typeof this.shader.dispose === 'function') this.shader.dispose();
    if (this.ctx && typeof this.ctx.dispose === 'function') this.ctx.dispose();
  }
}

async function processRenderQueue(id) {
  const task = currentTasks.get(id);
  if (!task || task.isRendering || task.renderQueue.length === 0) return;
  task.isRendering = true;
  try {
    while (task.renderQueue.length > 0) {
      const payload = task.renderQueue.shift();
      const { sampleTime, containerTime, sequence } = payload;
      const delta = (sampleTime - task.lastSampleTime) * 1000;
      task.lastSampleTime = sampleTime;
      if (task.renderer) {
        if (task.rendererType === 'live2d' && task.renderer.model) {
          task.renderer.model.update(delta);
          task.renderer.applyOverrides();
        } else if (task.rendererType === 'spine') {
          task.renderer.seek(sampleTime / (task.renderer._currentDuration || 0.1));
        }
        task.renderer.render();
      }
      if (task.compositeCtx) {
        const ctx = task.compositeCtx;
        ctx.clearRect(0, 0, task.canvas.width, task.canvas.height);
        if (task.bgBitmap) {
          ctx.drawImage(task.bgBitmap, 0, 0, task.canvas.width, task.canvas.height);
        } else if (task.bgColor) {
          ctx.fillStyle = task.bgColor;
          ctx.fillRect(0, 0, task.canvas.width, task.canvas.height);
        }
        ctx.drawImage(task.renderCanvas, 0, 0);
      }
      if (task.videoSource) {
        try {
          await task.videoSource.add(containerTime, 1 / task.fps);
          self.postMessage({ type: 'FRAME_ADDED', id });
        } catch (err) {
          self.postMessage({ type: 'ERROR', id, error: err.message });
        }
      } else {
        try {
          const bitmap = await createImageBitmap(task.canvas);
          self.postMessage({ type: 'FRAME_RENDERED', id, frameIndex: sequence, bitmap }, { transfer: [bitmap] });
        } catch (err) {
          self.postMessage({ type: 'ERROR', id, error: err.message });
        }
      }
    }
  } finally {
    task.isRendering = false;
  }
}

async function handleStartTask(id, type, payload) {
  const { width, height, bitrate, fps, modelUrl, animName, exprName, rendererType, bgBitmap, bgColor, spineVersion, selectedDir, fileNames, isFileJson, marginX, marginY, libraryBaseUrl } = payload;
  await loadLibraries(rendererType, spineVersion, libraryBaseUrl);
  const canvas = new OffscreenCanvas(width, height);
  let renderer = null;
  let renderCanvas = canvas;
  if (rendererType === 'live2d') {
    renderer = new WorkerLive2DRenderer(canvas);
    renderer.setupBackground(bgBitmap, bgColor);
    await renderer.load(modelUrl);
    if (payload.transform) {
      const { scale, x, y, rotation, originalWidth, originalHeight, screenBaseScale } = payload.transform;
      renderer.marginX = marginX || 0;
      renderer.marginY = marginY || 0;
      renderer.setTransform(scale, x, y, rotation, originalWidth, originalHeight, screenBaseScale);
    }
    if (payload.syncState) {
      renderer.applySyncState(payload.syncState);
    }
    if (animName) await renderer.setAnimation(animName);
    if (exprName) renderer.setExpression(exprName);
    renderer.applyOverrides();
  } else if (rendererType === 'spine') {
    renderCanvas = new OffscreenCanvas(width, height);
    renderer = new WorkerSpineRenderer(renderCanvas, self.spineLib);
    renderer.dirName = selectedDir;
    renderer.setupBackground(bgBitmap, bgColor);
    await renderer.load(selectedDir, fileNames, isFileJson);
    if (payload.transform) {
      const { scale, x, y, rotation } = payload.transform;
      renderer.marginX = marginX || 0;
      renderer.marginY = marginY || 0;
      renderer.setTransform(scale, x, y, rotation);
    }
    if (payload.syncState) {
      renderer.applySyncState(payload.syncState);
    }
    if (animName) await renderer.setAnimation(animName);
    renderer.render();
  }
  let output = null;
  let videoSource = null;
  if (type === 'START_VIDEO') {
    output = new Output({
      format: new WebMOutputFormat(),
      target: new BufferTarget()
    });
    try {
      videoSource = new CanvasSource(canvas, {
        codec: 'vp9',
        bitrate: bitrate,
      });
      output.addVideoTrack(videoSource);
      await output.start();
    } catch (err) {
      console.error('Worker: Failed to initialize video output', err);
      self.postMessage({ type: 'ERROR', id, error: err.message });
      return;
    }
  }
  currentTasks.set(id, {
    canvas,
    renderCanvas,
    compositeCtx: (renderCanvas !== canvas) ? canvas.getContext('2d') : null,
    bgBitmap,
    bgColor,
    renderer,
    output,
    videoSource,
    fps,
    lastSampleTime: 0,
    cancelled: false,
    ready: true,
    renderQueue: [],
    isRendering: false,
    rendererType
  });
  const finalDuration = renderer ? (renderer._currentDuration || 0.1) : (payload.duration || 0.1);
  const finalFps = (renderer && renderer.getFPS) ? renderer.getFPS() : (payload.fps || 60);
  self.postMessage({ type: 'READY', id, duration: finalDuration, fps: finalFps });
  self.postMessage({ type: 'STARTED', id });
}

async function handleFinishVideo(id) {
  const task = currentTasks.get(id);
  if (!task || task.cancelled) return;
  try {
    await task.output.finalize();
    const buffer = task.output.target.buffer;
    self.postMessage({ type: 'DONE_VIDEO', id, buffer }, { transfer: [buffer] });
  } catch (err) {
    self.postMessage({ type: 'ERROR', id, error: err.message });
  } finally {
    if (task.renderer) task.renderer.dispose();
    currentTasks.delete(id);
  }
}

async function handleCancelTask(id) {
  const task = currentTasks.get(id);
  if (!task) return;
  task.cancelled = true;
  if (task.output) {
    try { await task.output.finalize(); } catch (err) { }
  }
  if (task.renderer) {
    task.renderer.dispose();
  }
  task.renderQueue = [];
  currentTasks.delete(id);
}

self.onmessage = async (e) => {
  const { type, id, ...payload } = e.data;
  switch (type) {
    case 'CANCEL':
      await handleCancelTask(id);
      break;
    case 'START_VIDEO':
    case 'START_PNG_SEQUENCE':
      await handleStartTask(id, type, payload);
      break;
    case 'RENDER_FRAME': {
      const task = currentTasks.get(id);
      if (!task || task.cancelled || !task.ready) return;
      task.renderQueue.push(payload);
      processRenderQueue(id);
      break;
    }
    case 'ADD_FRAME_VIDEO':
    case 'PROCESS_FRAME_PNG': {
      const task = currentTasks.get(id);
      if (!task || task.cancelled || !task.ready) return;
      const { bitmap, containerTime, frameIndex } = payload;
      const ctx = task.canvas.getContext('2d');
      if (ctx && bitmap) {
        ctx.clearRect(0, 0, task.canvas.width, task.canvas.height);
        ctx.drawImage(bitmap, 0, 0);
        bitmap.close();
      }
      if (type === 'ADD_FRAME_VIDEO') {
        if (task.output) {
          try {
            await task.videoSource.add(containerTime, 1 / task.fps);
            self.postMessage({ type: 'FRAME_ADDED', id });
          } catch (err) {
            console.error('Worker: ADD_FRAME_VIDEO error', err);
            self.postMessage({ type: 'ERROR', id, error: err.message });
          }
        }
      } else {
        self.postMessage({ type: 'FRAME_RENDERED', id, frameIndex, bitmap }, { transfer: [bitmap] });
      }
      break;
    }
    case 'FINISH_VIDEO':
      await handleFinishVideo(id);
      break;
    case 'FINISH_PNG_SEQUENCE': {
      const task = currentTasks.get(id);
      if (task && task.renderer) task.renderer.dispose();
      currentTasks.delete(id);
      break;
    }
  }
};
