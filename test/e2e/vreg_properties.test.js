import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
const OUTPUT_DIR = './test/e2e/diffs';
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
async function waitForServer(url, timeout = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => resolve(res));
        req.on('error', (err) => reject(err));
        req.end();
      });
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  throw new Error('Server timeout: ' + url);
}
async function compareAndSave(img1Path, img2Path, diffPath) {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  return numDiffPixels;
}
(async () => {
  let serverProcess;
  if (!process.env.SHARED_SERVER) {
    serverProcess = spawn('bun', ['run', 'dev'], { shell: true, stdio: 'ignore' });
    await waitForServer('http://localhost:1420').catch(err => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
  }
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    await page.evaluateOnNewDocument(() => {
      window.__TAURI_INTERNALS__ = {
        invoke: async (cmd, args) => {
          if (cmd === 'plugin:path|get_download_dir') return '/mock/downloads';
          if (cmd === 'plugin:path|join') return args.paths.join('/');
          return;
        },
        metadata: { permissions: {} },
        transformCallback: (id) => id,
        unregisterCallback: (id) => { },
        convertFileSrc: (src) => src,
      };
      window.__TAURI__ = { invoke: window.__TAURI_INTERNALS__.invoke };
    });
    const live2dUrl = '/test-assets/live2d/Hiyori/Hiyori.model3.json';
    const spineUrl = '/test-assets/spine/spineboy42/spineboy.skel';
    const mixMatchUrl = '/test-assets/spine/mix-and-match42/mix-and-match.skel';
    const testVisualChange = async (modelUrl, category, selector, action) => {
      console.log(`--- Testing visual change for: ${category} ---`);
      await page.goto(`http://localhost:1420/?model=${encodeURIComponent(modelUrl)}`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('#canvasContainer canvas', { timeout: 15000 });
      await page.evaluate(() => {
        if (window.__APP_STATE__) {
          window.__APP_STATE__.animation.paused = true;
          window.__APP_STATE__.animation.seekProgress = 0;
        }
        if (window.__GET_RENDERER__) {
          const r = window.__GET_RENDERER__();
          r?.seekAnimation?.(0);
          r?.render?.();
        }
      });
      await new Promise(r => setTimeout(r, 2000));
      await page.mouse.move(10, 400);
      await page.waitForSelector('#sidebar:not(.hidden)', { visible: true, timeout: 5000 });
      const isAvailable = await page.evaluate((cat) => {
        const options = Array.from(document.querySelectorAll('#propertySelector option')).map(o => o.value);
        return options.includes(cat);
      }, category);
      if (!isAvailable) {
        console.log(`Category ${category} not available for this model. Skipping.`);
        return;
      }
      const beforeImg = path.join(OUTPUT_DIR, `${category}_before.png`);
      const afterImg = path.join(OUTPUT_DIR, `${category}_after.png`);
      const diffImg = path.join(OUTPUT_DIR, `${category}_diff.png`);
      await page.mouse.move(400, 300);
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: beforeImg });
      await page.mouse.move(10, 400);
      await page.waitForSelector('#sidebar:not(.hidden)', { visible: true, timeout: 5000 });
      console.log(`Switching to category: ${category}`);
      await page.select('#propertySelector', category);
      if (category === 'skins') {
        await page.waitForSelector('#skin-panel', { timeout: 5000 });
      } else {
        await page.waitForFunction((cat) => {
          const panel = document.querySelector('#skin-panel');
          return !panel;
        }, { timeout: 5000 }, category);
      }
      await page.waitForSelector(selector, { timeout: 5000 });
      console.log(`Performing action for ${category}...`);
      await action();
      await page.evaluate(() => {
        window.__GET_RENDERER__?.()?.render?.();
      });
      await new Promise(r => setTimeout(r, 1500));
      await page.mouse.move(400, 300);
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: afterImg });
      const diff = await compareAndSave(beforeImg, afterImg, diffImg);
      console.log(`Visual difference for ${category}: ${diff} pixels. Images saved to ${OUTPUT_DIR}`);
      if (diff < 10) {
        console.error(`FAILED: No visual change detected for ${category}.`);
        throw new Error(`Visual regression failed: No visual change detected for ${category} (${diff} pixels)`);
      } else {
        console.log(`SUCCESS: Visual change detected for ${category}.`);
      }
    };
    await testVisualChange(live2dUrl, 'parameters', '#property input[type="range"]', async () => {
      await page.evaluate(() => {
        const el = document.querySelector('#property input[type="range"]');
        if (el) {
          el.value = el.max;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    });
    await testVisualChange(live2dUrl, 'parts', '#property input[type="checkbox"]', async () => {
      await page.evaluate(() => {
        const el = document.querySelector('#property input[type="checkbox"]');
        if (el) el.click();
      });
    });
    await testVisualChange(live2dUrl, 'drawables', '#property input[type="checkbox"]', async () => {
      await page.evaluate(() => {
        const checkboxes = document.querySelectorAll('#property input[type="checkbox"]');
        for (let i = 0; i < Math.min(10, checkboxes.length); i++) {
          checkboxes[i].click();
        }
      });
    });
    await testVisualChange(spineUrl, 'attachments', '#property input[type="checkbox"]', async () => {
      await page.evaluate(() => {
        const el = document.querySelector('#property input[type="checkbox"]');
        if (el) el.click();
      });
    });
    await testVisualChange(mixMatchUrl, 'skins', '#skin-panel input[type="checkbox"]', async () => {
      await page.evaluate(() => {
        const checkboxes = document.querySelectorAll('#skin-panel input[type="checkbox"]');
        for (let i = 0; i < Math.min(5, checkboxes.length); i++) {
          checkboxes[i].click();
        }
      });
    });
    console.log('\nSUCCESS: All property visual regression tests passed.');
  } catch (e) {
    console.error('\nVREG ERROR:', e.message || e);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    if (serverProcess && serverProcess.pid) {
      spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t'], { shell: true, stdio: 'ignore' });
      serverProcess.kill();
    }
    process.exit(0);
  }
})();
