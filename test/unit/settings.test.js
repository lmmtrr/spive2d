import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveSetting, loadSetting, clearAllSettings } from '../../src/lib/settings.js';
describe('Settings Utility', () => {
  beforeEach(() => {
    const mockStorage = {};
    global.localStorage = {
      getItem: vi.fn((key) => mockStorage[key] || null),
      setItem: vi.fn((key, value) => { mockStorage[key] = value; }),
      removeItem: vi.fn((key) => { delete mockStorage[key]; }),
      clear: vi.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); })
    };
  });
  it('should save and load settings', () => {
    saveSetting('testKey', 'testValue');
    expect(loadSetting('testKey')).toBe('testValue');
  });
  it('should return default value if setting not found', () => {
    expect(loadSetting('nonExistent', 'default')).toBe('default');
  });
  it('should clear all settings', () => {
    saveSetting('key1', 'val1');
    saveSetting('key2', 'val2');
    clearAllSettings();
    expect(loadSetting('key1')).toBe(null);
    expect(loadSetting('key2')).toBe(null);
  });
});
