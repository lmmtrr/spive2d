import TextureDecoderWorker from './textureDecoder.worker.js?worker';

let worker = null;
let workerFailed = false;
let nextId = 0;
const pending = new Map();
const prefetched = new Map();
const PROBE_TIMEOUT_MS = 500;
let workerSupport = null;

function getWorker() {
  if (worker || workerFailed) return worker;
  if (typeof Worker === 'undefined' || typeof createImageBitmap !== 'function') {
    workerFailed = true;
    return null;
  }
  try {
    worker = new TextureDecoderWorker();
  } catch (e) {
    console.warn('[workerTextureLoader] texture worker unavailable:', e);
    workerFailed = true;
    return null;
  }
  worker.onmessage = (e) => {
    const { id, bitmap, premultiplied, straightAlpha, error } = e.data;
    const entry = pending.get(id);
    if (!entry) return;
    pending.delete(id);
    if (error || !bitmap) {
      entry.reject(new Error(error || 'decode failed'));
      return;
    }
    bitmap.__spive2dPremultiplied = premultiplied;
    if (straightAlpha !== undefined) bitmap.__spive2dStraightAlpha = straightAlpha;
    entry.resolve(bitmap);
  };
  worker.onerror = (e) => {
    console.warn('[workerTextureLoader] texture worker crashed:', e);
    for (const entry of pending.values()) entry.reject(new Error('texture worker crashed'));
    pending.clear();
    worker?.terminate();
    worker = null;
  };
  return worker;
}

function decodeInWorker(url, premultiply, probeAlpha) {
  const w = getWorker();
  if (!w) return Promise.reject(new Error('texture worker unavailable'));
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    w.postMessage({ id, url: new URL(url, location.href).href, premultiply, probeAlpha });
  });
}

function createProbeImage() {
  const canvas = document.createElement('canvas');
  canvas.width = 2;
  canvas.height = 2;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, 2, 2);
  return { canvas, url: canvas.toDataURL('image/png') };
}

function readTexturePixel(source) {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const gl = canvas.getContext('webgl');
  if (!gl) return null;
  try {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.bindFramebuffer(gl.FRAMEBUFFER, gl.createFramebuffer());
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;
    const pixel = new Uint8Array(4);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    return pixel;
  } finally {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}

function isProbeColor(pixel) {
  return !!pixel && pixel[0] > 200 && pixel[1] < 55 && pixel[2] < 55 && pixel[3] > 200;
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

async function probeWorkerTextures() {
  if (!getWorker()) return false;
  const { canvas, url } = createProbeImage();
  if (!isProbeColor(readTexturePixel(canvas))) return true;
  const bitmap = await withTimeout(decodeInWorker(url, false, false), PROBE_TIMEOUT_MS);
  try {
    return isProbeColor(readTexturePixel(bitmap));
  } finally {
    bitmap.close();
  }
}

function disableWorker() {
  workerFailed = true;
  worker?.terminate();
  worker = null;
  for (const entry of pending.values()) entry.reject(new Error('texture worker disabled'));
  pending.clear();
}

export function ensureWorkerTextureSupport() {
  if (workerSupport) return workerSupport;
  workerSupport = probeWorkerTextures().catch(() => false).then((ok) => {
    if (!ok) {
      console.warn('[workerTextureLoader] worker-decoded textures are unusable; decoding on main thread');
      disableWorker();
    }
    return ok;
  });
  return workerSupport;
}

export async function configurePixiTextureDecode(pixi) {
  if (await ensureWorkerTextureSupport()) return;
  const config = pixi?.loadTextures?.config;
  if (config) config.preferWorkers = false;
}

async function decodeIfSupported(url, premultiply, probeAlpha) {
  if (!await ensureWorkerTextureSupport()) throw new Error('texture worker unavailable');
  return decodeInWorker(url, premultiply, probeAlpha);
}

function prefetchKey(url, premultiply) {
  try {
    return `${premultiply ? 1 : 0}|${new URL(url, location.href).href}`;
  } catch (e) {
    return null;
  }
}

function takePrefetched(url, premultiply) {
  const key = prefetchKey(url, premultiply);
  const entry = key && prefetched.get(key);
  if (!entry) return null;
  prefetched.delete(key);
  return entry;
}

export function prefetchTextures(urls, premultiply) {
  clearTexturePrefetch();
  if (!getWorker()) return;
  for (const url of urls) {
    const key = prefetchKey(url, premultiply);
    if (key && !prefetched.has(key)) {
      prefetched.set(key, decodeIfSupported(url, premultiply, false).catch(() => null));
    }
  }
}

export function clearTexturePrefetch() {
  for (const entry of prefetched.values()) entry.then(bitmap => bitmap?.close());
  prefetched.clear();
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Couldn't load image: ${src}`));
    image.src = src;
  });
}

async function loadImage(src, premultiply, probeAlpha) {
  const entry = probeAlpha ? null : takePrefetched(src, premultiply);
  const bitmap = entry && await entry;
  if (bitmap) return bitmap;
  try {
    return await decodeIfSupported(src, premultiply, probeAlpha);
  } catch (e) {
    return loadImageElement(src);
  }
}

function resolveSource(assetManager, path) {
  return assetManager.downloader?.rawDataUris?.[path] || assetManager.rawDataUris?.[path] || path;
}

function createTexture(assetManager, path, image) {
  if (typeof assetManager.createTexture !== 'function') return assetManager.textureLoader(image);
  if (assetManager.createTexture.length >= 3) {
    return assetManager.createTexture(path, assetManager.texturePmaInfo?.[path], image);
  }
  return assetManager.createTexture(path, image);
}

export function installWorkerTextureLoader(assetManager, options = {}) {
  if (!assetManager || !getWorker()) return;
  const premultiply = !!options.premultiply;
  const probeAlpha = !!options.probeAlpha;
  const am = assetManager;
  const load = (path) => loadImage(resolveSource(am, path), premultiply, probeAlpha);
  if (typeof am.start === 'function' && typeof am.success === 'function') {
    am.loadTexture = (path, success = null, error = null) => {
      path = am.start(path);
      const fail = () => {
        const msg = `Couldn't load image: ${path}`;
        am.error(error, path, msg);
        return msg;
      };
      if (!am.cache?.assetsLoaded) {
        load(path).then(
          (image) => am.success(success, path, createTexture(am, path, image)),
          fail
        );
        return;
      }
      if (typeof am.reuseAssets === 'function' && am.reuseAssets(path, success, error)) return;
      am.cache.assetsLoaded[path] = new Promise((resolve, reject) => {
        load(path).then((image) => {
          const texture = createTexture(am, path, image);
          am.success(success, path, texture);
          resolve(texture);
        }, () => reject(fail()));
      });
    };
    return;
  }
  am.loadTexture = (path, success = null, error = null) => {
    path = am.pathPrefix + path;
    am.toLoad++;
    load(path).then((image) => {
      am.assets[path] = am.textureLoader(image);
      am.toLoad--;
      am.loaded++;
      if (success) success(path, image);
    }, () => {
      const msg = `Couldn't load image ${path}`;
      am.errors[path] = msg;
      am.toLoad--;
      am.loaded++;
      if (error) error(path, msg);
    });
  };
}
