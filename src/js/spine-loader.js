import {
  handleFilterInput,
  premultipliedAlpha,
  removeAttachments,
  restoreAnimation,
  restoreSkins,
  saveSkins,
} from "./events.js";
import { resetUI, populateAnimateSelector } from "../utils";
import { convertFileSrc } from "@tauri-apps/api/core";
import { getSpine, isFirstRender, setFirstRenderFlag } from "../store";
import { getSelectorCurrentState } from "../store/selectors";
import { getModelState } from "../model-transform";

export let spine;
let ctx;
let shader;
let batcher;
let skeletonRenderer;
let assetManager;
let mvp;
let lastFrameTime;
let requestId;
let _dirName;
let _fileNames;
export let animationStates = [];
export let skeletons = {};
const spineCanvas = document.getElementById("spineCanvas");

async function getSpineVersion(dirName, fileNames) {
  let spineVersion = "";
  const ext = fileNames[1];
  const file = await fetch(convertFileSrc(`${dirName}${fileNames[0]}${ext}`));
  if (ext.includes(".skel")) {
    const buffer = await file.arrayBuffer();
    const data = new Uint8Array(buffer);
    let position = -1;
    for (let i = 1; i < data.length - 1; i++) {
      const prev = data[i - 1];
      const current = data[i];
      const next = data[i + 1];
      if (
        current === 46 &&
        prev >= 48 &&
        prev <= 57 &&
        next >= 48 &&
        next <= 57
      ) {
        position = i;
        break;
      }
    }
    if (position === -1)
      throw new Error("Valid version pattern not found in .skel file");
    spineVersion = `${String.fromCharCode(
      data[position - 1],
    )}.${String.fromCharCode(data[position + 1])}`;
  } else if (ext.includes(".json")) {
    const content = await file.text();
    const jsonData = JSON.parse(content);
    if (!jsonData.skeleton || !jsonData.skeleton.spine) {
      throw new Error("Invalid JSON structure");
    }
    spineVersion = jsonData.skeleton.spine.substring(0, 3);
  }
  return spineVersion;
}

export async function loadSpineModel(dirName, fileNames) {
  spineCanvas.style.display = "block";
  _dirName = dirName;
  _fileNames = fileNames;
  const spineVersion = await getSpineVersion(dirName, fileNames);
  spine = getSpine(spineVersion);
  spineCanvas.width = window.innerWidth;
  spineCanvas.height = window.innerHeight;
  ctx = new spine.ManagedWebGLRenderingContext(spineCanvas, {
    preserveDrawingBuffer: true,
  });
  ctx.gl.pixelStorei(ctx.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultipliedAlpha);
  shader = spine.Shader.newTwoColoredTextured(ctx);
  batcher = new spine.PolygonBatcher(ctx);
  skeletonRenderer = new spine.SkeletonRenderer(ctx);
  assetManager = new spine.AssetManager(ctx.gl);
  mvp = new spine.Matrix4();
  const baseName = _fileNames[0];
  const skelExt = _fileNames[1];
  const atlasExt = _fileNames[2];
  skelExt.includes(".skel")
    ? assetManager.loadBinary(`${_dirName}${baseName}${skelExt}`)
    : assetManager.loadText(`${_dirName}${baseName}${skelExt}`);
  assetManager.loadTextureAtlas(`${_dirName}${baseName}${atlasExt}`);
  for (let i = 3; i < _fileNames.length; i++) {
    skelExt.includes(".skel")
      ? assetManager.loadBinary(`${_dirName}${baseName}${fileNames[i]}`)
      : assetManager.loadText(`${_dirName}${baseName}${fileNames[i]}`);
    assetManager.loadTextureAtlas(
      `${_dirName}${baseName}${fileNames[i].split(".")[0]}${atlasExt}`,
    );
  }
  requestAnimationFrame(load);
}

