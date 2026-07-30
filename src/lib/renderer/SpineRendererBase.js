import { convertFileSrc, invoke } from '@tauri-apps/api/core';
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
  _alphaMode = 'pma';
  _paused = false;
  _speed = 1.0;
  _attachmentsCache = {};
  _activeSkins = null;
  _isFileJson = false;

  constructor(canvas, spineLib, isExport = false) {
    super(isExport);
    this._canvas = canvas;
    this._spine = spineLib;
    this._evidenceCache = new Map();
    this._skelProfiles = new Map();
    this._primaryCache = null;
    this._textureFilter = 'linear';
    this._loadedAtlases = [];
  }

  async initCtx(alphaMode = 'pma') {
    this._alphaMode = alphaMode;
    this._ctx = new this._spine.ManagedWebGLRenderingContext(this._canvas, {
      preserveDrawingBuffer: true,
      alpha: true,
      premultipliedAlpha: true,
      antialias: true
    });
    const gl = this._ctx.gl;
    if (gl) {
      gl.clearColor(0, 0, 0, 0);
      const originalBlendFunc = gl.blendFunc.bind(gl);
      const originalBlendFuncSeparate = gl.blendFuncSeparate.bind(gl);
      const patchBlend = (target) => {
        target.blendFunc = (src, dst) => {
          if (dst === gl.ONE_MINUS_SRC_ALPHA) {
            const srcFactor = this._alphaMode === 'npm' ? gl.SRC_ALPHA : gl.ONE;
            originalBlendFuncSeparate(srcFactor, dst, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
          } else if (src === gl.ONE && dst === gl.ONE) {
            originalBlendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
          } else if (src === gl.SRC_ALPHA && dst === gl.ONE) {
            originalBlendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);
          } else {
            originalBlendFunc(src, dst);
          }
        };
        target.blendFuncSeparate = (srcRGB, dstRGB, srcAlpha, dstAlpha) => {
          if (dstRGB === gl.ONE_MINUS_SRC_ALPHA) {
            if (srcAlpha === gl.ONE_MINUS_SRC_COLOR) {
              if (this._alphaMode === 'npm') {
                originalBlendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              } else {
                originalBlendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_COLOR);
              }
            } else {
              originalBlendFuncSeparate(srcRGB, dstRGB, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            }
          } else {
            originalBlendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha);
          }
        };
      };
      patchBlend(gl);
      patchBlend(this._ctx);
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

  setTextureFilter(filter) {
    this._textureFilter = filter;
    if (this._canvas && this._canvas.style) {
      if (filter === 'nearest') {
        this._canvas.style.imageRendering = 'pixelated';
      } else {
        this._canvas.style.imageRendering = 'auto';
      }
    }
    if (!this._spine) return;
    const filterType = filter === 'nearest'
      ? this._spine.TextureFilter.Nearest
      : this._spine.TextureFilter.Linear;
    for (const atlas of this._loadedAtlases) {
      if (!atlas || !atlas.pages) continue;
      for (const page of atlas.pages) {
        page.minFilter = filterType;
        page.magFilter = filterType;
        if (page.texture?.setFilters) {
          page.texture.setFilters(filterType, filterType);
        }
      }
    }
    if (this._paused) {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
      this.render(0, { dpr });
    }
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
    this._evidenceCache = new Map();
    this._skelProfiles = new Map();
    this._activeSkins = null;
    this._primaryCache = null;
    this._parameterItems = null;
    this._parameterItemsMap = null;
    this._loadedAtlases = [];
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
        loadModel(scene.name + extraFile.substring(0, extraFile.lastIndexOf('.')));
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
        const name2 = sceneInfo.name + extraFile.substring(0, extraFile.lastIndexOf('.'));
        const skelN = await this._loadSkeleton(name2);
        if (skelN) this._skeletons[String(i + 1)] = skelN;
      }
    }
    this._invalidatePrimary();
    this._hideMaskMosaicAttachments();
    this._scheduleFitBounds();
  }

  _getSlotSkeleton(slot) {
    if (!slot) return null;
    return slot.skeleton ||
      (typeof slot.getSkeleton === 'function' ? slot.getSkeleton() : null) ||
      slot.bone?.skeleton ||
      null;
  }

  _boneDepth(bone) {
    let d = 0;
    let b = bone;
    while (b?.parent) { d++; b = b.parent; }
    return d;
  }

  _isGlowBlend(slot) {
    const modes = this._spine?.BlendMode;
    const bm = slot?.data?.blendMode;
    if (!modes || bm === undefined || bm === null) return false;
    return bm === modes.Additive || bm === modes.Screen;
  }

  _getSkeletonProfile(skelData) {
    if (!skelData) return null;
    if (!this._skelProfiles) this._skelProfiles = new Map();
    const cached = this._skelProfiles.get(skelData);
    if (cached) return cached;
    const profile = this._buildSkeletonProfile(skelData);
    this._skelProfiles.set(skelData, profile);
    return profile;
  }

  _buildSkeletonProfile(skelData) {
    const probe = new this._spine.Skeleton(skelData);
    if (skelData.skins.length > 1) {
      const combined = new this._spine.Skin('_profile');
      for (const skin of skelData.skins) combined.addSkin(skin);
      probe.setSkin(combined);
    } else {
      probe.setSkin(skelData.defaultSkin);
    }
    const slots = probe.slots.map((slot) => ({
      depth: this._boneDepth(slot.bone),
      glow: this._isGlowBlend(slot),
      atts: new Map(),
      seen: 0,
      animSet: new Set(),
    }));
    const record = (pass, animIndex) => {
      for (const slot of probe.slots) {
        const attachment = slot.attachment;
        if (!attachment?.name) continue;
        const info = slots[slot.data.index];
        const wb = this._getSlotWorldBounds(slot);
        if (!wb) continue;
        let att = info.atts.get(attachment.name);
        if (!att) {
          att = {
            srcW: attachment.width || 0,
            srcH: attachment.height || 0,
            weighted: !!attachment.bones,
            setupW: 0, setupH: 0, maxW: 0, maxH: 0,
          };
          info.atts.set(attachment.name, att);
        }
        if (pass === 'setup') { att.setupW = wb.w; att.setupH = wb.h; }
        if (wb.w * wb.h > att.maxW * att.maxH) { att.maxW = wb.w; att.maxH = wb.h; }
        if (pass === 'anim') { info.seen++; info.animSet.add(animIndex); }
      }
    };
    probe.setToSetupPose();
    probe.updateWorldTransform(2);
    record('setup', -1);
    const setupExtent = this._unionSlotBounds(probe);
    let frames = 0;
    skelData.animations.forEach((anim, animIndex) => {
      const n = Math.min(24, Math.max(2, Math.ceil((anim.duration || 0) * 8)));
      for (let i = 0; i <= n; i++) {
        const t = anim.duration ? (anim.duration * i) / n : 0;
        probe.setToSetupPose();
        anim.apply(probe, 0, t, true, null, 1.0, 0, 0);
        probe.updateWorldTransform(2);
        frames++;
        record('anim', animIndex);
      }
    });
    let unitW = skelData.width > 0 ? skelData.width : 0;
    let unitH = skelData.height > 0 ? skelData.height : 0;
    if (!(unitW > 0) || !(unitH > 0)) {
      unitW = setupExtent?.w || 0;
      unitH = setupExtent?.h || 0;
    }
    if (!(unitW > 0) || !(unitH > 0)) { unitW = 1024; unitH = 1024; }
    const profile = { unitW, unitH, frames, animCount: skelData.animations.length, slots };
    profile.structural = new Map();
    profile.consensus = new Map();
    slots.forEach((info, slotIndex) => {
      info.atts.forEach((att, attName) => {
        const score = this._structuralScore(profile, info, att);
        profile.structural.set(`${slotIndex}##${attName}`, score);
        const prev = profile.consensus.get(attName);
        if (prev === undefined || score > prev) profile.consensus.set(attName, score);
      });
    });
    return profile;
  }

  _structuralScore(profile, info, att) {
    const refW = att.setupW || att.maxW;
    const refH = att.setupH || att.maxH;
    const stretch = (att.srcW > 0 && att.srcH > 0) ? Math.max(refW / att.srcW, refH / att.srcH) : 0;
    const setupArea = att.setupW * att.setupH;
    const growth = setupArea > 0 ? (att.maxW * att.maxH) / setupArea : 0;
    const persistence = profile.frames > 0 ? info.seen / profile.frames : 0;
    const partial = profile.animCount >= 2 && info.animSet.size < profile.animCount;
    let score = 0;
    if (info.glow) score += 1.0;
    if (stretch >= 2.5) score += 1.0;
    if (stretch >= 8) score += 0.8;
    if (growth >= 6) score += 0.8;
    if (att.maxW > 1.3 * profile.unitW || att.maxH > 1.3 * profile.unitH) score += 0.8;
    if (att.maxW > 2.5 * profile.unitW || att.maxH > 2.5 * profile.unitH) score += 0.8;
    if (partial) score += 0.6;
    if (partial && !setupArea) score += 0.4;
    if (att.weighted) score -= 1.2;
    if (info.depth >= 5) score -= 0.6;
    if (persistence >= 0.9) score -= 0.4;
    return score;
  }

  _unionSlotBounds(skeleton) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const slot of skeleton.slots) {
      if (!slot.attachment) continue;
      const wb = this._getSlotWorldBounds(slot);
      if (!wb) continue;
      minX = Math.min(minX, wb.minX); minY = Math.min(minY, wb.minY);
      maxX = Math.max(maxX, wb.maxX); maxY = Math.max(maxY, wb.maxY);
    }
    if (minX === Infinity) return null;
    return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
  }

  _slotEvidence(name, attachment, slot) {
    const skelData = this._getSlotSkeleton(slot)?.data;
    const skelKey = skelData?.hash || skelData?.name || '';
    const cacheKey = `${skelKey}##${slot?.data?.name || ''}##${name}`;
    if (!this._evidenceCache) this._evidenceCache = new Map();
    const cached = this._evidenceCache.get(cacheKey);
    if (cached) return cached;
    const lower = String(name).toLowerCase();
    const slotName = slot?.data?.name?.toLowerCase() || '';
    const bgEffectRegex = /(?:^|[_/.-])(backgrounds?|bgs?|effects?|effs?|efs?|fxs?|efxs?)(?:[_/.-]|$|[0-9])/i;
    const coreRegex = /(chara|character|body|head|face|hair|arm|leg|skirt|cloth|pelvis|neck|hand|foot|torso|spine|chest|hip|bust|skin|sleeve|glove|shoe|socks|weapon|sword|shield|spear|bow|staff|scythe|dress|coat|jacket|cape|wing|tail|horn|ear|eye|mouth|nose)/i;
    const nameBg = bgEffectRegex.test(lower) || bgEffectRegex.test(slotName);
    const nameCore = !nameBg && (coreRegex.test(lower) || coreRegex.test(slotName));
    const profile = this._getSkeletonProfile(skelData);
    const own = profile?.structural?.get(`${slot?.data?.index}##${name}`);
    const shared = profile?.consensus?.get(name);
    let score = 0;
    if (own !== undefined || shared !== undefined) {
      score = Math.max(own ?? -Infinity, shared ?? -Infinity);
    }
    if (nameCore) score -= 0.9;
    let isEffect = score >= 1.1;
    let isCore = score <= -0.5;
    if (nameBg) { isEffect = true; isCore = false; }
    const evidence = { score, isEffect, isCore };
    this._evidenceCache.set(cacheKey, evidence);
    return evidence;
  }

  _isBackgroundOrEffect(name, attachment, slot) {
    if (!name) return false;
    return this._slotEvidence(name, attachment, slot).isEffect;
  }

  _isCoreSlot(slot) {
    const name = slot?.attachment?.name;
    if (!name) return false;
    return this._slotEvidence(name, slot.attachment, slot).isCore;
  }

  _getUnit(skeleton) {
    const profile = this._getSkeletonProfile(skeleton?.data);
    return { w: profile?.unitW || 1024, h: profile?.unitH || 1024 };
  }

  _getSlotWorldBounds(slot) {
    const attachment = slot.attachment;
    if (!attachment) return null;
    let vertices;
    if (attachment.computeWorldVertices) {
      if (typeof attachment.worldVerticesLength === 'number') {
        vertices = new Float32Array(attachment.worldVerticesLength);
        attachment.computeWorldVertices(slot, 0, attachment.worldVerticesLength, vertices, 0, 2);
      } else if (slot.bone) {
        vertices = new Float32Array(8);
        const skeleton = this._getSlotSkeleton(slot);
        const version = skeleton?.data?.version || '';
        const verNum = parseFloat(version) || 0;
        if (verNum >= 4.1) {
          attachment.computeWorldVertices(slot, vertices, 0, 2);
        } else {
          attachment.computeWorldVertices(slot.bone, vertices, 0, 2);
        }
      }
    }
    if (vertices) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      let hasNan = false;
      for (let i = 0; i < vertices.length; i += 2) {
        const x = vertices[i];
        const y = vertices[i + 1];
        if (isNaN(x) || isNaN(y)) {
          hasNan = true;
          break;
        }
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      if (!hasNan) {
        return { w: maxX - minX, h: maxY - minY, minX, maxX, minY, maxY };
      }
    }
    const bone = slot.bone;
    if (bone) {
      let scaleX = Math.abs(bone.scaleX || 1);
      let scaleY = Math.abs(bone.scaleY || 1);
      let curr = bone.parent;
      while (curr) {
        scaleX *= Math.abs(curr.scaleX || 1);
        scaleY *= Math.abs(curr.scaleY || 1);
        curr = curr.parent;
      }
      const w = (attachment.width || 0) * scaleX;
      const h = (attachment.height || 0) * scaleY;
      const x = bone.worldX || 0;
      const y = bone.worldY || 0;
      return { w, h, minX: x - w / 2, maxX: x + w / 2, minY: y - h / 2, maxY: y + h / 2 };
    }
  }

  _getCoreBounds(skeleton) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const slot of skeleton.slots) {
      if (slot.attachment && this._isCoreSlot(slot)) {
        const wb = this._getSlotWorldBounds(slot);
        if (wb) {
          minX = Math.min(minX, wb.minX);
          minY = Math.min(minY, wb.minY);
          maxX = Math.max(maxX, wb.maxX);
          maxY = Math.max(maxY, wb.maxY);
        }
      }
    }
    if (minX !== Infinity) {
      return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
    }
    return null;
  }

  _getFitBounds(skel, maxRatio = 1.15) {
    let bounds = skel.fitBounds || skel.bounds;
    if (skel.fitBounds && skel.bounds && !skel.bounds.isDefault) {
      const fitArea = skel.fitBounds.size.x * skel.fitBounds.size.y;
      const setupArea = skel.bounds.size.x * skel.bounds.size.y;
      const implausible = !(fitArea > 0) ||
        (setupArea > 0 && (fitArea < 0.1 * setupArea || fitArea > 8 * setupArea));
      if (implausible) bounds = skel.bounds;
    }
    const subject = (bounds === skel.fitBounds) ? skel.subjectBounds : null;
    let result = bounds;
    if (bounds && bounds.size && bounds.offset) {
      const w = bounds.size.x;
      const h = bounds.size.y;
      if (w > 0 && h > 0) {
        const left = bounds.offset.x;
        const right = bounds.offset.x + w;
        const boxCenterX = bounds.offset.x + bounds.size.x * 0.5;
        const centerX = subject ? subject.offset.x + subject.size.x * 0.5 : boxCenterX;
        const originNearCenter = Math.abs(centerX) <= w * 0.04;
        const maxExtent = originNearCenter
          ? Math.max(Math.abs(left), Math.abs(right))
          : (w * 0.5);
        const symWidth = 2 * maxExtent;
        const centerY = subject
          ? subject.offset.y + subject.size.y * 0.5
          : bounds.offset.y + bounds.size.y * 0.5;
        const fitCenterX = originNearCenter ? 0 : centerX;
        if (symWidth > maxRatio * h) {
          const clampedW = maxRatio * h;
          result = {
            offset: {
              x: fitCenterX - clampedW * 0.5,
              y: centerY - h * 0.5
            },
            size: {
              x: clampedW,
              y: h
            }
          };
        } else {
          result = {
            offset: {
              x: fitCenterX - symWidth * 0.5,
              y: centerY - h * 0.5
            },
            size: {
              x: symWidth,
              y: h
            }
          };
        }
      }
    }
    return result;
  }

  _getPrimarySkeleton() {
    const entries = Object.entries(this._skeletons || {});
    if (entries.length === 0) return null;
    if (this._primaryCache && this._skeletons[this._primaryCache.key] === this._primaryCache.entry) {
      return this._primaryCache;
    }
    let best = null;
    let bestScore = -Infinity;
    for (const [key, entry] of entries) {
      if (!entry?.skeleton) continue;
      const core = entry.bounds?.core;
      const fit = entry.fitBounds || (entry.bounds?.isDefault ? null : entry.bounds);
      const anim = entry._ab?.normalUnion;
      const coreArea = (core?.w > 0 && core?.h > 0) ? (core.w * core.h) : 0;
      const fitArea = (fit?.size?.x > 0 && fit?.size?.y > 0) ? (fit.size.x * fit.size.y) : 0;
      const animArea = (anim?.w > 0 && anim?.h > 0) ? (anim.w * anim.h) : 0;
      const name = String(entry.name || '').toLowerCase();
      const bgLike = /(?:^|[_/.-])(bg|backgrounds?|back|shadow|floor|ground)(?:[_/.-]|$)/.test(name);
      const nameWeight = bgLike ? 0.35 : 1.0;
      const score = Math.max(coreArea, animArea * 0.9, fitArea * 0.6) * nameWeight;
      if (score > bestScore) {
        bestScore = score;
        best = { key, entry };
      }
    }
    if (!best) {
      const [key, entry] = entries[0];
      best = { key, entry };
    }
    this._primaryCache = best;
    return best;
  }

  _invalidatePrimary() {
    this._primaryCache = null;
  }

  _idle() {
    return new Promise((res) => {
      if (typeof requestIdleCallback === 'function') requestIdleCallback(() => res(), { timeout: 100 });
      else setTimeout(res, 0);
    });
  }

  _cancelFit() {
    this._fitToken = (this._fitToken || 0) + 1;
  }

  _revealCanvas() {
    if (this._canvas) this._canvas.style.opacity = '1';
  }

  _scheduleFitBounds() {
    if (this.isExport) return;
    this._cancelFit();
    this._fitRevealReady = false;
    if (this._revealTimer) clearTimeout(this._revealTimer);
    this._revealTimer = setTimeout(() => { this._fitRevealReady = true; this._revealCanvas(); }, 1200);
    this._computeFitBoundsAsync(this._fitToken);
  }

  async _computeFitBoundsAsync(token) {
    let primaryDone = false;
    for (const key of Object.keys(this._skeletons)) {
      if (token !== this._fitToken || !this._ctx) return;
      const e = this._skeletons[key];
      if (!e) continue;
      const ab = await this._sampleAnimBounds(e, key, token);
      if (token !== this._fitToken || !this._ctx) return;
      if (ab) {
        e._ab = ab;
        const nb = ab.normalUnion;
        if (nb && nb.w > 0 && nb.h > 0 && !ab.weakAnchor) {
          e.fitBounds = { offset: { x: nb.offX, y: nb.offY }, size: { x: nb.w, y: nb.h } };
          const cb = ab.coreUnion;
          e.subjectBounds = (cb && cb.w > 0 && cb.h > 0)
            ? { offset: { x: cb.offX, y: cb.offY }, size: { x: cb.w, y: cb.h } }
            : null;
        }
        this._invalidatePrimary();
      }
      if (!primaryDone) {
        primaryDone = true;
        this._fitRevealReady = true;
        if (this._paused) { this.render(0, { dpr: window.devicePixelRatio || 1 }); this._revealCanvas(); }
      }
    }
  }

  async _sampleAnimBounds(entry, key, token, samplesPerSec = 12) {
    const data = entry.skeleton.data;
    const probe = new this._spine.Skeleton(data);
    if (data.skins.length > 1) {
      const combined = new this._spine.Skin('_fit');
      for (const s of data.skins) combined.addSkin(s);
      probe.setSkin(combined);
    } else {
      probe.setSkin(entry.skeleton.skin || data.defaultSkin);
    }
    const unit = this._getUnit(entry.skeleton);
    const perAnim = [];
    let lastYield = performance.now();
    for (const anim of data.animations) {
      if (token !== this._fitToken) return null;
      const frames = { minX: [], minY: [], maxX: [], maxY: [] };
      const coreFrames = { minX: [], minY: [], maxX: [], maxY: [] };
      const a = { name: anim.name, minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity, frames, coreFrames };
      const n = Math.min(48, Math.max(2, Math.ceil((anim.duration || 0) * samplesPerSec)));
      for (let i = 0; i <= n; i++) {
        const t = anim.duration ? (anim.duration * i) / n : 0;
        probe.setToSetupPose();
        anim.apply(probe, 0, t, true, null, 1.0, 0, 0);
        probe.updateWorldTransform(2);
        this._syncHiddenAttachments(probe, key);
        const coreBox = this._getCoreBounds(probe);
        const hasReliableCoreBox = !!(coreBox && coreBox.w >= 0.12 * unit.w && coreBox.h >= 0.12 * unit.h);
        const margin = coreBox ? Math.max(0.22 * unit.h, coreBox.h * 0.6) : 0;
        let fMinX = Infinity, fMinY = Infinity, fMaxX = -Infinity, fMaxY = -Infinity;
        let cMinX = Infinity, cMinY = Infinity, cMaxX = -Infinity, cMaxY = -Infinity;
        for (const slot of probe.slots) {
          if (!slot.attachment) continue;
          if (this._isBackgroundOrEffect(slot.attachment.name, slot.attachment, slot)) continue;
          const wb = this._getSlotWorldBounds(slot);
          if (!wb) continue;
          const isCore = this._isCoreSlot(slot);
          const isOutlier = hasReliableCoreBox && (
            wb.maxX < coreBox.minX - margin || wb.minX > coreBox.maxX + margin ||
            wb.maxY < coreBox.minY - margin || wb.minY > coreBox.maxY + margin
          );
          const isOversize = !isCore && (wb.w > 1.3 * unit.w || wb.h > 1.3 * unit.h);
          if (isOversize || isOutlier) continue;
          if (wb.minX < fMinX) fMinX = wb.minX;
          if (wb.minY < fMinY) fMinY = wb.minY;
          if (wb.maxX > fMaxX) fMaxX = wb.maxX;
          if (wb.maxY > fMaxY) fMaxY = wb.maxY;
          if (isCore) {
            if (wb.minX < cMinX) cMinX = wb.minX;
            if (wb.minY < cMinY) cMinY = wb.minY;
            if (wb.maxX > cMaxX) cMaxX = wb.maxX;
            if (wb.maxY > cMaxY) cMaxY = wb.maxY;
          }
        }
        if (fMinX === Infinity) continue;
        frames.minX.push(fMinX); frames.minY.push(fMinY);
        frames.maxX.push(fMaxX); frames.maxY.push(fMaxY);
        if (cMinX !== Infinity) {
          coreFrames.minX.push(cMinX); coreFrames.minY.push(cMinY);
          coreFrames.maxX.push(cMaxX); coreFrames.maxY.push(cMaxY);
        }

        a.minX = Math.min(a.minX, fMinX); a.minY = Math.min(a.minY, fMinY);
        a.maxX = Math.max(a.maxX, fMaxX); a.maxY = Math.max(a.maxY, fMaxY);
      }
      perAnim.push(a);
      if (performance.now() - lastYield > 10) {
        await this._idle();
        lastYield = performance.now();
      }
    }
    return this._reduceAnimBounds(perAnim, unit);
  }

  _reduceAnimBounds(perAnim, unit = { w: 1875, h: 1875 }) {
    const toBox = (b) => ({ offX: b.minX, offY: b.minY, w: b.maxX - b.minX, h: b.maxY - b.minY });
    const union = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    for (const a of perAnim) {
      if (!isFinite(a.minX)) continue;
      union.minX = Math.min(union.minX, a.minX); union.minY = Math.min(union.minY, a.minY);
      union.maxX = Math.max(union.maxX, a.maxX); union.maxY = Math.max(union.maxY, a.maxY);
    }
    const at = (values, q) => {
      const sorted = [...values].sort((x, y) => x - y);
      return sorted[Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * q)))];
    };
    const TRIM = 0.15;
    const trimmed = (f, name) => {
      if (!f?.minX?.length) return null;
      const box = {
        name,
        minX: at(f.minX, TRIM), maxX: at(f.maxX, 1 - TRIM),
        minY: at(f.minY, TRIM), maxY: at(f.maxY, 1 - TRIM),
      };
      box.w = box.maxX - box.minX;
      box.h = box.maxY - box.minY;
      return (box.w > 0 && box.h > 0) ? box : null;
    };
    const typicalBox = (f, name) => {
      const n = f?.minX?.length || 0;
      if (!n) return null;
      const w = [], h = [], cx = [], cy = [];
      for (let i = 0; i < n; i++) {
        w.push(f.maxX[i] - f.minX[i]);
        h.push(f.maxY[i] - f.minY[i]);
        cx.push((f.minX[i] + f.maxX[i]) * 0.5);
        cy.push((f.minY[i] + f.maxY[i]) * 0.5);
      }
      const bw = at(w, 0.5), bh = at(h, 0.5);
      if (!(bw > 0) || !(bh > 0)) return null;
      const bx = at(cx, 0.5), by = at(cy, 0.5);
      return { name, minX: bx - bw / 2, maxX: bx + bw / 2, minY: by - bh / 2, maxY: by + bh / 2, w: bw, h: bh };
    };
    const steady = [];
    const coreByName = new Map();
    for (const a of perAnim) {
      const box = trimmed(a.frames, a.name);
      if (box) steady.push(box);
      const coreBox = typicalBox(a.coreFrames, a.name);
      if (coreBox) coreByName.set(a.name, coreBox);
    }
    const plainPerAnim = perAnim.map(toBox);
    if (steady.length === 0) {
      return { union: toBox(union), normalUnion: toBox(union), perAnim: plainPerAnim, weakAnchor: !isFinite(union.minX) };
    }
    const centreX = (b) => (b.minX + b.maxX) * 0.5;
    const centreY = (b) => (b.minY + b.maxY) * 0.5;
    const medX = at(steady.map(centreX), 0.5);
    const medY = at(steady.map(centreY), 0.5);
    const medW = at(steady.map(b => b.w), 0.5);
    const medH = at(steady.map(b => b.h), 0.5);
    const DRIFT = 0.25;
    let placed = steady.filter(b =>
      Math.abs(centreX(b) - medX) <= DRIFT * medW &&
      Math.abs(centreY(b) - medY) <= DRIFT * medH);
    if (placed.length === 0) placed = steady;

    let candidates = placed.filter(b => b.w >= 0.08 * unit.w && b.h >= 0.08 * unit.h);
    if (candidates.length === 0) candidates = placed;
    const anchor = candidates.reduce((best, b) => (b.w * b.h < best.w * best.h ? b : best));
    const SIBLING = 1.3;
    const kept = placed.filter(b => b.w <= SIBLING * anchor.w && b.h <= SIBLING * anchor.h);
    const use = kept.length ? kept : [anchor];
    const nu = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    for (const b of use) {
      nu.minX = Math.min(nu.minX, b.minX); nu.minY = Math.min(nu.minY, b.minY);
      nu.maxX = Math.max(nu.maxX, b.maxX); nu.maxY = Math.max(nu.maxY, b.maxY);
    }
    const cu = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    for (const b of use) {
      const core = coreByName.get(b.name);
      if (!core) continue;
      cu.minX = Math.min(cu.minX, core.minX); cu.minY = Math.min(cu.minY, core.minY);
      cu.maxX = Math.max(cu.maxX, core.maxX); cu.maxY = Math.max(cu.maxY, core.maxY);
    }
    const coreUnion = isFinite(cu.minX) ? toBox(cu) : null;
    let framed = nu;
    const keptArea = (nu.maxX - nu.minX) * (nu.maxY - nu.minY);
    const coreArea = coreUnion ? coreUnion.w * coreUnion.h : 0;
    if (coreArea > 0 && coreArea >= 0.1 * keptArea) {
      const MARGIN = 1.1;
      const axis = (keptLo, keptHi, coreLo, coreHi) => {
        const size = Math.min(keptHi - keptLo, (coreHi - coreLo) * MARGIN);
        const center = (coreLo + coreHi) * 0.5;
        return { lo: center - size * 0.5, hi: center + size * 0.5 };
      };
      const x = axis(nu.minX, nu.maxX, cu.minX, cu.maxX);
      const y = axis(nu.minY, nu.maxY, cu.minY, cu.maxY);
      framed = { minX: x.lo, maxX: x.hi, minY: y.lo, maxY: y.hi };
    }
    return {
      union: toBox(union),
      normalUnion: toBox(framed),
      keptUnion: toBox(nu),
      coreUnion,
      perAnim: plainPerAnim,
      framedAnims: use.map(b => b.name),
      weakAnchor: false,
    };
  }

  _projectToPixel(x, y) {
    const m = this._mvp.values;
    const cx = m[0] * x + m[4] * y + m[12];
    const cy = m[1] * x + m[5] * y + m[13];
    const cw = m[3] * x + m[7] * y + m[15] || 1;
    const ndcX = cx / cw, ndcY = cy / cw;
    return {
      px: (ndcX * 0.5 + 0.5) * this._canvas.width,
      py: (1 - (ndcY * 0.5 + 0.5)) * this._canvas.height,
    };
  }

  _evalFit(box, margin = 0.05) {
    const W = this._canvas.width, H = this._canvas.height;
    const corners = [
      this._projectToPixel(box.offX, box.offY),
      this._projectToPixel(box.offX + box.w, box.offY),
      this._projectToPixel(box.offX, box.offY + box.h),
      this._projectToPixel(box.offX + box.w, box.offY + box.h),
    ];
    const xs = corners.map(c => c.px), ys = corners.map(c => c.py);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const boxW = maxX - minX, boxH = maxY - minY;
    const safeW = W * (1 - 2 * margin), safeH = H * (1 - 2 * margin);
    const pad = 1;
    return {
      rectPx: { x: minX, y: minY, w: boxW, h: boxH },
      clipped: minX < -pad || minY < -pad || maxX > W + pad || maxY > H + pad,
      fill: +Math.max(boxW / safeW, boxH / safeH).toFixed(3),
      centerErr: +(Math.hypot((minX + maxX) / 2 - W / 2, (minY + maxY) / 2 - H / 2) / Math.hypot(W, H)).toFixed(4),
    };
  }

  _hideMaskMosaicAttachments() {
    for (const key in this._skeletons) {
      const skelEntry = this._skeletons[key];
      const skeleton = skelEntry.skeleton;
      const state = skelEntry.state;
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
      if (state?.tracks?.[0]) {
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
        if (name && (name.includes('MaskMosaic') || name.includes('mozaiku'))) {
          const compositeKey = `${skelId}##${name}##${slotIndex}`;
          this._attachmentsCache[compositeKey] = [slotIndex, name, skelId];
          const slot = skeleton.slots[slotIndex];
          if (slot?.attachment && slot.attachment.name === name) {
            slot.attachment = null;
          }
        }
      });
    }
    this._syncAllHiddenAttachments();
  }

  async _loadSkeleton(fileName) {
    const sceneInfo = this._fileNames;
    const normalizedDirName = this._dirName.endsWith('/') ? this._dirName : `${this._dirName}/`;
    const makePath = (name, ext) => `${normalizedDirName}${name}${ext}`;
    const atlasPath = makePath(fileName, sceneInfo.atlasExt);
    const atlas = this._assetManager.get(atlasPath);
    if (!atlas) return null;
    if (atlas.regions) setupAtlas(atlas);
    this._loadedAtlases.push(atlas);
    const isWebUrl = this._dirName.startsWith('http://') || this._dirName.startsWith('https://');
    await this._resizeAtlasPages(atlas, atlasPath, isWebUrl);
    const filterType = this._textureFilter === 'nearest'
      ? this._spine.TextureFilter.Nearest
      : this._spine.TextureFilter.Linear;
    for (const page of atlas.pages) {
      page.minFilter = filterType;
      page.magFilter = filterType;
      if (page.texture?.setFilters) {
        page.texture.setFilters(filterType, filterType);
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
      const isLocalAsset = (() => {
        try {
          const url = new URL(atlasPath);
          return url.protocol === 'tauri:' ||
            url.hostname === 'tauri.localhost' ||
            url.hostname === 'asset.localhost';
        } catch (e) {
          return atlasPath.startsWith('tauri://');
        }
      })();
      const hasTauriInvoke = typeof window !== 'undefined' &&
        ((window.__TAURI_INTERNALS__ !== undefined && typeof window.__TAURI_INTERNALS__.invoke === 'function') ||
          (window.__TAURI__?.core?.invoke !== undefined));
      if (isWebUrl && !isLocalAsset && hasTauriInvoke) {
        const fetched = await invoke('fetch_url_bytes', { url: atlasPath });
        atlasText = new TextDecoder().decode(new Uint8Array(fetched));
      } else {
        const url = isLocalAsset ? atlasPath : convertFileSrc(atlasPath);
        const res = await fetch(url);
        if (res.ok) atlasText = await res.text();
      }
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
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this._alphaMode === 'unpack');
      page.width = declared.width;
      page.height = declared.height;
      resizedPages.add(page);
    }
    if (resizedPages.size > 0 && atlas.regions) {
      updateAtlasRegions(atlas, resizedPages);
    }
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
    const unit = this._getUnit(skeleton);
    const setupCoreBox = this._getCoreBounds(skeleton);
    const hasReliableSetupCoreBox = !!(setupCoreBox && setupCoreBox.w >= 0.12 * unit.w && setupCoreBox.h >= 0.12 * unit.h);
    const setupMargin = setupCoreBox ? Math.max(0.22 * unit.h, setupCoreBox.h * 0.6) : 0;
    for (const slot of skeleton.slots) {
      if (slot.attachment) {
        const isBgOrEff = this._isBackgroundOrEffect(slot.attachment.name, slot.attachment, slot);
        const isCore = this._isCoreSlot(slot);
        const wb = this._getSlotWorldBounds(slot);
        if (isBgOrEff) {
          slot.attachment = null;
          continue;
        }
        if (wb) {
          const isOutlier = hasReliableSetupCoreBox && (
            wb.maxX < setupCoreBox.minX - setupMargin || wb.minX > setupCoreBox.maxX + setupMargin ||
            wb.maxY < setupCoreBox.minY - setupMargin || wb.minY > setupCoreBox.maxY + setupMargin
          );
          const isOversize = !isCore && (wb.w > 1.3 * unit.w || wb.h > 1.3 * unit.h);
          if (isOversize || isOutlier) {
            slot.attachment = null;
          }
        }
      }
    }
    const offset = new this._spine.Vector2(), size = new this._spine.Vector2();
    skeleton.getBounds(offset, size, []);
    if (size.x === -Infinity || size.y === -Infinity) {
      const animations = skeleton.data.animations;
      for (const anim of animations) {
        anim.apply(skeleton, 0, 0, false, null, 1.0, 0, 0);
        skeleton.updateWorldTransform(2);
        const fallbackCoreBox = this._getCoreBounds(skeleton);
        const hasReliableFallbackCoreBox = !!(fallbackCoreBox && fallbackCoreBox.w >= 0.12 * unit.w && fallbackCoreBox.h >= 0.12 * unit.h);
        const fallbackMargin = fallbackCoreBox ? Math.max(0.22 * unit.h, fallbackCoreBox.h * 0.6) : 0;
        for (const slot of skeleton.slots) {
          if (slot.attachment) {
            const isBgOrEff = this._isBackgroundOrEffect(slot.attachment.name, slot.attachment, slot);
            if (isBgOrEff) {
              slot.attachment = null;
              continue;
            }
            const wb = this._getSlotWorldBounds(slot);
            if (wb) {
              const isOutlier = hasReliableFallbackCoreBox && (
                wb.maxX < fallbackCoreBox.minX - fallbackMargin || wb.minX > fallbackCoreBox.maxX + fallbackMargin ||
                wb.maxY < fallbackCoreBox.minY - fallbackMargin || wb.minY > fallbackCoreBox.maxY + fallbackMargin
              );
              const isOversize = !this._isCoreSlot(slot) && (wb.w > 1.3 * unit.w || wb.h > 1.3 * unit.h);
              if (isOversize || isOutlier) {
                slot.attachment = null;
              }
            }
          }
        }
        skeleton.getBounds(offset, size, []);
        if (size.x !== -Infinity) break;
      }
    }
    let isDefault = false;
    if (size.x === -Infinity) {
      size.x = 2048; size.y = 2048; offset.x = -1024; offset.y = -1024;
      isDefault = true;
    }
    skeleton.setSkin(originalSkin);
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform(2);
    return { offset, size, core: setupCoreBox, isDefault };
  }

  render(delta = 0, options = {}) {
    if (!this._ctx) return;
    const gl = this._ctx.gl;
    if (!gl) return;
    this.updateMVP(options);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const sortedKeys = this._getSortedSkeletonKeys();
    for (const key of sortedKeys) {
      const { skeleton, state } = this._skeletons[key];
      if (delta > 0 && !this._paused) state.update(delta * this._speed);
      state.apply(skeleton);
      this._applyParameterOverrides(key);
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
    const primary = this._getPrimarySkeleton();
    if (!primary?.entry) {
      const keys = Object.keys(this._skeletons || {});
      if (keys.length > 0) {
        console.warn(`[SpineRendererBase] updateMVP failed: no primary skeleton. keys=`, keys);
      }
      return;
    }
    const isExportOrCapture = this.isExport || options.isExport || options.screenBaseScale !== undefined || options.ignoreTransform !== undefined;
    const fitBounds = this._getFitBounds(primary.entry, isExportOrCapture ? 2.5 : 1.15);
    let screenBaseScale = options.screenBaseScale;
    if (!screenBaseScale && !this.isExport) {
      screenBaseScale = Math.max(
        fitBounds.size.x / (window.innerWidth),
        fitBounds.size.y / (window.innerHeight)
      );
    }
    const applyMvp = (b) => calculateSpineMVP(this._spine, this._mvp, this._canvas.width, this._canvas.height, b, {
      scale: this._scale,
      x: this._moveX,
      y: this._moveY,
      rotation: this._rotate
    }, { ...options, screenBaseScale });
    applyMvp(fitBounds);
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
    this._primaryCache = null;
    if (this._evidenceCache) this._evidenceCache.clear();
    if (this._skelProfiles) this._skelProfiles.clear();
  }

  getOriginalSize() {
    const primary = this._getPrimarySkeleton();
    const skel = primary?.entry;
    if (!skel) return { width: 0, height: 0 };
    const fitBounds = this._getFitBounds(skel, 2.5);
    if (!fitBounds || !fitBounds.size) return { width: 0, height: 0 };
    return {
      width: Math.round(fitBounds.size.x),
      height: Math.round(fitBounds.size.y)
    };
  }

  getMainOriginalSize() {
    const primary = this._getPrimarySkeleton();
    const skel = primary?.entry;
    if (!skel) return { width: 0, height: 0 };
    const fitBounds = this._getFitBounds(skel, 1.15);
    if (!fitBounds || !fitBounds.size) return { width: 0, height: 0 };
    return {
      width: Math.round(fitBounds.size.x),
      height: Math.round(fitBounds.size.y)
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
      const primary = this._getPrimarySkeleton();
      const firstSkel = primary?.entry;
      if (firstSkel) {
        const fitBounds = this._getFitBounds(firstSkel, 2.5);
        if (fitBounds && fitBounds.size) {
          screenBaseScale = Math.max(
            fitBounds.size.x / window.innerWidth,
            fitBounds.size.y / window.innerHeight
          );
        }
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
    if (value === '') {
      for (const key in this._skeletons) {
        const entry = this._skeletons[key];
        entry.state.clearTracks();
        entry.skeleton.setToSetupPose();
        entry.state.apply(entry.skeleton);
        entry.skeleton.updateWorldTransform(2);
      }
      return;
    }
    for (const key in this._skeletons) {
      const entry = this._skeletons[key];
      if (entry.skeleton.data.findAnimation(value)) {
        entry.state.setAnimation(0, value, true);
      }
    }
  }

  getPropertyCategories() {
    const categories = [];
    let hasMultipleSkins = false;
    for (const key in this._skeletons) {
      if (this._skeletons[key].skeleton.data.skins.length > 1) {
        hasMultipleSkins = true;
        break;
      }
    }
    if (hasMultipleSkins) categories.push('skins');
    categories.push('attachments');
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
      if (state?.tracks?.[0]) {
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
        const mergedIndex = (parseInt(skelId) * 1000000) + slotIndex;
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
    const sortedKeys = this._getSortedSkeletonKeys();
    for (const key of sortedKeys) {
      const skelEntry = this._skeletons[key];
      const skel = skelEntry.skeleton;
      const skelName = skelEntry.name || key;
      const skelId = parseInt(key);
      const animatedBonesRot = new Set();
      const animatedBonesTrans = new Set();
      const animatedBonesScale = new Set();
      const animatedBonesAny = new Set();
      const animatedIK = new Set();
      const animatedTF = new Set();
      const animatedPath = new Set();
      const animations = skel.data.animations;
      const hasAnimations = animations && animations.length > 0;
      if (hasAnimations) {
        for (const anim of animations) {
          if (!anim.timelines) continue;
          for (const tl of anim.timelines) {
            const isMoving = tl.frames && (tl.frames.length > (tl.constructor.name.includes('Rotate') ? 2 : 3) || tl.frames[0] > 0);
            if (tl.boneIndex !== undefined) {
              const bi = tl.boneIndex;
              const type = tl.constructor.name;
              if (isMoving) {
                animatedBonesAny.add(bi);
                if (type.includes('Rotate')) animatedBonesRot.add(bi);
                if (type.includes('Translate')) animatedBonesTrans.add(bi);
                if (type.includes('Scale')) animatedBonesScale.add(bi);
              }
            }
            if (isMoving) {
              if (tl.ikConstraintIndex !== undefined) animatedIK.add(tl.ikConstraintIndex);
              if (tl.transformConstraintIndex !== undefined) animatedTF.add(tl.transformConstraintIndex);
              if (tl.pathConstraintIndex !== undefined) animatedPath.add(tl.pathConstraintIndex);
            }
          }
        }
      }
      const deformBones = new Set();
      if (skel.data.skins) {
        skel.data.skins.forEach(skin => {
          if (!skin.attachments) return;
          skin.attachments.forEach(slotAttachments => {
            if (!slotAttachments) return;
            Object.values(slotAttachments).forEach(attachment => {
              if (attachment && attachment.bones) {
                attachment.bones.forEach(bId => deformBones.add(bId));
              }
            });
          });
        });
      }
      const ikTargets = new Set();
      const drivenBones = new Set();
      if (skel.ikConstraints) {
        skel.ikConstraints.forEach(ik => {
          if (ik.target) ikTargets.add(skel.bones.indexOf(ik.target));
          if (ik.bones) ik.bones.forEach(b => drivenBones.add(skel.bones.indexOf(b)));
        });
      }
      if (skel.transformConstraints) {
        skel.transformConstraints.forEach(tc => {
          if (tc.bones) tc.bones.forEach(b => drivenBones.add(skel.bones.indexOf(b)));
        });
      }
      const hasChildren = new Set();
      skel.bones.forEach((bone, i) => {
        if (bone.parent) hasChildren.add(skel.bones.indexOf(bone.parent));
      });
      const usedNames = new Set();
      const isMerged = !!this._fileNames?.isMerged;
      const addRange = (name, target, prop, min = 0, max = 1, step = 0.01, localId) => {
        const fullPropName = `${name}_${prop}`;
        if (isMerged && usedNames.has(fullPropName)) return;
        usedNames.add(fullPropName);
        const displayName = (Object.keys(this._skeletons).length > 1 && !isMerged ? `[${skelName}] ${name}` : name).replace(/\[.*?\]\s*/g, '');
        items.push({
          name: name,
          displayName: displayName,
          index: (skelId * 1000000) + localId,
          type: 'range',
          min, max, step,
          value: target[prop],
          _target: target,
          _prop: prop,
          _skeletonId: key
        });
      };
      if (skel.ikConstraints) {
        skel.ikConstraints.forEach((ik, i) => {
          if (!hasAnimations || animatedIK.has(i)) {
            addRange(`IK: ${ik.data.name}`, ik, 'mix', 0, 1, 0.01, 0 + i);
          }
        });
      }
      if (skel.transformConstraints) {
        skel.transformConstraints.forEach((tc, i) => {
          if (!hasAnimations || animatedTF.has(i)) {
            const props = ['mixRotate', 'rotateMix', 'mixX', 'translateMix', 'mixY', 'mixScaleX', 'scaleMix', 'mixScaleY', 'mixShearY', 'shearMix'];
            props.forEach((p, pi) => {
              if (tc[p] !== undefined) addRange(`TF ${tc.data.name}: ${p}`, tc, p, 0, 1, 0.01, 10000 + i * 10 + pi);
            });
          }
        });
      }
      if (skel.pathConstraints) {
        skel.pathConstraints.forEach((pc, i) => {
          if (!hasAnimations || animatedPath.has(i)) {
            const props = ['mixRotate', 'rotateMix', 'mixX', 'translateMix', 'mixY'];
            props.forEach((p, pi) => {
              if (pc[p] !== undefined) addRange(`Path ${pc.data.name}: ${p}`, pc, p, 0, 1, 0.01, 20000 + i * 10 + pi);
            });
          }
        });
      }
      if (skel.bones) {
        skel.bones.forEach((bone, i) => {
          const name = bone.data.name;
          if (name.startsWith('_')) return;
          const isRoot = (i === 0);
          const isIKTarget = ikTargets.has(i);
          if (drivenBones.has(i) && !isIKTarget && !isRoot) return;
          const isDeformOnly = deformBones.has(i) && !hasChildren.has(i) && !isIKTarget;
          if (isDeformOnly && !isRoot) return;
          const hasRot = animatedBonesRot.has(i);
          const hasTrans = animatedBonesTrans.has(i);
          const hasScale = animatedBonesScale.has(i);
          if (hasAnimations && !animatedBonesAny.has(i) && !isRoot && !isIKTarget) return;
          const range = 1000;
          const baseId = 100000 + i * 10;
          if (!hasAnimations || hasTrans || isRoot || isIKTarget) {
            addRange(`Bone ${name}: x`, bone, 'x', -range, range, 0.5, baseId + 0);
            addRange(`Bone ${name}: y`, bone, 'y', -range, range, 0.5, baseId + 1);
          }
          if (!hasAnimations || hasRot || isRoot) {
            addRange(`Bone ${name}: rotation`, bone, 'rotation', -360, 360, 1, baseId + 2);
          }
          if (!hasAnimations || hasScale) {
            addRange(`Bone ${name}: scaleX`, bone, 'scaleX', -10, 10, 0.1, baseId + 3);
            addRange(`Bone ${name}: scaleY`, bone, 'scaleY', -10, 10, 0.1, baseId + 4);
          }
        });
      }
    }
    this._parameterItems = items;
    this._parameterItemsMap = new Map(items.map(i => [i.index, i]));
    return items;
  }

  _applyParameterOverrides(skeletonId) {
    if (this.parameterOverrides.size === 0) return;
    if ((!this._parameterItemsMap || this._parameterItemsMap.size === 0) && Object.keys(this._skeletons).length > 0) {
      this._getParameterItems();
    }
    if (!this._parameterItemsMap) return;
    const skelIdInt = parseInt(skeletonId);
    for (let [index, value] of this.parameterOverrides) {
      const idx = Number(index);
      if (Math.floor(idx / 1000000) === skelIdInt) {
        const item = this._parameterItemsMap.get(idx);
        if (item) {
          item._target[item._prop] = value;
        }
      }
    }
  }

  updatePropertyItem(category, name, mergedIndex, value) {
    if (category === 'parameters') {
      const idx = Number(mergedIndex);
      const item = this._parameterItemsMap?.get(idx) || this._parameterItems?.find(i => i.index === idx);
      if (item) {
        const val = Number(value);
        const prop = item._prop;
        const itemName = item.name;
        const isMerged = !!this._fileNames?.isMerged;
        for (const k in this._skeletons) {
          if (!isMerged && k !== item._skeletonId) continue;
          const s = this._skeletons[k].skeleton;
          let targetObj = null;
          let localIdBase = 0;
          if (itemName.startsWith('Bone ')) {
            const bName = itemName.split(': ')[0].replace('Bone ', '');
            targetObj = s.findBone(bName);
            if (targetObj) localIdBase = 100000 + s.bones.indexOf(targetObj) * 10;
          } else if (itemName.startsWith('IK: ')) {
            const ikName = itemName.replace('IK: ', '');
            targetObj = s.findIkConstraint(ikName);
            if (targetObj) localIdBase = 0 + s.ikConstraints.indexOf(targetObj);
          } else if (itemName.startsWith('TF ')) {
            const tfName = itemName.split(': ')[0].replace('TF ', '');
            targetObj = s.findTransformConstraint(tfName);
            if (targetObj) localIdBase = 10000 + s.transformConstraints.indexOf(targetObj) * 10;
          } else if (itemName.startsWith('Path ')) {
            const pathName = itemName.split(': ')[0].replace('Path ', '');
            targetObj = s.findPathConstraint(pathName);
            if (targetObj) localIdBase = 20000 + s.pathConstraints.indexOf(targetObj) * 10;
          }
          if (targetObj) {
            targetObj[prop] = val;
            const skelId = parseInt(k);
            let finalIdx = (skelId * 1000000) + localIdBase;
            if (itemName.includes(': ')) {
              const suffix = itemName.split(': ')[1];
              if (suffix === 'y') finalIdx += 1;
              if (suffix === 'rotation') finalIdx += 2;
              if (suffix === 'scaleX') finalIdx += 3;
              if (suffix === 'scaleY') finalIdx += 4;
              const props = ['mixRotate', 'rotateMix', 'mixX', 'translateMix', 'mixY', 'mixScaleX', 'scaleMix', 'mixScaleY', 'mixShearY', 'shearMix'];
              const pi = props.indexOf(prop);
              if (pi !== -1) finalIdx += pi;
            }
            this.parameterOverrides.set(finalIdx, val);
          }
        }
      }
    } else if (category === 'skins') {
      this._toggleSkin(name, value);
    } else if (category === 'attachments') {
      const skeletonId = String(Math.floor(mergedIndex / 1000000));
      const slotIndex = mergedIndex % 1000000;
      this._toggleAttachment(name, slotIndex, value, skeletonId);
    }
  }

  resetOverrides(category) {
    super.resetOverrides(category);
    if (category === 'parameters') {
      for (const key in this._skeletons) {
        const { skeleton, state } = this._skeletons[key];
        skeleton.setToSetupPose();
        state.apply(skeleton);
        skeleton.updateWorldTransform(2);
      }
    } else if (category === 'attachments') {
      this._attachmentsCache = {};
      for (const key in this._skeletons) {
        const { skeleton, state } = this._skeletons[key];
        skeleton.setToSetupPose();
        state.apply(skeleton);
        skeleton.updateWorldTransform(2);
      }
      this._hideMaskMosaicAttachments();
    }
    this.render(0);
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
        this._applyParameterOverrides(key);
        skeleton.updateWorldTransform(2);
      }
    }
  }

  getSyncState() {
    const state = super.getSyncState();
    state.activeSkins = this._activeSkins ? Array.from(this._activeSkins) : null;
    state.attachmentsCache = this._attachmentsCache;
    state.skeletonBounds = {};
    for (const key in this._skeletons) {
      const entry = this._skeletons[key];
      if (entry) {
        state.skeletonBounds[key] = {
          bounds: entry.bounds,
          fitBounds: entry.fitBounds,
          subjectBounds: entry.subjectBounds,
          _ab: entry._ab
        };
      }
    }
    return state;
  }

  applySyncState(state) {
    super.applySyncState(state);
    if (!state) return;
    if (state.activeSkins) {
      this.applySkins(state.activeSkins);
    }
    if (state.attachmentsCache) {
      this._attachmentsCache = state.attachmentsCache;
      this._syncAllHiddenAttachments();
    }
    if (state.skeletonBounds) {
      for (const key in state.skeletonBounds) {
        const entry = this._skeletons[key];
        if (entry) {
          const boundsInfo = state.skeletonBounds[key];
          entry.bounds = boundsInfo.bounds;
          entry.fitBounds = boundsInfo.fitBounds;
          entry.subjectBounds = boundsInfo.subjectBounds;
          entry._ab = boundsInfo._ab;
          this._invalidatePrimary();
        } else {
          console.warn(`[SpineRendererBase] Sync bounds for key=${key} but skeleton not loaded in skeletons:`, Object.keys(this._skeletons));
        }
      }
    }
  }
}
