export function getLive2DFrameBox(internalModel) {
  if (!internalModel) return null;
  const canvasBox = { x: 0, y: 0, width: internalModel.originalWidth, height: internalModel.originalHeight };
  const core = internalModel.coreModel;
  core?.update?.();
  const count = core?.getDrawableCount?.() ?? internalModel?.getDrawableIDs?.()?.length ?? 0;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let drawn = 0, insideCanvas = 0;
  for (let i = 0; i < count; i++) {
    if (core?.getDrawableDynamicFlagIsVisible?.(i) === false) continue;
    if (core?.getDrawableOpacity?.(i) === 0) continue;
    const vertices = internalModel?.getDrawableVertices?.(i);
    if (!vertices || typeof vertices.length !== 'number') continue;
    let pMinX = Infinity, pMinY = Infinity, pMaxX = -Infinity, pMaxY = -Infinity;
    for (let j = 0; j < vertices.length; j += 2) {
      const x = vertices[j], y = vertices[j + 1];
      if (!isFinite(x) || !isFinite(y)) continue;
      if (x < pMinX) pMinX = x;
      if (x > pMaxX) pMaxX = x;
      if (y < pMinY) pMinY = y;
      if (y > pMaxY) pMaxY = y;
    }
    if (pMinX === Infinity) continue;
    drawn++;
    const centreX = (pMinX + pMaxX) * 0.5;
    const centreY = (pMinY + pMaxY) * 0.5;
    if (centreX >= 0 && centreX <= canvasBox.width && centreY >= 0 && centreY <= canvasBox.height) {
      insideCanvas++;
    }
    if (pMinX < minX) minX = pMinX;
    if (pMaxX > maxX) maxX = pMaxX;
    if (pMinY < minY) minY = pMinY;
    if (pMaxY > maxY) maxY = pMaxY;
  }
  if (!(maxX > minX) || !(maxY > minY)) return null;
  const CANVAS_IS_THE_FRAME = 0.75;
  if (drawn > 0 && insideCanvas / drawn >= CANVAS_IS_THE_FRAME) return canvasBox;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function fitLive2DBox(internalModel, box, viewWidth, viewHeight, marginX = 0, marginY = 0) {
  if (!internalModel || !box) return { baseScale: 1, dx: 0, dy: 0 };
  const usableWidth = Math.max(1, viewWidth - 2 * marginX);
  const usableHeight = Math.max(1, viewHeight - 2 * marginY);
  return {
    baseScale: Math.min(usableWidth / box.width, usableHeight / box.height),
    dx: (box.x + box.width * 0.5) - internalModel.originalWidth * 0.5,
    dy: (box.y + box.height * 0.5) - internalModel.originalHeight * 0.5,
  };
}
