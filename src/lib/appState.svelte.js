import { loadSetting } from './settings.js';

let initialized = $state(false);
let processing = $state(false);
let viewport = $state({
  width: typeof window !== 'undefined' ? window.innerWidth : 800,
  height: typeof window !== 'undefined' ? window.innerHeight : 600,
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
let exportBase = $state('window');
let exportScale = $state(100);
let exportMarginX = $state(0);
let exportMarginY = $state(0);
let alphaMode = $state(loadSetting('spive2d_alpha_mode', 'unpack'));
let mergeSequential = $state(loadSetting('spive2d_merge_sequential', 'false') === 'true');
const SCALE_MAX = 8;
const SCALE_MIN = 0.5;
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
  set exportBase(v) { exportBase = v; },
  get exportScale() { return exportScale; },
  set exportScale(v) { exportScale = v; },
  get exportMarginX() { return exportMarginX; },
  set exportMarginX(v) { exportMarginX = v; },
  get exportMarginY() { return exportMarginY; },
  set exportMarginY(v) { exportMarginY = v; },
  get alphaMode() { return alphaMode; },
  set alphaMode(v) { alphaMode = v; },
  get mergeSequential() { return mergeSequential; },
  set mergeSequential(v) { mergeSequential = v; },
  SCALE_MAX,
  SCALE_MIN,
  resetTransform() {
    transform = { scale: 1, moveX: 0, moveY: 0, rotate: 0 };
  },
  resetAnimation() {
    animation = { paused: false, seeking: false, seekProgress: 0, currentTime: 0, duration: 0, speed: 1.0 };
  },
};
