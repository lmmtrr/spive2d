declare global {
  interface Window {
    __TAURI__?: any;
    spine?: any;
  }
  const PIXI: any;
  const spine: any;
}
export {};
