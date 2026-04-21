export function normalizeAtlasText(text) {
  if (typeof text !== 'string') return text;
  const lines = text.split(/\r?\n/).map(line => line.trim());
  const cleaned = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.length === 0) continue;
    if (cleaned.length > 0 && line.match(/\.(png|jpg|jpeg|webp)$/i)) {
      cleaned.push('');
    }
    cleaned.push(line);
  }
  return cleaned.join('\n');
}

export function parseAtlasDeclaredSizes(atlasText) {
  const sizes = new Map();
  const lines = atlasText.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.match(/\.(png|jpg|jpeg|webp)$/i)) continue;
    const pageName = line;
    for (let j = i + 1; j < lines.length; j++) {
      const entry = lines[j].trim();
      if (!entry || (!entry.includes(':') && entry.match(/\.(png|jpg|jpeg|webp)$/i))) break;
      const sizeMatch = entry.match(/^size\s*:\s*(\d+)\s*,\s*(\d+)/);
      if (sizeMatch) {
        sizes.set(pageName, { width: parseInt(sizeMatch[1]), height: parseInt(sizeMatch[2]) });
        break;
      }
    }
  }
  return sizes;
}

export function setupAtlas(atlas) {
  if (!atlas || !atlas.regions || atlas.__spive2d_setup) return;
  atlas.__spive2d_setup = true;
  atlas.regions.forEach((region) => {
    if (region.name) region.name = region.name.trim();
  });
  const originalFindRegion = atlas.findRegion;
  atlas.findRegion = function (name) {
    let region = originalFindRegion.call(this, name);
    if (!region && name) {
      region = originalFindRegion.call(this, name.trim());
    }
    return region;
  };
}

export function updateAtlasRegions(atlas, resizedPages) {
  if (!atlas.regions) return;
  for (const region of atlas.regions) {
    if (!resizedPages.has(region.page)) continue;
    const pw = region.page.width;
    const ph = region.page.height;
    region.u = region.x / pw;
    region.v = region.y / ph;
    const isRotated = region.degrees === 90 || region.rotate === true;
    if (isRotated) {
      region.u2 = (region.x + region.height) / pw;
      region.v2 = (region.y + region.width) / ph;
    } else {
      region.u2 = (region.x + region.width) / pw;
      region.v2 = (region.y + region.height) / ph;
    }
  }
}

export function createCanvas(width, height) {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height);
  throw new Error('No canvas implementation available');
}

