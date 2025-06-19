import { animationSelector, handleLive2DAnimationChange, setScaleAdjustment } from "./events.js";
import { createAnimationSelector, resetUI } from "./ui.js";
const { convertFileSrc } = window.__TAURI__.core;

const live2dCanvas = document.getElementById("live2dCanvas");
let app = new PIXI.Application({
  view: live2dCanvas,
  resizeTo: window,
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
  const scale = Math.min(
    window.innerWidth / currentModel.internalModel.originalWidth,
    window.innerHeight / currentModel.internalModel.originalHeight
  );
  currentModel.scale.set(scale);
  currentModel.anchor.set(0.5, 0.5);
  currentModel.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5);
  app.stage.addChild(currentModel);
  const motions = currentModel.internalModel.motionManager.definitions;
  if (motions) createAnimationSelector(motions);
  const [motion, index] = animationSelector.value.split(",");
  handleLive2DAnimationChange(motion, index);
  setScaleAdjustment(scale);
  resetUI();
}

export function disposeLive2D() {
  live2dCanvas.style.display = "none";
  app.stage.removeChildren();
}
