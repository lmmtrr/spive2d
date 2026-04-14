import { Live2DRenderer } from './Live2DRenderer.js';
import { SpineRenderer } from './SpineRenderer.js';

export function createRenderer(scene, isExport = false) {
  const ext = scene.mainExt;
  if (ext.includes('.moc') || ext.includes('.model3.json') || ext.includes('.model.json')) return new Live2DRenderer(isExport);
  return new SpineRenderer(isExport);
}