export function setupSpineAssetManager(assetManager, spine, gl, onFallback) {
  const target = assetManager.downloader || assetManager;
  const originalDownloadText = target.downloadText.bind(target);
  target.downloadText = (url, success, error) => {
    return originalDownloadText(url, (text) => {
      if (typeof text === 'string' && url.split(/[?#]/)[0].match(/\.(atlas|txt)$/)) {
        text = normalizeAtlasText(text);
      }
      success?.(text);
    }, error);
  };
  const originalLoadTexture = assetManager.loadTexture.bind(assetManager);
  assetManager.loadTexture = (url, success, error) => {
    originalLoadTexture(url, success, (path, msg) => {
      onFallback?.(path, msg);
      const canvas = (typeof OffscreenCanvas !== 'undefined')
        ? new OffscreenCanvas(1, 1)
        : document.createElement('canvas');
      if (!('OffscreenCanvas' in globalThis)) {
        canvas.width = 1;
        canvas.height = 1;
      }
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#cccccc';
      ctx.fillRect(0, 0, 1, 1);
      const texture = new spine.GLTexture(gl, canvas);
      assetManager.assets[path] = texture;
      if (assetManager.errors) delete assetManager.errors[path];
      success?.(path, texture);
    });
  };
}

export function initializeSkeleton(spine, atlas, skeletonDataOrText, isFileJson) {
  const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
  const originalNewRegionAttachment = atlasLoader.newRegionAttachment;
  atlasLoader.newRegionAttachment = function (skin, name, path) {
    if (!atlas.findRegion(path)) {
      console.warn(`[Spine] Skipping missing region attachment: ${path}`);
      return null;
    }
    return originalNewRegionAttachment.call(atlasLoader, skin, name, path);
  };
  const originalNewMeshAttachment = atlasLoader.newMeshAttachment;
  atlasLoader.newMeshAttachment = function (skin, name, path) {
    if (!atlas.findRegion(path)) {
      console.warn(`[Spine] Skipping missing mesh attachment: ${path}`);
      return null;
    }
    return originalNewMeshAttachment.call(atlasLoader, skin, name, path);
  };
  const skeletonLoader = !isFileJson
    ? new spine.SkeletonBinary(atlasLoader)
    : new spine.SkeletonJson(atlasLoader);
  let data = skeletonDataOrText;
  if (typeof data === 'string' && isFileJson) {
    data = data.replace(/,(\s*[}\]])/g, '$1');
  }
  const skeletonData = skeletonLoader.readSkeletonData(data);
  const skeleton = new spine.Skeleton(skeletonData);
  let initialSkinName;
  if (skeleton.data.skins.length > 0) {
    const appearanceSkins = skeleton.data.skins.filter(s => s.name !== 'default' && !s.name.startsWith('mask_'));
    if (appearanceSkins.length > 0) {
      initialSkinName = appearanceSkins[0].name;
    } else {
      initialSkinName = 'default';
    }
  }
  const newSkin = new spine.Skin('_');
  const initialSkin = skeleton.data.findSkin(initialSkinName);
  if (initialSkin) newSkin.addSkin(initialSkin);
  skeleton.setSkin(newSkin);
  if (!skeleton.data.defaultSkin)
    skeleton.data.defaultSkin = new spine.Skin('default');
  skeleton.setToSetupPose();
  skeleton.updateWorldTransform(2);
  const animationStateData = new spine.AnimationStateData(skeleton.data);
  const animationState = new spine.AnimationState(animationStateData);
  return { skeleton, state: animationState, initialSkinNames: [initialSkinName] };
}

export function calculateSpineMVP(spine, mvp, canvasWidth, canvasHeight, bounds, transform, options = {}) {
  const { scale: userScale = 1, x: userMoveX = 0, y: userMoveY = 0, rotation: userRotate = 0 } = transform;
  const { marginX = 0, marginY = 0, dpr = 1, contentWidth, contentHeight, screenBaseScale } = options;
  const logicalWidth = canvasWidth / dpr;
  const logicalHeight = canvasHeight / dpr;
  const centerX = bounds.offset.x + bounds.size.x * 0.5;
  const centerY = bounds.offset.y + bounds.size.y * 0.5;
  const usedWidth = (contentWidth && contentHeight) ? (contentWidth / dpr) : (logicalWidth - 2 * marginX / dpr);
  const usedHeight = (contentWidth && contentHeight) ? (contentHeight / dpr) : (logicalHeight - 2 * marginY / dpr);
  const baseScale = Math.max(
    bounds.size.x / usedWidth,
    bounds.size.y / usedHeight
  );
  let scale = baseScale / userScale;
  const width = logicalWidth * scale;
  const height = logicalHeight * scale;
  const scaleFactor = screenBaseScale ? (screenBaseScale / baseScale) : 1;
  const viewCenterX = centerX - userMoveX * scale * scaleFactor;
  const viewCenterY = centerY + userMoveY * scale * scaleFactor;
  mvp.ortho2d(
    viewCenterX - width * 0.5,
    viewCenterY - height * 0.5,
    width,
    height
  );
  if (userRotate !== 0) {
    const cos = Math.cos(Math.PI * userRotate);
    const sin = Math.sin(Math.PI * userRotate);
    const t1 = new spine.Matrix4();
    t1.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, centerX, centerY, 0, 1]);
    const rot = new spine.Matrix4();
    rot.set([cos, -sin, 0, 0, sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    const t2 = new spine.Matrix4();
    t2.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -centerX, -centerY, 0, 1]);
    mvp.multiply(t1);
    mvp.multiply(rot);
    mvp.multiply(t2);
  }
}
