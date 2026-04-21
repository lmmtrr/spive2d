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
  const serverProcess = spawn('bun', ['run', 'dev'], { shell: true, stdio: 'ignore' });
  let browser;
  try {
    await waitForServer('http://localhost:1420');
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.evaluateOnNewDocument(() => {
      window.__TAURI_INTERNALS__ = {
        invoke: async (cmd, args) => {
          if (cmd === 'plugin:fs|write_file') return;
          if (cmd === 'plugin:fs|mkdir') return;
          if (cmd === 'plugin:fs|exists') return false;
          if (cmd === 'plugin:path|get_download_dir') return '/mock/downloads';
          if (cmd === 'plugin:path|join') return args.paths.join('/');
          return;
        },
        metadata: {
          permissions: {
            'fs:allow-write': true,
            'fs:allow-mkdir': true,
            'fs:allow-exists': true,
            'path:allow-get-download-dir': true
          }
        }
      };
      window.__TAURI__ = window.__TAURI__ || {};
      window.__TAURI__.invoke = window.__TAURI_INTERNALS__.invoke;
    });
    const modelUrl = '/test-assets/spine/spineboy42/spineboy.skel';
    const targetUrl = `http://localhost:1420/?model=${encodeURIComponent(modelUrl)}`;
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#canvasContainer canvas', { visible: true });
    await page.keyboard.press('e');
    await page.waitForSelector('.export-queue .queue-item', { visible: true, timeout: 10000 });
    await page.click('.queue-close');
    await new Promise(r => setTimeout(r, 1000));
    await page.keyboard.press('c');
    await page.waitForSelector('.export-queue .queue-item', { visible: true, timeout: 10000 });
    const typeLabel = await page.$eval('.queue-title', el => el.textContent);
    if (typeLabel.includes('Video')) {
      try {
        await page.waitForSelector('.queue-item.status-completed', { timeout: 60000 });
      } catch (e) {
        const status = await page.$eval('.queue-item', el => el.className);
        throw new Error(`Animation export failed. Status: ${status}`);
      }
    } else {
      throw new Error('Animation export item did not appear');
    }
  } catch (e) {
    console.error('E2E ERROR:', e);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    if (serverProcess.pid) {
      spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t'], { shell: true, stdio: 'ignore' });
      serverProcess.kill();
    }
    process.exit(0);
  }
})();
