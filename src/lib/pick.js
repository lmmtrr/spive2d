const EPSILON = 1e-12;

export function barycentric(px, py, ax, ay, bx, by, cx, cy) {
  const d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
  if (Math.abs(d) < EPSILON) return null;
  const u = ((by - cy) * (px - cx) + (cx - bx) * (py - cy)) / d;
  const v = ((cy - ay) * (px - cx) + (ax - cx) * (py - cy)) / d;
  const w = 1 - u - v;
  if (u < 0 || v < 0 || w < 0) return null;
  return [u, v, w];
}

export function meshContainsPoint(vertices, indices, x, y) {
  if (!vertices || !indices) return false;
  for (let i = 0; i + 2 < indices.length; i += 3) {
    const a = indices[i] * 2;
    const b = indices[i + 1] * 2;
    const c = indices[i + 2] * 2;
    if (barycentric(x, y, vertices[a], vertices[a + 1], vertices[b], vertices[b + 1], vertices[c], vertices[c + 1])) {
      return true;
    }
  }
  return false;
}

export function toTriangles(vertices, indices, map) {
  const vertexCount = vertices.length >> 1;
  const mapped = new Float32Array(vertexCount * 2);
  const point = [0, 0];
  for (let v = 0; v < vertexCount; v++) {
    map(vertices[v * 2], vertices[v * 2 + 1], point);
    mapped[v * 2] = point[0];
    mapped[v * 2 + 1] = point[1];
  }
  const out = new Float32Array(Math.floor(indices.length / 3) * 6);
  let o = 0;
  for (let i = 0; i + 2 < indices.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const v = indices[i + k] * 2;
      out[o++] = mapped[v];
      out[o++] = mapped[v + 1];
    }
  }
  return out;
}

export const PICK_ALPHA_THRESHOLD = 16;
const ALPHA_MAP_SIZE = 1024;
const alphaMaps = new WeakMap();

export function alphaMapOf(source) {
  if (!source || typeof source !== 'object') return null;
  if (alphaMaps.has(source)) return alphaMaps.get(source);
  let map = null;
  try {
    const resource = source.resource;
    const width = source.pixelWidth || source.width || resource?.width;
    const height = source.pixelHeight || source.height || resource?.height;
    if (resource && width > 0 && height > 0) {
      const scale = Math.min(1, ALPHA_MAP_SIZE / Math.max(width, height));
      const w = Math.max(1, Math.round(width * scale));
      const h = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(resource, 0, 0, w, h);
      const rgba = ctx.getImageData(0, 0, w, h).data;
      const alpha = new Uint8Array(w * h);
      for (let i = 0; i < alpha.length; i++) alpha[i] = rgba[i * 4 + 3];
      map = { width: w, height: h, alpha };
    }
  } catch (e) {
    console.warn('[pick] alpha map', e);
    map = null;
  }
  alphaMaps.set(source, map);
  return map;
}

export function sampleAlpha(map, u, v) {
  const x = Math.min(map.width - 1, Math.max(0, Math.floor(u * map.width)));
  const y = Math.min(map.height - 1, Math.max(0, Math.floor(v * map.height)));
  return map.alpha[y * map.width + x];
}

export function meshAlphaAt(vertices, indices, uvs, map, flipV, x, y) {
  if (!vertices || !indices) return -1;
  let best = -1;
  for (let i = 0; i + 2 < indices.length; i += 3) {
    const a = indices[i] * 2;
    const b = indices[i + 1] * 2;
    const c = indices[i + 2] * 2;
    const weights = barycentric(x, y, vertices[a], vertices[a + 1], vertices[b], vertices[b + 1], vertices[c], vertices[c + 1]);
    if (!weights) continue;
    if (!map || !uvs) return 255;
    const u = weights[0] * uvs[a] + weights[1] * uvs[b] + weights[2] * uvs[c];
    const v = weights[0] * uvs[a + 1] + weights[1] * uvs[b + 1] + weights[2] * uvs[c + 1];
    const alpha = sampleAlpha(map, u, flipV ? 1 - v : v);
    if (alpha > best) best = alpha;
  }
  return best;
}

export function toTriangleUvs(uvs, indices, flipV) {
  if (!uvs || !indices) return null;
  const out = new Float32Array(Math.floor(indices.length / 3) * 6);
  let o = 0;
  for (let i = 0; i + 2 < indices.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const v = indices[i + k] * 2;
      out[o++] = uvs[v];
      out[o++] = flipV ? 1 - uvs[v + 1] : uvs[v + 1];
    }
  }
  return out;
}

function fillTriangles(target, chunk, width, height, offsetX, offsetY, clip, inverted, bounds) {
  const t = chunk.triangles;
  const uvs = chunk.map ? chunk.uvs : null;
  const map = uvs ? chunk.map : null;
  for (let i = 0; i + 5 < t.length; i += 6) {
    const ax = t[i] + offsetX, ay = t[i + 1] + offsetY;
    const bx = t[i + 2] + offsetX, by = t[i + 3] + offsetY;
    const cx = t[i + 4] + offsetX, cy = t[i + 5] + offsetY;
    const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    if (!(Math.abs(area) > 1e-9)) continue;
    const minX = Math.max(0, Math.floor(Math.min(ax, bx, cx)));
    const maxX = Math.min(width - 1, Math.ceil(Math.max(ax, bx, cx)));
    const minY = Math.max(0, Math.floor(Math.min(ay, by, cy)));
    const maxY = Math.min(height - 1, Math.ceil(Math.max(ay, by, cy)));
    if (minX > maxX || minY > maxY) continue;
    for (let y = minY; y <= maxY; y++) {
      const py = y + 0.5;
      const row = y * width;
      for (let x = minX; x <= maxX; x++) {
        const index = row + x;
        if (target[index]) continue;
        const px = x + 0.5;
        const wa = ((bx - px) * (cy - py) - (by - py) * (cx - px)) / area;
        if (wa < 0) continue;
        const wb = ((cx - px) * (ay - py) - (cy - py) * (ax - px)) / area;
        if (wb < 0) continue;
        const wc = 1 - wa - wb;
        if (wc < 0) continue;
        if (clip && (clip[index] !== 0) === inverted) continue;
        if (map) {
          const u = wa * uvs[i] + wb * uvs[i + 2] + wc * uvs[i + 4];
          const v = wa * uvs[i + 1] + wb * uvs[i + 3] + wc * uvs[i + 5];
          if (sampleAlpha(map, u, v) <= PICK_ALPHA_THRESHOLD) continue;
        }
        target[index] = 1;
        if (bounds) {
          if (x < bounds.minX) bounds.minX = x;
          if (x > bounds.maxX) bounds.maxX = x;
          if (y < bounds.minY) bounds.minY = y;
          if (y > bounds.maxY) bounds.maxY = y;
        }
      }
    }
  }
}

export function rasterizeTextured(chunks, width, height, offsetX, offsetY) {
  const coverage = new Uint8Array(width * height);
  const bounds = { minX: width, minY: height, maxX: -1, maxY: -1 };
  let clip = null;
  let clipKey = null;
  for (const chunk of chunks) {
    let useClip = null;
    if (chunk.clips?.length) {
      clip ??= new Uint8Array(width * height);
      if (chunk.clipKey !== clipKey) {
        clip.fill(0);
        for (const mask of chunk.clips) fillTriangles(clip, mask, width, height, offsetX, offsetY, null, false, null);
        clipKey = chunk.clipKey;
      }
      useClip = clip;
    }
    fillTriangles(coverage, chunk, width, height, offsetX, offsetY, useClip, !!chunk.inverted, bounds);
  }
  return { coverage, bounds };
}
