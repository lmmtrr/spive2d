import { convertFileSrc } from '@tauri-apps/api/core';
import { BaseRenderer } from './BaseRenderer.js';
import {
  setupSpineAssetManager,
  initializeSkeleton,
  calculateSpineMVP,
  setupAtlas,
  updateAtlasRegions,
  parseAtlasDeclaredSizes,
  normalizeAtlasText,
  createCanvas
} from './SpineCommon.js';

export class SpineRendererBase extends BaseRenderer {
  _canvas;
  _spine = null;
  _ctx = null;
  _shader = null;
  _batcher = null;
  _skeletonRenderer = null;
  _assetManager = null;
  _mvp = null;
  _dirName = '';
  _fileNames = [];
  _skeletons = {};
  _animationStates = [];
  _alphaMode = 'unpack';
  _paused = false;
  _speed = 1.0;
  _attachmentsCache = {};
  _activeSkins = null;
  _isFileJson = false;

  constructor(canvas, spineLib, isExport = false) {
    super(isExport);
    this._canvas = canvas;
    this._spine = spineLib;
  }

  async initCtx(alphaMode = 'unpack') {
    this._alphaMode = alphaMode;
    this._ctx = new this._spine.ManagedWebGLRenderingContext(this._canvas, {
      preserveDrawingBuffer: true,
    });
    const gl = this._ctx.gl;
    if (gl) {
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, alphaMode === 'unpack');
    }
    this._shader = this._spine.Shader.newTwoColoredTextured(this._ctx);
    this._batcher = new this._spine.PolygonBatcher(this._ctx);
    this._skeletonRenderer = new this._spine.SkeletonRenderer(this._ctx);
    this._mvp = new this._spine.Matrix4();
  }

  async setAlphaMode(mode) {
    this._alphaMode = mode;
    if (this._ctx?.gl) {
      const gl = this._ctx.gl;
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, mode === 'unpack');
    }
    if (this._dirName) {
      await this.loadAssets(this._dirName, this._fileNames, this._isFileJson);
      await this._waitForAssets();
      await this.processLoadedAssets();
      if (this._activeSkins) {
        this.applySkins(Array.from(this._activeSkins));
      }
    }
  }

  setSpeed(speed) {
    this._speed = speed;
  }

  setPaused(paused) {
    this._paused = paused;
  }

  getCurrentTime() {
    for (const key of this._getSortedSkeletonKeys()) {
      const entry = this._skeletons[key]?.state.tracks[0];
      if (!entry) continue;
      const duration = entry.animation.duration;
      if (duration > 0) {
        return entry.trackTime % duration;
      }
    }
    return 0;
  }

  getFPS() {
    return 60;
  }

  _waitForAssets() {
    return new Promise((resolve) => {
      const check = () => {
        if (!this._assetManager || this._assetManager.isLoadingComplete()) {
          resolve();
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  }

  async loadAssets(dirName, scene, isJson) {
    this._dirName = dirName;
    this._fileNames = scene;
    this._isFileJson = isJson;
    this._skeletons = {};
    this._animationStates = [];
    this._attachmentsCache = {};
    this._activeSkins = null;
    this._assetManager = new this._spine.AssetManager(this._ctx.gl, '');
    setupSpineAssetManager(this._assetManager, this._spine, this._ctx.gl);
    const mainExt = scene.mainExt;
    const atlasExt = scene.atlasExt;
    const normalizedDirName = dirName.endsWith('/') ? dirName : `${dirName}/`;
    const makePath = (name, ext) => `${normalizedDirName}${name}${ext}`;
    const loadModel = (name) => {
      if (!this._isFileJson) this._assetManager.loadBinary(makePath(name, mainExt));
      else this._assetManager.loadText(makePath(name, mainExt));
      this._assetManager.loadTextureAtlas(makePath(name, atlasExt));
    };
    if (scene.isMerged) {
      for (const name of scene.files) loadModel(name);
    } else {
      loadModel(scene.name);
      for (const extraFile of scene.files) {
        if (!extraFile.endsWith('.skel') && !extraFile.endsWith('.json') && !extraFile.endsWith('.asset')) continue;
        loadModel(scene.name + extraFile.split('.')[0]);
      }
    }
  }

  async processLoadedAssets() {
    const sceneInfo = this._fileNames;
    if (sceneInfo.isMerged) {
      for (let i = 0; i < sceneInfo.files.length; i++) {
        const skel = await this._loadSkeleton(sceneInfo.files[i]);
        if (skel) this._skeletons[String(i)] = skel;
      }
    } else {
      const skel0 = await this._loadSkeleton(sceneInfo.name);
      if (skel0) this._skeletons['0'] = skel0;
      for (let i = 0; i < sceneInfo.files.length; i++) {
        const extraFile = sceneInfo.files[i];
        if (!extraFile.endsWith('.skel') && !extraFile.endsWith('.json') && !extraFile.endsWith('.asset')) continue;
        const name2 = sceneInfo.name + extraFile.split('.')[0];
        const skelN = await this._loadSkeleton(name2);
        if (skelN) this._skeletons[String(i + 1)] = skelN;
      }
    }
  }

  async _loadSkeleton(fileName) {
    const sceneInfo = this._fileNames;
    const normalizedDirName = this._dirName.endsWith('/') ? this._dirName : `${this._dirName}/`;
    const makePath = (name, ext) => `${normalizedDirName}${name}${ext}`;
    const atlasPath = makePath(fileName, sceneInfo.atlasExt);
    const atlas = this._assetManager.get(atlasPath);
    if (!atlas) return null;
    if (atlas.regions) setupAtlas(atlas);
    const isWebUrl = this._dirName.startsWith('http://') || this._dirName.startsWith('https://');
    await this._resizeAtlasPages(atlas, atlasPath, isWebUrl);
    for (const page of atlas.pages) {
      if (page.minFilter >= 9984 && page.minFilter <= 9987) {
        page.minFilter = this._spine.TextureFilter.Linear;
        page.magFilter = this._spine.TextureFilter.Linear;
      }
      if (page.texture?.setFilters) {
        page.texture.setFilters(this._spine.TextureFilter.Linear, this._spine.TextureFilter.Linear);
      }
    }
    const { skeleton, state, initialSkinNames } = initializeSkeleton(this._spine, atlas, this._assetManager.get(makePath(fileName, sceneInfo.mainExt)), this._isFileJson);
    if (!this._activeSkins) this._activeSkins = new Set(initialSkinNames);
    this._animationStates.push(state);
    const bounds = this._calculateBounds(skeleton);
    if (skeleton.data.width === 0 || isNaN(skeleton.data.width)) {
      skeleton.data.width = bounds.size.x;
      skeleton.data.height = bounds.size.y;
    }
    const animations = skeleton.data.animations;
    if (animations.length > 0) state.setAnimation(0, animations[0].name, true);
    return { skeleton, state, bounds, name: fileName };
  }

  async _resizeAtlasPages(atlas, atlasPath, isWebUrl) {
    let atlasText = null;
    try {
      const url = isWebUrl ? atlasPath : convertFileSrc(atlasPath);
      const res = await fetch(url);
      if (res.ok) atlasText = await res.text();
    } catch (e) {
      console.warn('[SpineRendererBase] Could not fetch atlas text for resize check:', e);
    }
    if (atlasText) atlasText = normalizeAtlasText(atlasText);
    else return;
    const declaredSizes = parseAtlasDeclaredSizes(atlasText);
    const gl = this._ctx.gl;
    const resizedPages = new Set();
    for (const page of atlas.pages) {
      const tex = page.texture;
      if (!tex || !tex.getImage) continue;
      const img = tex.getImage();
      if (!img) continue;
      const declared = declaredSizes.get(page.name);
      if (!declared || (img.width === declared.width && img.height === declared.height)) continue;
      const canvas = createCanvas(declared.width, declared.height);
      const ctx2d = canvas.getContext('2d');
      ctx2d.imageSmoothingEnabled = false;
      const source = img._bitmap || img;
      ctx2d.drawImage(source, 0, 0, declared.width, declared.height);
      tex._image = canvas;
      tex.bind();
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
      page.width = declared.width;
      page.height = declared.height;
      resizedPages.add(page);
    }
    if (resizedPages.size > 0 && atlas.regions) {
      updateAtlasRegions(atlas, resizedPages);
    }
  }

  getSyncState() {
    const serializableAttachmentsCache = {};
    if (this._attachmentsCache) {
      for (const key in this._attachmentsCache) {
        const entry = this._attachmentsCache[key];
        const [slotIndex, name, skeletonId] = entry;
        serializableAttachmentsCache[key] = [
          slotIndex,
          name,
          skeletonId || '0'
        ];
      }
    }
    return {
      scale: this._scale,
      moveX: this._moveX,
      moveY: this._moveY,
      rotate: this._rotate,
      activeSkins: this._activeSkins ? Array.from(this._activeSkins) : [],
      attachmentsCache: serializableAttachmentsCache,
      parameterOverrides: Array.from(this.parameterOverrides.entries())
    };
  }

  _calculateBounds(skeleton) {
    const originalSkin = skeleton.skin;
    const allSkins = skeleton.data.skins;
    if (allSkins.length > 1) {
      const combinedSkin = new this._spine.Skin('_bounds');
      for (const skin of allSkins) combinedSkin.addSkin(skin);
      skeleton.setSkin(combinedSkin);
    }
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform(2);
    const offset = new this._spine.Vector2(), size = new this._spine.Vector2();
    skeleton.getBounds(offset, size, []);
    if (size.x === -Infinity || size.y === -Infinity) {
      const animations = skeleton.data.animations;
      for (const anim of animations) {
        anim.apply(skeleton, 0, 0, false, null, 1.0, 0, 0);
        skeleton.updateWorldTransform(2);
        skeleton.getBounds(offset, size, []);
        if (size.x !== -Infinity) break;
      }
    }
    if (size.x === -Infinity) {
      size.x = 2048; size.y = 2048; offset.x = -1024; offset.y = -1024;
    }
    skeleton.setSkin(originalSkin);
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform(2);
    return { offset, size };
  }

  render(delta = 0, options = {}) {
    if (!this._ctx) return;
    const gl = this._ctx.gl;
    if (!gl) return;
    this.updateMVP(options);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const sortedKeys = this._getSortedSkeletonKeys();
    for (const key of sortedKeys) {
      const { skeleton, state } = this._skeletons[key];
      if (delta > 0 && !this._paused) state.update(delta * this._speed);
      state.apply(skeleton);
      skeleton.updateWorldTransform(2);
      this._syncHiddenAttachments(skeleton, key);
      this._shader.bind();
      this._shader.setUniformi(this._spine.Shader.SAMPLER, 0);
      this._shader.setUniform4x4f(this._spine.Shader.MVP_MATRIX, this._mvp.values);
      this._batcher.begin(this._shader);
      this._skeletonRenderer.premultipliedAlpha = (this._alphaMode === 'unpack' || this._alphaMode === 'pma');
      this._skeletonRenderer.draw(this._batcher, skeleton);
      this._batcher.end();
    }
  }

  updateMVP(options = {}) {
    if (!this._ctx) return;
    const firstSkel = this._skeletons['0'] || Object.values(this._skeletons)[0];
    if (!firstSkel) return;
    let screenBaseScale = options.screenBaseScale;
    if (!screenBaseScale && !this.isExport) {
      const bounds = firstSkel.bounds;
      screenBaseScale = Math.max(
        bounds.size.x / (window.innerWidth),
        bounds.size.y / (window.innerHeight)
      );
    }
    calculateSpineMVP(this._spine, this._mvp, this._canvas.width, this._canvas.height, firstSkel.bounds, {
      scale: this._scale,
      x: this._moveX,
      y: this._moveY,
      rotation: this._rotate
    }, { ...options, screenBaseScale });
    this._ctx.gl.viewport(0, 0, this._canvas.width, this._canvas.height);
  }

  _getSortedSkeletonKeys() {
    const sceneInfo = this._fileNames;
    return Object.keys(this._skeletons).sort((a, b) => {
      const getLayer = (k) => {
        if (!sceneInfo.isMerged && k === '0') return 0;
        const name = (sceneInfo.isMerged ? sceneInfo.files[parseInt(k)] : sceneInfo.files[parseInt(k) - 1] || '').toLowerCase();
        return name.includes('_fg') ? 1 : (name.includes('_bg') ? -1 : 0);
      };
      const la = getLayer(a), lb = getLayer(b);
      return la !== lb ? la - lb : parseInt(a) - parseInt(b);
    });
  }

  _syncHiddenAttachments(skeleton, id) {
    if (!this._attachmentsCache) return;
    for (const compositeKey in this._attachmentsCache) {
      const entry = this._attachmentsCache[compositeKey];
      const [idx, name, cachedSkelId] = entry;
      if (String(cachedSkelId || '0') === String(id)) {
        const slot = skeleton.slots[idx];
        if (slot?.attachment && slot.attachment.name === name) {
          slot.attachment = null;
        }
      }
    }
  }

  dispose() {
    if (this._ctx) {
      this._ctx.gl.getExtension('WEBGL_lose_context')?.loseContext();
      this._ctx = null;
    }
    this._skeletons = {};
    this._animationStates = [];
  }

  getOriginalSize() {
    const skel = this._skeletons['0'] || Object.values(this._skeletons)[0];
    if (!skel) return { width: 0, height: 0 };
    return {
      width: Math.round(skel.skeleton.data.width || skel.bounds.size.x),
      height: Math.round(skel.skeleton.data.height || skel.bounds.size.y)
    };
  }

  captureFrame(width, height, options = {}) {
    if (!this._ctx || Object.keys(this._skeletons).length === 0) return null;
    const oldWidth = this._canvas.width;
    const oldHeight = this._canvas.height;
    const oldScale = this._scale;
    const oldMoveX = this._moveX;
    const oldMoveY = this._moveY;
    const oldRotate = this._rotate;
    this._canvas.width = Math.round(width);
    this._canvas.height = Math.round(height);
    if (options.ignoreTransform) {
      this._scale = 1;
      this._moveX = 0;
      this._moveY = 0;
      this._rotate = 0;
    }
    let screenBaseScale = options.screenBaseScale;
    if (!screenBaseScale && typeof window !== 'undefined') {
      const firstSkel = this._skeletons['0'] || Object.values(this._skeletons)[0];
      if (firstSkel) {
        screenBaseScale = Math.max(
          firstSkel.bounds.size.x / window.innerWidth,
          firstSkel.bounds.size.y / window.innerHeight
        );
      }
    }
    const renderOptions = { ...options, dpr: options.dpr || 1, screenBaseScale };
    this.render(0, renderOptions);
    const captureCanvas = createCanvas(this._canvas.width, this._canvas.height);
    const ctx = captureCanvas.getContext('2d');
    ctx.drawImage(this._canvas, 0, 0);
    this._canvas.width = oldWidth;
    this._canvas.height = oldHeight;
    this._scale = oldScale;
    this._moveX = oldMoveX;
    this._moveY = oldMoveY;
    this._rotate = oldRotate;
    if (!this.isExport) {
      this.render(0, { ...renderOptions, dpr: options.dpr || 1 });
    }
    return captureCanvas;
  }

  getAnimationDuration() {
    for (const key of this._getSortedSkeletonKeys()) {
      const duration = this._skeletons[key]?.state.tracks[0]?.animation.duration;
      if (duration !== undefined && duration > 0) return duration;
    }
    return 0.1;
  }

  getAnimations() {
    const allAnimations = new Set();
    const result = [];
    for (const key in this._skeletons) {
      const skeleton = this._skeletons[key]?.skeleton;
      if (skeleton) {
        for (const anim of skeleton.data.animations) {
          if (!allAnimations.has(anim.name)) {
            allAnimations.add(anim.name);
            result.push({
              name: anim.name,
              value: anim.name
            });
          }
        }
      }
    }
    return result;
  }

  async setAnimation(value) {
    for (const key in this._skeletons) {
      const entry = this._skeletons[key];
      if (entry.skeleton.data.findAnimation(value)) {
        entry.state.setAnimation(0, value, true);
      }
    }
  }

  getPropertyCategories() {
    const categories = ['attachments'];
    let hasMultipleSkins = false;
    for (const key in this._skeletons) {
      if (this._skeletons[key].skeleton.data.skins.length > 1) {
        hasMultipleSkins = true;
        break;
      }
    }
    if (hasMultipleSkins) categories.push('skins');
    categories.push('parameters');
    return categories;
  }

  getPropertyItems(category) {
    if (Object.keys(this._skeletons).length === 0) return [];
    if (category === 'parameters') return this._getParameterItems();
    if (category === 'skins') return this._getSkinsItems();
    const items = [];
    for (const key in this._skeletons) {
      const skelEntry = this._skeletons[key];
      const skeleton = skelEntry.skeleton;
      const state = skelEntry.state;
      const skelName = skelEntry.name || key;
      const skelId = key;
      const attachmentMap = new Map();
      const addFromSkin = (skin) => {
        if (!skin || !skin.attachments) return;
        if (Array.isArray(skin.attachments)) {
          skin.attachments.forEach((slotAttachments, slotIndex) => {
            if (!slotAttachments) return;
            if (slotAttachments.name !== undefined && slotAttachments.slotIndex !== undefined) {
              attachmentMap.set(`${slotAttachments.name}##${slotAttachments.slotIndex}`, slotAttachments.slotIndex);
            } else {
              for (const name in slotAttachments) attachmentMap.set(`${name}##${slotIndex}`, slotIndex);
            }
          });
        } else {
          for (const slotIdx in skin.attachments) {
            const slotAttachments = skin.attachments[slotIdx];
            if (!slotAttachments) continue;
            for (const name in slotAttachments) attachmentMap.set(`${name}##${slotIdx}`, parseInt(slotIdx));
          }
        }
      };
      if (skeleton.data.defaultSkin) addFromSkin(skeleton.data.defaultSkin);
      if (skeleton.skin) addFromSkin(skeleton.skin);
      skeleton.slots.forEach((slot, slotIndex) => {
        const names = [];
        if (slot.attachment) names.push(slot.attachment.name);
        if (slot.data.attachmentName && !names.includes(slot.data.attachmentName)) names.push(slot.data.attachmentName);
        names.forEach(n => attachmentMap.set(`${n}##${slotIndex}`, slotIndex));
      });
      if (state?.tracks[0]) {
        const animation = state.tracks[0].animation;
        if (animation.timelines) {
          animation.timelines.forEach(timeline => {
            if (timeline.attachmentNames) {
              timeline.attachmentNames.forEach(name => {
                if (name) attachmentMap.set(`${name}##${timeline.slotIndex}`, timeline.slotIndex);
              });
            }
          });
        }
      }
      attachmentMap.forEach((slotIndex, keyAndIdx) => {
        const [name] = keyAndIdx.split('##');
        const compositeKey = `${skelId}##${name}##${slotIndex}`;
        const mergedIndex = (parseInt(skelId) << 16) | slotIndex;
        const displayName = (Object.keys(this._skeletons).length > 1 ? `[${skelName}] ${name}` : name).replace(/\[.*?\]\s*/g, '');
        items.push({
          name: name,
          displayName: displayName,
          index: mergedIndex,
          type: 'checkbox',
          checked: !this._attachmentsCache[compositeKey],
        });
      });
    }
    return items.sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name));
  }

  _getSkinsItems() {
    const items = [];
    const seenNames = new Set();
    for (const key in this._skeletons) {
      const skelEntry = this._skeletons[key];
      const skel = skelEntry.skeleton;
      const skins = skel.data.skins;
      const skelName = skelEntry.name || key;
      if (!this._activeSkins) {
        this._activeSkins = new Set();
        if (skel.skin) this._activeSkins.add(skel.skin.name);
        else {
          let name = 'default';
          if (skins.length > 1 && skins[0].name === 'default') name = skins[1].name;
          else if (skins.length > 0) name = skins[0].name;
          this._activeSkins.add(name);
        }
      }
      skins.forEach((skin, index) => {
        const displayName = (Object.keys(this._skeletons).length > 1 ? `[${skelName}] ${skin.name}` : skin.name).replace(/\[.*?\]\s*/g, '');
        if (!seenNames.has(skin.name)) {
          seenNames.add(skin.name);
          items.push({
            name: skin.name,
            displayName: displayName,
            index,
            type: 'checkbox',
            checked: this._activeSkins.has(skin.name),
          });
        }
      });
    }
    return items.sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name));
  }

  _getParameterItems() {
    const items = [];
    let idx_counter = 0;
    for (const key in this._skeletons) {
      const skelEntry = this._skeletons[key];
      const skel = skelEntry.skeleton;
      const skelName = skelEntry.name || key;
      const skelId = parseInt(key);
      const addRange = (name, target, prop, min = 0, max = 1, step = 0.01) => {
        const displayName = (Object.keys(this._skeletons).length > 1 ? `[${skelName}] ${name}` : name).replace(/\[.*?\]\s*/g, '');
        items.push({
          name: name,
          displayName: displayName,
          index: (skelId << 16) | idx_counter++,
          type: 'range',
          min, max, step,
          value: target[prop],
          _target: target,
          _prop: prop,
          _skeletonId: key
        });
      };
      if (skel.ikConstraints) {
        for (const ik of skel.ikConstraints) addRange(`IK: ${ik.data.name}`, ik, 'mix');
      }
      if (skel.transformConstraints) {
        for (const tc of skel.transformConstraints) {
          for (const p of ['mixRotate', 'rotateMix', 'mixX', 'translateMix', 'mixY', 'mixScaleX', 'scaleMix', 'mixScaleY', 'mixShearY', 'shearMix']) {
            if (tc[p] !== undefined) addRange(`TF ${tc.data.name}: ${p}`, tc, p);
          }
        }
      }
      if (skel.pathConstraints) {
        for (const pc of skel.pathConstraints) {
          for (const p of ['mixRotate', 'rotateMix', 'mixX', 'translateMix', 'mixY']) {
            if (pc[p] !== undefined) addRange(`Path ${pc.data.name}: ${p}`, pc, p);
          }
        }
      }
      if (skel.bones) {
        for (const bone of skel.bones) {
          const range = 1000;
          addRange(`Bone ${bone.data.name}: x`, bone, 'x', -range, range, 0.5);
          addRange(`Bone ${bone.data.name}: y`, bone, 'y', -range, range, 0.5);
        }
      }
    }
    this._parameterItems = items;
    return items;
  }

  updatePropertyItem(category, name, mergedIndex, value) {
    if (category === 'parameters') {
      const item = this._parameterItems.find(i => i.index === mergedIndex);
      if (item) {
        item._target[item._prop] = value;
        this.parameterOverrides.set(mergedIndex, value);
      }
    } else if (category === 'skins') {
      this._toggleSkin(name, value);
    } else if (category === 'attachments') {
      const skeletonId = String(mergedIndex >> 16);
      const slotIndex = mergedIndex & 0xFFFF;
      this._toggleAttachment(name, slotIndex, value, skeletonId);
    }
  }

  _toggleSkin(name, checked) {
    if (!this._activeSkins) this._activeSkins = new Set();
    if (checked) this._activeSkins.add(name);
    else this._activeSkins.delete(name);
    this.applySkins(Array.from(this._activeSkins));
  }

  applySkins(names) {
    for (const key in this._skeletons) {
      const skel = this._skeletons[key].skeleton;
      const newSkin = new this._spine.Skin('_');
      this._activeSkins = new Set(names);
      for (const n of names) {
        const s = skel.data.findSkin(n);
        if (s) newSkin.addSkin(s);
      }
      skel.setSkin(newSkin);
      skel.setToSetupPose();
      this._skeletons[key].state.apply(skel);
      skel.updateWorldTransform(2);
    }
    this._syncAllHiddenAttachments();
  }

  _toggleAttachment(name, slotIndex, checked, targetSkeletonId) {
    const skeletonId = targetSkeletonId || '0';
    const compositeKey = `${skeletonId}##${name}##${slotIndex}`;
    const skelEntry = this._skeletons[skeletonId];
    if (!skelEntry) return;
    if (checked) {
      if (this._attachmentsCache[compositeKey]) {
        delete this._attachmentsCache[compositeKey];
        const skeleton = skelEntry.skeleton;
        skeleton.setToSetupPose();
        if (skelEntry.state) skelEntry.state.apply(skeleton);
      }
    } else {
      this._attachmentsCache[compositeKey] = [slotIndex, name, skeletonId];
      const skeleton = skelEntry.skeleton;
      if (skeleton.slots[slotIndex]?.attachment?.name === name) {
        skeleton.slots[slotIndex].attachment = null;
      }
    }
    this._syncAllHiddenAttachments();
  }


  _syncAllHiddenAttachments() {
    for (const key in this._skeletons) {
      const skeleton = this._skeletons[key].skeleton;
      for (const compositeKey in this._attachmentsCache) {
        const entry = this._attachmentsCache[compositeKey];
        const [idx, name, cachedSkelId] = entry;
        if (String(cachedSkelId || '0') === String(key)) {
          const slot = skeleton.slots[idx];
          if (slot?.attachment && slot.attachment.name === name) {
            slot.attachment = null;
          }
        }
      }
    }
  }

  seekAnimation(progress) {
    for (const key in this._skeletons) {
      const { skeleton, state } = this._skeletons[key];
      const entry = state.tracks[0];
      if (entry) {
        entry.trackTime = entry.animation.duration * progress;
        state.apply(skeleton);
        skeleton.updateWorldTransform(2);
      }
    }
  }
}
