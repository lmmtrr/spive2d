import { loadSetting, saveSetting } from './settings.js';

function loadNumberSetting(key, defaultValue, min, max) {
  const v = parseFloat(loadSetting(key, ''));
  return Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : defaultValue;
}

let initialized = $state(false);
let processing = $state(false);
let viewport = $state({
  width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  height: typeof window !== 'undefined' ? window.innerHeight : 800,
});
let transform = $state({
  scale: 1,
  moveX: 0,
  moveY: 0,
  rotate: 0,
});
let animation = $state({
  paused: false,
  seeking: false,
  seekProgress: 0,
  currentTime: 0,
  duration: 0,
  speed: 1.0,
});
let directories = $state({
  files: null,
  entries: [],
  selectedDir: '',
  selectedScene: 0,
});
let background = $state({
  color: loadSetting('spive2d_bg_color', ''),
  imagePath: loadSetting('spive2d_bg_image_path', ''),
});
let propertyCategory = $state('parameters');
let exportBase = $state(loadSetting('spive2d_export_base', 'window') === 'original' ? 'original' : 'window');
let exportScale = $state(loadNumberSetting('spive2d_export_scale', 100, 10, 1000));
let exportMarginX = $state(loadNumberSetting('spive2d_export_margin_x', 0, -1000, 1000));
let exportMarginY = $state(loadNumberSetting('spive2d_export_margin_y', 0, -1000, 1000));
let alphaMode = $state(loadSetting('spive2d_alpha_mode', 'pma'));
let textureFilter = $state(loadSetting('spive2d_texture_filter', 'linear'));
let skipUnity = $state(loadSetting('spive2d_skip_unity', 'false') === 'true');
let mergeSequential = $state(loadSetting('spive2d_merge_sequential', 'false') === 'true');
let enableIdleAndBreathing = $state(loadSetting('spive2d_enable_idle_and_breathing', 'false') === 'true');
let enableMouseTracking = $state(loadSetting('spive2d_enable_mouse_tracking', 'false') === 'true');
const SCALE_MAX = 16;
const SCALE_MIN = 0.125;
export const appState = {
  get initialized() { return initialized; },
  set initialized(v) { initialized = v; },
  get processing() { return processing; },
  set processing(v) { processing = v; },
  get viewport() { return viewport; },
  set viewport(v) { viewport = v; },
  get transform() { return transform; },
  set transform(v) { transform = v; },
  get animation() { return animation; },
  set animation(v) { animation = v; },
  get directories() { return directories; },
  set directories(v) { directories = v; },
  get background() { return background; },
  set background(v) { background = v; },
  get propertyCategory() { return propertyCategory; },
  set propertyCategory(v) { propertyCategory = v; },
  get exportBase() { return exportBase; },
  set exportBase(v) { exportBase = v; saveSetting('spive2d_export_base', v); },
  get exportScale() { return exportScale; },
  set exportScale(v) { exportScale = v; if (Number.isFinite(v)) saveSetting('spive2d_export_scale', v); },
  get exportMarginX() { return exportMarginX; },
  set exportMarginX(v) { exportMarginX = v; if (Number.isFinite(v)) saveSetting('spive2d_export_margin_x', v); },
  get exportMarginY() { return exportMarginY; },
  set exportMarginY(v) { exportMarginY = v; if (Number.isFinite(v)) saveSetting('spive2d_export_margin_y', v); },
  get alphaMode() { return alphaMode; },
  set alphaMode(v) { alphaMode = v; },
  get textureFilter() { return textureFilter; },
  set textureFilter(v) { textureFilter = v; },
  get mergeSequential() { return mergeSequential; },
  set mergeSequential(v) { mergeSequential = v; },
  get enableIdleAndBreathing() { return enableIdleAndBreathing; },
  set enableIdleAndBreathing(v) { enableIdleAndBreathing = v; },
  get enableMouseTracking() { return enableMouseTracking; },
  set enableMouseTracking(v) { enableMouseTracking = v; },
  get skipUnity() { return skipUnity; },
  set skipUnity(v) { skipUnity = v; },
  SCALE_MAX,
  SCALE_MIN,
  resetTransform() {
    transform = { scale: 1, moveX: 0, moveY: 0, rotate: 0 };
  },
  resetExportSettings() {
    exportScale = 100;
    exportMarginX = 0;
    exportMarginY = 0;
    exportBase = 'window';
    saveSetting('spive2d_export_scale', exportScale);
    saveSetting('spive2d_export_margin_x', exportMarginX);
    saveSetting('spive2d_export_margin_y', exportMarginY);
    saveSetting('spive2d_export_base', exportBase);
  },
  resetAnimation() {
    animation = { paused: false, seeking: false, seekProgress: 0, currentTime: 0, duration: 0, speed: 1.0 };
  },
};
