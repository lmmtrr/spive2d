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
let _fileName;
let _ext;
export let animationState;
export let skeletons = {};
const spineCanvas = document.getElementById("spineCanvas");

async function getSpineVersion(fileName, ext) {
  let spineVersion = "";
  const file = await fetch(convertFileSrc(fileName));
  if (ext === ".skel") {
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
  } else if (ext === ".json") {
    const content = await file.text();
    const jsonData = JSON.parse(content);
    if (!jsonData.skeleton || !jsonData.skeleton.spine) {
      throw new Error("Invalid JSON structure");
    }
    spineVersion = jsonData.skeleton.spine.substring(0, 3);
  }
  return spineVersion;
}

export async function loadSpineModel(fileName, ext) {
  spineCanvas.style.display = "block";
  _fileName = fileName;
  _ext = ext;
  const spineVersion = await getSpineVersion(`${_fileName}${_ext}`, _ext);
  spine = spines[spineVersion];
  spineCanvas.width = window.innerWidth;
  spineCanvas.height = window.innerHeight;
  ctx = new spine.ManagedWebGLRenderingContext(spineCanvas);
  shader = spine.Shader.newTwoColoredTextured(ctx);
  batcher = new spine.PolygonBatcher(ctx);
  skeletonRenderer = new spine.SkeletonRenderer(ctx);
  assetManager = new spine.AssetManager(ctx.gl);
  mvp = new spine.Matrix4();
  _ext === ".skel"
    ? assetManager.loadBinary(`${_fileName}${_ext}`)
    : assetManager.loadText(`${_fileName}${_ext}`);
  assetManager.loadTextureAtlas(`${_fileName}.atlas`);
  requestAnimationFrame(load);
}

function load() {
  if (assetManager.isLoadingComplete()) {
    skeletons["0"] = loadSkeleton();
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

function loadSkeleton() {
  const atlas = assetManager.get(`${_fileName}.atlas`);
  const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
  const skeletonLoader =
    _ext === ".skel"
      ? new spine.SkeletonBinary(atlasLoader)
      : new spine.SkeletonJson(atlasLoader);
  const skeletonData = skeletonLoader.readSkeletonData(
    assetManager.get(`${_fileName}${_ext}`)
  );
  const skeleton = new spine.Skeleton(skeletonData);
  const bounds = calculateSetupPoseBounds(skeleton);
  const animationStateData = new spine.AnimationStateData(skeleton.data);
  animationState = new spine.AnimationState(animationStateData);
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
  const skeleton = skeletons["0"].skeleton;
  const state = skeletons["0"].state;
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
  if (isFirstRender) {
    const animationName = document.getElementById("animationSelector").value;
    const skinFlags = saveSkins();
    resetUI();
    createAnimationSelector(skeleton.data.animations);
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
  skeletons = {};
}
