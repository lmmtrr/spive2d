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
        serializableAttachmentsCache[key] = [
          entry[0],
          {
            name: entry[1].name,
            skeletonId: entry[1].skeletonId,
            isSkeleton: entry[1].isSkeleton
          },
          entry[2],
          entry[3],
          null,
          entry[5]
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
    Object.values(this._attachmentsCache).forEach(([idx, att]) => {
      if (!att.isSkeleton && String(att.skeletonId || '0') === String(id)) {
        if (skeleton.slots[idx]?.attachment?.name === att.name) {
          skeleton.slots[idx].attachment = null;
        }
      }
    });
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
    return ['attachments', 'skins', 'parameters'];
  }

  getPropertyItems(category) {
    if (Object.keys(this._skeletons).length === 0) return [];
    if (category === 'parameters') return this._getParameterItems();
    if (category === 'skins') return this._getSkinsItems();
    const items = [];
    for (const key in this._skeletons) {
      const skelEntry = this._skeletons[key];
      const skeleton = skelEntry.skeleton;
      const skelName = skelEntry.name || key;
      const skelId = parseInt(key);
      skeleton.slots.forEach((slot, slotIndex) => {
        const attachment = slot.attachment;
        const mergedIndex = (skelId << 16) | slotIndex;
        const rawName = attachment?.name || slot.data.name;
        const displayName = (Object.keys(this._skeletons).length > 1 ? `[${skelName}] ${rawName}` : rawName).replace(/\[.*?\]\s*/g, '');
        if (attachment) {
          items.push({
            name: rawName,
            displayName: displayName,
            index: mergedIndex,
            type: 'checkbox',
            checked: true,
          });
        } else {
          const compositeKey = `${key}:${rawName}##${slotIndex}`;
          const cacheEntry = this._attachmentsCache[compositeKey];
          if (cacheEntry) {
            items.push({
              name: rawName,
              displayName: displayName,
              index: mergedIndex,
              type: 'checkbox',
              checked: false,
            });
          }
        }
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
    const compositeKey = `${skeletonId}:${name}##${slotIndex}`;
    const skelEntry = this._skeletons[skeletonId];
    if (!skelEntry) return;
    const skeleton = skelEntry.skeleton;
    const defaultSkin = skeleton.data.defaultSkin;
    if (checked) {
      const cached = this._attachmentsCache[compositeKey];
      if (cached) {
        const [sIdx, attachment, wasSkin, skinKey, , isDefault] = cached;
        if (wasSkin) {
          if (isDefault) defaultSkin.setAttachment(sIdx, skinKey || name, attachment);
          else if (skeleton.skin) skeleton.skin.setAttachment(sIdx, skinKey || name, attachment);
          skeleton.setToSetupPose();
        } else {
          const slot = skeleton.slots[sIdx];
          if (slot) slot.attachment = attachment;
        }
      }
      delete this._attachmentsCache[compositeKey];
    } else {
      const { attachment, key: skinKey, isDefault } = this._getSkinAttachment(slotIndex, name, defaultSkin, skeleton);
      if (attachment) {
        attachment.skeletonId = skeletonId;
        attachment.isSkeleton = false;
        this._attachmentsCache[compositeKey] = [slotIndex, attachment, true, skinKey, skeletonId, isDefault];
        if (isDefault) defaultSkin.removeAttachment(slotIndex, skinKey);
        else if (skeleton.skin) skeleton.skin.removeAttachment(slotIndex, skinKey);
        skeleton.setToSetupPose();
      } else {
        const slot = skeleton.slots[slotIndex];
        if (slot?.attachment?.name === name) {
          slot.attachment.skeletonId = skeletonId;
          slot.attachment.isSkeleton = false;
          this._attachmentsCache[compositeKey] = [slotIndex, slot.attachment, false, null, skeletonId, false];
          slot.attachment = null;
        }
      }
    }
    this._syncAllHiddenAttachments();
  }

  _getSkinAttachment(slotIndex, name, defaultSkin, skeleton) {
    const check = (skin, isDefault) => {
      if (!skin) return null;
      let att = skin.getAttachment(slotIndex, name);
      if (att) return { attachment: att, key: name, isDefault };
      const slot = skeleton.slots[slotIndex];
      if (slot?.data.attachmentName) {
        const altKey = slot.data.attachmentName;
        const altAtt = skin.getAttachment(slotIndex, altKey);
        if (altAtt?.name === name) return { attachment: altAtt, key: altKey, isDefault };
      }
      return null;
    };
    return check(skeleton.skin, false) || check(defaultSkin, true) || { attachment: null, key: name, isDefault: false };
  }

  _syncAllHiddenAttachments() {
    for (const key in this._skeletons) {
      const skeleton = this._skeletons[key].skeleton;
      Object.entries(this._attachmentsCache).forEach(([compositeKey, cacheEntry]) => {
        const [sIdx, , wasSkin, skinKey, cachedSkelId] = cacheEntry;
        if (String(cachedSkelId || '0') !== String(key)) return;
        if (wasSkin) {
          if (skeleton.data.defaultSkin) skeleton.data.defaultSkin.removeAttachment(sIdx, skinKey);
          if (skeleton.skin) skeleton.skin.removeAttachment(sIdx, skinKey);
        }
        const slot = skeleton.slots[sIdx];
        if (slot) slot.attachment = null;
      });
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
