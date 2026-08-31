declare global {
  interface Window {
    __TAURI__?: any;
    __TAURI_INTERNALS__?: any;
    __APP_STATE__?: any;
    __GET_RENDERER__?: any;
    spine?: any;
    spineLib?: any;
    PIXI?: any;
    setupPIXISettings?: any;
    Live2D?: any;
    UtSystem?: any;
    useNonePMA?: any;
    wantFlipYBitmap?: any;
  }
  const PIXI: any;
  const spine: any;
}
export {};
