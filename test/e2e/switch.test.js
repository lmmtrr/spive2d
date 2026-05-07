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
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    await page.setViewport({ width: 1200, height: 800 });
    const spineUrl = '/test-assets/spine/spineboy42/spineboy.skel';
    const live2dUrl = '/test-assets/live2d/Hiyori/Hiyori.model3.json';
    console.log('Loading Spine model...');
    await page.goto(`http://localhost:1420/?model=${encodeURIComponent(spineUrl)}`, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => window.__APP_STATE__ && window.__APP_STATE__.initialized, { timeout: 10000 });
    await page.mouse.move(10, 400);
    await page.waitForSelector('#sidebar:not(.hidden)', { visible: true, timeout: 5000 });
    await page.waitForSelector('#propertySelector', { visible: true, timeout: 15000 });
    let options = await page.$$eval('#propertySelector option', opts => opts.map(o => o.value));
    if (!options.includes('attachments')) throw new Error('Spine load failed: "attachments" category not found');
    console.log('Switching to Live2D model...');
    await page.goto(`http://localhost:1420/?model=${encodeURIComponent(live2dUrl)}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#canvasContainer canvas', { visible: true });
    await page.mouse.move(10, 400);
    await page.waitForSelector('#sidebar:not(.hidden)', { visible: true, timeout: 5000 });
    await new Promise(r => setTimeout(r, 2000));
    options = await page.$$eval('#propertySelector option', opts => opts.map(o => o.value));
    if (options.includes('attachments') || !options.includes('parameters')) throw new Error('Live2D switch failed: category list not updated correctly');
    console.log('SUCCESS: Model switching and property category updates verified.');
  } catch (e) {
    console.error('E2E ERROR:', e.message);
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
