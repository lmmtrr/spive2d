import { getCurrentWindow } from '@tauri-apps/api/window';
import { PhysicalSize } from '@tauri-apps/api/dpi';

export function getPhysicalWindowSize() {
  const dpr = window.devicePixelRatio || 1;
  return {
    width: Math.round(window.innerWidth * dpr),
    height: Math.round(window.innerHeight * dpr)
  };
}

export async function setWindowSize(width, height) {
  if (typeof window !== 'undefined' && window.__TAURI__) {
    try {
      await getCurrentWindow().setSize(new PhysicalSize(Math.round(width), Math.round(height)));
    } catch (e) {
      console.error('Failed to set window size', e);
    }
  }
}
