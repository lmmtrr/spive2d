import { Live2DRenderer } from './Live2DRenderer.js';
import { SpineRenderer } from './SpineRenderer.js';

export function createRenderer(fileNames, isExport = false) {
  const ext = fileNames[1];
  if (ext.includes('.moc') || ext.includes('.model3.json') || ext.includes('.model.json')) return new Live2DRenderer(isExport);
  return new SpineRenderer(isExport);
}
