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
          if (cmd === 'plugin:path|get_download_dir') return '/mock/downloads';
          if (cmd === 'plugin:path|join') return args.paths.join('/');
          return;
        },
        metadata: { permissions: {} }
      };
    });
    const modelUrl = '/test-assets/live2d/Hiyori/Hiyori.model3.json';
    const targetUrl = `http://localhost:1420/?model=${encodeURIComponent(modelUrl)}`;
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#canvasContainer canvas', { visible: true });
    await new Promise(r => setTimeout(r, 2000));
    await page.keyboard.press('e');
    await page.waitForSelector('.export-queue .queue-item', { visible: true, timeout: 10000 });
    const title = await page.$eval('.queue-title', el => el.textContent);
    if (!title.includes('Image')) throw new Error('Live2D export failed');
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
