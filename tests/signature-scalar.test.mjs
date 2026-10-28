import test from 'node:test';
import assert from 'node:assert/strict';
import { createPublicKey, verify } from 'node:crypto';
import { verifyDetached } from '../src/curve25519/ed25519/verify-detached.js';
import { L } from '../src/curve25519/const.js';

// RFC 8032 §7.1, test 1; only public data is used.
const pk = Buffer.from('d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a', 'hex');
const signature = Buffer.from(
  'e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555f' +
  'b8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b', 'hex');
const message = new Uint8Array(0);
const publicKey = createPublicKey({
  key: Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), pk]),
  format: 'der', type: 'spki',
});
let originalS = 0n;
for (let i = 0; i < 32; i++) originalS |= BigInt(signature[32 + i]) << BigInt(8 * i);
const withS = s => {
  const result = Buffer.from(signature);
  for (let i = 0; i < 32; i++) result[32 + i] = Number((s >> BigInt(8 * i)) & 255n);
  return result;
};

test('Ed25519: reject equivalent S+nL encodings without discarding bit 255', () => {
  assert.equal(verifyDetached(signature, message, pk), 0);
  assert.equal(verify(null, message, publicKey, signature), true);
  for (const n of [1n, 2n, 4n, 8n, 9n, 15n]) {
    const s = originalS + n * L;
    assert.ok(s >= L && s < (1n << 256n));
    const altered = withS(s);
    assert.equal(verify(null, message, publicKey, altered), false);
    assert.equal(verifyDetached(altered, message, pk), -1, `S + ${n}L must be rejected`);
  }
});

test('Ed25519: reject scalar range boundaries and top-bit variants', () => {
  for (const s of [L, L + 1n, 1n << 255n, originalS | (1n << 255n), (1n << 256n) - 1n]) {
    const altered = withS(s);
    assert.equal(verify(null, message, publicKey, altered), false);
    assert.equal(verifyDetached(altered, message, pk), -1, `out-of-range S: ${s}`);
  }
  for (const s of [0n, L - 1n]) {
    const altered = withS(s);
    // In range does not make the scalar a valid signature for this R/message.
    assert.equal(verifyDetached(altered, message, pk) === 0, verify(null, message, publicKey, altered));
  }
});