function load() {
  if (assetManager.isLoadingComplete()) {
    const baseName = _fileNames[0];
    skeletons["0"] = loadSkeleton(baseName);
    for (let i = 3; i < _fileNames.length; i++) {
      const FileName2 = `${baseName}${_fileNames[i].split(".")[0]}`;
      skeletons[String(i - 2)] = loadSkeleton(FileName2);
    }
    lastFrameTime = Date.now() / 1000;
    requestAnimationFrame(render);
  } else requestAnimationFrame(load);
}

function calculateSetupPoseBounds(skeleton) {
  skeleton.setToSetupPose();
  skeleton.updateWorldTransform(2);
  const offset = new spine.Vector2();
  const size = new spine.Vector2();
  skeleton.getBounds(offset, size, []);
  if (size.x === -Infinity || size.y === -Infinity) {
    size.x = 2048;
    size.y = 2048;
    offset.x = -1024;
    offset.y = -1024;
  }
  return { offset: offset, size: size };
}

function loadSkeleton(fileName) {
  const skelExt = _fileNames[1];
  const atlasExt = _fileNames[2];
  const atlas = assetManager.get(`${_dirName}${fileName}${atlasExt}`);
  const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
  const skeletonLoader = skelExt.includes(".skel")
    ? new spine.SkeletonBinary(atlasLoader)
    : new spine.SkeletonJson(atlasLoader);
  const skeletonData = skeletonLoader.readSkeletonData(
    assetManager.get(`${_dirName}${fileName}${skelExt}`),
  );
  const skeleton = new spine.Skeleton(skeletonData);

  if (
    skeleton.data.skins[0].name === "default" &&
    skeleton.data.skins.length > 1
  )
    skeleton.setSkinByName(skeleton.data.skins[1].name);
  else skeleton.setSkinByName(skeleton.data.skins[0].name);

  if (!skeleton.data.defaultSkin)
    skeleton.data.defaultSkin = new spine.Skin("default");

  const bounds = calculateSetupPoseBounds(skeleton);
  if (skeleton.data.width === 0 || skeleton.data.height === 0) {
    skeleton.data.width = bounds.size.x;
    skeleton.data.height = bounds.size.y;
  }
  skeleton.setToSetupPose();
  skeleton.updateWorldTransform(2);
  const animationStateData = new spine.AnimationStateData(skeleton.data);
  const animationState = new spine.AnimationState(animationStateData);
  animationStates.push(animationState);
  const animations = skeleton.data.animations;
  animationState.setAnimation(0, animations[0].name, true);
  return {
    skeleton: skeleton,
    state: animationState,
    bounds: bounds,
  };
}

function render() {
  const gl = ctx.gl;
  const now = Date.now() / 1000;
  const delta = now - lastFrameTime;
  lastFrameTime = now;
  resize();
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (const fileName of Object.keys(skeletons).reverse()) {
    const skeleton = skeletons[fileName].skeleton;
    const state = skeletons[fileName].state;
    state.update(delta);
    state.apply(skeleton);
    skeleton.updateWorldTransform(2);
    shader.bind();
    shader.setUniformi(spine.Shader.SAMPLER, 0);
    shader.setUniform4x4f(spine.Shader.MVP_MATRIX, mvp.values);
    batcher.begin(shader);
    skeletonRenderer.vertexEffect = null;
    skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
    skeletonRenderer.draw(batcher, skeleton);
    batcher.end();
    shader.unbind();
  }
  if (isFirstRender()) {
    const skinFlags = saveSkins();
    resetUI();
    populateAnimateSelector(skeletons["0"].skeleton.data.animations);
    const animationName = getSelectorCurrentState("animate").selected.value;
    restoreAnimation(animationName);
    restoreSkins(skinFlags);
    removeAttachments();
    setFirstRenderFlag(false);
    handleFilterInput();
  }
  requestId = requestAnimationFrame(render);
}

