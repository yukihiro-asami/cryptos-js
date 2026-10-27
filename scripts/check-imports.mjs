import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('docs/source-manifest.json', root), 'utf8'));
const changeLog = JSON.parse(await readFile(new URL('docs/source-changes.json', root), 'utf8'));
const originals = new Map(manifest.files.map(item => [item.path, item]));
const changes = new Map();
for (const change of changeLog.files) {
  assert.ok(originals.has(change.path), `Unknown original: ${change.path}`);
  assert.ok(!changes.has(change.path), `Duplicate change: ${change.path}`);
  assert.equal(change.originalSha256, originals.get(change.path).sha256, change.path);
  assert.match(change.currentSha256, /^[a-f0-9]{64}$/);
  assert.notEqual(change.currentSha256, change.originalSha256, change.path);
  assert.ok(change.reason?.trim(), `Missing change reason: ${change.path}`);
  changes.set(change.path, change);
}
let imports = 0;
for (const item of manifest.files) {
  const url = new URL(item.path, root);
  const bytes = await readFile(url);
  const expected = changes.get(item.path)?.currentSha256 ?? item.sha256;
  assert.equal(createHash('sha256').update(bytes).digest('hex'), expected, item.path);
  for (const match of bytes.toString().matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)) {
    const specifier = match[1];
    if (specifier.startsWith('.')) {
      const target = new URL(specifier, url);
      assert.ok(target.href.startsWith(root.href), `External path: ${target}`);
      assert.ok((await stat(target)).isFile(), `Missing dependency: ${target}`);
      imports++;
    } else {
      assert.ok(item.path.startsWith('tests/'), `Runtime package dependency: ${specifier}`);
      assert.ok(['assert', 'node:assert', 'node:assert/strict', 'crypto', 'node:crypto'].includes(specifier));
    }
  }
}
console.log(JSON.stringify({ filesVerified: manifest.files.length,
  originalMatches: manifest.files.length - changes.size, recordedChanges: changes.size,
  localImportsResolved: imports }));
