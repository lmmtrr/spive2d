export function getSortableKey(str, padLength = 16) {
  const s = String(str || '');
  return s.replace(/\d+/g, (match) => match.padStart(padLength, '0'));
}

export function formatFrames(seconds, duration, fps) {
  const currentFrame = Math.floor(seconds * fps);
  const totalFrames = Math.floor(duration * fps);
  return `${currentFrame} / ${totalFrames}`;
}

export function findMaxNumber(str) {
  const numbers = str.match(/\d+/g);
  if (!numbers) return null;
  return Math.max(...numbers.map(Number));
}

export function createSorter(keyExtractor) {
  return (a, b) => {
    const keyA = getSortableKey(keyExtractor(a));
    const keyB = getSortableKey(keyExtractor(b));
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  };
}

export function parseBackgroundImageUrl(style) {
  if (!style || !style.startsWith('url')) return null;
  const match = style.match(/^url\(["']?(.+?)["']?\)$/);
  return match ? match[1] : null;
}

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image from ${url}`));
    img.src = url;
  });
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function sanitizeFilename(name) {
  return String(name || '').replace(/[\\/:*?"<>|]/g, '_');
}

export function sanitizeInputUrl(urlStr) {
  const url = new URL(urlStr);
  if (url.hostname === 'github.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length >= 4 && (parts[2] === 'blob' || parts[2] === 'raw')) {
      const owner = parts[0];
      const repo = parts[1];
      let refAndPath = parts.slice(3);
      if (refAndPath[0] === 'refs' && refAndPath[1] === 'heads') {
        refAndPath = refAndPath.slice(2);
      }
      url.hostname = 'raw.githubusercontent.com';
      url.pathname = `/${owner}/${repo}/${refAndPath.join('/')}`;
      return url.toString();
    }
  } else if (url.hostname === 'raw.githubusercontent.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length >= 4 && parts[2] === 'refs' && parts[3] === 'heads') {
      const owner = parts[0];
      const repo = parts[1];
      const refAndPath = parts.slice(4);
      url.pathname = `/${owner}/${repo}/${refAndPath.join('/')}`;
      return url.toString();
    }
  }
  return urlStr;
}
