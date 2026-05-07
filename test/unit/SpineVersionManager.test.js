import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/lib/notificationStore.svelte.js', () => ({
  showNotification: vi.fn(),
}));
vi.mock('@tauri-apps/api/core', () => ({
  convertFileSrc: vi.fn(s => s),
}));
import { isJsonSpineData } from '../../src/lib/renderer/SpineVersionManager.js';
describe('SpineVersionManager Logic', () => {
  describe('isJsonSpineData', () => {
    it('should return true for valid JSON starting with {', () => {
      const head = new Uint8Array([123, 34, 115, 107, 101, 108, 101, 116, 111, 110]);
      expect(isJsonSpineData(head)).toBe(true);
    });
    it('should return true for JSON with leading whitespace', () => {
      const head = new Uint8Array([32, 10, 123, 34]);
      expect(isJsonSpineData(head)).toBe(true);
    });
    it('should return false for binary Spine data', () => {
      const head = new Uint8Array([0, 1, 2, 3, 4, 5]);
      expect(isJsonSpineData(head)).toBe(false);
    });
    it('should return false for binary data starting with other characters', () => {
      const head = new Uint8Array([97, 98, 99]);
      expect(isJsonSpineData(head)).toBe(false);
    });
    it('should return false if binary nulls are present after {', () => {
        const head = new Uint8Array([123, 0, 0, 0]);
        expect(isJsonSpineData(head)).toBe(false);
    });
  });
});
