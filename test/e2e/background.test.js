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
    await waitForServer('http://localhost:1420');
  }
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
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
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('spive2d_bg_color', 'rgb(255, 0, 0)');
    });
    const spineUrl = '/test-assets/spine/spineboy42/spineboy.skel';
    await page.goto(`http://localhost:1420/?model=${encodeURIComponent(spineUrl)}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#canvasContainer canvas', { visible: true, timeout: 10000 });
    const bodyBg = await page.evaluate(() => document.body.style.backgroundColor);
    if (!bodyBg.includes('rgb(255, 0, 0)')) throw new Error('Background color not applied');
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
    if (!exportData.bgColor.includes('rgb(255, 0, 0)')) throw new Error('Background color not in export payload');
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
