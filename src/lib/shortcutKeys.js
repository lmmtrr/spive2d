const STORAGE_KEY = 'spive2d_shortcuts';

const DEFAULT_SHORTCUTS = {
  prevScene: 'q',
  nextScene: 'w',
  prevAnim: 'a',
  nextAnim: 's',
  toggleDialog: 'z',
  toggleSceneGrid: 'x',
  exportImage: 'e',
  exportImageSeq: 'd',
  exportAnim: 'c',
  exportModel: 'r',
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
    const used = new Set(Object.values(parsed));
    const added = Object.fromEntries(
      Object.entries(DEFAULT_SHORTCUTS)
        .filter(([action]) => !(action in parsed))
        .map(([action, key]) => [action, used.has(key) ? '' : key])
    );
    return { ...parsed, ...added };
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
