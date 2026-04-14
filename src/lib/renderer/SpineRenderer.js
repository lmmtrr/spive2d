import { BaseRenderer } from './BaseRenderer.js';
import { createSorter } from '../utils.js';
import { convertFileSrc } from '@tauri-apps/api/core';
import { showNotification } from '../notificationStore.svelte.js';
import { SpineVersionManager } from './SpineVersionManager.js';
import { normalizeAtlasText, setupAtlas, parseAtlasDeclaredSizes, updateAtlasRegions } from '../atlasUtils.js';

const sortByName = createSorter(item => item[0] || item.name || '');

export class SpineRenderer extends BaseRenderer {
  #canvas;
  #spine = null;
  #ctx = null;
  #shader = null;
  #batcher = null;
  #skeletonRenderer = null;
  #assetManager = null;
  #mvp = null;
  #lastFrameTime = 0;
  #requestId = undefined;
  #dirName = '';
  #fileNames = [];
  #skeletons = {};
  #animationStates = [];
  #alphaMode = 'unpack';
  #paused = false;
  #seeking = false;
  #speed = 1.0;
  #firstRender = true;
  #attachmentsCache = {};
  #activeSkins = null;
  #onFirstRender = null;
  #isFileJson = false;
  #captureResources = null;
  #isExport = false;
  _parameterItems = null;

  constructor(isExport = false) {
    super(isExport);
    this.#isExport = isExport;
    this.#canvas = document.createElement('canvas');
    this.#canvas.style.display = 'none';
    this.#canvas.style.verticalAlign = 'top';
    this.#canvas.style.opacity = '0';
  }

  getCanvas() {
    return this.#canvas;
  }

