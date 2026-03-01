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
