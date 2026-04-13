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

  setTransform(scale, x, y, rotation, originalWidth, originalHeight, screenBaseScale) {
    if (!this.model) return;
    const { width: canvasWidth, height: canvasHeight } = this.app.view;
    const baseScale = Math.min((canvasWidth - 2 * this.marginX) / originalWidth, (canvasHeight - 2 * this.marginY) / originalHeight);
    const scaleFactor = screenBaseScale ? (baseScale / screenBaseScale) : 1;
    this.model.scale.set(baseScale * (scale || 1));
    this.model.position.set(canvasWidth * 0.5 + (x || 0) * scaleFactor, canvasHeight * 0.5 + (y || 0) * scaleFactor);
    this.model.rotation = rotation || 0;
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
    this.dirName = '';
    this.fileNames = [];
    this.transform = { scale: 1, x: 0, y: 0, rotation: 0 };
    this._currentDuration = 0.1;
    this.attachmentsCache = {};
    this.marginX = 0;
    this.marginY = 0;
    this.alphaMode = 'unpack';
  }

  async load(dirName, fileNames, isFileJson, alphaMode = 'unpack') {
    this.dirName = dirName;
    this.fileNames = fileNames;
    this.alphaMode = alphaMode;
    const isWebUrl = dirName.startsWith('http');
    this.assetManager = new this.spine.AssetManager(this.ctx.gl, isWebUrl ? dirName : '');
    const gl = this.ctx.gl;
    if (gl) {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, alphaMode === 'unpack');
    }
    const baseName = fileNames[0];
    const skelExt = fileNames[1];
    const atlasExt = fileNames[2];
    const loadModel = (name) => {
      if (!isFileJson) this.assetManager.loadBinary(name + skelExt);
      else this.assetManager.loadText(name + skelExt);
      this.assetManager.loadTextureAtlas(name + atlasExt);
    };
    const isMerged = baseName.startsWith('\u200B');
    if (isMerged) {
      for (let i = 3; i < fileNames.length; i++) loadModel(fileNames[i]);
    } else {
      loadModel(baseName);
      for (let i = 3; i < fileNames.length; i++) loadModel(baseName + fileNames[i].split('.')[0]);
    }
    await new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if (this.assetManager.isLoadingComplete()) {
          const errors = this.assetManager.getErrors();
          if (Object.keys(errors).length > 0) reject(new Error("Loading failed: " + JSON.stringify(errors)));
          else resolve();
        } else if (Date.now() - start > 10000) reject(new Error("Loading timeout"));
        else setTimeout(check, 100);
      };
      check();
    });
    const isMerged2 = baseName.startsWith('\u200B');
    if (isMerged2) {
      for (let i = 3; i < fileNames.length; i++) {
        this.skeletons[String(i - 3)] = await this._loadSkeleton(fileNames[i], fileNames, isFileJson);
      }
    } else {
      this.skeletons['0'] = await this._loadSkeleton(baseName, fileNames, isFileJson);
      for (let i = 3; i < fileNames.length; i++) {
        const name2 = baseName + fileNames[i].split('.')[0];
        this.skeletons[String(i - 2)] = await this._loadSkeleton(name2, fileNames, isFileJson);
      }
    }
    this._currentDuration = this.getAnimationDuration();
  }

  async _loadSkeleton(fileName, fileNames, isFileJson) {
    const skelFile = fileName + fileNames[1];
    const atlasFile = fileName + fileNames[2];
    const atlas = this.assetManager.get(atlasFile);
    if (!atlas) throw new Error("Atlas not found: " + atlasFile);

    if (atlas.regions) {
      atlas.regions.forEach(r => { if (r.name) r.name = r.name.trim(); });
      const orig = atlas.findRegion;
      atlas.findRegion = function(name) {
        let res = orig.call(this, name);
        if (!res && name) res = orig.call(this, name.trim());
        return res;
      };
    }

    await this._resizeAtlasPages(atlas, atlasFile);

    const skeletonData = (isFileJson ? new this.spine.SkeletonJson(new this.spine.AtlasAttachmentLoader(atlas)) : new this.spine.SkeletonBinary(new this.spine.AtlasAttachmentLoader(atlas))).readSkeletonData(this.assetManager.get(skelFile));
    const skeleton = new this.spine.Skeleton(skeletonData);
    let initialSkinName;
    if (skeleton.data.skins[0].name === 'default' && skeleton.data.skins.length > 1) initialSkinName = skeleton.data.skins[1].name;
    else initialSkinName = skeleton.data.skins[0].name;
    const newSkin = new this.spine.Skin('_');
    const initialSkin = skeleton.data.findSkin(initialSkinName);
    if (initialSkin) newSkin.addSkin(initialSkin);
    skeleton.setSkin(newSkin);
    skeleton.updateWorldTransform(2);
    const state = new this.spine.AnimationState(new this.spine.AnimationStateData(skeleton.data));
    const offset = new this.spine.Vector2(), size = new this.spine.Vector2();
    skeleton.getBounds(offset, size, []);
    return { skeleton, state, bounds: { offset, size } };
  }

  async _resizeAtlasPages(atlas, atlasPath) {
    let atlasText = null;
    try {
      const isWebUrl = this.dirName.startsWith('http');
      const url = isWebUrl ? this.dirName + atlasPath : atlasPath;
      const res = await fetch(url);
      if (res.ok) atlasText = await res.text();
    } catch (e) {
      console.warn('[WorkerSpineRenderer] Could not fetch atlas text for resize check:', e);
    }
    if (!atlasText) return;

    const declaredSizes = this._parseAtlasDeclaredSizes(atlasText);
    const gl = this.ctx.gl;
    const resizedPages = new Set();
    for (const page of atlas.pages) {
      const tex = page.texture;
      if (!tex || !tex.getImage) continue;
      const img = tex.getImage();
      if (!img) continue;
      const declared = declaredSizes.get(page.name);
      if (!declared) continue;
      if (img.width === declared.width && img.height === declared.height) continue;

      const canvas = new OffscreenCanvas(declared.width, declared.height);
      const ctx2d = canvas.getContext('2d');
      ctx2d.imageSmoothingEnabled = false;
      ctx2d.drawImage(img, 0, 0, declared.width, declared.height);
      tex._image = canvas;
      tex.bind();
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
      page.width = declared.width;
      page.height = declared.height;
      resizedPages.add(page);
    }
    if (resizedPages.size > 0 && atlas.regions) {
      for (const region of atlas.regions) {
        if (!resizedPages.has(region.page)) continue;
        const pw = region.page.width;
        const ph = region.page.height;
        region.u = region.x / pw;
        region.v = region.y / ph;
        const isRotated = region.degrees === 90 || region.rotate === true;
        if (isRotated) {
          region.u2 = (region.x + region.height) / pw;
          region.v2 = (region.y + region.width) / ph;
        } else {
          region.u2 = (region.x + region.width) / pw;
          region.v2 = (region.y + region.height) / ph;
        }
      }
    }
  }

  _parseAtlasDeclaredSizes(atlasText) {
    const sizes = new Map();
    const lines = atlasText.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line.endsWith('.png') && !line.endsWith('.jpg') && !line.endsWith('.jpeg') && !line.endsWith('.webp')) continue;
      const pageName = line;
      for (let j = i + 1; j < lines.length; j++) {
        const entry = lines[j].trim();
        if (!entry || (!entry.includes(':') && (entry.endsWith('.png') || entry.endsWith('.jpg')))) break;
        const sizeMatch = entry.match(/^size\s*:\s*(\d+)\s*,\s*(\d+)/);
        if (sizeMatch) {
          sizes.set(pageName, { width: parseInt(sizeMatch[1]), height: parseInt(sizeMatch[2]) });
          break;
        }
      }
    }
    return sizes;
  }

  getAnimationDuration() {
    const s = this.skeletons['0']?.state;
    return (s && s.tracks[0]?.animation?.duration) || 0.1;
  }

  setAnimation(value) {
    for (const k in this.skeletons) this.skeletons[k].state.setAnimation(0, value, true);
    this._currentDuration = this.getAnimationDuration();
  }

  setTransform(scale, x, y, rotation) { this.transform = { scale, x, y, rotation }; }

  seek(progress) {
    for (const k in this.skeletons) {
      const { skeleton, state } = this.skeletons[k];
      const entry = state.tracks[0];
      if (entry) {
        entry.trackTime = entry.animation.duration * progress;
        state.apply(skeleton);
        skeleton.updateWorldTransform(2);
      }
    }
  }

  render() {
    const gl = this.ctx.gl, { width, height } = this.canvas;
    this._updateMVP(width, height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    const baseName = this.fileNames[0];
    const keys = Object.keys(this.skeletons).sort((a, b) => {
      const getL = (k) => {
        const isMerged = baseName.startsWith('\u200B');
        if (!isMerged && k === '0') return 0;
        const name = (this.fileNames[isMerged ? parseInt(k) + 3 : parseInt(k) + 2] || '').toLowerCase();
        return name.includes('_fg') ? 1 : (name.includes('_bg') ? -1 : 0);
      };
      const la = getL(a), lb = getL(b);
      return la !== lb ? la - lb : parseInt(a) - parseInt(b);
    });
    for (const k of keys) {
      const { skeleton } = this.skeletons[k];
      this._syncHidden(skeleton, k);
      this.shader.bind();
      this.shader.setUniformi(this.spine.Shader.SAMPLER, 0);
      this.shader.setUniform4x4f(this.spine.Shader.MVP_MATRIX, this.mvp.values);
      this.batcher.begin(this.shader);
      this.skeletonRenderer.premultipliedAlpha = (this.alphaMode === 'unpack' || this.alphaMode === 'pma');
      this.skeletonRenderer.draw(this.batcher, skeleton);
      this.batcher.end();
    }
  }

  _updateMVP(w, h) {
    const bounds = this.skeletons['0'].bounds;
    const { scale, x, y, rotation } = this.transform;
    const centerX = bounds.offset.x + bounds.size.x * 0.5, centerY = bounds.offset.y + bounds.size.y * 0.5;
    let s = Math.max(bounds.size.x / (w - 2 * this.marginX), bounds.size.y / (h - 2 * this.marginY)) / scale;
    this.mvp.ortho2d(centerX - x * s - (w * s) * 0.5, centerY + y * s - (h * s) * 0.5, w * s, h * s);
    if (rotation) {
      const cos = Math.cos(Math.PI * rotation), sin = Math.sin(Math.PI * rotation);
      const t1 = new this.spine.Matrix4(); t1.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, centerX, centerY, 0, 1]);
      const rot = new this.spine.Matrix4(); rot.set([cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      const t2 = new this.spine.Matrix4(); t2.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -centerX, -centerY, 0, 1]);
      this.mvp.multiply(t1); this.mvp.multiply(rot); this.mvp.multiply(t2);
    }
    this.ctx.gl.viewport(0, 0, w, h);
  }

  _syncHidden(skeleton, id) {
    Object.values(this.attachmentsCache).forEach(([idx, att]) => {
      if (!att.isSkeleton && String(att.skeletonId || '0') === String(id) && skeleton.slots[idx]?.attachment?.name === att.name) skeleton.slots[idx].attachment = null;
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
          renderer.setTransform(p.transform.scale, p.transform.x, p.transform.y, p.transform.rotation, p.transform.originalWidth, p.transform.originalHeight, p.transform.screenBaseScale);
        }
        if (p.syncState) renderer.applySyncState(p.syncState);
        if (p.animName) await renderer.setAnimation(p.animName);
        if (p.exprName) renderer.setExpression(p.exprName);
        renderer.applyOverrides();
      } else {
        renderer = new WorkerSpineRenderer(renderCanvas, self.spineLib);
        await renderer.load(p.selectedDir, p.fileNames, p.isFileJson, p.alphaMode);
        renderer.setTransform(p.transform?.scale, p.transform?.x, p.transform?.y, p.transform?.rotation);
        if (p.syncState) {
          if (p.syncState.activeSkins) {
            const s = renderer.skeletons['0'].skeleton, st = renderer.skeletons['0'].state, nk = new renderer.spine.Skin('_');
            for (const sn of p.syncState.activeSkins) { const sk = s.data.findSkin(sn); if (sk) nk.addSkin(sk); }
            s.setSkin(nk); s.setToSetupPose(); st.apply(s);
          }
          renderer.attachmentsCache = p.syncState.attachmentsCache || {};
        }
        if (p.animName) await renderer.setAnimation(p.animName);
      }
      let output = null, videoSource = null;
      if (type === 'START_VIDEO') {
        output = new Output({ format: new WebMOutputFormat(), target: new BufferTarget() });
        videoSource = new CanvasSource(canvas, { codec: 'vp9', bitrate: p.bitrate });
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
