import { getSelectorCurrentState } from "../store/selectors";
import {
  populateAnimateSelector,
  populateExpressionSelector,
  resetUI,
} from "../utils";
import { handleLive2DAnimationChange } from "./events.js";
import { convertFileSrc } from "@tauri-apps/api/core";

const live2dCanvas = document.getElementById("live2dCanvas");
let app = new PIXI.Application({
  view: live2dCanvas,
  resizeTo: window,
  preserveDrawingBuffer: true,
  transparent: true,
});
export let currentModel;
const {
  live2d: { Live2DModel },
} = PIXI;

export async function loadLive2DModel(dirName, fileNames) {
  live2dCanvas.style.display = "block";
  let ext = fileNames[1].includes(".moc3") ? ".model3.json" : ".json";
  currentModel = await Live2DModel.from(
    convertFileSrc(`${dirName}${fileNames[0]}${ext}`),
    {
      autoInteract: false,
    },
  );
  const { innerWidth: w, innerHeight: h } = window;
  const _scale = Math.min(
    w / currentModel.internalModel.originalWidth,
    h / currentModel.internalModel.originalHeight,
  );
  currentModel.scale.set(_scale);
  currentModel.anchor.set(0.5, 0.5);
  currentModel.position.set(w * 0.5, h * 0.5);
  app.stage.addChild(currentModel);
  const motions = currentModel.internalModel.motionManager.definitions;
  if (motions) populateAnimateSelector(motions);
  const expressions =
    currentModel.internalModel.motionManager.expressionManager?.definitions;
  if (expressions) populateExpressionSelector(expressions);
  const [motion, index] =
    getSelectorCurrentState("animate").selected.value.split(",");
  handleLive2DAnimationChange(motion, index);
  resetUI();
}

export function disposeLive2D() {
  live2dCanvas.style.display = "none";
  app.stage.removeChildren();
}

export function resizeLive2D(width, height) {
  app.renderer.resize(width, height);
}

export function setLive2DResizeTo(target) {
  app.resizeTo = target;
}

export function renderLive2D() {
  app.render();
}

export function captureFrame(width, height) {
  width = Math.round(width);
  height = Math.round(height);
  const originalScale = currentModel.scale.clone();
  const originalPosition = currentModel.position.clone();
  const scale = Math.min(
    width / currentModel.internalModel.originalWidth,
    height / currentModel.internalModel.originalHeight,
  );
  currentModel.scale.set(scale);
  currentModel.position.set(width * 0.5, height * 0.5);
  const renderTexture = PIXI.RenderTexture.create({ width, height });
  app.renderer.render(currentModel, { renderTexture });
  const canvas = app.renderer.extract.canvas(renderTexture);
  currentModel.scale.copyFrom(originalScale);
  currentModel.position.copyFrom(originalPosition);
  renderTexture.destroy(true);
  return canvas;
}
