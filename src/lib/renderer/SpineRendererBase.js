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
            originalBlendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
          } else if (src === gl.ONE && dst === gl.ONE) {
            originalBlendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
          } else {
            originalBlendFunc(src, dst);
          }
        };
        target.blendFuncSeparate = (srcRGB, dstRGB, srcAlpha, dstAlpha) => {
          if (dstRGB === gl.ONE_MINUS_SRC_ALPHA) {
            originalBlendFuncSeparate(srcRGB, dstRGB, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
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
    this._parameterItems = null;
    this._parameterItemsMap = null;
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
    this._hideMaskMosaicAttachments();
    this._computeFitBoundsAsync();
  }

  _getFitBounds(skel) {
    // Animation-derived body box when present; window.__USE_FIT__ = false forces setup for A/B.
    const useFit = (typeof window === 'undefined') || window.__USE_FIT__ !== false;
    return (useFit && skel.fitBounds) ? skel.fitBounds : skel.bounds;
  }
 
  // ---- async adaptive fit -------------------------------------------------
 
  _idle() {
    // yield between animations; setTimeout fallback for WKWebView (no requestIdleCallback)
    return new Promise((res) => {
      if (typeof requestIdleCallback === 'function') requestIdleCallback(() => res(), { timeout: 100 });
      else setTimeout(res, 0);
    });
  }
 
  _cancelFit() {
    this._fitToken = (this._fitToken || 0) + 1; // bump => any in-flight pass sees a stale token and bails
  }
 
  _revealCanvas() {
    if (this._revealed) return;
    this._revealed = true;
    if (this._canvas) this._canvas.style.opacity = '1';
    console.log('[load] REVEAL', this._loadT0 ? (performance.now() - this._loadT0).toFixed(0) : '?');
  }
 
  _scheduleFitBounds() {
    this._cancelFit();
    this._revealed = false;
    this._fitRevealReady = false;
    if (this._revealTimer) clearTimeout(this._revealTimer);
    // failsafe: never leave the canvas hidden if fit stalls (very heavy model / error).
    // If this fires before fit lands, you may see one setup-framed frame + a small jump;
    // set it above your slowest [fit] time to avoid that (1203 was ~0.9s).
    this._revealTimer = setTimeout(() => { this._fitRevealReady = true; this._revealCanvas(); }, 1200);
    this._computeFitBoundsAsync(this._fitToken); // fire and forget; self-cancels via token
  }
 
  async _computeFitBoundsAsync(token) {
    let primaryDone = false;
    for (const key of Object.keys(this._skeletons)) {
      if (token !== this._fitToken || !this._ctx) return; // superseded or disposed
      const e = this._skeletons[key];
      if (!e) continue;
      const ab = await this._sampleAnimBounds(e, key, token);
      if (token !== this._fitToken || !this._ctx) return;
      if (ab) {
        e._ab = ab;
        const nb = ab.normalUnion;
        if (!ab.weakAnchor && nb && nb.w > 0 && nb.h > 0) {
          e.fitBounds = { offset: { x: nb.offX, y: nb.offY }, size: { x: nb.w, y: nb.h } };
        }
      }
      if (!primaryDone) {
        // First skeleton resolved => framing for '0' is final (fit box or setup fallback).
        // Arm reveal; the render loop draws one final-framed frame, then shows the canvas.
        primaryDone = true;
        this._fitRevealReady = true;
        if (this._paused) { this.render(0, { dpr: window.devicePixelRatio || 1 }); this._revealCanvas(); }
      }
    }
    if (token === this._fitToken && this._ctx) this._dumpGeometry();
  }
 
  // Samples animation extents on a throwaway skeleton (live one is never touched),
  // yielding between animations. Returns null if cancelled.
  async _sampleAnimBounds(entry, key, token, samplesPerSec = 12) {
    const data = entry.skeleton.data;
    const probe = new this._spine.Skeleton(data); // shares SkeletonData, independent pose
 
    if (data.skins.length > 1) {
      const combined = new this._spine.Skin('_fit');
      for (const s of data.skins) combined.addSkin(s);
      probe.setSkin(combined);
    } else {
      probe.setSkin(entry.skeleton.skin || data.defaultSkin);
    }
 
    const off = new this._spine.Vector2();
    const sz  = new this._spine.Vector2();
    const perAnim = [];
 
    for (const anim of data.animations) {
      if (token !== this._fitToken) return null;
      const a = { name: anim.name, minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
      const n = Math.min(48, Math.max(2, Math.ceil((anim.duration || 0) * samplesPerSec))); // cap long anims
      for (let i = 0; i <= n; i++) {
        const t = anim.duration ? (anim.duration * i) / n : 0;
        probe.setToSetupPose();
        anim.apply(probe, 0, t, true, null, 1.0, 0, 0);
        probe.updateWorldTransform(2);
        this._syncHiddenAttachments(probe, key); // mirror MaskMosaic hiding so it doesn't inflate bounds
        probe.getBounds(off, sz, []);
        if (sz.x === -Infinity) continue;
        a.minX = Math.min(a.minX, off.x);       a.minY = Math.min(a.minY, off.y);
        a.maxX = Math.max(a.maxX, off.x + sz.x); a.maxY = Math.max(a.maxY, off.y + sz.y);
      }
      perAnim.push(a);
      await this._idle(); // one animation per slice
    }
    return this._reduceAnimBounds(perAnim);
  }
 
  // Outlier filtering (cheap, synchronous).
  _reduceAnimBounds(perAnim) {
    const toBox = (b) => ({ offX: b.minX, offY: b.minY, w: b.maxX - b.minX, h: b.maxY - b.minY });
 
    const union = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    for (const a of perAnim) {
      if (!isFinite(a.minX)) continue;
      union.minX = Math.min(union.minX, a.minX); union.minY = Math.min(union.minY, a.minY);
      union.maxX = Math.max(union.maxX, a.maxX); union.maxY = Math.max(union.maxY, a.maxY);
    }
 
    // Anchor = per-axis max of the smallest-40%-by-area boxes = upper edge of the normal body.
    // Lower 40% stays clear of the 50% boundary (first effect frame); per-axis max keeps a single
    // thin pose from dragging the anchor down and flipping the whole set to "effect".
    const valid = perAnim.filter(b => isFinite(b.minX));
    const wOf = b => b.maxX - b.minX, hOf = b => b.maxY - b.minY, aOf = b => wOf(b) * hOf(b);
    const sorted = valid.map(aOf).sort((x, y) => x - y);
    const cut = sorted.length ? sorted[Math.floor(sorted.length * 0.4)] : Infinity;
    const base = valid.filter(b => aOf(b) <= cut);
    const aw = base.length ? Math.max(...base.map(wOf)) : 0;
    const ah = base.length ? Math.max(...base.map(hOf)) : 0;
    const K = 2.2; // anchor + 120% headroom; beyond -> effect
    const isEffect = (b) => aw > 0 && (wOf(b) > K * aw || hOf(b) > K * ah);
    const effectAnims = valid.filter(isEffect).map(b => b.name);
    const kept = valid.filter(b => !isEffect(b));
    const normals = kept.length ? kept : valid;
    const nu = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    for (const b of normals) {
      nu.minX = Math.min(nu.minX, b.minX); nu.minY = Math.min(nu.minY, b.minY);
      nu.maxX = Math.max(nu.maxX, b.maxX); nu.maxY = Math.max(nu.maxY, b.maxY);
    }
 
    return {
      union: toBox(union),
      normalUnion: toBox(nu),
      perAnim: perAnim.map(toBox),
      effectAnims,
      anchorBox: { w: aw, h: ah },
      weakAnchor: valid.length > 0 && effectAnims.length > valid.length * 0.6,
    };
  }

  // Project a skeleton-space point to canvas pixels through the current MVP.
  _projectToPixel(x, y) {
    const m = this._mvp.values; // column-major 4x4
    const cx = m[0]*x + m[4]*y + m[12];
    const cy = m[1]*x + m[5]*y + m[13];
    const cw = m[3]*x + m[7]*y + m[15] || 1;
    const ndcX = cx / cw, ndcY = cy / cw;
    return {
      px: (ndcX * 0.5 + 0.5) * this._canvas.width,
      py: (1 - (ndcY * 0.5 + 0.5)) * this._canvas.height,
    };
  }
 
  // calculateSpineMVP fits a box to the full canvas (no margin), so a perfectly-fit
  // box reports fill ~= 1/(1-2*margin) ~= 1.11, not 1.0.
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
    const safeW = W * (1 - 2*margin), safeH = H * (1 - 2*margin);
    const pad = 1;
    return {
      rectPx: { x: minX, y: minY, w: boxW, h: boxH },
      clipped: minX < -pad || minY < -pad || maxX > W + pad || maxY > H + pad,
      fill: +Math.max(boxW / safeW, boxH / safeH).toFixed(3),
      centerErr: +(Math.hypot((minX + maxX) / 2 - W / 2, (minY + maxY) / 2 - H / 2) / Math.hypot(W, H)).toFixed(4),
    };
  }
 
  _dumpGeometry() {
    try {
      const dpr = window.devicePixelRatio || 1;
      this.updateMVP({ dpr }); // mirror the live frame's MVP; fitNormal lands on this
 
      const FILL_LO = 0.85, FILL_HI = 1.25, CENTER_MAX = 0.05; // fill ideal ~1.11
      const force = (typeof window !== 'undefined' && window.__GEO_FORCE__) === true;
      const isPrimary = (s) => s.key === '0' && !/_bg|_fg/i.test(s.name || '');
 
      const skeletons = Object.entries(this._skeletons).map(([key, e]) => {
        const ab = e._ab;
        if (!ab) return null; // fit hasn't landed for this skeleton (shouldn't happen post-async)
        const off = e.bounds?.offset || {}, sz = e.bounds?.size || {};
        return {
          key, name: e.name,
          usingFit: !!e.fitBounds,
          idleBounds: { offX: off.x, offY: off.y, w: sz.x, h: sz.y },
          animBounds: ab.union,
          normalBounds: ab.normalUnion,
          perAnimBounds: ab.perAnim,
          effectAnims: ab.effectAnims,
          fitNormal: this._evalFit(ab.normalUnion),
          diag: { anchorBox: ab.anchorBox, weakAnchor: ab.weakAnchor, effectCount: ab.effectAnims.length },
        };
      }).filter(Boolean);
 
      const flagsFor = (s) => {
        if (!isPrimary(s)) return [];
        if (!s.usingFit) {
          // setup fallback. weakAnchor is expected (effect-heavy char) -> quiet; otherwise nb
          // degenerated unexpectedly -> surface it.
          return s.diag?.weakAnchor ? [] : ['noFit'];
        }
        const r = [], fn = s.fitNormal || {};
        if (fn.clipped) r.push('clip');
        if (fn.fill != null && (fn.fill < FILL_LO || fn.fill > FILL_HI)) r.push('fill=' + fn.fill);
        if (fn.centerErr != null && fn.centerErr > CENTER_MAX) r.push('center=' + fn.centerErr);
        return r;
      };
 
      const reasons = skeletons.flatMap(flagsFor);
      const primary = skeletons.find(isPrimary);
 
      if (reasons.length === 0 && !force) {
        const tag = primary
          ? (primary.usingFit
              ? `fill=${primary.fitNormal.fill} center=${primary.fitNormal.centerErr}`
              : `fallback=${primary.diag.weakAnchor ? 'weakAnchor' : 'noFit'}`)
          : '';
        console.log('[GEO-OK]', this._fileNames?.name, tag);
        return;
      }
 
      console.error('[GEO]', JSON.stringify({
        type: 'spine', ts: Date.now(),
        dir: this._dirName, scene: this._fileNames?.name,
        isExport: this.isExport,
        viewport: { vw: window.innerWidth, vh: window.innerHeight, dpr },
        canvas: { w: this._canvas?.width, h: this._canvas?.height },
        attention: reasons,
        skeletons,
      }));
    } catch (e) { }
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
      if (isWebUrl) {
        const fetched = await invoke('fetch_url_bytes', { url: atlasPath });
        atlasText = new TextDecoder().decode(new Uint8Array(fetched));
      } else {
        const url = convertFileSrc(atlasPath);
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
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
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
    const firstSkel = this._skeletons['0'] || Object.values(this._skeletons)[0];
    if (!firstSkel) return;
    const fitBounds = this._getFitBounds(firstSkel);
    let screenBaseScale = options.screenBaseScale;
    if (!screenBaseScale && !this.isExport) {
      screenBaseScale = Math.max(
        fitBounds.size.x / (window.innerWidth),
        fitBounds.size.y / (window.innerHeight)
      );
    }
    calculateSpineMVP(this._spine, this._mvp, this._canvas.width, this._canvas.height, fitBounds, {
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
  }
}
