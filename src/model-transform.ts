import { currentModel } from "./js/live2d-loader";
import { isInitialized, isModelType } from "./store";

const scaleMax = 8;
const scaleMin = 0.5;

const movement = { x: 0, y: 0 };
let scale = 1;
let rotate = 0;

export const getScale = () => scale;
export const setScale = (s: number) =>
  (scale = Math.min(scaleMax, Math.max(scaleMin, s)));

export const getRotate = () => rotate;
export const setRotate = (r: number) => (rotate = r);

export const getMovement = () => movement;
export const setMovement = (x: number, y: number) => {
  movement.x = x;
  movement.y = y;
};
export const increaseMovement = (dx: number, dy: number) => {
  movement.x += dx;
  movement.y += dy;
};

export function getModelState() {
  return {
    movement,
    scale,
    rotate,
  };
}

export function setModelState(
  _scale: number,
  _moveX: number,
  _moveY: number,
  _rotate: number,
) {
  scale = _scale;
  movement.x = _moveX;
  movement.y = _moveY;
  rotate = _rotate;
}

export function resetModelState(
  width = window.innerWidth,
  height = window.innerHeight,
) {
  scale = 1;
  movement.x = 0;
  movement.y = 0;
  rotate = 0;
  if (!isInitialized()) return;
  if (isModelType("live2d")) {
    let _scale = Math.min(
      width / currentModel.internalModel.originalWidth,
      height / currentModel.internalModel.originalHeight,
    );
    _scale *= scale;
    currentModel.scale.set(_scale);
    currentModel.position.set(width * 0.5, height * 0.5);
    currentModel.rotation = 0;
  }
}
