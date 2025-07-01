import { animationSelector, handleLive2DAnimationChange, setScale } from "./events.js";
import { createAnimationSelector, createExpressionSelector, resetUI } from "./ui.js";
const { convertFileSrc } = window.__TAURI__.core;

const live2dCanvas = document.getElementById("live2dCanvas");
let app = new PIXI.Application({
  view: live2dCanvas,
  resizeTo: window,
  preserveDrawingBuffer: true,
  transparent: true,
  backgroundAlpha: 0,
});
export let currentModel;
const {
  live2d: { Live2DModel },
} = PIXI;

export async function loadLive2DModel(dirName, fileNames) {
  live2dCanvas.style.display = "block";
  let ext = fileNames[1].includes(".moc3") ? ".model3.json" : ".json";
  currentModel = await Live2DModel.from(convertFileSrc(`${dirName}${fileNames[0]}${ext}`), {
    autoInteract: false,
  });
  const { innerWidth: w, innerHeight: h } = window;
  const scale = Math.min(
    w / currentModel.internalModel.originalWidth,
    h / currentModel.internalModel.originalHeight
  );
  setScale(scale);
  currentModel.scale.set(scale);
  currentModel.anchor.set(0.5, 0.5);
  currentModel.position.set(w * 0.5, h * 0.5);
  app.stage.addChild(currentModel);
  const motions = currentModel.internalModel.motionManager.definitions;
  if (motions) createAnimationSelector(motions);
  const expressions = currentModel.internalModel.motionManager.expressionManager?.definitions;
  if (expressions) createExpressionSelector(expressions);
  const [motion, index] = animationSelector.value.split(",");
  handleLive2DAnimationChange(motion, index);
  resetUI();
}

export function disposeLive2D() {
  live2dCanvas.style.display = "none";
  app.stage.removeChildren();
}
