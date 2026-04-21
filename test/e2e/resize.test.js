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
    await page.setViewport({ width: 800, height: 600 });
    const modelUrl = '/test-assets/spine/spineboy42/spineboy.skel';
    const targetUrl = `http://localhost:1420/?model=${encodeURIComponent(modelUrl)}`;
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#canvasContainer canvas', { visible: true, timeout: 30000 });
    const getCanvasSize = async () => {
      return await page.evaluate(() => {
        const canvas = document.querySelector('#canvasContainer canvas');
        return { width: canvas.width, height: canvas.height, clientWidth: canvas.clientWidth, clientHeight: canvas.clientHeight };
      });
    };
    const size1 = await getCanvasSize();
    await page.setViewport({ width: 1200, height: 800 });
    await new Promise(r => setTimeout(r, 1000));
    const size2 = await getCanvasSize();
    if (size2.clientWidth <= size1.clientWidth || size2.clientHeight <= size1.clientHeight) throw new Error('Canvas did not resize');
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
