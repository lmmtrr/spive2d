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
    page.on('console', msg => console.log('BROWSER:', msg.text()));
    await page.setViewport({ width: 1200, height: 800 });
    const spineUrl = '/test-assets/spine/spineboy42/spineboy.skel';
    const live2dUrl = '/test-assets/live2d/Hiyori/Hiyori.model3.json';
    await page.goto(`http://localhost:1420/?model=${encodeURIComponent(spineUrl)}`, { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => window.__APP_STATE__ && window.__APP_STATE__.initialized, { timeout: 30000 });
    await page.click('body');
    await page.keyboard.press('r');
    await page.waitForSelector('#propertySelector', { visible: true, timeout: 15000 });
    let options = await page.$$eval('#propertySelector option', opts => opts.map(o => o.value));
    if (!options.includes('attachments')) throw new Error('Spine load failed');
    await page.goto(`http://localhost:1420/?model=${encodeURIComponent(live2dUrl)}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#canvasContainer canvas', { visible: true });
    await new Promise(r => setTimeout(r, 2000));
    options = await page.$$eval('#propertySelector option', opts => opts.map(o => o.value));
    if (options.includes('attachments') || !options.includes('parameters')) throw new Error('Live2D switch failed');
  } catch (e) {
    await page.screenshot({ path: 'error_switch.png' });
    console.error('E2E ERROR:', e.message);
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
