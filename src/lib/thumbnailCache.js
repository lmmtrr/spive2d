import { invoke } from '@tauri-apps/api/core';

const MAX_ENTRIES = 5000;
const PRUNE_DELAY_MS = 2000;

let pruneTimer = null;

function schedulePrune() {
  if (pruneTimer) return;
  pruneTimer = setTimeout(() => {
    pruneTimer = null;
    invoke('thumbnail_prune', { maxEntries: MAX_ENTRIES })
      .catch(err => console.warn('[ThumbnailCache] Failed to prune:', err));
  }, PRUNE_DELAY_MS);
}

export const thumbnailCache = {
  async get(key) {
    try {
      const buffer = await invoke('thumbnail_get', { key: encodeURIComponent(key) });
      if (!buffer || buffer.byteLength === 0) return null;
      return new Blob([buffer], { type: 'image/webp' });
    } catch (err) {
      console.warn('[ThumbnailCache] Failed to read:', err);
      return null;
    }
  },

  async put(key, blob) {
    try {
      const bytes = new Uint8Array(await blob.arrayBuffer());
      await invoke('thumbnail_put', bytes, {
        headers: { 'x-thumbnail-key': encodeURIComponent(key) },
      });
      schedulePrune();
    } catch (err) {
      console.warn('[ThumbnailCache] Failed to write:', err);
    }
  },

  async clear() {
    await invoke('thumbnail_clear');
  },
};
