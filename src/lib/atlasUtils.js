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
  if (!atlas || !atlas.regions) return;
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
