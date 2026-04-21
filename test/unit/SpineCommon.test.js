import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeAtlasText, setupAtlas, setupSpineAssetManager } from '../../src/lib/renderer/SpineCommon.js';
describe('SpineCommon Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('normalizeAtlasText', () => {
    it('should remove leading/trailing whitespace from lines', () => {
      const input = '  line1  \n  line2  ';
      const output = normalizeAtlasText(input);
      expect(output).toBe('line1\nline2');
    });
    it('should remove empty lines but keep valid empty lines between pages', () => {
      const input = 'page1.png\n\n\nregion1\n\npage2.png\nregion2';
      const output = normalizeAtlasText(input);
      expect(output).toBe('page1.png\nregion1\n\npage2.png\nregion2');
    });
    it('should sanitize atlas files with excessive newlines', () => {
      const input = '\n\npage.png\n\nsize: 1,1\n\n\nregion\n\n\n';
      const output = normalizeAtlasText(input);
      expect(output).toBe('page.png\nsize: 1,1\nregion');
    });
  });
  describe('setupAtlas', () => {
    it('should trim region names', () => {
      const atlas = {
        regions: [
          { name: '  region1  ' },
          { name: 'region2' }
        ],
        findRegion: (name) => null
      };
      setupAtlas(atlas);
      expect(atlas.regions[0].name).toBe('region1');
      expect(atlas.regions[1].name).toBe('region2');
    });
    it('should enhance findRegion to handle untrimmed names', () => {
      const regions = { 'region1': { name: 'region1' } };
      const originalSpy = vi.fn((name) => regions[name]);
      const atlas = { regions: [], findRegion: originalSpy };
      setupAtlas(atlas);
      const found = atlas.findRegion('  region1  ');
      expect(found).toBe(regions['region1']);
      expect(originalSpy).toHaveBeenCalledWith('region1');
    });
  });
  describe('setupSpineAssetManager', () => {
    it('should handle texture load failure with fallback', () => {
      const onFallback = vi.fn();
      const mockGl = {};
      const mockTexture = { setFilters: vi.fn() };
      let glTextureCalled = false;
      function MockGLTexture() {
        glTextureCalled = true;
        return mockTexture;
      }
      const mockSpine = { GLTexture: MockGLTexture };
      const assetManager = {
        loadTexture: vi.fn((url, success, error) => {
          error('path/to/missing.png', '404 Not Found');
        }),
        downloadText: vi.fn(),
        assets: {},
        errors: { 'path/to/missing.png': 'Error' }
      };
      if (typeof global.OffscreenCanvas === 'undefined') {
        global.OffscreenCanvas = class {
          constructor() { this.width = 1; this.height = 1; }
          getContext() { return { fillStyle: '', fillRect: () => {} }; }
        };
      }
      setupSpineAssetManager(assetManager, mockSpine, mockGl, onFallback);
      const successCb = vi.fn();
      const errorCb = vi.fn();
      assetManager.loadTexture('path/to/missing.png', successCb, errorCb);
      expect(onFallback).toHaveBeenCalledWith('path/to/missing.png', '404 Not Found');
      expect(glTextureCalled).toBe(true);
      expect(assetManager.assets['path/to/missing.png']).toBe(mockTexture);
      expect(successCb).toHaveBeenCalled();
      expect(assetManager.errors['path/to/missing.png']).toBeUndefined();
    });
  });
});
