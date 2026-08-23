import { createCanvas } from './SpineCommon.js';

export const MASK_MODE_OFF = 0;
export const MASK_MODE_DESIGN = 1;
export const MASK_MODE_PAGE = 2;

const MASK_INFIXES = ['-mask', '_mask', '.mask', '-alpha', '_alpha', '.alpha'];
const IMAGE_EXTS = ['.png', '.webp'];
const MAX_VARIANT_PROBES = 32;
const ASPECT_TOLERANCE = 0.05;

export function stripExtension(name) {
  const i = name.lastIndexOf('.');
  return i > 0 ? name.substring(0, i) : name;
}

function aspectMatches(a, b) {
  if (!(a > 0) || !(b > 0)) return false;
  return Math.abs(a - b) <= ASPECT_TOLERANCE * Math.max(a, b);
}

function baseCandidates(assetNames) {
  const out = [];
  for (const asset of new Set(assetNames)) {
    for (const infix of MASK_INFIXES) {
      for (const ext of IMAGE_EXTS) out.push({ url: `${asset}${infix}${ext}`, infix, asset, ext });
    }
  }
  return out;
}

function makeExistenceFilter(listing) {
  if (!listing) return () => true;
  return (name) => listing.has(name.toLowerCase());
}

async function probeInPriorityOrder(candidates, loadImage, exists) {
  const viable = candidates.filter((candidate) => exists(candidate.url));
  const results = await Promise.all(viable.map((candidate) => loadImage(candidate.url)));
  for (let i = 0; i < viable.length; i++) {
    if (results[i]) return { ...viable[i], image: results[i] };
  }
  return null;
}

export function collectVariantSuffixes(skeletonData) {
  const suffixes = new Set();
  const add = (name) => {
    if (typeof name !== 'string') return;
    const i = name.lastIndexOf('_');
    if (i <= 0 || i === name.length - 1) return;
    suffixes.add(name.substring(i + 1));
  };
  const addFromSkin = (skin) => {
    if (!skin) return;
    if (typeof skin.getAttachments === 'function') {
      for (const entry of skin.getAttachments()) add(entry?.name);
      return;
    }
    const attachments = skin.attachments;
    if (Array.isArray(attachments)) {
      attachments.forEach((slotAttachments) => {
        if (!slotAttachments) return;
        for (const name in slotAttachments) add(name);
      });
    } else if (attachments) {
      for (const slotIndex in attachments) {
        for (const name in attachments[slotIndex]) add(name);
      }
    }
  };
  skeletonData?.skins?.forEach(addFromSkin);
  skeletonData?.animations?.forEach((anim) => add(anim?.name));
  return Array.from(suffixes).slice(0, MAX_VARIANT_PROBES);
}

function detectChannel(image, width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0, width, height);
  let data;
  try {
    data = ctx.getImageData(0, 0, width, height).data;
  } catch (e) {
    return [1, 0, 0, 0];
  }
  const step = Math.max(1, Math.floor(Math.min(width, height) / 64));
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] !== 255) return [0, 0, 0, 1];
    }
  }
  return [1, 0, 0, 0];
}

function uploadMaskTexture(spine, gl, image, alphaMode) {
  const texture = new spine.GLTexture(gl, image);
  texture.bind();
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, alphaMode === 'unpack');
  return texture;
}

export async function loadMaskTextures(opts) {
  const { assetNames, loadImage, pageSize, designSize, variantSuffixes = [], listing = null } = opts;
  const exists = makeExistenceFilter(listing);
  const found = await probeInPriorityOrder(baseCandidates(assetNames), loadImage, exists);
  if (!found) return null;
  const { image } = found;
  const width = image.width;
  const height = image.height;
  const maskAspect = width / height;
  const pageAspect = pageSize?.width > 0 ? pageSize.width / pageSize.height : 0;
  const designAspect = designSize?.width > 0 ? designSize.width / designSize.height : 0;
  const exactPage = width === pageSize?.width && height === pageSize?.height;
  const exactDesign = width === designSize?.width && height === designSize?.height;
  let mode = MASK_MODE_OFF;
  if (exactPage) mode = MASK_MODE_PAGE;
  else if (exactDesign) mode = MASK_MODE_DESIGN;
  else if (aspectMatches(maskAspect, pageAspect) && !aspectMatches(maskAspect, designAspect)) mode = MASK_MODE_PAGE;
  else if (aspectMatches(maskAspect, designAspect)) mode = MASK_MODE_DESIGN;
  else if (aspectMatches(maskAspect, pageAspect)) mode = MASK_MODE_PAGE;
  if (mode === MASK_MODE_OFF) {
    console.warn(`[SpineMask] ignoring ${found.url}: ${width}x${height} matches neither the atlas page nor the design rect`);
    return null;
  }
  const channel = detectChannel(image, width, height);
  const variants = new Map();
  if (mode === MASK_MODE_DESIGN && variantSuffixes.length > 0) {
    const wanted = variantSuffixes
      .map((suffix) => ({ suffix, url: `${found.asset}${found.infix}_${suffix}${found.ext}` }))
      .filter((variant) => exists(variant.url));
    const images = await Promise.all(wanted.map((variant) => loadImage(variant.url)));
    images.forEach((variantImage, i) => {
      if (variantImage) variants.set(wanted[i].suffix, { image: variantImage, url: wanted[i].url });
    });
  }
  return { mode, channel, base: { image, url: found.url }, variants };
}

export function uploadMaskImages(spine, gl, mask, alphaMode) {
  mask.base.texture = uploadMaskTexture(spine, gl, mask.base.image, alphaMode);
  mask.base.image = null;
  mask.variants.forEach((variant) => {
    variant.texture = uploadMaskTexture(spine, gl, variant.image, alphaMode);
    variant.image = null;
  });
  return mask;
}

export function selectMaskTexture(mask, skeleton, state) {
  if (!mask) return null;
  if (mask.variants.size === 0) return mask.base.texture;
  for (const slot of skeleton.slots) {
    const name = slot.attachment?.name;
    if (!name) continue;
    const i = name.lastIndexOf('_');
    if (i <= 0) continue;
    const variant = mask.variants.get(name.substring(i + 1));
    if (variant) return variant.texture;
  }
  for (const track of state?.tracks || []) {
    const name = track?.animation?.name;
    if (!name) continue;
    const i = name.lastIndexOf('_');
    if (i <= 0) continue;
    const variant = mask.variants.get(name.substring(i + 1));
    if (variant) return variant.texture;
  }
  return mask.base.texture;
}

export function disposeMask(mask) {
  if (!mask) return;
  mask.base?.texture?.dispose?.();
  mask.variants?.forEach((variant) => variant.texture?.dispose?.());
}
