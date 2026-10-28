import { sha512 } from '../src/crypto/sha512/sha512.js';
import { fromHex, toHex, equalBytes } from './bytes.js';
import { sha512Expected } from './vectors.js';

export function run() {
  const message = new TextEncoder().encode('abc');
  const digest = new Uint8Array(64);
  sha512(message, digest);
  const checks = [equalBytes(digest, fromHex(sha512Expected), 'SHA-512 abc digest matches')];
  return { checks, input: { utf8: 'abc' }, output: { digest: toHex(digest) } };
}
