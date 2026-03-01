let rendererInstance = null;

export function getRenderer() {
  return rendererInstance;
}

export function setRenderer(renderer) {
  rendererInstance = renderer;
}
