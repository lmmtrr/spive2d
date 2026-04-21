import { describe, it, expect, vi } from 'vitest';
import { SpineRendererBase } from '../../src/lib/renderer/SpineRendererBase.js';
vi.mock('@tauri-apps/api/core', () => ({
  convertFileSrc: (path) => path
}));
describe('SpineRendererBase Logic', () => {
  const mockSpine = {
    Skin: class { addSkin() {} },
    ManagedWebGLRenderingContext: class {
        constructor() { this.gl = { pixelStorei: () => {} }; }
    },
    Shader: { newTwoColoredTextured: () => ({ bind: () => {}, setUniformi: () => {}, setUniform4x4f: () => {} }) },
    PolygonBatcher: class { begin() {} end() {} },
    SkeletonRenderer: class { draw() {} },
    Matrix4: class { values = [] }
  };
  const createRenderer = () => {
    const canvas = { width: 800, height: 600 };
    const renderer = new SpineRendererBase(canvas, mockSpine);
    renderer._skeletons = {
        '0': { 
            skeleton: { 
                slots: [
                    { attachment: { name: 'att1' }, data: { name: 'slot0' } },
                    { attachment: { name: 'att2' }, data: { name: 'slot1' } }
                ],
                setToSetupPose: vi.fn(),
                updateWorldTransform: vi.fn()
            },
            state: { apply: vi.fn() }
        }
    };
    return renderer;
  };
  describe('_toggleAttachment', () => {
    it('should add to cache when hidden', () => {
      const renderer = createRenderer();
      renderer._toggleAttachment('att1', 0, false, '0');
      expect(renderer._attachmentsCache['0##att1##0']).toBeDefined();
      expect(renderer._skeletons['0'].skeleton.slots[0].attachment).toBeNull();
    });
    it('should remove from cache when shown', () => {
      const renderer = createRenderer();
      renderer._attachmentsCache['0##att1##0'] = [0, 'att1', '0'];
      renderer._toggleAttachment('att1', 0, true, '0');
      expect(renderer._attachmentsCache['0##att1##0']).toBeUndefined();
      expect(renderer._skeletons['0'].skeleton.setToSetupPose).toHaveBeenCalled();
    });
  });
  describe('_syncAllHiddenAttachments', () => {
    it('should apply cache to skeleton slots', () => {
      const renderer = createRenderer();
      renderer._attachmentsCache['0##att1##0'] = [0, 'att1', '0'];
      renderer._syncAllHiddenAttachments();
      expect(renderer._skeletons['0'].skeleton.slots[0].attachment).toBeNull();
      expect(renderer._skeletons['0'].skeleton.slots[1].attachment).not.toBeNull();
    });
  });
});
