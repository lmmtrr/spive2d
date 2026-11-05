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
