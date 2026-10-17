import { storage } from './storage.js';

export function saveSetting(key, value) {
  storage.setItem(key, value);
}

export function loadSetting(key, defaultValue = null) {
  return storage.getItem(key) || defaultValue;
}

export function removeSetting(key) {
  storage.removeItem(key);
}

export function clearAllSettings() {
  storage.clear();
}
