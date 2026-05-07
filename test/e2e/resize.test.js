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
        unregisterCallback: (id) => {},
        convertFileSrc: (src) => src,
      };
      window.__TAURI__ = { invoke: window.__TAURI_INTERNALS__.invoke };
    });
    const spineUrl = '/test-assets/spine/spineboy42/spineboy.skel';
    await page.goto(`http://localhost:1420/?model=${encodeURIComponent(spineUrl)}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#canvasContainer canvas', { visible: true });
    const getCanvasSize = async () => {
        return await page.$eval('#canvasContainer canvas', el => ({
            clientWidth: el.clientWidth,
            clientHeight: el.clientHeight
        }));
    };
    const size1 = await getCanvasSize();
    console.log('Initial size:', size1);
    await page.setViewport({ width: 1200, height: 800 });
    await new Promise(r => setTimeout(r, 1000));
    const size2 = await getCanvasSize();
    console.log('New size:', size2);
    if (size2.clientWidth <= size1.clientWidth || size2.clientHeight <= size1.clientHeight) {
        throw new Error('Canvas did not resize');
    }
    console.log('SUCCESS: Resize test passed.');
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
