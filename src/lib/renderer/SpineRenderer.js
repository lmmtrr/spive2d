import { createSorter } from '../utils.js';
import { convertFileSrc } from '@tauri-apps/api/core';

const sortByName = createSorter(item => item[0] || item.name || '');
const SPINE_VERSIONS = ['3.6', '3.7', '3.8', '4.0', '4.1', '4.2'];
const spineLibs = {};

for (const version of SPINE_VERSIONS) {
  const script = document.createElement('script');
  script.src = `lib/spine-webgl-${version}.js`;
  script.onload = () => {
    if (version[0] === '3') Object.assign(window.spine, window.spine.webgl);
    spineLibs[version] = window.spine;
    window.spine = undefined;
    script.remove();
  };
  document.head.appendChild(script);
}

export class SpineRenderer {
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
  constructor() {
    this.#canvas = document.createElement('canvas');
    this.#canvas.style.display = 'none';
    this.#canvas.style.verticalAlign = 'top';
  }
  getCanvas() {
    return this.#canvas;
  }
  async load(dirName, fileNames) {
    this.#canvas.style.display = 'block';
    this.#dirName = dirName;
    this.#fileNames = fileNames;
    this.#firstRender = true;
    const spineVersion = await this.#getSpineVersion(dirName, fileNames);
    this.#spine = spineLibs[spineVersion];
    const dpr = window.devicePixelRatio || 1;
    this.#canvas.width = Math.round(window.innerWidth * dpr);
    this.#canvas.height = Math.round(window.innerHeight * dpr);
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
    this.#mvp = new this.#spine.Matrix4();
    const baseName = fileNames[0];
    const skelExt = fileNames[1];
    const atlasExt = fileNames[2];
    const makePath = (name, ext) => {
      if (isWebUrl) return `${name}${ext}`;
      return `${dirName}${name}${ext}`;
    };
    if (skelExt.includes('.skel'))
      this.#assetManager.loadBinary(makePath(baseName, skelExt));
    else
      this.#assetManager.loadText(makePath(baseName, skelExt));
    this.#assetManager.loadTextureAtlas(makePath(baseName, atlasExt));
    for (let i = 3; i < fileNames.length; i++) {
      if (skelExt.includes('.skel'))
        this.#assetManager.loadBinary(makePath(baseName, fileNames[i]));
      else
        this.#assetManager.loadText(makePath(baseName, fileNames[i]));
      this.#assetManager.loadTextureAtlas(
        makePath(baseName, `${fileNames[i].split('.')[0]}${atlasExt}`)
      );
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
    if (this.#assetManager) this.#assetManager.dispose();
    this.#assetManager = null;
    this.#animationStates = [];
    this.#skeletons = {};
    this.#activeSkins = null;
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
    this._scale = scale;
    this._moveX = moveX;
    this._moveY = moveY;
    this._rotate = rotate;
  }
  resetTransform() {
    this._scale = 1;
    this._moveX = 0;
    this._moveY = 0;
    this._rotate = 0;
  }
  captureFrame(width, height) {
    width = Math.round(width);
    height = Math.round(height);
    const gl = this.#ctx.gl;
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return null;
    }
    const oldViewport = gl.getParameter(gl.VIEWPORT);
    gl.viewport(0, 0, width, height);
    const originalMvpValues = new Float32Array(this.#mvp.values);
    this.#updateMVP(width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.#shader.bind();
    this.#shader.setUniformi(this.#spine.Shader.SAMPLER, 0);
    this.#shader.setUniform4x4f(this.#spine.Shader.MVP_MATRIX, this.#mvp.values);
    this.#batcher.begin(this.#shader);
    for (const key of Object.keys(this.#skeletons).reverse()) {
      const skel = this.#skeletons[key].skeleton;
      this.#syncHiddenAttachments();
      this.#skeletonRenderer.vertexEffect = null;
      this.#skeletonRenderer.premultipliedAlpha = (this.#alphaMode === 'unpack' || this.#alphaMode === 'pma');
      this.#skeletonRenderer.draw(this.#batcher, skel);
    }
    this.#batcher.end();
    this.#shader.unbind();
    const pixels = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(framebuffer);
    gl.deleteTexture(texture);
    gl.viewport(oldViewport[0], oldViewport[1], oldViewport[2], oldViewport[3]);
    this.#mvp.set(originalMvpValues);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx2d = canvas.getContext('2d');
    const imgData = ctx2d.createImageData(width, height);
    const rowBytes = width * 4;
    for (let y = 0; y < height; y++) {
      const srcRowStart = y * rowBytes;
      const dstRowStart = (height - 1 - y) * rowBytes;
      imgData.data.set(pixels.subarray(srcRowStart, srcRowStart + rowBytes), dstRowStart);
    }
    ctx2d.putImageData(imgData, 0, 0);
    return canvas;
  }
  getAnimations() {
    const skel = this.#skeletons['0']?.skeleton;
    if (!skel) return [];
    return skel.data.animations.map(a => ({
      name: a.name,
      value: a.name,
    }));
  }
  setAnimation(value) {
    const skel = this.#skeletons['0']?.skeleton;
    if (!skel) return;
    for (const animState of this.#animationStates) {
      animState.clearTracks();
      skel.setToSetupPose();
      animState.setAnimation(0, value, true);
    }
  }
  getExpressions() {
    return null;
  }
  setExpression(_value) {
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
    return 30;
  }
  setPaused(paused) {
    this.#paused = paused;
  }
  setSeeking(seeking) {
    this.#seeking = seeking;
  }
  setSpeed(speed) {
    this.#speed = speed;
  }
  render() {
  }
  async setAlphaMode(alphaMode) {
    this.#alphaMode = alphaMode;
    this.#firstRender = true;
    if (this.#dirName && this.#fileNames.length > 0) {
      this.dispose();
      await this.load(this.#dirName, this.#fileNames);
    }
  }
  async #getSpineVersion(dirName, fileNames) {
    const ext = fileNames[1];
    const rawUrl = `${dirName}${fileNames[0]}${ext}`;
    const url = (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
      ? rawUrl
      : convertFileSrc(rawUrl);
    const file = await fetch(url);
    if (!file.ok) {
      throw new Error(`HTTP ${file.status}`);
    }
    if (ext.includes('.skel')) {
      const buffer = await file.arrayBuffer();
      const data = new Uint8Array(buffer);
      let position = -1;
      for (let i = 1; i < data.length - 1; i++) {
        const prev = data[i - 1];
        const current = data[i];
        const next = data[i + 1];
        if (current === 46 && prev >= 48 && prev <= 57 && next >= 48 && next <= 57) {
          position = i;
          break;
        }
      }
      if (position === -1) throw new Error('Valid version pattern not found in .skel file');
      return `${String.fromCharCode(data[position - 1])}.${String.fromCharCode(data[position + 1])}`;
    } else if (ext.includes('.json')) {
      const content = await file.text();
      const cleanedContent = content.replace(/,(\s*[}\]])/g, '$1');
      const jsonData = JSON.parse(cleanedContent);
      if (!jsonData.skeleton?.spine) throw new Error('Invalid JSON structure');
      return jsonData.skeleton.spine.substring(0, 3);
    }
    throw new Error('Unknown skeleton extension');
  }
  #waitForAssets() {
    if (!this.#assetManager) return;
    if (this.#assetManager.isLoadingComplete()) {
      const baseName = this.#fileNames[0];
      this.#skeletons['0'] = this.#loadSkeleton(baseName);
      for (let i = 3; i < this.#fileNames.length; i++) {
        const name2 = `${baseName}${this.#fileNames[i].split('.')[0]}`;
        this.#skeletons[String(i - 2)] = this.#loadSkeleton(name2);
      }
      this.#lastFrameTime = Date.now() / 1000;
      requestAnimationFrame(() => this.#renderLoop());
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
    const atlas = this.#assetManager.get(makePath(fileName, atlasExt));
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
    const skeletonLoader = skelExt.includes('.skel')
      ? new this.#spine.SkeletonBinary(atlasLoader)
      : new this.#spine.SkeletonJson(atlasLoader);
    let skelDataOrText = this.#assetManager.get(makePath(fileName, skelExt));
    if (typeof skelDataOrText === 'string' && skelExt.includes('.json')) {
      skelDataOrText = skelDataOrText.replace(/,(\s*[}\]])/g, '$1');
    }
    const skeletonData = skeletonLoader.readSkeletonData(skelDataOrText);
    const skeleton = new this.#spine.Skeleton(skeletonData);
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
    return { skeleton, state: animationState, bounds };
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
    const gl = this.#ctx.gl;
    const now = Date.now() / 1000;
    const delta = now - this.#lastFrameTime;
    this.#lastFrameTime = now;
    const dpr = window.devicePixelRatio || 1;
    this.#updateMVP(this.#canvas.width, this.#canvas.height, dpr);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (const key of Object.keys(this.#skeletons).reverse()) {
      const skel = this.#skeletons[key].skeleton;
      const state = this.#skeletons[key].state;
      if (!this.#seeking && !this.#paused) {
        state.update(delta * this.#speed);
      }
      state.apply(skel);
      skel.updateWorldTransform(2);
      this.#syncHiddenAttachments();
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
    this.#requestId = requestAnimationFrame(() => this.#renderLoop());
  }
  #getAttachmentItems() {
    const skeleton = this.#skeletons['0']?.skeleton;
    if (!skeleton) return [];
    const attachmentMap = new Map();
    skeleton.slots.forEach((slot, index) => {
      let attachmentNames = [];
      if (slot.attachment) {
        attachmentNames.push(slot.attachment.name);
      }
      if (slot.data.attachmentName && !attachmentNames.includes(slot.data.attachmentName)) {
        attachmentNames.push(slot.data.attachmentName);
      }
      attachmentNames.forEach(name => {
        const compositeKey = `${name}##${index}`;
        attachmentMap.set(compositeKey, index);
      });
    });
    for (const compositeKey in this.#attachmentsCache) {
      if (!attachmentMap.has(compositeKey)) {
        const [index] = this.#attachmentsCache[compositeKey];
        attachmentMap.set(compositeKey, index);
      }
    }
    return Array.from(attachmentMap.entries())
      .map(([compositeKey, index]) => {
        const [name] = compositeKey.split('##');
        return {
          name,
          index,
          type: 'checkbox',
          checked: !this.#attachmentsCache[compositeKey],
        };
      })
      .sort(sortByName);
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
  #toggleAttachment(name, slotIndex, checked) {
    const skeleton = this.#skeletons['0'].skeleton;
    const compositeKey = `${name}##${slotIndex}`;
    if (checked) {
      if (this.#attachmentsCache[compositeKey]) {
        delete this.#attachmentsCache[compositeKey];
        skeleton.setToSetupPose();
        const state = this.#skeletons['0'].state;
        if (state) state.apply(skeleton);
      }
    } else {
      const slot = skeleton.slots[slotIndex];
      let att = null;
      if (slot && slot.attachment && slot.attachment.name === name) {
        att = slot.attachment;
      } else {
        att = { name: name };
      }
      this.#attachmentsCache[compositeKey] = [slotIndex, att];
      if (slot && slot.attachment && slot.attachment.name === name) {
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
    this.#syncHiddenAttachments();
  }
  saveSkins(checkedNames) {
    return checkedNames;
  }
  #syncHiddenAttachments() {
    const skeleton = this.#skeletons['0']?.skeleton;
    if (!skeleton) return;
    Object.values(this.#attachmentsCache).forEach(([slotIndex, cachedAttachment]) => {
      const slot = skeleton.slots[slotIndex];
      if (slot && slot.attachment && (slot.attachment.name === cachedAttachment.name)) {
        slot.attachment = null;
      }
    });
  }
  #getModelId() {
    return `${this.#dirName}/${this.#fileNames[0]}`;
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
    if (!this._parameterItems) return;
    const item = this._parameterItems.find(i => i.index === index);
    if (!item) return;
    item._target[item._prop] = value;
    item.value = value;
  }
  isSkinsDisabled() {
    const skel = this.#skeletons['0']?.skeleton;
    return !skel || skel.data.skins.length <= 1;
  }
  getAnimationStates() {
    return this.#animationStates;
  }
}
