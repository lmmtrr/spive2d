import { BaseRenderer } from './BaseRenderer.js';
import { convertFileSrc } from '@tauri-apps/api/core';
import { showNotification } from '../notificationStore.svelte.js';

export class LayeredSpriteRenderer extends BaseRenderer {
  constructor(isExport = false) {
    super(isExport);
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'none';
    this.canvas.style.verticalAlign = 'top';
    this.canvas.style.opacity = '0';
    this.ctx = this.canvas.getContext('2d');
    this.meta = null;
    this.images = {};
    this.metaDir = "";
    this.currentFaceKey = null;
    this.isLoaded = false;
    this.width = typeof window !== 'undefined' ? window.innerWidth : 800;
    this.height = typeof window !== 'undefined' ? window.innerHeight : 600;
  }

  getCanvas() {
    return this.canvas;
  }

  async getTexture(filename, dirName) {
    if (!filename) return null;
    if (this.images[filename]) return this.images[filename];
    const rawUrl = `${dirName}${filename}`;
    const url = rawUrl.startsWith('http') ? rawUrl : convertFileSrc(rawUrl);
    const img = await this.loadImage(url);
    this.images[filename] = img;
    return img;
  }

  async load(dirName, scene) {
    try {
      this.dispose();
      this.canvas.style.display = 'block';
      const rawUrl = `${dirName}${scene.name}${scene.mainExt}`;
      const url = rawUrl.startsWith('http') ? rawUrl : convertFileSrc(rawUrl);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      this.meta = await response.json();
      this.metaDir = dirName;
      if (this.meta.bodySpriteRect && this.meta.bodySpriteRect.texture) {
        await this.getTexture(this.meta.bodySpriteRect.texture, dirName);
      } else if (this.meta.atlas) {
        await this.getTexture(this.meta.atlas, dirName);
      }
      if (this.meta.faces) {
        const keys = Object.keys(this.meta.faces);
        if (keys.includes('normal')) {
          this.currentFaceKey = 'normal';
        } else if (keys.length > 0) {
          this.currentFaceKey = keys[0];
        }
        if (this.currentFaceKey && this.meta.faces[this.currentFaceKey]) {
          const faceMeta = this.meta.faces[this.currentFaceKey];
          const texName = faceMeta.texture || this.meta.atlas;
          if (texName) {
            await this.getTexture(texName, dirName);
          }
        }
      }
      this.isLoaded = true;
      this.resize(this.width, this.height);
      this.render();
      requestAnimationFrame(() => {
        this.canvas.style.opacity = '1';
      });
    } catch (err) {
      showNotification("LayeredSpriteRenderer Error: " + (err.message || err), 'error');
      console.error(err);
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  dispose() {
    this.isLoaded = false;
    this.images = {};
    this.meta = null;
    this.canvas.style.display = 'none';
    this.canvas.style.opacity = '0';
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    if (this.isExport) {
      this.canvas.width = width;
      this.canvas.height = height;
    } else {
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
    }
    this.render();
  }

  applyTransform(scale, moveX, moveY, rotate) {
    super.applyTransform(scale, moveX, moveY, rotate);
    this.render();
  }

  getOriginalSize() {
    if (!this.meta || !this.meta.bodySpriteRect) return { width: 0, height: 0 };
    return {
      width: this.meta.bodySpriteRect.w,
      height: this.meta.bodySpriteRect.h
    };
  }

  getExpressions() {
    if (!this.meta || !this.meta.faces) return null;
    return [
      { name: 'Default', value: '' },
      ...Object.keys(this.meta.faces).map(key => ({
        name: key,
        value: key
      }))
    ];
  }

  async setExpression(value) {
    if (value === '') {
      if (this.meta.faces) {
        const keys = Object.keys(this.meta.faces);
        if (keys.includes('normal')) {
          this.currentFaceKey = 'normal';
        } else if (keys.length > 0) {
          this.currentFaceKey = keys[0];
        }
      }
    } else {
      this.currentFaceKey = value;
    }
    if (this.currentFaceKey && this.meta.faces && this.meta.faces[this.currentFaceKey]) {
      const faceMeta = this.meta.faces[this.currentFaceKey];
      const texName = faceMeta.texture || this.meta.atlas;
      if (texName && !this.images[texName]) {
        try {
          await this.getTexture(texName, this.metaDir);
        } catch (err) {
          console.error("Failed to load expression texture:", err);
        }
      }
    }
    this.render();
  }

  render() {
    if (!this.isLoaded || !this.meta) return;
    const bodySpriteRect = this.meta.bodySpriteRect;
    const bodyTexName = (bodySpriteRect && bodySpriteRect.texture) || this.meta.atlas;
    const bodyImg = this.images[bodyTexName];
    if (!bodyImg) return;
    const dpr = this.isExport ? 1 : (window.devicePixelRatio || 1);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.scale(dpr, dpr);
    this.ctx.translate(this.width * 0.5 + this._moveX, this.height * 0.5 + this._moveY);
    this.ctx.rotate((this._rotate * Math.PI) / 180);
    const bw = bodySpriteRect ? bodySpriteRect.w : bodyImg.naturalWidth;
    const bh = bodySpriteRect ? bodySpriteRect.h : bodyImg.naturalHeight;
    const bx = bodySpriteRect ? bodySpriteRect.x : 0;
    const by = bodySpriteRect ? bodySpriteRect.y : 0;
    const bow = (bodySpriteRect && bodySpriteRect.ow) || bw;
    const boh = (bodySpriteRect && bodySpriteRect.oh) || bh;
    const bwRect = (this.meta.bodyRect && this.meta.bodyRect.sizeDelta.x) || bow;
    const bhRect = (this.meta.bodyRect && this.meta.bodyRect.sizeDelta.y) || boh;
    const scaleFactorX = bow / bwRect;
    const scaleFactorY = boh / bhRect;
    const baseScale = Math.min(
      this.width / bw,
      this.height / bh
    );
    const scale = baseScale * this._scale;
    this.ctx.scale(scale, scale);
    const bodyYCanvas = bodyImg.naturalHeight - (by + bh);
    this.ctx.drawImage(bodyImg, bx, bodyYCanvas, bw, bh, -bw * 0.5, -bh * 0.5, bw, bh);
    if (this.currentFaceKey && this.meta.faces && this.meta.faces[this.currentFaceKey]) {
      const faceMeta = this.meta.faces[this.currentFaceKey];
      const faceTexName = faceMeta.texture || this.meta.atlas;
      const faceImg = this.images[faceTexName];
      if (faceImg) {
        const rect = faceMeta.textureRect;
        const fw = faceMeta.w || rect.w;
        const fh = faceMeta.h || rect.h;
        const fxRect = (this.meta.faceContentRect && this.meta.faceContentRect.anchoredPosition.x) || 0;
        const fyRect = (this.meta.faceContentRect && this.meta.faceContentRect.anchoredPosition.y) || 0;
        const faceCenterX = fxRect * scaleFactorX;
        const faceCenterY = -fyRect * scaleFactorY;
        const tw = rect.w;
        const th = rect.h;
        const faceYCanvas = faceImg.naturalHeight - (rect.y + th);
        const offset = faceMeta.textureRectOffset || { x: 0, y: 0 };
        const dw = tw * scaleFactorX;
        const dh = th * scaleFactorY;
        const dx_orig = faceCenterX - (fw * 0.5 - offset.x) * scaleFactorX;
        const dy_orig = faceCenterY + (fh * 0.5 - offset.y) * scaleFactorY - dh;
        const bodyOffset = (bodySpriteRect && bodySpriteRect.textureRectOffset) || { x: 0, y: 0 };
        const cropCenterX = -bow * 0.5 + bodyOffset.x + bw * 0.5;
        const cropCenterY = boh * 0.5 - (bodyOffset.y + bh) + bh * 0.5;
        const dx = dx_orig - cropCenterX;
        const dy = dy_orig - cropCenterY;
        this.ctx.drawImage(faceImg, rect.x, faceYCanvas, tw, th, dx, dy, dw, dh);
      }
    }
    this.ctx.restore();
  }

  captureFrame(width, height, options = {}) {
    if (!this.isLoaded || !this.meta) return null;
    const bodySpriteRect = this.meta.bodySpriteRect;
    const bodyTexName = (bodySpriteRect && bodySpriteRect.texture) || this.meta.atlas;
    const bodyImg = this.images[bodyTexName];
    if (!bodyImg) return null;
    const capCanvas = document.createElement('canvas');
    capCanvas.width = width;
    capCanvas.height = height;
    const capCtx = capCanvas.getContext('2d');
    capCtx.save();
    const marginX = options.marginX || 0;
    const marginY = options.marginY || 0;
    const bw = bodySpriteRect ? bodySpriteRect.w : bodyImg.naturalWidth;
    const bh = bodySpriteRect ? bodySpriteRect.h : bodyImg.naturalHeight;
    const bx = bodySpriteRect ? bodySpriteRect.x : 0;
    const by = bodySpriteRect ? bodySpriteRect.y : 0;
    const bow = (bodySpriteRect && bodySpriteRect.ow) || bw;
    const boh = (bodySpriteRect && bodySpriteRect.oh) || bh;
    const bwRect = (this.meta.bodyRect && this.meta.bodyRect.sizeDelta.x) || bow;
    const bhRect = (this.meta.bodyRect && this.meta.bodyRect.sizeDelta.y) || boh;
    const scaleFactorX = bow / bwRect;
    const scaleFactorY = boh / bhRect;
    let scale, moveX, moveY, rotate;
    if (options.ignoreTransform) {
      scale = Math.min(
        (width - 2 * marginX) / bw,
        (height - 2 * marginY) / bh
      );
      moveX = 0;
      moveY = 0;
      rotate = 0;
    } else {
      const userScale = this._scale || 1;
      const userMoveX = this._moveX || 0;
      const userMoveY = this._moveY || 0;
      const userRotate = this._rotate || 0;
      const baseScale = Math.min(
        (width - 2 * marginX) / bw,
        (height - 2 * marginY) / bh
      );
      const screenBaseScale = Math.min(window.innerWidth / bw, window.innerHeight / bh);
      const scaleFactor = baseScale / screenBaseScale;
      scale = baseScale * userScale;
      moveX = userMoveX * scaleFactor;
      moveY = userMoveY * scaleFactor;
      rotate = userRotate;
    }
    capCtx.translate(width * 0.5 + moveX, height * 0.5 + moveY);
    capCtx.rotate((rotate * Math.PI) / 180);
    capCtx.scale(scale, scale);
    const bodyYCanvas = bodyImg.naturalHeight - (by + bh);
    capCtx.drawImage(bodyImg, bx, bodyYCanvas, bw, bh, -bw * 0.5, -bh * 0.5, bw, bh);
    if (this.currentFaceKey && this.meta.faces && this.meta.faces[this.currentFaceKey]) {
      const faceMeta = this.meta.faces[this.currentFaceKey];
      const faceTexName = faceMeta.texture || this.meta.atlas;
      const faceImg = this.images[faceTexName];
      if (faceImg) {
        const rect = faceMeta.textureRect;
        const fw = faceMeta.w || rect.w;
        const fh = faceMeta.h || rect.h;
        const fxRect = (this.meta.faceContentRect && this.meta.faceContentRect.anchoredPosition.x) || 0;
        const fyRect = (this.meta.faceContentRect && this.meta.faceContentRect.anchoredPosition.y) || 0;
        const faceCenterX = fxRect * scaleFactorX;
        const faceCenterY = -fyRect * scaleFactorY;
        const tw = rect.w;
        const th = rect.h;
        const faceYCanvas = faceImg.naturalHeight - (rect.y + th);
        const offset = faceMeta.textureRectOffset || { x: 0, y: 0 };
        const dw = tw * scaleFactorX;
        const dh = th * scaleFactorY;
        const dx_orig = faceCenterX - (fw * 0.5 - offset.x) * scaleFactorX;
        const dy_orig = faceCenterY + (fh * 0.5 - offset.y) * scaleFactorY - dh;
        const bodyOffset = (bodySpriteRect && bodySpriteRect.textureRectOffset) || { x: 0, y: 0 };
        const cropCenterX = -bow * 0.5 + bodyOffset.x + bw * 0.5;
        const cropCenterY = boh * 0.5 - (bodyOffset.y + bh) + bh * 0.5;
        const dx = dx_orig - cropCenterX;
        const dy = dy_orig - cropCenterY;
        capCtx.drawImage(faceImg, rect.x, faceYCanvas, tw, th, dx, dy, dw, dh);
      }
    }
    capCtx.restore();
    return capCanvas;
  }
}
