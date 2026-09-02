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

export const MASK_UNIFORM = {
  SAMPLER: 'u_mask',
  CHANNEL: 'u_maskChannel',
  PARAMS: 'u_maskParams',
  RECT: 'u_maskRect'
};

export function createMaskShader(spine, ctx) {
  const S = spine.Shader;
  const vs = `
attribute vec4 ${S.POSITION};
attribute vec4 ${S.COLOR};
attribute vec4 ${S.COLOR2};
attribute vec2 ${S.TEXCOORDS};
uniform mat4 ${S.MVP_MATRIX};
uniform vec4 ${MASK_UNIFORM.RECT};
varying vec4 v_light;
varying vec4 v_dark;
varying vec2 v_texCoords;
varying vec2 v_maskCoords;

void main () {
	v_light = ${S.COLOR};
	v_dark = ${S.COLOR2};
	v_texCoords = ${S.TEXCOORDS};
	v_maskCoords = vec2(
		(${S.POSITION}.x - ${MASK_UNIFORM.RECT}.x) * ${MASK_UNIFORM.RECT}.z,
		1.0 - (${S.POSITION}.y - ${MASK_UNIFORM.RECT}.y) * ${MASK_UNIFORM.RECT}.w);
	gl_Position = ${S.MVP_MATRIX} * ${S.POSITION};
}
`;
  const fs = `
#ifdef GL_ES
	#define LOWP lowp
	precision mediump float;
#else
	#define LOWP
#endif
varying LOWP vec4 v_light;
varying LOWP vec4 v_dark;
varying vec2 v_texCoords;
varying vec2 v_maskCoords;
uniform sampler2D ${S.SAMPLER};
uniform sampler2D ${MASK_UNIFORM.SAMPLER};
uniform vec4 ${MASK_UNIFORM.CHANNEL};
uniform vec4 ${MASK_UNIFORM.PARAMS};

void main () {
	vec4 texColor = texture2D(${S.SAMPLER}, v_texCoords);
	gl_FragColor.a = texColor.a * v_light.a;
	gl_FragColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;
	if (${MASK_UNIFORM.PARAMS}.x > 0.5) {
		bool designSpace = ${MASK_UNIFORM.PARAMS}.x < 1.5;
		vec2 maskCoords = designSpace ? v_maskCoords : v_texCoords;
		float coverage = dot(texture2D(${MASK_UNIFORM.SAMPLER}, maskCoords), ${MASK_UNIFORM.CHANNEL});
		if (designSpace) {
			coverage *= step(0.0, maskCoords.x) * step(maskCoords.x, 1.0)
				* step(0.0, maskCoords.y) * step(maskCoords.y, 1.0);
		}
		gl_FragColor.a *= coverage;
		gl_FragColor.rgb *= mix(1.0, coverage, ${MASK_UNIFORM.PARAMS}.y);
	}
}
`;
  try {
    return new S(ctx, vs, fs);
  } catch (e) {
    console.warn('[SpineCommon] mask shader unavailable, falling back to the stock shader:', e);
    return null;
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

export function toSpineAssetUrl(url) {
  if (typeof url !== 'string' || /^(https?:|data:|blob:)/i.test(url)) return url;
  const convert = globalThis.__TAURI__?.core?.convertFileSrc;
  return typeof convert === 'function' ? convert(url) : url;
}

export function setupSpineAssetManager(assetManager, spine, gl, onFallback) {
  const target = assetManager.downloader || assetManager;
  const originalDownloadText = target.downloadText.bind(target);
  target.downloadText = (url, success, error) => {
    const isAtlas = typeof url === 'string' && /\.(atlas|txt)$/.test(url.split(/[?#]/)[0]);
    return originalDownloadText(toSpineAssetUrl(url), (text) => {
      if (typeof text === 'string' && isAtlas) {
        text = normalizeAtlasText(text);
      }
      success?.(text);
    }, error);
  };
  if (typeof target.downloadBinary === 'function') {
    const originalDownloadBinary = target.downloadBinary.bind(target);
    target.downloadBinary = (url, success, error) => originalDownloadBinary(toSpineAssetUrl(url), success, error);
  }
  const getAssetsCache = () => assetManager.cache?.assets || assetManager.assets;
  const originalLoadTexture = assetManager.loadTexture.bind(assetManager);
  assetManager.loadTexture = (url, success, error) => {
    const requestUrl = toSpineAssetUrl(url);
    const mirrorOntoPlainPath = (key) => {
      const assets = getAssetsCache();
      if (requestUrl === url || !assets) return;
      const cached = assets[key];
      if (cached !== undefined) assets[url] = cached;
    };
    originalLoadTexture(requestUrl, (path, asset) => {
      mirrorOntoPlainPath(path);
      success?.(path, asset);
    }, (path, msg) => {
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
      const assets = getAssetsCache();
      if (assets) assets[path] = texture;
      mirrorOntoPlainPath(path);
      if (assetManager.errors) delete assetManager.errors[path];
      success?.(path, texture);
    });
  };
}

export function getInitialSkinName(skins) {
  if (!skins || skins.length === 0) return 'default';
  const appearanceSkins = skins.filter(s => s.name !== 'default' && !s.name.startsWith('mask_'));
  if (appearanceSkins.length > 0) {
    return appearanceSkins[0].name;
  } else {
    return 'default';
  }
}

export function setToSetupPose(skeleton) {
  if (!skeleton) return;
  if (typeof skeleton.setToSetupPose === 'function') {
    skeleton.setToSetupPose();
  } else if (typeof skeleton.setupPose === 'function') {
    skeleton.setupPose();
  }
}

export function getSlotAttachment(slot) {
  if (!slot) return null;
  return slot.appliedPose?.attachment ?? slot.pose?.attachment ?? slot.attachment ?? null;
}

export function setSlotAttachment(slot, attachment) {
  if (!slot) return;
  if (slot.pose?.setAttachment) {
    slot.pose.setAttachment(attachment);
  } else if (slot.pose) {
    slot.pose.attachment = attachment;
  }
  if (slot.appliedPose?.setAttachment) {
    slot.appliedPose.setAttachment(attachment);
  } else if (slot.appliedPose) {
    slot.appliedPose.attachment = attachment;
  }
  slot.attachment = attachment;
}

export function getTargetProperty(target, prop) {
  if (!target) return undefined;
  if (target.pose && target.pose[prop] !== undefined) return target.pose[prop];
  return target[prop];
}

export function setTargetProperty(target, prop, value) {
  if (!target) return;
  if (target.pose && target.pose[prop] !== undefined) {
    target.pose[prop] = value;
  }
  if (target.appliedPose && target.appliedPose[prop] !== undefined) {
    target.appliedPose[prop] = value;
  }
  target[prop] = value;
}

export function initializeSkeleton(spine, atlas, skeletonDataOrText, isFileJson) {
  const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
  const originalNewRegionAttachment = atlasLoader.newRegionAttachment;
  atlasLoader.newRegionAttachment = function (...args) {
    const isV43 = args.length >= 5;
    const path = isV43 ? args[3] : args[2];
    const sequence = isV43 ? args[4] : args[3];
    const isSequence = sequence && (typeof sequence.pathSuffix === 'boolean' ? sequence.pathSuffix : true);
    if (!isSequence && !atlas.findRegion(path)) {
      return null;
    }
    return originalNewRegionAttachment.apply(atlasLoader, args);
  };
  const originalNewMeshAttachment = atlasLoader.newMeshAttachment;
  atlasLoader.newMeshAttachment = function (...args) {
    const isV43 = args.length >= 5;
    const path = isV43 ? args[3] : args[2];
    const sequence = isV43 ? args[4] : args[3];
    const isSequence = sequence && (typeof sequence.pathSuffix === 'boolean' ? sequence.pathSuffix : true);
    if (!isSequence && !atlas.findRegion(path)) {
      return null;
    }
    return originalNewMeshAttachment.apply(atlasLoader, args);
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
  const initialSkinName = getInitialSkinName(skeleton.data.skins);
  const newSkin = new spine.Skin('_');
  const initialSkin = skeleton.data.findSkin(initialSkinName);
  if (initialSkin) newSkin.addSkin(initialSkin);
  skeleton.setSkin(newSkin);
  if (!skeleton.data.defaultSkin)
    skeleton.data.defaultSkin = new spine.Skin('default');
  setToSetupPose(skeleton);
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
    const cos = Math.cos(Math.PI * userRotate / 180);
    const sin = Math.sin(Math.PI * userRotate / 180);
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
