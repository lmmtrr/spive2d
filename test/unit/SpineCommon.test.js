import { describe, it, expect, vi, beforeEach } from 'vitest';
import { normalizeAtlasText, setupAtlas, setupSpineAssetManager, getInitialSkinName, calculateSpineMVP, parseAtlasDeclaredSizes } from '../../src/lib/renderer/SpineCommon.js';
describe('SpineCommon Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('calculateSpineMVP', () => {
    it('should correctly calculate ortho2d bounds', () => {
      const mockMvp = { ortho2d: vi.fn(), multiply: vi.fn() };
      const mockSpine = { Matrix4: class {} };
      const bounds = { offset: { x: 0, y: 0 }, size: { x: 100, y: 100 } };
      const transform = { scale: 1, x: 0, y: 0, rotation: 0 };
      calculateSpineMVP(mockSpine, mockMvp, 800, 600, bounds, transform);
      expect(mockMvp.ortho2d).toHaveBeenCalled();
      const args = mockMvp.ortho2d.mock.calls[0];
      expect(args[2]).toBeCloseTo(133.33, 2);
      expect(args[3]).toBeCloseTo(100, 2);
    });
    it('should apply screenBaseScale to movement', () => {
      const mockMvp = { ortho2d: vi.fn(), multiply: vi.fn() };
      const mockSpine = { Matrix4: class {} };
      const centerX = 50;
      const bounds = { offset: { x: 0, y: 0 }, size: { x: 100, y: 100 } };
      const transform = { scale: 1, x: 10, y: 0, rotation: 0 };
      calculateSpineMVP(mockSpine, mockMvp, 800, 600, bounds, transform, { screenBaseScale: null });
      const args1 = mockMvp.ortho2d.mock.calls[0];
      const width = args1[2];
      const viewCenterX1 = args1[0] + width * 0.5;
      const baseScale = 1/6;
      calculateSpineMVP(mockSpine, mockMvp, 800, 600, bounds, transform, { screenBaseScale: baseScale * 2 });
      const args2 = mockMvp.ortho2d.mock.calls[1];
      const viewCenterX2 = args2[0] + width * 0.5;
      const disp1 = centerX - viewCenterX1;
      const disp2 = centerX - viewCenterX2;
      expect(disp2).toBeCloseTo(disp1 * 2, 2);
    });
  });
  describe('getInitialSkinName', () => {
    it('should select the first non-default, non-mask skin', () => {
      const skins = [
        { name: 'default' },
        { name: 'mask_eyes' },
        { name: 'outfit1' },
        { name: 'outfit2' }
      ];
      expect(getInitialSkinName(skins)).toBe('outfit1');
    });
    it('should fallback to default if only mask skins are available', () => {
      const skins = [
        { name: 'default' },
        { name: 'mask_eyes' }
      ];
      expect(getInitialSkinName(skins)).toBe('default');
    });
    it('should return default if skins list is empty', () => {
      expect(getInitialSkinName([])).toBe('default');
    });
    it('should select default if it is the only skin', () => {
      const skins = [{ name: 'default' }];
      expect(getInitialSkinName(skins)).toBe('default');
    });
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
    it('should ensure exactly one empty line before a new page name', () => {
      const input = 'page1.png\nregion1\npage2.png\nregion2';
      const output = normalizeAtlasText(input);
      expect(output).toBe('page1.png\nregion1\n\npage2.png\nregion2');
    });
    it('should handle various image extensions in page names', () => {
      const input = 'p1.png\nr1\np2.jpg\nr2\np3.webp\nr3';
      const output = normalizeAtlasText(input);
      expect(output).toBe('p1.png\nr1\n\np2.jpg\nr2\n\np3.webp\nr3');
    });
  });
  describe('parseAtlasDeclaredSizes', () => {
    it('should extract sizes for multiple pages', () => {
      const input = `
page1.png
size: 1024, 2048
filter: Linear, Linear
page2.png
  size: 512, 512
      `;
      const sizes = parseAtlasDeclaredSizes(input);
      expect(sizes.get('page1.png')).toEqual({ width: 1024, height: 2048 });
      expect(sizes.get('page2.png')).toEqual({ width: 512, height: 512 });
    });
    it('should skip pages without size declaration', () => {
      const input = `
page1.png
filter: Linear
page2.png
size: 100, 100
      `;
      const sizes = parseAtlasDeclaredSizes(input);
      expect(sizes.has('page1.png')).toBe(false);
      expect(sizes.get('page2.png')).toEqual({ width: 100, height: 100 });
    });
    it('should handle messy formatting and spaces', () => {
      const input = 'image.png \n size:123 , 456';
      const sizes = parseAtlasDeclaredSizes(input);
      expect(sizes.get('image.png')).toEqual({ width: 123, height: 456 });
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
