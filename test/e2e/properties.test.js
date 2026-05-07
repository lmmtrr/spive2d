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
    const live2dUrl = '/test-assets/live2d/Hiyori/Hiyori.model3.json';
    console.log('Loading Hiyori (Live2D)...');
    await page.goto(`http://localhost:1420/?model=${encodeURIComponent(live2dUrl)}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#canvasContainer canvas', { timeout: 10000 });
    await page.mouse.move(10, 400);
    await page.waitForSelector('#sidebar:not(.hidden)', { visible: true, timeout: 5000 });
    console.log('Testing Parameters (Sliders) state change...');
    await page.select('#propertySelector', 'parameters');
    await page.waitForSelector('#property input[type="range"]');
    const firstSlider = '#property input[type="range"]';
    const initialParamValue = await page.$eval(firstSlider, el => Number(el.value));
    const paramName = await page.$eval(firstSlider, el => el.dataset.name);
    await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        el.value = Number(el.max);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }, firstSlider);
    const paramStateValue = await page.evaluate((name) => {
        const renderer = window.__GET_RENDERER__();
        const item = renderer.getPropertyItems('parameters').find(i => i.name === name);
        return item ? item.value : null;
    }, paramName);
    if (paramStateValue === initialParamValue) throw new Error('Renderer parameter state did not change');
    console.log('Testing Parts (Checkboxes) state change...');
    await page.select('#propertySelector', 'parts');
    await page.waitForSelector('#property input[type="checkbox"]');
    const firstPart = '#property input[type="checkbox"]';
    const partName = await page.$eval(firstPart, el => el.dataset.name);
    const initialPartChecked = await page.$eval(firstPart, el => el.checked);
    await page.click(firstPart);
    await new Promise(r => setTimeout(r, 200));
    const partStateChecked = await page.evaluate((name) => {
        const renderer = window.__GET_RENDERER__();
        const item = renderer.getPropertyItems('parts').find(i => i.name === name);
        return item ? item.checked : null;
    }, partName);
    if (partStateChecked === initialPartChecked) throw new Error('Renderer part state did not change');
    console.log('Testing Drawables (Checkboxes) state change...');
    await page.select('#propertySelector', 'drawables');
    await page.waitForSelector('#property input[type="checkbox"]');
    const firstDrawable = '#property input[type="checkbox"]';
    const drawableName = await page.$eval(firstDrawable, el => el.dataset.name);
    const initialDrawableChecked = await page.$eval(firstDrawable, el => el.checked);
    await page.click(firstDrawable);
    await new Promise(r => setTimeout(r, 200));
    const drawableStateChecked = await page.evaluate((name) => {
        const renderer = window.__GET_RENDERER__();
        const item = renderer.getPropertyItems('drawables').find(i => i.name === name);
        return item ? item.checked : null;
    }, drawableName);
    if (drawableStateChecked === initialDrawableChecked) throw new Error('Renderer drawable state did not change');
    const spineUrl = '/test-assets/spine/spineboy42/spineboy.skel';
    console.log('Loading Spineboy (Spine)...');
    await page.goto(`http://localhost:1420/?model=${encodeURIComponent(spineUrl)}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#canvasContainer canvas', { timeout: 10000 });
    await page.mouse.move(10, 400);
    await page.waitForSelector('#sidebar:not(.hidden)', { visible: true, timeout: 5000 });
    console.log('Testing Skins state change...');
    await page.select('#propertySelector', 'skins');
    await page.waitForSelector('#property input[type="checkbox"]');
    const firstSkin = '#property input[type="checkbox"]';
    const skinName = await page.$eval(firstSkin, el => el.dataset.name);
    const initialSkinChecked = await page.$eval(firstSkin, el => el.checked);
    await page.click(firstSkin);
    await new Promise(r => setTimeout(r, 500));
    const skinStateChecked = await page.evaluate((name) => {
        const renderer = window.__GET_RENDERER__();
        const item = renderer.getPropertyItems('skins').find(i => i.name === name);
        return item ? item.checked : null;
    }, skinName);
    if (skinStateChecked === initialSkinChecked) throw new Error('Renderer skin state did not change');
    console.log('SUCCESS: All property category tests with state verification passed.');
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
