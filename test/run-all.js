import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('--- Running Unit Tests ---');
const unitResult = spawnSync('bun', ['run', 'test:unit'], { stdio: 'inherit', shell: true });
if (unitResult.status !== 0) {
  console.error('\nUNIT TESTS FAILED. Aborting E2E tests.');
  process.exit(1);
}
console.log('UNIT TESTS PASSED\n');

const e2eDir = './test/e2e';
const files = fs.readdirSync(e2eDir).filter(f => f.endsWith('.test.js'));
console.log(`Starting ${files.length} E2E tests...`);
let failed = [];
files.forEach(file => {
  console.log(`\n--- Running ${file} ---`);
  const result = spawnSync('node', [path.join(e2eDir, file)], { stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    failed.push(file);
  }
});
console.log('\n--- E2E Test Summary ---');
if (failed.length === 0) {
  console.log('ALL E2E TESTS PASSED');
} else {
  console.error(`FAILED TESTS: ${failed.join(', ')}`);
  process.exit(1);
}
