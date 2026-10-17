import en from './locales/en.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import zh from './locales/zh.json';
import { storage } from './storage.js';

const translations = { en, ja, ko, zh };

let locale = $state(storage.getItem('spive2d_language') || 'en');

export function t(key) {
  return translations[locale]?.[key] || key;
}

export function getLocale() {
  return locale;
}

export function setLocale(lang) {
  locale = lang;
  storage.setItem('spive2d_language', lang);
}
