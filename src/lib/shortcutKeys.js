import { storage } from './storage.js';

const STORAGE_KEY = 'spive2d_shortcuts';

const DEFAULT_SHORTCUTS = {
  toggleDialog: 'q',
  toggleSceneGrid: 'w',
  prevScene: 'a',
  nextScene: 's',
  prevAnim: 'z',
  nextAnim: 'x',
  togglePause: ' ',
  exportImage: 'e',
  exportImageSeq: 'd',
  exportAnim: 'c',
  exportModel: 'r',
  addToList: 'v',
  toggleFullscreen: 'F11',
  openDirectory: '',
  openArchive: '',
  openCurrentDirectory: '',
  focusUrl: '',
  focusFilter: '',
  prevExpression: '',
  nextExpression: '',
  toggleSetupPose: '',
  resetOverrides: '',
  resetView: '',
  resetScale: '',
  resetRotation: '',
  resetPositionX: '',
  resetPositionY: '',
  resetPosition: '',
  cycleTextureFilter: '',
  openBackgroundImage: '',
  removeBackground: '',
  openExportDirectory: '',
  resetExportMarginX: '',
  resetExportMarginY: '',
  resetExportMargin: '',
  resetExportScale: '',
  toggleIdle: '',
  toggleBreathing: '',
  toggleBlinking: '',
  toggleHitAreas: '',
  toggleMouseTracking: '',
  togglePhysics: '',
};

export function getDefaultShortcuts() {
  return { ...DEFAULT_SHORTCUTS };
}

export function getShortcuts() {
  const saved = storage.getItem(STORAGE_KEY);
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
  storage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
}

export function resetShortcuts() {
  storage.removeItem(STORAGE_KEY);
  return getDefaultShortcuts();
}
