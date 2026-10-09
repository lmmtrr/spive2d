const STORAGE_KEY = 'spive2d_shortcuts';

const DEFAULT_SHORTCUTS = {
  prevScene: 'a',
  nextScene: 's',
  prevAnim: 'z',
  nextAnim: 'x',
  exportImage: 'e',
  exportImageSeq: 'd',
  exportAnim: 'c',
  exportModel: 'r',
  toggleDialog: 'f',
  addToList: 'v',
  toggleFullscreen: 'F11',
};

export function getDefaultShortcuts() {
  return { ...DEFAULT_SHORTCUTS };
}

export function getShortcuts() {
  if (typeof localStorage === 'undefined') return getDefaultShortcuts();
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return getDefaultShortcuts();
  try {
    const parsed = JSON.parse(saved);
    return { ...DEFAULT_SHORTCUTS, ...parsed };
  } catch {
    return getDefaultShortcuts();
  }
}

export function saveShortcuts(shortcuts) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
  }
}

export function resetShortcuts() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return getDefaultShortcuts();
}
