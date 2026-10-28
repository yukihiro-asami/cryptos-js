import { hkdfSha512Extract } from '../src/crypto/sha512/hkdf-sha512-extract.js';
import { hkdfSha512Expand } from '../src/crypto/sha512/hkdf-sha512-expand.js';
import { fromHex, toHex, equalBytes } from './bytes.js';
import { hkdfVector as v } from './vectors.js';

export function run() {
  const prk = new Uint8Array(64);
  hkdfSha512Extract(prk, fromHex(v.salt), fromHex(v.ikm));
  const derived = new Uint8Array(v.length);
  hkdfSha512Expand(derived, fromHex(v.info), prk);
  const checks = [
    equalBytes(prk, fromHex(v.prk), 'Extract matches independent SHA-512 expectation'),
    equalBytes(derived, fromHex(v.output), 'Expand matches independent SHA-512 expectation'),
  ];
  return { checks, input: { ikm: v.ikm, salt: v.salt, info: v.info, outputBytes: v.length },
    output: { prk: toHex(prk), derived: toHex(derived) } };
}
