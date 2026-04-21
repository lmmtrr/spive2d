import { describe, it, expect } from 'vitest';
import { getSortableKey, findMaxNumber, createSorter } from '../../src/lib/utils.js';
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
    it('should ensure numerical order matches lexicographical order of keys', () => {
      const keys = ['file2', 'file10', 'file1'].map(s => getSortableKey(s));
      keys.sort();
      expect(keys[0]).toBe(getSortableKey('file1'));
      expect(keys[1]).toBe(getSortableKey('file2'));
      expect(keys[2]).toBe(getSortableKey('file10'));
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
});
