import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import http from 'http';
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
    await page.evaluateOnNewDocument(() => {
      window.__TAURI_INTERNALS__ = {
        invoke: async (cmd, args) => {
          if (cmd === 'plugin:path|get_download_dir') return '/mock/downloads';
          if (cmd === 'plugin:path|join') return args.paths.join('/');
          return;
        },
        metadata: { permissions: {} },
        transformCallback: (id) => id,
        unregisterCallback: (id) => {},
        convertFileSrc: (src) => src,
      };
      window.__TAURI__ = { invoke: window.__TAURI_INTERNALS__.invoke };
    });
    await page.setViewport({ width: 1200, height: 800 });
    const modelUrl = '/test-assets/spine/spineboy42/spineboy.skel';
    const targetUrl = `http://localhost:1420/?model=${encodeURIComponent(modelUrl)}`;
    console.log('Navigating to model...');
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    console.log('Triggering sidebar visibility...');
    await page.mouse.move(10, 400);
    await page.waitForSelector('#sidebar:not(.hidden)', { visible: true, timeout: 5000 });
    await page.waitForSelector('#property .item input[type="checkbox"]', { timeout: 10000 });
    const checkboxSelector = '#property .item input[type="checkbox"]';
    const initialChecked = await page.$eval(checkboxSelector, el => el.checked);
    console.log('Toggling attachment checkbox...');
    await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    }, checkboxSelector);
    const newChecked = await page.$eval(checkboxSelector, el => el.checked);
    if (initialChecked === newChecked) throw new Error('Checkbox failed to toggle');
    console.log('Verifying attachment cache in export data...');
    const exportData = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const originalPostMessage = Worker.prototype.postMessage;
        Worker.prototype.postMessage = function (data, transfer) {
          if (data && data.type === 'START_VIDEO') {
            Worker.prototype.postMessage = originalPostMessage;
            resolve(data);
          }
          return originalPostMessage.apply(this, [data, transfer]);
        };
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
      });
    });
    const attachmentsCache = exportData.syncState.attachmentsCache;
    const cacheKeys = Object.keys(attachmentsCache || {});
    if (cacheKeys.length === 0) throw new Error('attachmentsCache is empty');
    console.log('SUCCESS: Attachment visibility and export state verified.');
  } catch (e) {
    console.error('E2E ERROR:', e);
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
