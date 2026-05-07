import { describe, it, expect } from 'vitest';
import { getSortableKey, findMaxNumber, createSorter, formatFrames, parseBackgroundImageUrl, formatFileSize } from '../../src/lib/utils.js';
describe('General Utilities', () => {
  describe('getSortableKey', () => {
    it('should pad numbers with zeros', () => {
      expect(getSortableKey('file1')).toBe('file0000000000000001');
      expect(getSortableKey('file10')).toBe('file0000000000000010');
      expect(getSortableKey('file2')).toBe('file0000000000000002');
    });
    it('should handle multiple numbers', () => {
      expect(getSortableKey('v1_part10')).toBe('v0000000000000001_part0000000000000010');
    });
    it('should handle strings with mixed numbers and characters', () => {
      expect(getSortableKey('123abc456')).toBe('0000000000000123abc0000000000000456');
    });
    it('should handle empty or null input gracefully', () => {
      expect(getSortableKey('')).toBe('');
      expect(getSortableKey(null)).toBe('');
    });
    it('should ensure numerical order matches lexicographical order of keys', () => {
      const keys = ['file2', 'file10', 'file1', 'file01'].map(s => getSortableKey(s));
      keys.sort();
      expect(keys[0]).toBe(getSortableKey('file01'));
      expect(keys[1]).toBe(getSortableKey('file1'));
      expect(keys[2]).toBe(getSortableKey('file2'));
      expect(keys[3]).toBe(getSortableKey('file10'));
    });
  });
  describe('findMaxNumber', () => {
    it('should find the largest number in a string', () => {
      expect(findMaxNumber('seq_12_v3')).toBe(12);
      expect(findMaxNumber('no_numbers')).toBe(null);
    });
  });
  describe('createSorter', () => {
    it('should correctly sort objects numerically based on a key', () => {
      const items = [{ name: 'a10' }, { name: 'a1' }, { name: 'a2' }];
      const sorter = createSorter(item => item.name);
      items.sort(sorter);
      expect(items[0].name).toBe('a1');
      expect(items[1].name).toBe('a2');
      expect(items[2].name).toBe('a10');
    });
  });
  describe('formatFrames', () => {
    it('should format seconds and duration into frame strings', () => {
      expect(formatFrames(1, 10, 30)).toBe('30 / 300');
      expect(formatFrames(0.5, 2, 60)).toBe('30 / 120');
    });
  });
  describe('parseBackgroundImageUrl', () => {
    it('should extract URL from CSS background-image style', () => {
      expect(parseBackgroundImageUrl('url("path/to/image.png")')).toBe('path/to/image.png');
      expect(parseBackgroundImageUrl("url('path/to/image.png')")).toBe('path/to/image.png');
      expect(parseBackgroundImageUrl('url(path/to/image.png)')).toBe('path/to/image.png');
      expect(parseBackgroundImageUrl('none')).toBe(null);
      expect(parseBackgroundImageUrl('')).toBe(null);
    });
  });
  describe('formatFileSize', () => {
    it('should format bytes into human-readable strings', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
    });
  });
});
