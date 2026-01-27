import { isInitialized, isModelType, isProcessing } from "./store";
import { setGlobalSetting, getGlobalSetting } from "./store/settings";
import { currentModel } from "./js/live2d-loader.js";
import {
  getMovement,
  getRotate,
  getScale,
  increaseMovement,
  setRotate,
  setScale,
} from "./model-transform";

const live2dCanvas = document.getElementById(
  "live2dCanvas",
)! as HTMLCanvasElement;
const spineCanvas = document.getElementById(
  "spineCanvas",
)! as HTMLCanvasElement;

const rotateStep = 0.001;

const rootStyles = getComputedStyle(document.documentElement);
const sidebarWidth = Number(
  rootStyles.getPropertyValue("--sidebar-width").replace("px", ""),
);
let mouseDown = false;
let isMouseMove = false;
const moveStartPosition = { x: 0, y: 0 };

export function handleResize() {
  const { innerWidth: w, innerHeight: h } = window;
  live2dCanvas.width = w;
  live2dCanvas.height = h;
  live2dCanvas.style.width = `${w}px`;
  live2dCanvas.style.height = `${h}px`;
  spineCanvas.width = w;
  spineCanvas.height = h;
  spineCanvas.style.width = `${w}px`;
  spineCanvas.style.height = `${h}px`;
  setGlobalSetting("windowWidth", w);
  setGlobalSetting("windowHeight", h);
  setGlobalSetting("aspectRatio", h / w);

  if (!isInitialized()) return;
  if (isModelType("live2d")) {
    const movement = getMovement();
    currentModel.position.set(w * 0.5 + movement.x, h * 0.5 + movement.y);
  }
}

function updateCursorStyle(e: MouseEvent) {
  document.body.style.cursor = "default";
  if (e.clientX >= live2dCanvas.width - sidebarWidth)
    document.body.style.cursor = `url("/cursors/rotate_right.svg"), auto`;
}

export function handleMouseUp() {
  mouseDown = false;
  isMouseMove = false;
}

export function handleMouseOut() {
  handleMouseUp();
}

export function handleMouseDown(e: MouseEvent) {
  if (getGlobalSetting("settingDialogOpen")) return;
  if (!isInitialized()) return;
  if (isProcessing()) return;
  if (e.button === 2) return;

  moveStartPosition.x = e.clientX;
  moveStartPosition.y = e.clientY;
  mouseDown = true;
  isMouseMove =
    e.clientX < live2dCanvas.width - sidebarWidth && e.clientX > sidebarWidth;
}

export function handleMouseMove(e: MouseEvent) {
  if (isInitialized()) updateCursorStyle(e);
  if (!mouseDown) return;
  if (isMouseMove) {
    increaseMovement(
      e.clientX - moveStartPosition.x,
      e.clientY - moveStartPosition.y,
    );
    if (isModelType("live2d")) {
      const { innerWidth: w, innerHeight: h } = window;
      const movement = getMovement();
      currentModel.position.set(w * 0.5 + movement.x, h * 0.5 + movement.y);
    }
  } else if (e.clientX >= live2dCanvas.width - sidebarWidth) {
    const rotate =
      getRotate() +
      (e.clientY - moveStartPosition.y) *
        rotateStep *
        (e.clientX >= live2dCanvas.width - sidebarWidth ? 1 : -1);
    setRotate(rotate);

    if (isModelType("live2d")) currentModel.rotation = rotate;
  }
  moveStartPosition.x = e.clientX;
  moveStartPosition.y = e.clientY;
}

export function handleWheel(e: WheelEvent) {
  if (!isInitialized()) return;
  if (e.clientX < sidebarWidth) return;

  const baseScaleStep = 0.1;
  const scaleFactor = 0.1;
  const scaleStep = baseScaleStep + Math.abs(getScale() - 1) * scaleFactor;
  setScale(getScale() - Math.sign(e.deltaY) * scaleStep);

  if (isModelType("live2d")) {
    const { innerWidth: w, innerHeight: h } = window;
    let _scale = Math.min(
      w / currentModel.internalModel.originalWidth,
      h / currentModel.internalModel.originalHeight,
    );
    _scale *= getScale();
    currentModel.scale.set(_scale);
  }
}
