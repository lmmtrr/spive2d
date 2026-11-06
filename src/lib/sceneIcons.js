import { getRendererType } from './renderer/createRenderer.js';

const ICON_PATHS = {
  spine: 'M8 14a3 3 0 0 1-3 3 3 3 0 0 1-3-3c0-.77.29-1.47.76-2A2.99 2.99 0 0 1 2 10a3 3 0 0 1 3-3 3 3 0 0 1 3 3c1.33.08 2.67.17 4 .17s2.67-.09 4-.17a3 3 0 0 1 3-3 3 3 0 0 1 3 3c0 .77-.29 1.47-.76 2 .47.53.76 1.23.76 2a3 3 0 0 1-3 3 3 3 0 0 1-3-3c-1.33-.08-2.67-.17-4-.17s-2.67.09-4 .17z',
  live2d: 'M5 7.6 19 2v6.7L5 15.2zM6.8 16.4l7-3.3 5.2 2.3V22z',
  layered: 'M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27-7.38 5.74zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z',
};

export function sceneIconPath(scene) {
  if (!scene?.mainExt) return undefined;
  return ICON_PATHS[getRendererType(scene)];
}
