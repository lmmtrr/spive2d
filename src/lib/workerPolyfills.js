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
        .then(blob => createImageBitmap(blob, { premultiplyAlpha: this.premultiplyAlpha }))
        .then(bitmap => {
          this.width = bitmap.width;
          this.height = bitmap.height;
          this.complete = true;
          this._bitmap = bitmap;
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
  self.HTMLVideoElement = class HTMLVideoElement { };
  const patchWebGL = (proto) => {
    if (!proto) return;
    const oldTexImage2D = proto.texImage2D;
    proto.texImage2D = function (...args) {
      const last = args[args.length - 1];
      if (last && last._bitmap) args[args.length - 1] = last._bitmap;
      return oldTexImage2D.apply(this, args);
    };
    const oldTexSubImage2D = proto.texSubImage2D;
    proto.texSubImage2D = function (...args) {
      const last = args[args.length - 1];
      if (last && last._bitmap) args[args.length - 1] = last._bitmap;
      return oldTexSubImage2D.apply(this, args);
    };
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
    currentScript: null,
    location: self.location,
    styleSheets: [],
    fonts: { add: () => { }, ready: Promise.resolve() },
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
      PIXI.utils.isWebGLSupported = () => true;
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
