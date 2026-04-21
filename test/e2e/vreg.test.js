import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const BASELINE_DIR = './test/e2e/baselines';
const DIFF_DIR = './test/e2e/diffs';
const PORT = 1420;
const URL = `http://localhost:${PORT}`;
if (!fs.existsSync(BASELINE_DIR)) fs.mkdirSync(BASELINE_DIR, { recursive: true });
if (!fs.existsSync(DIFF_DIR)) fs.mkdirSync(DIFF_DIR, { recursive: true });

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
  throw new Error('Server timeout: could not reach ' + url);
}

async function runVisualTest(models, updateBaselines = false) {
  const serverProcess = spawn('bun', ['run', 'dev'], { shell: true, stdio: 'ignore' });
  let browser;
  try {
    await waitForServer(URL);
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });
    for (const model of models) {
      const name = model.name;
      const modelUrl = model.url;
      const targetUrl = `${URL}/?model=${encodeURIComponent(modelUrl)}`;
      console.log(`Testing model: ${name}...`);
      await page.goto(targetUrl, { waitUntil: 'networkidle0' });
      await page.waitForSelector('#canvasContainer canvas', { visible: true });
      await new Promise(r => setTimeout(r, 1000));
      await page.evaluate(() => {
        if (window.__APP_STATE__) {
          window.__APP_STATE__.animation.paused = true;
          window.__APP_STATE__.animation.seekProgress = 0;
        }
      });
      await new Promise(r => setTimeout(r, 1000));
      const screenshotPath = `temp_${name}.png`;
      await page.screenshot({ path: screenshotPath });
      const baselinePath = path.join(BASELINE_DIR, `${name}.png`);
      const diffPath = path.join(DIFF_DIR, `${name}.png`);
      if (updateBaselines || !fs.existsSync(baselinePath)) {
        console.log(`Saving baseline for ${name}...`);
        fs.renameSync(screenshotPath, baselinePath);
        continue;
      }
      const img1 = PNG.sync.read(fs.readFileSync(baselinePath));
      const img2 = PNG.sync.read(fs.readFileSync(screenshotPath));
      const { width, height } = img1;
      const diff = new PNG({ width, height });
      const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
        threshold: 0.1,
        includeAA: true
      });
      const threshold = (width * height) * 0.001;
      if (numDiffPixels > threshold) {
        console.error(`FAILURE: ${name} visual mismatch! Pixels changed: ${numDiffPixels} (threshold: ${Math.round(threshold)})`);
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
        process.exitCode = 1;
      } else {
        console.log(`SUCCESS: ${name} visual match (Diff: ${numDiffPixels} pixels).`);
      }
      fs.unlinkSync(screenshotPath);
    }
  } catch (e) {
    console.error('VISUAL TEST ERROR:', e);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (serverProcess.pid) {
      spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t'], { shell: true, stdio: 'ignore' });
      serverProcess.kill();
    }
  }
}

const modelsToTest = [
  { name: 'spineboy', url: '/test-assets/spine/spineboy42/spineboy.skel' },
  { name: 'hiyori', url: '/test-assets/live2d/Hiyori/Hiyori.model3.json' }
];
const update = process.argv.includes('--update');
runVisualTest(modelsToTest, update);
