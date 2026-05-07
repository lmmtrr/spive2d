import { spawnSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import http from 'http';
async function waitForServer(url, timeout = 60000) {
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
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('Server timeout: ' + url);
}
(async () => {
  console.log('--- Running Unit Tests ---');
  const unitResult = spawnSync('bun', ['run', 'test:unit'], { stdio: 'inherit', shell: true });
  if (unitResult.status !== 0) {
    console.error('\nUNIT TESTS FAILED. Aborting E2E tests.');
    process.exit(1);
  }
  console.log('UNIT TESTS PASSED\n');
  console.log('--- Starting Shared Server for E2E Tests ---');
  const serverProcess = spawn('bun', ['run', 'dev'], { shell: true, stdio: 'ignore' });
  try {
    await waitForServer('http://localhost:1420');
    console.log('Server is ready.\n');
    const e2eDir = './test/e2e';
    const files = fs.readdirSync(e2eDir).filter(f => f.endsWith('.test.js'));
    console.log(`Starting ${files.length} E2E tests...`);
    let failed = [];
    for (const file of files) {
      console.log(`\n--- Running ${file} ---`);
      const result = spawnSync('node', [path.join(e2eDir, file)], {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, SHARED_SERVER: 'true' }
      });
      if (result.status !== 0) {
        failed.push(file);
      }
    }
    console.log('\n--- E2E Test Summary ---');
    if (failed.length === 0) {
      console.log('ALL E2E TESTS PASSED');
    } else {
      console.error(`FAILED TESTS: ${failed.join(', ')}`);
      process.exitCode = 1;
    }
  } catch (e) {
    console.error('ERROR during E2E suite:', e);
    process.exitCode = 1;
  } finally {
    console.log('\n--- Stopping Shared Server ---');
    if (serverProcess.pid) {
      spawnSync('taskkill', ['/pid', serverProcess.pid, '/f', '/t'], { shell: true });
      serverProcess.kill();
    }
  }
})();
