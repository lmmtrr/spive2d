let canvas = null;
let ctx = null;

self.onmessage = async (e) => {
  const { bitmap, id, frameIndex } = e.data;
  if (!bitmap) return;
  if (!canvas || canvas.width !== bitmap.width || canvas.height !== bitmap.height) {
    canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    ctx = canvas.getContext('2d');
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  try {
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    const buffer = await blob.arrayBuffer();
    self.postMessage({ type: 'FRAME_PNG_DONE', id, frameIndex, buffer }, [buffer]);
  } catch (err) {
    self.postMessage({ type: 'ERROR', id, frameIndex, error: err.message });
  }
};
