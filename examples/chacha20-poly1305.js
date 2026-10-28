import { chacha20poly1305Encrypt } from '../src/crypto/chacha20poly1305/chacha20poly1305-encrypt.js';
import { chacha20poly1305Decrypt } from '../src/crypto/chacha20poly1305/chacha20poly1305-decrypt.js';
import { fromHex, toHex, check, equalBytes } from './bytes.js';
import { chachaVector as v } from './vectors.js';

export function run() {
  const key = fromHex(v.key), nonce = fromHex(v.nonce), aad = fromHex(v.aad);
  const message = fromHex(v.plaintext);
  const encrypted = new Uint8Array(message.length + 16); // ciphertext || 16-byte tag
  const checks = [check(chacha20poly1305Encrypt(encrypted, message, aad, nonce, key) === 0,
    'Encryption succeeded')];
  checks.push(equalBytes(encrypted, fromHex(v.ciphertext + v.tag), 'Ciphertext and tag match RFC 8439'));
  const plain = new Uint8Array(message.length);
  checks.push(check(chacha20poly1305Decrypt(plain, encrypted, aad, nonce, key) === 0,
    'Authentic ciphertext accepted'));
  checks.push(equalBytes(plain, message, 'Plaintext recovered'));

  const changed = encrypted.slice();
  changed[changed.length - 1] ^= 1;
  plain.fill(0xa5);
  checks.push(check(chacha20poly1305Decrypt(plain, changed, aad, nonce, key) === -1,
    'Changed tag rejected'));
  checks.push(check(plain.every(byte => byte === 0xa5), 'Rejected input leaves output untouched'));
  return { checks, input: { key: v.key, nonce: v.nonce, aad: v.aad, plaintext: v.plaintext },
    output: { ciphertext: toHex(encrypted.subarray(0, -16)), tag: toHex(encrypted.subarray(-16)) } };
}
