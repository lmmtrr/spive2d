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
    await page.setViewport({ width: 1200, height: 800 });
    const modelUrl = '/test-assets/spine/spineboy42/spineboy.skel';
    const targetUrl = `http://localhost:1420/?model=${encodeURIComponent(modelUrl)}`;
    console.log('Navigating to model...');
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    console.log('Triggering sidebar/controller visibility...');
    await page.mouse.move(640, 750);
    await page.waitForSelector('.speed-slider', { visible: true, timeout: 5000 });
    console.log('Updating playback speed...');
    await page.evaluate(() => {
      const slider = document.querySelector('.speed-slider');
      slider.value = 2.0;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
      slider.dispatchEvent(new Event('change', { bubbles: true }));
    });
    const newSpeed = await page.$eval('.speed-slider', el => el.value);
    const speedLabel = await page.$eval('.speed-label', el => el.textContent);
    console.log('Verifying playback speed:', newSpeed, speedLabel);
    if (newSpeed !== '2' || !speedLabel.includes('2.0x')) throw new Error('Playback speed did not update');
    console.log('SUCCESS: Playback controller and speed updates verified.');
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
