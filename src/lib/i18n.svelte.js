import en from './locales/en.json';
import ja from './locales/ja.json';
import zh from './locales/zh.json';

const translations = { en, ja, zh };

let locale = $state(localStorage.getItem('spive2d_language') || 'en');

export function t(key) {
  return translations[locale]?.[key] || key;
}

export function getLocale() {
  return locale;
}

export function setLocale(lang) {
  locale = lang;
  localStorage.setItem('spive2d_language', lang);
}
