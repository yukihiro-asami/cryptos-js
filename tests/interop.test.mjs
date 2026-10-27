import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, createHmac, hkdfSync, createPrivateKey, createPublicKey,
  sign, verify, diffieHellman, createCipheriv } from 'node:crypto';
import { keyPair } from '../src/curve25519/ed25519/key-pair.js';
import { signDetached } from '../src/curve25519/ed25519/sign-detached.js';
import { verifyDetached } from '../src/curve25519/ed25519/verify-detached.js';
import { scalarmultCurve25519 } from '../src/curve25519/x25519/scalarmult-curve25519.js';
import { scalarmultCurve25519Base } from '../src/curve25519/x25519/scalarmult-curve25519-base.js';
import { sha512 } from '../src/crypto/sha512/sha512.js';
import { hkdfSha512Extract } from '../src/crypto/sha512/hkdf-sha512-extract.js';
import { hkdfSha512Expand } from '../src/crypto/sha512/hkdf-sha512-expand.js';
import { chacha20poly1305Encrypt } from '../src/crypto/chacha20poly1305/chacha20poly1305-encrypt.js';
import { chacha20poly1305Decrypt } from '../src/crypto/chacha20poly1305/chacha20poly1305-decrypt.js';

// Deterministic, non-secret test data. These are not production keys.
const bytes = (length, offset = 0) => Uint8Array.from({ length }, (_, i) => (i * 37 + offset) & 255);
const equal = (actual, expected) => assert.deepEqual(Buffer.from(actual), Buffer.from(expected));
const privateKey = (seed, oid) => createPrivateKey({ format: 'der', type: 'pkcs8',
  key: Buffer.concat([Buffer.from(`302e020100300506032b65${oid}04220420`, 'hex'), seed]) });
const publicBytes = key => createPublicKey(key).export({ format: 'der', type: 'spki' }).subarray(-32);
const fromLE = value => value.reduceRight((n, b) => (n << 8n) | BigInt(b), 0n);
const toLE = value => Uint8Array.from({ length: 32 }, (_, i) => Number((value >> BigInt(i * 8)) & 255n));

test('Ed25519: 4 seeds × 6 lengths; Node public keys/signatures, cross-verification and tamper rejection', () => {
  for (const offset of [0, 1, 127, 255]) {
    const seed = bytes(32, offset);
    const native = privateKey(seed, '70');
    const pk = new Uint8Array(32), sk = new Uint8Array(64);
    keyPair(pk, sk, seed);
    equal(pk, publicBytes(native));
    for (const length of [0, 1, 32, 127, 128, 257]) {
      const message = bytes(length, offset);
      const signature = new Uint8Array(64);
      signDetached(signature, message, sk);
      equal(signature, sign(null, message, native));
      assert.equal(verify(null, message, createPublicKey(native), signature), true);
      assert.equal(verifyDetached(signature, message, pk), 0);
      signature[0] ^= 1;
      assert.equal(verifyDetached(signature, message, pk), -1);
    }
  }
});

test('X25519: 8 key pairs; Node public keys, shared secrets and both directions', () => {
  for (let i = 0; i < 8; i++) {
    const a = bytes(32, i), b = bytes(32, i + 31);
    const ka = privateKey(a, '6e'), kb = privateKey(b, '6e');
    const pa = publicBytes(ka), pb = publicBytes(kb);
    equal(toLE(scalarmultCurve25519Base(fromLE(a))), pa);
    equal(toLE(scalarmultCurve25519Base(fromLE(b))), pb);
    const expected = diffieHellman({ privateKey: ka, publicKey: createPublicKey(kb) });
    equal(toLE(scalarmultCurve25519(a, pb)), expected);
    equal(toLE(scalarmultCurve25519(b, pa)), expected);
  }
});

test('SHA-512: 14 lengths including block and padding boundaries', () => {
  for (const length of [0, 1, 31, 64, 111, 112, 127, 128, 129, 239, 240, 255, 256, 1024]) {
    const message = bytes(length);
    const output = new Uint8Array(64);
    sha512(message, output);
    equal(output, createHash('sha512').update(message).digest());
  }
});

test('HKDF-SHA-512: 3 salts × 6 positive output lengths match Node; zero length checked separately', () => {
  for (const saltLength of [0, 13, 140]) {
    const salt = bytes(saltLength, 11), ikm = bytes(47, 23), info = bytes(17, 42);
    const prk = new Uint8Array(64);
    hkdfSha512Extract(prk, salt, ikm);
    equal(prk, createHmac('sha512', salt).update(ikm).digest());
    const empty = new Uint8Array(0);
    hkdfSha512Expand(empty, info, prk);
    assert.equal(empty.length, 0);
    // Node v24.22.1 rejects a zero-byte derivation; compare positive lengths.
    for (const length of [1, 32, 64, 65, 96, 129]) {
      const output = new Uint8Array(length);
      hkdfSha512Expand(output, info, prk);
      equal(output, new Uint8Array(hkdfSync('sha512', ikm, salt, info, length)));
    }
  }
});

test('ChaCha20-Poly1305: 9 lengths × 3 AAD lengths; Node ciphertext/tag, round trip and tamper rejection', () => {
  for (const length of [0, 1, 15, 16, 17, 63, 64, 65, 257]) {
    for (const aadLength of [0, 13, 16]) {
      const key = bytes(32, 19), nonce = bytes(12, length + aadLength);
      const message = bytes(length, 7), aad = bytes(aadLength, 3);
      const native = createCipheriv('chacha20-poly1305', key, nonce, { authTagLength: 16 });
      native.setAAD(aad, { plaintextLength: length });
      const encrypted = Buffer.concat([native.update(message), native.final(), native.getAuthTag()]);
      const output = new Uint8Array(length + 16);
      assert.equal(chacha20poly1305Encrypt(output, message, aad, nonce, key), 0);
      equal(output, encrypted);
      const plain = new Uint8Array(length);
      assert.equal(chacha20poly1305Decrypt(plain, output, aad, nonce, key), 0);
      equal(plain, message);
      output[output.length - 1] ^= 1;
      plain.fill(0xa5);
      assert.equal(chacha20poly1305Decrypt(plain, output, aad, nonce, key), -1);
      assert.ok(plain.every(b => b === 0xa5));
    }
  }
});
