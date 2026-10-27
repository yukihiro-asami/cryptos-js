import test from 'node:test';
import assert from 'node:assert/strict';
import { ge25519FromBytes } from '../src/curve25519/ge25519/ge25519-from-bytes.js';
import { ge25519FromBytesNegateVartime } from '../src/curve25519/ge25519/ge25519-from-bytes-negate-vartime.js';
import { ge25519P3 } from '../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3ToBytes } from '../src/curve25519/ge25519/ge25519-p3-to-bytes.js';
import { verifyDetached } from '../src/curve25519/ed25519/verify-detached.js';

const P = (1n << 255n) - 19n;
const encode = (y, sign) => {
  const bytes = Uint8Array.from({ length: 32 }, (_, i) => Number((y >> BigInt(8 * i)) & 255n));
  bytes[31] |= sign << 7;
  return bytes;
};
const mod = x => ((x % P) + P) % P;
const decoders = [ge25519FromBytes, ge25519FromBytesNegateVartime];
const invalid = [encode(1n, 1), encode(P - 1n, 1)];
for (const y of [P, P + 1n, (1n << 255n) - 1n]) {
  for (const sign of [0, 1]) invalid.push(encode(y, sign));
}

test('RFC 8032 decoding: x=0/sign=1 and y>=p are rejected by both decoders', () => {
  for (const decode of decoders) for (const bytes of invalid) {
    assert.equal(decode(ge25519P3(), bytes), -1, `${decode.name}: ${Buffer.from(bytes).toString('hex')}`);
  }
});

test('valid boundary points: y=±1/sign=0 and y=0 with either sign decode correctly', () => {
  for (const decode of decoders) for (const [y, sign] of [[1n, 0], [P - 1n, 0], [0n, 0], [0n, 1]]) {
    const point = ge25519P3();
    assert.equal(decode(point, encode(y, sign)), 0);
    assert.equal(mod(point.Y.value), y);
    if (y !== 0n) assert.equal(mod(point.X.value), 0n);
    else assert.equal(Number(mod(point.X.value) & 1n), decode === ge25519FromBytes ? sign : 1 - sign);
  }
});

test('negating decode returns (-x,y); serialization flips the base-point sign and preserves the 64-byte caller', () => {
  const base = Uint8Array.from(Buffer.from('58' + '66'.repeat(31), 'hex'));
  for (const sign of [0, 1]) {
    const bytes = base.slice(); bytes[31] = (bytes[31] & 127) | sign << 7;
    const ordinary = ge25519P3(), negated = ge25519P3();
    assert.equal(ge25519FromBytes(ordinary, bytes), 0);
    assert.equal(ge25519FromBytesNegateVartime(negated, bytes), 0);
    assert.equal(mod(ordinary.X.value + negated.X.value), 0n);
    assert.equal(mod(ordinary.Y.value - negated.Y.value), 0n);
    const encoded = new Uint8Array(32);
    ge25519P3ToBytes(encoded, negated);
    const expected = bytes.slice(); expected[31] ^= 128;
    assert.deepEqual(encoded, expected);
    // verifyDetached passes a whole 64-byte signature to the ordinary decoder.
    const wholeSignature = new Uint8Array(64); wholeSignature.set(bytes); wholeSignature.fill(0xa5, 32);
    const fromSignature = ge25519P3();
    assert.equal(ge25519FromBytes(fromSignature, wholeSignature), 0);
    ge25519P3ToBytes(encoded, fromSignature);
    assert.deepEqual(encoded, bytes);
  }
});

test('signature entry rejects invalid public keys and invalid R encodings', () => {
  // RFC 8032 §7.1, test 1 (empty message).
  const pk = Uint8Array.from(Buffer.from('d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a', 'hex'));
  const signature = Uint8Array.from(Buffer.from(
    'e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555f' +
    'b8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b', 'hex'));
  const message = new Uint8Array(0);
  assert.equal(verifyDetached(signature, message, pk), 0);
  for (const bytes of invalid) {
    assert.equal(verifyDetached(signature, message, bytes), -1);
    const altered = signature.slice(); altered.set(bytes, 0);
    assert.equal(verifyDetached(altered, message, pk), -1);
  }
});
