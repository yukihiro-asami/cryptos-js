import assert from 'node:assert/strict';
import { ge25519P2 } from '../../../../src/curve25519/ge25519/ge25519-p2.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P2ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p2-to-p3.js';
import { P, ED25519_BASE_X, ED25519_BASE_Y } from '../../../../src/curve25519/const.js';

const mod = x => ((x % P) + P) % P;
const p = ge25519P2(), r = ge25519P3();
// A real curve point with Z != 1, rather than fixed expectations for bad coordinates.
p.X.value = mod(7n * ED25519_BASE_X);
p.Y.value = mod(7n * ED25519_BASE_Y);
p.Z.value = 7n;
ge25519P2ToP3(r, p);

assert.notEqual(mod(r.Z.value), 0n);
assert.equal(mod(r.X.value * p.Z.value - p.X.value * r.Z.value), 0n);
assert.equal(mod(r.Y.value * p.Z.value - p.Y.value * r.Z.value), 0n);
assert.equal(mod(r.X.value * r.Y.value - r.Z.value * r.T.value), 0n);
for (const coord of ['X', 'Y', 'Z', 'T']) assert.equal(typeof r[coord].value, 'bigint');
console.log('tests_passed.');
