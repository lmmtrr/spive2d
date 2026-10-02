import { detectStraightAlphaImage } from './SpineCommon.js';

self.onmessage = async (e) => {
  const { id, url, probeAlpha } = e.data;
  let premultiply = !!e.data.premultiply;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    let straightAlpha;
    let bitmap = null;
    if (probeAlpha) {
      const probe = await createImageBitmap(blob, { premultiplyAlpha: 'none' });
      straightAlpha = detectStraightAlphaImage(probe);
      if (straightAlpha !== null) premultiply = straightAlpha;
      if (premultiply) probe.close();
      else bitmap = probe;
    }
    if (!bitmap) {
      bitmap = await createImageBitmap(blob, { premultiplyAlpha: premultiply ? 'premultiply' : 'none' });
    }
    self.postMessage({ id, bitmap, premultiplied: premultiply, straightAlpha }, [bitmap]);
  } catch (err) {
    self.postMessage({ id, error: String(err?.message || err) });
  }
};
