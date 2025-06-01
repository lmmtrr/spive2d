import {
  isFirstRender,
  moveX,
  moveY,
  moveStep,
  premultipliedAlpha,
  removeAttachments,
  restoreAnimation,
  restoreSkins,
  rotate,
  saveSkins,
  scale,
  setFirstRenderFlag,
} from "./events.js";
import { createAnimationSelector, resetUI } from "./ui.js";
import { spines } from "./main.js";
const { convertFileSrc } = window.__TAURI__.core;

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
      data[position - 1]
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
  spine = spines[spineVersion];
  spineCanvas.width = window.innerWidth;
  spineCanvas.height = window.innerHeight;
  ctx = new spine.ManagedWebGLRenderingContext(spineCanvas);
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
    assetManager.loadTextureAtlas(`${_dirName}${baseName}${fileNames[i].split('.')[0]}${atlasExt}`);
  }
  requestAnimationFrame(load);
}

function load() {
  if (assetManager.isLoadingComplete()) {
    const baseName = _fileNames[0];
    skeletons["0"] = loadSkeleton(baseName);
    for (let i = 3; i < _fileNames.length; i++) {
      const FileName2 = `${baseName}${_fileNames[i].split('.')[0]}`;
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
  return { offset: offset, size: size };
}

function loadSkeleton(fileName) {
  const skelExt = _fileNames[1];
  const atlasExt = _fileNames[2];
  const atlas = assetManager.get(`${_dirName}${fileName}${atlasExt}`);
  const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
  const skeletonLoader =
    skelExt === ".skel"
      ? new spine.SkeletonBinary(atlasLoader)
      : new spine.SkeletonJson(atlasLoader);
  const skeletonData = skeletonLoader.readSkeletonData(
    assetManager.get(`${_dirName}${fileName}${skelExt}`)
  );
  const skeleton = new spine.Skeleton(skeletonData);
  const bounds = calculateSetupPoseBounds(skeleton);
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
  if (isFirstRender) {
    const animationName = document.getElementById("animationSelector").value;
    const skinFlags = saveSkins();
    resetUI();
    createAnimationSelector(skeletons["0"].skeleton.data.animations);
    restoreAnimation(animationName);
    restoreSkins(skinFlags);
    removeAttachments();
    setFirstRenderFlag(false);
  }
  requestId = requestAnimationFrame(render);
}

export function resize() {
  const bounds = skeletons["0"].bounds;
  const centerX = bounds.offset.x + bounds.size.x * 0.5;
  const centerY = bounds.offset.y + bounds.size.y * 0.5;
  const scaleX = bounds.size.x / spineCanvas.width;
  const scaleY = bounds.size.y / spineCanvas.height;
  let scale_ = Math.max(scaleX, scaleY);
  scale_ /= scale;
  const width = spineCanvas.width * scale_;
  const height = spineCanvas.height * scale_;
  mvp.ortho2d(centerX - width * 0.5, centerY - height * 0.5, width, height);
  const c = Math.cos(Math.PI * rotate);
  const s = Math.sin(Math.PI * rotate);
  const rotateMatrix = new spine.Matrix4();
  rotateMatrix.set([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  mvp.multiply(rotateMatrix);
  mvp.translate(moveX * moveStep, -moveY * moveStep, 0);
  ctx.gl.viewport(0, 0, spineCanvas.width, spineCanvas.height);
}

export function disposeSpine() {
  spineCanvas.style.display = "none";
  if (requestId) window.cancelAnimationFrame(requestId);
  requestId = undefined;
  if (assetManager) assetManager.dispose();
  animationStates = [];
  skeletons = {};
}