export function resize() {
  const bounds = skeletons["0"].bounds;
  const centerX = bounds.offset.x + bounds.size.x * 0.5;
  const centerY = bounds.offset.y + bounds.size.y * 0.5;
  const scaleX = bounds.size.x / spineCanvas.width;
  const scaleY = bounds.size.y / spineCanvas.height;
  const modelState = getModelState();

  let _scale = Math.max(scaleX, scaleY);
  _scale /= modelState.scale;
  const width = spineCanvas.width * _scale;
  const height = spineCanvas.height * _scale;
  mvp.ortho2d(
    centerX - width * 0.5 - modelState.movement.x * _scale,
    centerY - height * 0.5 + modelState.movement.y * _scale,
    width,
    height,
  );
  const c = Math.cos(Math.PI * modelState.rotate);
  const s = Math.sin(Math.PI * modelState.rotate);
  const rotateMatrix = new spine.Matrix4();
  rotateMatrix.set([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  mvp.multiply(rotateMatrix);
  ctx.gl.viewport(0, 0, spineCanvas.width, spineCanvas.height);
}

export async function reloadSpine() {
  if (_dirName && _fileNames) {
    disposeSpine();
    await loadSpineModel(_dirName, _fileNames);
  }
}

export function disposeSpine() {
  spineCanvas.style.display = "none";
  if (requestId) window.cancelAnimationFrame(requestId);
  requestId = undefined;
  if (assetManager) assetManager.dispose();
  animationStates = [];
  skeletons = {};
}

export function captureFrame(width, height) {
  width = Math.round(width);
  height = Math.round(height);
  const gl = ctx.gl;
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    console.error("Framebuffer incomplete");
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return null;
  }
  const oldViewport = gl.getParameter(gl.VIEWPORT);
  gl.viewport(0, 0, width, height);
  const originalMvpValues = new Float32Array(mvp.values);
  const bounds = skeletons["0"].bounds;
  const centerX = bounds.offset.x + bounds.size.x * 0.5;
  const centerY = bounds.offset.y + bounds.size.y * 0.5;
  const scaleX = bounds.size.x / width;
  const scaleY = bounds.size.y / height;
  let _scale = Math.max(scaleX, scaleY);
  _scale /= scale;
  const targetWidth = width * _scale;
  const targetHeight = height * _scale;
  mvp.ortho2d(
    centerX - targetWidth * 0.5 - moveX * _scale,
    centerY - targetHeight * 0.5 + moveY * _scale,
    targetWidth,
    targetHeight,
  );
  const c = Math.cos(Math.PI * rotate);
  const s = Math.sin(Math.PI * rotate);
  const rotateMatrix = new spine.Matrix4();
  rotateMatrix.set([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  mvp.multiply(rotateMatrix);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  shader.bind();
  shader.setUniformi(spine.Shader.SAMPLER, 0);
  shader.setUniform4x4f(spine.Shader.MVP_MATRIX, mvp.values);
  batcher.begin(shader);
  for (const fileName of Object.keys(skeletons).reverse()) {
    const skeleton = skeletons[fileName].skeleton;
    skeletonRenderer.vertexEffect = null;
    skeletonRenderer.premultipliedAlpha = premultipliedAlpha;
    skeletonRenderer.draw(batcher, skeleton);
  }
  batcher.end();
  shader.unbind();
  const pixels = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.deleteFramebuffer(framebuffer);
  gl.deleteTexture(texture);
  gl.viewport(oldViewport[0], oldViewport[1], oldViewport[2], oldViewport[3]);
  mvp.set(originalMvpValues);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx2d = canvas.getContext("2d");
  const imgData = ctx2d.createImageData(width, height);
  const rowBytes = width * 4;
  for (let y = 0; y < height; y++) {
    const srcRowStart = y * rowBytes;
    const dstRowStart = (height - 1 - y) * rowBytes;
    imgData.data.set(
      pixels.subarray(srcRowStart, srcRowStart + rowBytes),
      dstRowStart,
    );
  }
  ctx2d.putImageData(imgData, 0, 0);
  return canvas;
}
