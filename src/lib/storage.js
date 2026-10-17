import { invoke } from '@tauri-apps/api/core';

const injected = globalThis.__SPIVE2D_SETTINGS__;
const persistent = injected !== undefined;
const values = new Map(Object.entries(injected ?? {}));
let saveQueued = false;

function scheduleSave() {
  if (saveQueued) return;
  saveQueued = true;
  queueMicrotask(() => {
    saveQueued = false;
    invoke('save_settings', { settings: Object.fromEntries(values) })
      .catch(err => console.warn('[Storage] Failed to save settings:', err));
  });
}

function migrateFromLocalStorage() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      values.set(key, localStorage.getItem(key));
    }
  } catch (err) {
    console.warn('[Storage] Failed to migrate localStorage:', err);
  }
  scheduleSave();
}

if (injected === null) migrateFromLocalStorage();

export const storage = {
  getItem(key) {
    if (!persistent) return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    return values.get(key) ?? null;
  },

  setItem(key, value) {
    if (!persistent) {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      return;
    }
    values.set(key, String(value));
    scheduleSave();
  },

  removeItem(key) {
    if (!persistent) {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      return;
    }
    if (values.delete(key)) scheduleSave();
  },

  clear() {
    if (!persistent) {
      if (typeof localStorage !== 'undefined') localStorage.clear();
      return;
    }
    values.clear();
    scheduleSave();
  },
};
