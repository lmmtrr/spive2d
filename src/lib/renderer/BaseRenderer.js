export class BaseRenderer {
  constructor(isExport = false) {
    this.isExport = isExport;
    this._scale = 1;
    this._moveX = 0;
    this._moveY = 0;
    this._rotate = 0;
    this.parameterOverrides = new Map();
    this.partOverrides = new Map();
    this.drawableOverrides = new Map();
  }

  getCanvas() {
    throw new Error('getCanvas() must be implemented');
  }

  async load(dirName, fileNames) {
    throw new Error('load() must be implemented');
  }

  dispose() {
    throw new Error('dispose() must be implemented');
  }

  resize(width, height) {
  }

  getOriginalSize() {
    return { width: 0, height: 0 };
  }

  applyTransform(scale, moveX, moveY, rotate) {
    this._scale = scale;
    this._moveX = moveX;
    this._moveY = moveY;
    this._rotate = rotate;
  }

  resetTransform() {
    this._scale = 1;
    this._moveX = 0;
    this._moveY = 0;
    this._rotate = 0;
  }

  getAnimations() {
    return [];
  }

  async setAnimation(value) {
  }

  getExpressions() {
    return null;
  }

  setExpression(value) {
  }

  getPropertyCategories() {
    return [];
  }

  getPropertyItems(category) {
    return [];
  }

  updatePropertyItem(category, name, index, value) {
  }

  getAnimationDuration() {
    return 0;
  }

  seekAnimation(progress) {
  }

  getCurrentTime() {
    return 0;
  }

  getFPS() {
    return 30;
  }

  setPaused(paused) {
  }

  setSpeed(speed) {
  }

  getSyncState() {
    return JSON.parse(JSON.stringify({
      scale: this._scale,
      moveX: this._moveX,
      moveY: this._moveY,
      rotate: this._rotate,
      parameterOverrides: Array.from(this.parameterOverrides.entries()),
      partOverrides: Array.from(this.partOverrides.entries()),
      drawableOverrides: Array.from(this.drawableOverrides.entries()),
    }));
  }

  applySyncState(state) {
    if (!state) return;
    this.applyTransform(
      state.scale ?? 1,
      state.moveX ?? 0,
      state.moveY ?? 0,
      state.rotate ?? 0
    );
    if (state.parameterOverrides) this.parameterOverrides = new Map(state.parameterOverrides);
    if (state.partOverrides) this.partOverrides = new Map(state.partOverrides);
    if (state.drawableOverrides) this.drawableOverrides = new Map(state.drawableOverrides);
  }

  render() {
  }

  captureFrame(width, height, options = {}) {
    throw new Error('captureFrame() must be implemented');
  }
}
