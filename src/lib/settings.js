export function saveSetting(key, value) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

export function loadSetting(key, defaultValue = null) {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
}

export function removeSetting(key) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
}
