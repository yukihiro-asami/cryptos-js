import { readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const timeoutArgument = process.argv.find(arg => arg.startsWith('--timeout-ms='));
const timeoutOverride = timeoutArgument ? Number(timeoutArgument.split('=')[1]) : undefined;
if (timeoutOverride !== undefined && (!Number.isSafeInteger(timeoutOverride) || timeoutOverride <= 0)) {
  throw new Error('Invalid --timeout-ms');
}
const outputArgument = process.argv.find(arg => arg.startsWith('--output='));
const outputPath = outputArgument?.slice('--output='.length);
const manifest = JSON.parse(await readFile(new URL('docs/source-manifest.json', root), 'utf8'));
const longTest = 'tests/curve25519/fe25519/Fe25519InvertTest/test-03.js';
const started = performance.now();

function runTest(path, timeoutMs) {
  return new Promise(resolve => {
    const start = performance.now();
    let output = '', error, timedOut = false;
    const child = spawn(process.execPath, [
      '--import', fileURLToPath(new URL('scripts/reference-assert-guard.mjs', root)),
      fileURLToPath(new URL(path, root)),
    ], { cwd: fileURLToPath(root), stdio: ['ignore', 'pipe', 'pipe'] });
    const timer = setTimeout(() => { timedOut = true; child.kill('SIGKILL'); }, timeoutMs);
    const collect = chunk => {
      output += chunk;
      if (path === longTest) process.stderr.write(chunk);
      if (output.length > 1024 * 1024) {
        error = 'Test output exceeded 1 MiB';
        output = output.slice(-1024 * 1024);
        child.kill('SIGKILL');
      }
    };
    child.stdout.setEncoding('utf8').on('data', collect);
    child.stderr.setEncoding('utf8').on('data', collect);
    child.on('error', cause => { error = cause.message; });
    child.on('close', (exitCode, signal) => {
      clearTimeout(timer);
      const passed = exitCode === 0 && !error && !timedOut && !/FAILED|Assertion failed/i.test(output);
      resolve({ path, passed, exitCode, durationMs: performance.now() - start, timeoutMs,
        ...(signal ? { signal } : {}), ...(timedOut ? { timedOut } : {}),
        ...(error ? { error } : {}),
        ...(!passed || path === longTest ? { output: output.slice(-12000) } : {}) });
    });
  });
}

const results = [];
const candidates = manifest.files.filter(item => item.path.startsWith('tests/'));
for (const item of candidates) {
  const timeoutMs = timeoutOverride ?? (item.path === longTest ? 600000 : 15000);
  if (item.path === longTest) console.error(`Starting 1,000,000-case inverse test (limit ${timeoutMs} ms)`);
  const result = await runTest(item.path, timeoutMs);
  results.push(result);
  if (!result.passed) console.error(`FAILED ${item.path}`);
  else if (results.length % 25 === 0) console.error(`Reference tests: ${results.length}/${candidates.length}`);
}
const failed = results.filter(item => !item.passed).length;
const report = { node: process.version, platform: process.platform, arch: process.arch,
  total: results.length, passed: results.length - failed, failed,
  durationMs: performance.now() - started, results };
if (outputPath) {
  await writeFile(outputPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ ...report, results: undefined }));
} else {
  console.log(JSON.stringify(report, null, 2));
}
if (failed) process.exitCode = 1;