  async load(dirName, fileNames) {
    this.dispose();
    this.#attachmentsCache = {};
    this.#activeSkins = null;
    this.#canvas.style.display = 'block';
    this.#dirName = dirName;
    this.#fileNames = fileNames;
    this.#firstRender = true;
    const { version, isJson } = await SpineVersionManager.detectVersion(dirName, fileNames);
    this.#isFileJson = isJson;
    this.#spine = SpineVersionManager.getLib(version);
    if (!this.#spine) {
      const msg = `Spine library for version ${version} not loaded.`;
      showNotification(msg, 'error');
      throw new Error(msg);
    }
    const dpr = window.devicePixelRatio || 1;
    this.#canvas.width = Math.round(window.innerWidth * dpr);
    this.#canvas.height = Math.round(window.innerHeight * dpr);
    this.#canvas.style.width = `${window.innerWidth}px`;
    this.#canvas.style.height = `${window.innerHeight}px`;
    this.#ctx = new this.#spine.ManagedWebGLRenderingContext(this.#canvas, {
      preserveDrawingBuffer: true,
    });
    this.#ctx.gl.pixelStorei(
      this.#ctx.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
      this.#alphaMode === 'unpack'
    );
    this.#shader = this.#spine.Shader.newTwoColoredTextured(this.#ctx);
    this.#batcher = new this.#spine.PolygonBatcher(this.#ctx);
    this.#skeletonRenderer = new this.#spine.SkeletonRenderer(this.#ctx);
    const isWebUrl = dirName.startsWith('http://') || dirName.startsWith('https://');
    this.#assetManager = new this.#spine.AssetManager(this.#ctx.gl, isWebUrl ? dirName : '');
    const target = this.#assetManager.downloader || this.#assetManager;
    const original = target.downloadText.bind(target);
    target.downloadText = (url, success, error) => original(url, (text) => {
      if (typeof text === 'string' && url.split(/[?#]/)[0].match(/\.(atlas|txt)$/)) {
        text = normalizeAtlasText(text);
      }
      success?.(text);
    }, error);
    this.#mvp = new this.#spine.Matrix4();
    const baseName = fileNames[0];
    const skelExt = fileNames[1];
    const atlasExt = fileNames[2];
    const makePath = (name, ext) => {
      if (isWebUrl) return `${name}${ext}`;
      return `${dirName}${name}${ext}`;
    };
    if (baseName.startsWith('\u200B')) {
      for (let i = 3; i < fileNames.length; i++) {
        const name = fileNames[i];
        if (!this.#isFileJson)
          this.#assetManager.loadBinary(makePath(name, skelExt));
        else
          this.#assetManager.loadText(makePath(name, skelExt));
        this.#assetManager.loadTextureAtlas(makePath(name, atlasExt));
      }
    } else {
      if (!this.#isFileJson)
        this.#assetManager.loadBinary(makePath(baseName, skelExt));
      else
        this.#assetManager.loadText(makePath(baseName, skelExt));
      this.#assetManager.loadTextureAtlas(makePath(baseName, atlasExt));
      for (let i = 3; i < fileNames.length; i++) {
        const extraFile = fileNames[i];
        if (!extraFile.endsWith('.skel') && !extraFile.endsWith('.json') && !extraFile.endsWith('.asset')) continue;
        if (!this.#isFileJson)
          this.#assetManager.loadBinary(makePath(baseName, extraFile));
        else
          this.#assetManager.loadText(makePath(baseName, extraFile));
        this.#assetManager.loadTextureAtlas(
          makePath(baseName, `${extraFile.split('.')[0]}${atlasExt}`)
        );
      }
    }
    return new Promise((resolve) => {
      this.#onFirstRender = resolve;
      requestAnimationFrame(() => this.#waitForAssets());
    });
  }

  dispose() {
    this.#canvas.style.display = 'none';
    if (this.#requestId) window.cancelAnimationFrame(this.#requestId);
    this.#requestId = undefined;
    this.#attachmentsCache = {};
    if (this.#assetManager) {
      this.#assetManager.dispose();
      this.#assetManager = null;
    }
    if (this.#skeletonRenderer) {
      if (typeof this.#skeletonRenderer.dispose === 'function') this.#skeletonRenderer.dispose();
      this.#skeletonRenderer = null;
    }
    if (this.#batcher) {
      this.#batcher.dispose();
      this.#batcher = null;
    }
    if (this.#shader) {
      this.#shader.dispose();
      this.#shader = null;
    }
    if (this.#ctx) {
      if (typeof this.#ctx.dispose === 'function') this.#ctx.dispose();
      this.#ctx = null;
    }
    this.#animationStates = [];
    this.#skeletons = {};
    this.#activeSkins = null;
    if (this.#captureResources) {
      const gl = this.#ctx?.gl;
      if (gl) {
        if (this.#captureResources.fb) gl.deleteFramebuffer(this.#captureResources.fb);
        if (this.#captureResources.rb) gl.deleteRenderbuffer(this.#captureResources.rb);
      }
      this.#captureResources = null;
    }
  }

  resize(width, height) {
    const dpr = window.devicePixelRatio || 1;
    this.#canvas.width = Math.round(width * dpr);
    this.#canvas.height = Math.round(height * dpr);
    this.#canvas.style.width = `${width}px`;
    this.#canvas.style.height = `${height}px`;
  }

  getOriginalSize() {
    const skel = this.#skeletons['0']?.skeleton;
    if (!skel) return { width: 0, height: 0 };
    return {
      width: Math.round(skel.data.width),
      height: Math.round(skel.data.height),
    };
  }

  applyTransform(scale, moveX, moveY, rotate) {
    super.applyTransform(scale, moveX, moveY, rotate);
  }

  resetTransform() {
    super.resetTransform();
  }

  getAnimations() {
    const skel = this.#skeletons['0']?.skeleton;
    if (!skel) return [];
    return skel.data.animations.map(a => ({
      name: a.name,
      value: a.name,
    }));
  }

  async setAnimation(value) {
    for (const key of Object.keys(this.#skeletons)) {
      const { skeleton, state } = this.#skeletons[key];
      if (!skeleton || !state) continue;
      state.clearTracks();
      skeleton.setToSetupPose();
      state.setAnimation(0, value, true);
    }
  }

  getPropertyCategories() {
    const categories = ['attachments'];
    if (!this.isSkinsDisabled()) categories.push('skins');
    categories.push('parameters');
    return categories;
  }

  getPropertyItems(category) {
    const skel = this.#skeletons['0']?.skeleton;
    if (!skel) return [];
    if (category === 'attachments') {
      return this.#getAttachmentItems();
    }
    if (category === 'skins') {
      return this.#getSkinItems();
    }
    if (category === 'parameters') {
      return this.#getParameterItems();
    }
    return [];
  }

  updatePropertyItem(category, name, index, value) {
    if (category === 'attachments') {
      this.#toggleAttachment(name, index, value);
    } else if (category === 'skins') {
      this.#toggleSkin(name, value);
    } else if (category === 'parameters') {
      this.#updateParameter(name, index, value);
    }
  }

  getAnimationDuration() {
    const state = this.#skeletons['0']?.state;
    if (state?.tracks[0]) {
      return state.tracks[0].animation.duration;
    }
    return 0;
  }

  seekAnimation(progress) {
    for (const skeletonId in this.#skeletons) {
      const state = this.#skeletons[skeletonId]?.state;
      const skel = this.#skeletons[skeletonId]?.skeleton;
      if (state?.tracks[0] && skel) {
        const entry = state.tracks[0];
        entry.trackTime = entry.animation.duration * progress;
        state.apply(skel);
        skel.updateWorldTransform(2);
      }
    }
    this.render(0);
  }

  getCurrentTime() {
    const state = this.#skeletons['0']?.state;
    if (state?.tracks[0]) {
      const duration = state.tracks[0].animation.duration || 1;
      return state.tracks[0].trackTime % duration;
    }
    return 0;
  }

  getFPS() {
    return 60;
  }

  setPaused(paused) {
    if (this.#paused === paused) return;
    this.#paused = paused;
    if (paused) {
      if (this.#requestId) {
        cancelAnimationFrame(this.#requestId);
        this.#requestId = undefined;
      }
    } else {
      if (!this.#requestId) {
        this.#lastFrameTime = Date.now() / 1000;
        requestAnimationFrame(() => this.#renderLoop());
      }
    }
  }

  setSeeking(seeking) {
    this.#seeking = seeking;
  }

  setSpeed(speed) {
    this.#speed = speed;
  }

  getSyncState() {
    return {
      ...super.getSyncState(),
      activeSkins: this.#activeSkins ? Array.from(this.#activeSkins) : null,
      attachmentsCache: JSON.parse(JSON.stringify(this.#attachmentsCache)),
    };
  }

  applySyncState(state) {
    if (!state) return;
    super.applySyncState(state);
    if (state.activeSkins) {
      this.applySkins(state.activeSkins);
    }
    if (state.attachmentsCache) {
      this.#attachmentsCache = { ...state.attachmentsCache };
      this.#syncHiddenAttachments();
    }
  }

  #getSortedSkeletonKeys() {
    const baseName = this.#fileNames[0];
    return Object.keys(this.#skeletons).sort((a, b) => {
      const getLayer = (k) => {
        const isMerged = baseName.startsWith('\u200B');
        if (!isMerged && k === '0') return 0;
        const index = isMerged ? parseInt(k) + 3 : parseInt(k) + 2;
        const name = (this.#fileNames[index] || '').toLowerCase();
        if (name.includes('_fg')) return 1;
        if (name.includes('_bg')) return -1;
        return 0;
      };
      const la = getLayer(a);
      const lb = getLayer(b);
      if (la !== lb) return la - lb;
      return parseInt(a) - parseInt(b);
    });
  }

  render(delta = 0) {
    const gl = this.#ctx.gl;
    if (!gl) return;
    const dpr = window.devicePixelRatio || 1;
    this.#updateMVP(this.#canvas.width, this.#canvas.height, dpr);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const sortedKeys = this.#getSortedSkeletonKeys();
    for (const key of sortedKeys) {
      const skel = this.#skeletons[key].skeleton;
      const state = this.#skeletons[key].state;
      if (delta > 0 && !this.#seeking && !this.#paused) {
        state.update(delta * this.#speed);
      }
      state.apply(skel);
      this.#applyParameterOverrides(skel);
      skel.updateWorldTransform(2);
      this.#syncHiddenAttachments(skel, key);
      this.#shader.bind();
      this.#shader.setUniformi(this.#spine.Shader.SAMPLER, 0);
      this.#shader.setUniform4x4f(this.#spine.Shader.MVP_MATRIX, this.#mvp.values);
      this.#batcher.begin(this.#shader);
      this.#skeletonRenderer.vertexEffect = null;
      this.#skeletonRenderer.premultipliedAlpha = (this.#alphaMode === 'unpack' || this.#alphaMode === 'pma');
      this.#skeletonRenderer.draw(this.#batcher, skel);
      this.#batcher.end();
      this.#shader.unbind();
    }
    if (this.#firstRender) {
      this.#firstRender = false;
      if (this.#onFirstRender) {
        this.#onFirstRender();
        this.#onFirstRender = null;
      }
    }
  }

  async setAlphaMode(alphaMode) {
    this.#alphaMode = alphaMode;
    this.#firstRender = true;
    if (this.#dirName && this.#fileNames.length > 0) {
      this.dispose();
      await this.load(this.#dirName, this.#fileNames);
    }
  }

  #waitForAssets() {
    if (!this.#assetManager) return;
    if (this.#assetManager.isLoadingComplete()) {
      const allSkipped = [];
      const baseName = this.#fileNames[0];
      if (baseName.startsWith('\u200B')) {
        for (let i = 3; i < this.#fileNames.length; i++) {
          const name = this.#fileNames[i];
          const skelData = this.#loadSkeleton(name);
          if (skelData) {
            this.#skeletons[String(i - 3)] = skelData;
            allSkipped.push(...(skelData.skippedAttachments || []));
          }
        }
      } else {
        const skelData0 = this.#loadSkeleton(baseName);
        if (skelData0) {
          this.#skeletons['0'] = skelData0;
          allSkipped.push(...(skelData0.skippedAttachments || []));
        }
        for (let i = 3; i < this.#fileNames.length; i++) {
          const extraFile = this.#fileNames[i];
          if (!extraFile.endsWith('.skel') && !extraFile.endsWith('.json') && !extraFile.endsWith('.asset')) continue;
          const name2 = `${baseName}${extraFile.split('.')[0]}`;
          const skelDataN = this.#loadSkeleton(name2);
          if (skelDataN) {
            this.#skeletons[String(i - 2)] = skelDataN;
            allSkipped.push(...(skelDataN.skippedAttachments || []));
          }
        }
      }
      if (allSkipped.length > 0) {
        const names = allSkipped.length <= 5
          ? allSkipped.join(', ')
          : allSkipped.slice(0, 5).join(', ') + ` ... +${allSkipped.length - 5}`;
        showNotification(`Region not found: ${names}`, 'error', 5000);
      }
      this.#lastFrameTime = Date.now() / 1000;
      if (!this.#isExport && !this.#paused) {
        requestAnimationFrame(() => this.#renderLoop());
      } else if (this.#isExport) {
        if (this.#onFirstRender) {
          this.#onFirstRender();
          this.#onFirstRender = null;
        }
      }
    } else {
      requestAnimationFrame(() => this.#waitForAssets());
    }
  }

  #loadSkeleton(fileName) {
    const skelExt = this.#fileNames[1];
    const atlasExt = this.#fileNames[2];
    const isWebUrl = this.#dirName.startsWith('http://') || this.#dirName.startsWith('https://');
    const makePath = (name, ext) => {
      if (isWebUrl) return `${name}${ext}`;
      return `${this.#dirName}${name}${ext}`;
    };
    const atlasPath = makePath(fileName, atlasExt);
    const atlas = this.#assetManager.get(atlasPath);
    if (atlas && atlas.regions) {
      setupAtlas(atlas);
    }
    this.#resizeAtlasPages(atlas, atlasPath, isWebUrl);
    for (const page of atlas.pages) {
      if (
        page.minFilter === this.#spine.TextureFilter.MipMap ||
        page.minFilter === this.#spine.TextureFilter.MipMapLinearLinear ||
        page.minFilter === this.#spine.TextureFilter.MipMapLinearNearest ||
        page.minFilter === this.#spine.TextureFilter.MipMapNearestLinear ||
        page.minFilter === this.#spine.TextureFilter.MipMapNearestNearest
      ) {
        page.minFilter = this.#spine.TextureFilter.Linear;
        page.magFilter = this.#spine.TextureFilter.Linear;
      }
      if (page.texture?.setFilters) {
        page.texture.setFilters(this.#spine.TextureFilter.Linear, this.#spine.TextureFilter.Linear);
      }
    }
    const atlasLoader = new this.#spine.AtlasAttachmentLoader(atlas);
    const skippedAttachments = [];
    for (const method of ['newRegionAttachment', 'newMeshAttachment', 'newSequenceAttachment']) {
      const original = atlasLoader[method];
      if (original) {
        atlasLoader[method] = function (...args) {
          try {
            return original.apply(this, args);
          } catch (e) {
            const name = args[1] || 'unknown';
            skippedAttachments.push(name);
            console.warn(`[SpineRenderer] Skipping attachment (${method}): ${e.message}`);
            return null;
          }
        };
      }
    }
    const skeletonLoader = !this.#isFileJson
      ? new this.#spine.SkeletonBinary(atlasLoader)
      : new this.#spine.SkeletonJson(atlasLoader);
    let skelDataOrText = this.#assetManager.get(makePath(fileName, skelExt));
    if (typeof skelDataOrText === 'string' && this.#isFileJson) {
      skelDataOrText = skelDataOrText.replace(/,(\s*[}\]])/g, '$1');
    }
    const skeletonData = skeletonLoader.readSkeletonData(skelDataOrText);
    const skeleton = new this.#spine.Skeleton(skeletonData);
    skeleton.scaleX = 1;
    skeleton.scaleY = 1;
    let initialSkinName;
    if (skeleton.data.skins[0].name === 'default' && skeleton.data.skins.length > 1)
      initialSkinName = skeleton.data.skins[1].name;
    else
      initialSkinName = skeleton.data.skins[0].name;
    const newSkin = new this.#spine.Skin('_');
    const initialSkin = skeleton.data.findSkin(initialSkinName);
    if (initialSkin) newSkin.addSkin(initialSkin);
    skeleton.setSkin(newSkin);
    if (!skeleton.data.defaultSkin)
      skeleton.data.defaultSkin = new this.#spine.Skin('default');
    const bounds = this.#calculateBounds(skeleton);
    if (skeleton.data.width === 0 || skeleton.data.height === 0 || isNaN(skeleton.data.width) || isNaN(skeleton.data.height)) {
      skeleton.data.width = bounds.size.x;
      skeleton.data.height = bounds.size.y;
    }
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform(2);
    const animationStateData = new this.#spine.AnimationStateData(skeleton.data);
    const animationState = new this.#spine.AnimationState(animationStateData);
    this.#animationStates.push(animationState);
    const animations = skeleton.data.animations;
    animationState.setAnimation(0, animations[0].name, true);
    return { skeleton, state: animationState, bounds, skippedAttachments };
  }

  #calculateBounds(skeleton) {
    const originalSkin = skeleton.skin;
    const allSkins = skeleton.data.skins;
    if (allSkins.length > 1) {
      const combinedSkin = new this.#spine.Skin('_bounds');
      for (const skin of allSkins) {
        combinedSkin.addSkin(skin);
      }
      skeleton.setSkin(combinedSkin);
    }
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform(2);
    const offset = new this.#spine.Vector2();
    const size = new this.#spine.Vector2();
    skeleton.getBounds(offset, size, []);
    if (size.x === -Infinity || size.y === -Infinity) {
      const animations = skeleton.data.animations;
      for (let i = 0; i < animations.length; i++) {
        animations[i].apply(skeleton, 0, 0, false, null, 1.0, 0, 0);
        skeleton.updateWorldTransform(2);
        skeleton.getBounds(offset, size, []);
        if (size.x !== -Infinity && size.y !== -Infinity) {
          break;
        }
      }
    }
    if (size.x === -Infinity || size.y === -Infinity) {
      size.x = 2048;
      size.y = 2048;
      offset.x = -1024;
      offset.y = -1024;
    }
    if (originalSkin) {
      skeleton.setSkin(originalSkin);
    } else {
      skeleton.setSkin(null);
    }
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform(2);
    return { offset, size };
  }

  #updateMVP(canvasWidth = this.#canvas.width, canvasHeight = this.#canvas.height, dpr = 1) {
    const logicalWidth = canvasWidth / dpr;
    const logicalHeight = canvasHeight / dpr;
    const bounds = this.#skeletons['0'].bounds;
    const centerX = bounds.offset.x + bounds.size.x * 0.5;
    const centerY = bounds.offset.y + bounds.size.y * 0.5;
    const scaleX = bounds.size.x / logicalWidth;
    const scaleY = bounds.size.y / logicalHeight;
    let scale = Math.max(scaleX, scaleY);
    const userScale = this._scale || 1;
    const userMoveX = this._moveX || 0;
    const userMoveY = this._moveY || 0;
    const userRotate = this._rotate || 0;
    scale /= userScale;
    const width = logicalWidth * scale;
    const height = logicalHeight * scale;
    const viewCenterX = centerX - userMoveX * scale;
    const viewCenterY = centerY + userMoveY * scale;
    this.#mvp.ortho2d(
      viewCenterX - width * 0.5,
      viewCenterY - height * 0.5,
      width,
      height
    );
    if (userRotate !== 0) {
      const cos = Math.cos(Math.PI * userRotate);
      const sin = Math.sin(Math.PI * userRotate);
      const t1 = new this.#spine.Matrix4();
      t1.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, centerX, centerY, 0, 1]);
      const rot = new this.#spine.Matrix4();
      rot.set([cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      const t2 = new this.#spine.Matrix4();
      t2.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -centerX, -centerY, 0, 1]);
      this.#mvp.multiply(t1);
      this.#mvp.multiply(rot);
      this.#mvp.multiply(t2);
    }
    this.#ctx.gl.viewport(0, 0, canvasWidth, canvasHeight);
  }

  #renderLoop() {
    const now = Date.now() / 1000;
    const delta = now - this.#lastFrameTime;
    this.#lastFrameTime = now;
    this.render(delta);
    this.#requestId = requestAnimationFrame(() => this.#renderLoop());
  }

  #getAttachmentItems() {
    const allItems = [];
    const baseName = this.#fileNames[0];
    for (const skeletonId in this.#skeletons) {
      const skelEntry = this.#skeletons[skeletonId];
      const skeleton = skelEntry.skeleton;
      const state = skelEntry.state;
      const idNum = parseInt(skeletonId);
      const isMerged = baseName.startsWith('\u200B');
      const fileLabel = isMerged
        ? `[${this.#fileNames[idNum + 3] || skeletonId}] `
        : (idNum === 0 ? '' : `[${this.#fileNames[idNum + 2] || skeletonId}] `);
      const animationAttachmentMap = new Map();
      const addSkinAttachments = (skin) => {
        if (!skin) return;
        if (typeof skin.getAttachments === 'function') {
          const entries = skin.getAttachments();
          if (Array.isArray(entries)) {
            for (let i = 0; i < entries.length; i++) {
              const entry = entries[i];
              if (entry && entry.slotIndex !== undefined && entry.name !== undefined) {
                animationAttachmentMap.set(`${entry.name}##${entry.slotIndex}`, entry.slotIndex);
              }
            }
          }
        }
        if (skin.attachments) {
          if (Array.isArray(skin.attachments)) {
            for (let i = 0; i < skin.attachments.length; i++) {
              const item = skin.attachments[i];
              if (!item) continue;
              if (item.slotIndex !== undefined && item.name !== undefined) {
                animationAttachmentMap.set(`${item.name}##${item.slotIndex}`, item.slotIndex);
              } else {
                for (const name in item) {
                  animationAttachmentMap.set(`${name}##${i}`, i);
                }
              }
            }
          } else if (typeof skin.attachments === 'object') {
            for (const slotIndex in skin.attachments) {
              const item = skin.attachments[slotIndex];
              if (!item) continue;
              for (const name in item) {
                animationAttachmentMap.set(`${name}##${slotIndex}`, parseInt(slotIndex));
              }
            }
          }
        }
      };
      if (skeleton.data.defaultSkin) addSkinAttachments(skeleton.data.defaultSkin);
      if (skeleton.skin) addSkinAttachments(skeleton.skin);
      skeleton.slots.forEach((slot, index) => {
        let attachmentNames = [];
        if (slot.attachment) {
          attachmentNames.push(slot.attachment.name);
        }
        if (slot.data.attachmentName && !attachmentNames.includes(slot.data.attachmentName)) {
          attachmentNames.push(slot.data.attachmentName);
        }
        attachmentNames.forEach(name => {
          const key = `${name}##${index}`;
          animationAttachmentMap.set(key, index);
        });
      });
      if (state?.tracks[0]) {
        const animation = state.tracks[0].animation;
        if (animation.timelines) {
          for (const timeline of animation.timelines) {
            if (timeline.attachmentNames) {
              const slotIndex = timeline.slotIndex;
              for (const name of timeline.attachmentNames) {
                if (name) {
                  const key = `${name}##${slotIndex}`;
                  animationAttachmentMap.set(key, slotIndex);
                }
              }
            }
          }
        }
      }
      animationAttachmentMap.forEach((slotIndex, key) => {
        const [name] = key.split('##');
        const compositeKey = `${skeletonId}##${name}##${slotIndex}`;
        allItems.push({
          name: `${fileLabel}${name}`,
          index: idNum * 10000 + slotIndex,
          type: 'checkbox',
          checked: !this.#attachmentsCache[compositeKey],
        });
      });
    }
    return allItems.sort(sortByName);
  }

  #getSkinItems() {
    const skel = this.#skeletons['0']?.skeleton;
    if (!skel) return [];
    const skins = skel.data.skins;
    if (skins.length <= 1) return [];
    const activeSkinNames = new Set();
    if (this.#activeSkins) {
      this.#activeSkins.forEach(name => activeSkinNames.add(name));
    } else if (skel.skin && skel.skin.name !== '_') {
      activeSkinNames.add(skel.skin.name);
    } else {
      let defaultName = 'default';
      if (skins.length > 1 && skins[0].name === 'default') defaultName = skins[1].name;
      else if (skins.length > 0) defaultName = skins[0].name;
      activeSkinNames.add(defaultName);
    }
    return skins.map((skin, index) => ({
      name: skin.name,
      index,
      type: 'checkbox',
      checked: activeSkinNames.has(skin.name),
    }));
  }

  #toggleAttachment(displayName, uniqueIndex, checked) {
    const idNum = Math.floor(uniqueIndex / 10000);
    const skeletonId = String(idNum);
    const slotIndex = uniqueIndex % 10000;
    const skeleton = this.#skeletons[skeletonId]?.skeleton;
    if (!skeleton) return;
    const baseName = this.#fileNames[0];
    let originalName = displayName;
    const isMerged = baseName.startsWith('\u200B');
    if (isMerged) {
      const fileLabel = `[${this.#fileNames[idNum + 3] || skeletonId}] `;
      if (displayName.startsWith(fileLabel)) {
        originalName = displayName.substring(fileLabel.length);
      }
    } else if (idNum !== 0) {
      const fileLabel = `[${this.#fileNames[idNum + 2] || skeletonId}] `;
      if (displayName.startsWith(fileLabel)) {
        originalName = displayName.substring(fileLabel.length);
      }
    }
    const compositeKey = `${skeletonId}##${originalName}##${slotIndex}`;
    if (checked) {
      if (this.#attachmentsCache[compositeKey]) {
        delete this.#attachmentsCache[compositeKey];
        skeleton.setToSetupPose();
        const state = this.#skeletons[skeletonId].state;
        if (state) state.apply(skeleton);
      }
    } else {
      const slot = skeleton.slots[slotIndex];
      this.#attachmentsCache[compositeKey] = [slotIndex, { name: originalName, skeletonId: skeletonId }];
      if (slot && slot.attachment && slot.attachment.name === originalName) {
        slot.attachment = null;
      }
    }
  }

  #toggleSkin(name, checked) {
    if (!this.#activeSkins) {
      this.#activeSkins = new Set();
      const skel = this.#skeletons['0'].skeleton;
      if (skel.skin && skel.skin.name !== '_') this.#activeSkins.add(skel.skin.name);
      else {
        let defaultName = 'default';
        const skins = skel.data.skins;
        if (skins.length > 1 && skins[0].name === 'default') defaultName = skins[1].name;
        else if (skins.length > 0) defaultName = skins[0].name;
        this.#activeSkins.add(defaultName);
      }
    }
    if (checked) {
      this.#activeSkins.add(name);
    } else {
      this.#activeSkins.delete(name);
    }
    this.applySkins(Array.from(this.#activeSkins));
  }

  applySkins(names) {
    const skeleton = this.#skeletons['0']?.skeleton;
    if (!skeleton) return;
    const newSkin = new this.#spine.Skin('_');
    this.#activeSkins = new Set(names);
    skeleton.setSkin(null);
    for (const skinName of names) {
      const skin = skeleton.data.findSkin(skinName);
      if (skin) newSkin.addSkin(skin);
    }
    skeleton.setSkin(newSkin);
    skeleton.setToSetupPose();
    const state = this.#skeletons['0'].state;
    state.apply(skeleton);
    skeleton.updateWorldTransform(2);
    this.#syncHiddenAttachments(skeleton);
  }

  #syncHiddenAttachments(skeleton, id) {
    if (!skeleton) return;
    Object.values(this.#attachmentsCache).forEach(([slotIndex, cachedAttachment]) => {
      if (cachedAttachment.isSkeleton) return;
      const targetSkelId = cachedAttachment.skeletonId || '0';
      if (String(targetSkelId) !== String(id)) return;
      const slot = skeleton.slots[slotIndex];
      if (slot && slot.attachment && (slot.attachment.name === cachedAttachment.name)) {
        slot.attachment = null;
      }
    });
  }

  captureFrame(width, height, options = {}) {
    const skel = this.#skeletons['0'];
    if (!skel) return null;
    const { skeleton, bounds } = skel;
    const gl = this.#ctx.gl;
    if (!this.#captureResources ||
      this.#captureResources.width !== width ||
      this.#captureResources.height !== height) {
      if (this.#captureResources) {
        if (this.#captureResources.fb) gl.deleteFramebuffer(this.#captureResources.fb);
        if (this.#captureResources.rb) gl.deleteRenderbuffer(this.#captureResources.rb);
      }
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      const rb = gl.createRenderbuffer();
      gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, width, height);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, rb);
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const flipCanvas = document.createElement('canvas');
      flipCanvas.width = width;
      flipCanvas.height = height;
      const pixels = new Uint8ClampedArray(width * height * 4);
      this.#captureResources = {
        width, height, fb, rb, tempCanvas, flipCanvas, pixels,
        tempCtx: tempCanvas.getContext('2d'),
        flipCtx: flipCanvas.getContext('2d')
      };
    }
    const res = this.#captureResources;
    const originalMvp = this.#mvp.copy();
    gl.bindFramebuffer(gl.FRAMEBUFFER, res.fb);
    const oldViewport = gl.getParameter(gl.VIEWPORT);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const marginX = options.marginX || 0;
    const marginY = options.marginY || 0;
    if (options.ignoreTransform) {
      const s = Math.min((width - 2 * marginX) / bounds.size.x, (height - 2 * marginY) / bounds.size.y);
      this.#mvp.ortho(
        bounds.offset.x - (width / s - bounds.size.x) / 2,
        bounds.offset.x + bounds.size.x + (width / s - bounds.size.x) / 2,
        bounds.offset.y - (height / s - bounds.size.y) / 2,
        bounds.offset.y + bounds.size.y + (height / s - bounds.size.y) / 2,
        -1,
        1
      );
    } else {
      const centerX = bounds.offset.x + bounds.size.x * 0.5;
      const centerY = bounds.offset.y + bounds.size.y * 0.5;
      const scaleX = bounds.size.x / (width - 2 * marginX);
      const scaleY = bounds.size.y / (height - 2 * marginY);
      let scale = Math.max(scaleX, scaleY);
      const userScale = this._scale || 1;
      const userMoveX = this._moveX || 0;
      const userMoveY = this._moveY || 0;
      const userRotate = this._rotate || 0;
      scale /= userScale;
      const orthoWidth = width * scale;
      const orthoHeight = height * scale;
      const viewCenterX = centerX - userMoveX * scale;
      const viewCenterY = centerY + userMoveY * scale;
      this.#mvp.ortho2d(
        viewCenterX - orthoWidth * 0.5,
        viewCenterY - orthoHeight * 0.5,
        orthoWidth,
        orthoHeight
      );
      if (userRotate !== 0) {
        const cos = Math.cos(Math.PI * userRotate);
        const sin = Math.sin(Math.PI * userRotate);
        const t1 = new this.#spine.Matrix4();
        t1.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, centerX, centerY, 0, 1]);
        const rot = new this.#spine.Matrix4();
        rot.set([cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        const t2 = new this.#spine.Matrix4();
        t2.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -centerX, -centerY, 0, 1]);
        this.#mvp.multiply(t1);
        this.#mvp.multiply(rot);
        this.#mvp.multiply(t2);
      }
    }
    this.#shader.bind();
    this.#shader.setUniform4x4f(this.#spine.Shader.MVP_MATRIX, this.#mvp.values);
    this.#batcher.begin(this.#shader);
    const sortedKeys = this.#getSortedSkeletonKeys();
    for (const key of sortedKeys) {
      const skel = this.#skeletons[key].skeleton;
      const state = this.#skeletons[key].state;
      state.apply(skel);
      this.#applyParameterOverrides(skel);
      skel.updateWorldTransform(2);
      this.#syncHiddenAttachments(skel, key);
      this.#skeletonRenderer.draw(this.#batcher, skel);
    }
    this.#batcher.end();
    this.#shader.unbind();
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, res.pixels);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(oldViewport[0], oldViewport[1], oldViewport[2], oldViewport[3]);
    this.#mvp.set(originalMvp);
    const imageData = new ImageData(res.pixels, width, height);
    res.flipCtx.putImageData(imageData, 0, 0);
    res.tempCtx.clearRect(0, 0, width, height);
    res.tempCtx.save();
    res.tempCtx.scale(1, -1);
    res.tempCtx.drawImage(res.flipCanvas, 0, -height);
    res.tempCtx.restore();
    return res.tempCanvas;
  }

  #getParameterItems() {
    const skel = this.#skeletons['0']?.skeleton;
    if (!skel) return [];
    const items = [];
    let idx = 0;
    if (skel.ikConstraints) {
      for (const ik of skel.ikConstraints) {
        items.push({
          name: `IK: ${ik.data.name}`,
          index: idx++,
          type: 'range',
          min: 0,
          max: 1,
          step: 0.01,
          value: ik.mix,
          _paramType: 'ik',
          _target: ik,
          _prop: 'mix',
        });
      }
    }
    if (skel.transformConstraints) {
      for (const tc of skel.transformConstraints) {
        for (const prop of ['mixRotate', 'rotateMix', 'mixX', 'translateMix', 'mixY', 'mixScaleX', 'scaleMix', 'mixScaleY', 'mixShearY', 'shearMix']) {
          if (tc[prop] !== undefined) {
            const label = prop.replace(/([A-Z])/g, ' $1').trim();
            items.push({
              name: `TF ${tc.data.name}: ${label}`,
              index: idx++,
              type: 'range',
              min: 0,
              max: 1,
              step: 0.01,
              value: tc[prop],
              _paramType: 'transform',
              _target: tc,
              _prop: prop,
            });
          }
        }
      }
    }
    if (skel.pathConstraints) {
      for (const pc of skel.pathConstraints) {
        for (const prop of ['mixRotate', 'rotateMix', 'mixX', 'translateMix', 'mixY']) {
          if (pc[prop] !== undefined) {
            const label = prop.replace(/([A-Z])/g, ' $1').trim();
            items.push({
              name: `Path ${pc.data.name}: ${label}`,
              index: idx++,
              type: 'range',
              min: 0,
              max: 1,
              step: 0.01,
              value: pc[prop],
              _paramType: 'path',
              _target: pc,
              _prop: prop,
            });
          }
        }
      }
    }
    if (skel.bones) {
      for (const bone of skel.bones) {
        const bx = bone.data.x || 0;
        const by = bone.data.y || 0;
        const range = Math.max(Math.abs(bx), Math.abs(by), 500) * 2;
        items.push({
          name: `Bone ${bone.data.name}: x`,
          index: idx++,
          type: 'range',
          min: -range,
          max: range,
          step: 0.5,
          value: bone.x,
          _paramType: 'bone',
          _target: bone,
          _prop: 'x',
        });
        items.push({
          name: `Bone ${bone.data.name}: y`,
          index: idx++,
          type: 'range',
          min: -range,
          max: range,
          step: 0.5,
          value: bone.y,
          _paramType: 'bone',
          _target: bone,
          _prop: 'y',
        });
      }
    }
    this._parameterItems = items;
    return items;
  }

  #updateParameter(name, index, value) {
    if (!this._parameterItems) {
      this.#getParameterItems();
    }
    const item = this._parameterItems.find(i => i.index === index);
    if (!item) return;
    item._target[item._prop] = value;
    item.value = value;
    this.parameterOverrides.set(item.name, value);
  }

  #applyParameterOverrides(skel) {
    if (this.parameterOverrides.size === 0) return;
    if (!skel._paramCache) {
      const items = this.#getParameterItems();
      const map = new Map();
      for (const item of items) map.set(item.name, item);
      skel._paramCache = map;
    }
    const cache = skel._paramCache;
    for (const [name, value] of this.parameterOverrides.entries()) {
      const item = cache.get(name);
      if (item && item._target && item._prop) {
        item._target[item._prop] = value;
      }
    }
  }

  isSkinsDisabled() {
    const skel = this.#skeletons['0']?.skeleton;
    return !skel || skel.data.skins.length <= 1;
  }

  #resizeAtlasPages(atlas, atlasPath, isWebUrl) {
    if (!atlas) return;
    let atlasText = null;
    try {
      const url = isWebUrl ? this.#dirName + atlasPath : convertFileSrc(atlasPath);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send();
      if (xhr.status === 200 || xhr.status === 0) {
        atlasText = xhr.responseText;
      }
    } catch (e) {
      console.warn('[SpineRenderer] Could not fetch atlas text for resize check:', e);
    }
    if (atlasText) {
      atlasText = normalizeAtlasText(atlasText);
    } else {
      return;
    }
    const declaredSizes = parseAtlasDeclaredSizes(atlasText);
    const gl = this.#ctx.gl;
    const resizedPages = new Set();
    for (const page of atlas.pages) {
      const tex = page.texture;
      if (!tex || !tex.getImage) continue;
      const img = tex.getImage();
      if (!img) continue;
      const declared = declaredSizes.get(page.name);
      if (!declared) continue;
      if (img.width === declared.width && img.height === declared.height) continue;
      const canvas = document.createElement('canvas');
      canvas.width = declared.width;
      canvas.height = declared.height;
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
      updateAtlasRegions(atlas, resizedPages);
    }
  }

}
