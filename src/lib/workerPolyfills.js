export function setupWorkerEnv(self) {
  self.window = self;
  self.HTMLCanvasElement = OffscreenCanvas;
  self.HTMLImageElement = class HTMLImageElement {
    constructor() {
      this.onload = null;
      this.onerror = null;
      this._src = '';
      this.width = 0;
      this.height = 0;
      this.complete = false;
      this.premultiplyAlpha = self.useNonePMA ? 'none' : 'premultiply';
      this.decodeFlipY = !!self.wantFlipYBitmap;
    }
    set src(url) {
      this._src = url;
      this.complete = false;
      if (!url) return;
      fetch(url)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to load image: ${url}`);
          return res.blob();
        })
        .then(blob => Promise.all([
          createImageBitmap(blob, { premultiplyAlpha: this.premultiplyAlpha }),
          this.decodeFlipY
            ? createImageBitmap(blob, { premultiplyAlpha: this.premultiplyAlpha, imageOrientation: 'flipY' })
              .catch(() => null)
            : null,
        ]))
        .then(([bitmap, flippedBitmap]) => {
          this.width = bitmap.width;
          this.height = bitmap.height;
          this.complete = true;
          this._bitmap = bitmap;
          this._bitmapFlipY = flippedBitmap;
          if (this.onload) this.onload();
        })
        .catch(err => {
          console.error('Worker Image Load Error:', err);
          if (this.onerror) this.onerror(err);
        });
    }
    get src() { return this._src; }
  };
  self.Image = self.HTMLImageElement;
  const patchWebGL = (proto) => {
    if (!proto) return;
    const wrapUpload = (name) => {
      const original = proto[name];
      if (!original) return;
      proto[name] = function (...args) {
        const last = args[args.length - 1];
        if (!last || !last._bitmap) return original.apply(this, args);
        const FLIP_Y = this.UNPACK_FLIP_Y_WEBGL;
        if (last._bitmapFlipY && this.getParameter(FLIP_Y)) {
          args[args.length - 1] = last._bitmapFlipY;
          this.pixelStorei(FLIP_Y, false);
          try {
            return original.apply(this, args);
          } finally {
            this.pixelStorei(FLIP_Y, true);
          }
        }
        args[args.length - 1] = last._bitmap;
        return original.apply(this, args);
      };
    };
    wrapUpload('texImage2D');
    wrapUpload('texSubImage2D');
  };
  patchWebGL(self.WebGLRenderingContext?.prototype);
  patchWebGL(self.WebGL2RenderingContext?.prototype);
  if (typeof OffscreenCanvasRenderingContext2D !== 'undefined') {
    const proto = OffscreenCanvasRenderingContext2D.prototype;
    const oldDrawImage = proto.drawImage;
    proto.drawImage = function (...args) {
      if (args[0] && args[0]._bitmap) args[0] = args[0]._bitmap;
      return oldDrawImage.apply(this, args);
    };
  }
  let fallbackCanvas = null;
  const getFallbackCanvas = () => {
    if (!fallbackCanvas) fallbackCanvas = new OffscreenCanvas(32, 32);
    return fallbackCanvas;
  };
  const mockDoc = {
    createElement: (type) => {
      if (type === 'canvas') return new OffscreenCanvas(1, 1);
      if (type === 'img') return new self.HTMLImageElement();
      return { style: {}, appendChild: () => { }, querySelector: () => null };
    },
    createElementNS: () => ({ style: {} }),
    addEventListener: () => { },
    removeEventListener: () => { },
    documentElement: { style: {} },
    head: { appendChild: () => { } },
    body: { appendChild: () => { } },
  };
  self.__TAURI__ = {
    core: {
      convertFileSrc: (url) => url
    }
  };
  Object.defineProperty(self, 'document', { value: mockDoc, writable: true });
  self.setupPIXISettings = (PIXI) => {
    if (!PIXI) return;
    self.window.PIXI = PIXI;
    if (PIXI.utils) {
      PIXI.utils.skipHello();
    }
    if (PIXI.Ticker) {
      PIXI.Ticker.shared.autoStart = false;
      PIXI.Ticker.shared.stop();
    }
    if (PIXI.settings) {
      PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;
      PIXI.settings.PREFER_WEBGL_2 = true;
      PIXI.settings.ADAPTER = {
        createCanvas: () => new OffscreenCanvas(1, 1),
        getCanvas: () => new OffscreenCanvas(1, 1),
        getWebGLRenderingContext: (c, attrs) => {
          const target = c || getFallbackCanvas();
          return target.getContext('webgl2', attrs);
        },
        getWebGLContext: (c, attrs) => {
          const target = c || getFallbackCanvas();
          return target.getContext('webgl2', attrs);
        },
        getNavigator: () => self.navigator,
        getBaseUrl: () => self.location.href,
        getFontFaceSet: () => self.document ? self.document.fonts : null,
        fetch: (...args) => fetch(...args),
      };
    }
  };
}
