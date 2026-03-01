export function savePreference(key, value) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

export function loadPreference(key, defaultValue = null) {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
}

export function removePreference(key) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
}
