import { getCurrentWindow } from '@tauri-apps/api/window';
import { LogicalSize } from '@tauri-apps/api/dpi';

export async function setWindowSize(width, height) {
  if (typeof window !== 'undefined' && window.__TAURI__) {
    try {
      await getCurrentWindow().setSize(new LogicalSize(Math.round(width), Math.round(height)));
    } catch (e) {
      console.error('Failed to set window size', e);
    }
  }
}
