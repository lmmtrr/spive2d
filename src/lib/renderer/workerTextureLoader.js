import TextureDecoderWorker from './textureDecoder.worker.js?worker';

let worker = null;
let workerFailed = false;
let nextId = 0;
const pending = new Map();

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
  try {
    return await decodeInWorker(src, premultiply, probeAlpha);
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
