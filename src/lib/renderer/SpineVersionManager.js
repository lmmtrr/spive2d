import { showNotification } from '../notificationStore.svelte.js';
import { convertFileSrc } from '@tauri-apps/api/core';

const SPINE_VERSIONS = ['3.6', '3.7', '3.8', '4.0', '4.1', '4.2'];
const spineLibs = {};
let initPromise = null;

export class SpineVersionManager {
  static async init() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
      if (Object.keys(spineLibs).length === SPINE_VERSIONS.length) return;
      for (const version of SPINE_VERSIONS) {
        if (spineLibs[version]) continue;
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = `lib/spine-webgl-${version}.js`;
          script.onload = () => {
            if (version[0] === '3' && window.spine.webgl) {
              Object.assign(window.spine, window.spine.webgl);
            }
            spineLibs[version] = window.spine;
            window.spine = undefined;
            script.remove();
            resolve();
          };
          document.head.appendChild(script);
        });
      }
    })();
    return initPromise;
  }

  static getLib(version) {
    return spineLibs[version];
  }

  static async detectVersion(dirName, scene) {
    let baseName = scene.name;
    if (scene.isMerged && scene.files.length > 0) {
      baseName = scene.files[0];
    }
    const rawUrl = `${dirName}${baseName}${scene.mainExt}`;
    const url = /^https?:\/\//.test(rawUrl) ? rawUrl : convertFileSrc(rawUrl);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        showNotification(`HTTP ${response.status}`, 'error');
        throw new Error(`HTTP ${response.status}`);
      }
      const buffer = await response.arrayBuffer();
      const data = new Uint8Array(buffer);
      const head = data.subarray(0, 100);
      const firstIdx = head.findIndex(c => ![32, 9, 10, 13].includes(c));
      const isJson = head[firstIdx] === 123 &&
        !head.subarray(firstIdx + 1).some(c => c === 0 || (c < 9) || (c > 13 && c < 32));
      if (isJson) {
        const content = new TextDecoder().decode(data).replace(/,(\s*[}\]])/g, '$1');
        const jsonData = JSON.parse(content);
        if (!jsonData.skeleton?.spine) {
          showNotification('Invalid JSON structure', 'error');
          throw new Error('Invalid JSON structure');
        }
        return { version: jsonData.skeleton.spine.substring(0, 3), isJson: true };
      } else {
        const versionMatch = new TextDecoder().decode(data.subarray(0, 256)).match(/\d\.\d/);
        if (!versionMatch) {
          showNotification('Valid version pattern not found in binary file', 'error');
          throw new Error('Valid version pattern not found in binary file');
        }
        return { version: versionMatch[0], isJson: false };
      }
    } catch (err) {
      console.error('Spine version detection failed:', err);
      throw err;
    }
  }
}

if (typeof document !== 'undefined') {
  SpineVersionManager.init();
}
