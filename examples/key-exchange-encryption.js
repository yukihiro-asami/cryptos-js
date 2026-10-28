import { scalarmultCurve25519 } from '../src/curve25519/x25519/scalarmult-curve25519.js';
import { scalarmultCurve25519Base } from '../src/curve25519/x25519/scalarmult-curve25519-base.js';
import { hkdfSha512Extract } from '../src/crypto/sha512/hkdf-sha512-extract.js';
import { hkdfSha512Expand } from '../src/crypto/sha512/hkdf-sha512-expand.js';
import { chacha20poly1305Encrypt } from '../src/crypto/chacha20poly1305/chacha20poly1305-encrypt.js';
import { chacha20poly1305Decrypt } from '../src/crypto/chacha20poly1305/chacha20poly1305-decrypt.js';
import { fromLE, toLE32, toHex, check, equalBytes } from './bytes.js';

// A local composition example, not an authenticated key-exchange protocol.
// Fresh demo keys for each run; only random-byte generation uses platform crypto.
export function run() {
  const alice = crypto.getRandomValues(new Uint8Array(32));
  const bob = crypto.getRandomValues(new Uint8Array(32));
  const alicePublic = toLE32(scalarmultCurve25519Base(fromLE(alice)));
  const bobPublic = toLE32(scalarmultCurve25519Base(fromLE(bob)));
  const aliceShared = toLE32(scalarmultCurve25519(alice, bobPublic));
  const bobShared = toLE32(scalarmultCurve25519(bob, alicePublic));
  const checks = [
    check(aliceShared.some(byte => byte !== 0), 'Shared secret is nonzero'),
    equalBytes(aliceShared, bobShared, 'X25519 shared secrets agree'),
  ];

  const salt = crypto.getRandomValues(new Uint8Array(32));
  const context = new TextEncoder().encode('cryptos-js example v1');
  const info = new Uint8Array([...context, ...alicePublic, ...bobPublic]);
  const alicePrk = new Uint8Array(64), bobPrk = new Uint8Array(64);
  hkdfSha512Extract(alicePrk, salt, aliceShared);
  hkdfSha512Extract(bobPrk, salt, bobShared);
  const aliceKey = new Uint8Array(32), bobKey = new Uint8Array(32);
  hkdfSha512Expand(aliceKey, info, alicePrk);
  hkdfSha512Expand(bobKey, info, bobPrk);
  checks.push(equalBytes(aliceKey, bobKey, 'HKDF derives the same 32-byte encryption key'));

  const message = new TextEncoder().encode('Hello from cryptos-js / こんにちは');
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const aad = new TextEncoder().encode('demo-message:1');
  const encrypted = new Uint8Array(message.length + 16);
  checks.push(check(chacha20poly1305Encrypt(encrypted, message, aad, nonce, aliceKey) === 0,
    'Alice encrypted with the derived key'));
  const plain = new Uint8Array(message.length);
  checks.push(check(chacha20poly1305Decrypt(plain, encrypted, aad, nonce, bobKey) === 0,
    'Bob decrypted with his independently derived key'));
  checks.push(equalBytes(plain, message, 'UTF-8 message recovered'));
  const recovered = new TextDecoder().decode(plain);
  encrypted[encrypted.length - 1] ^= 1;
  checks.push(check(chacha20poly1305Decrypt(plain, encrypted, aad, nonce, bobKey) === -1,
    'Changed tag rejected with the derived key'));
  encrypted[encrypted.length - 1] ^= 1;
  return { checks, input: { utf8: new TextDecoder().decode(message), salt: toHex(salt),
    info: toHex(info), nonce: toHex(nonce), aad: toHex(aad) },
  output: { alicePublic: toHex(alicePublic), bobPublic: toHex(bobPublic),
    ciphertextAndTag: toHex(encrypted), recovered } };
}
