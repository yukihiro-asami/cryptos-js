import { keyPair } from '../src/curve25519/ed25519/key-pair.js';
import { signDetached } from '../src/curve25519/ed25519/sign-detached.js';
import { verifyDetached } from '../src/curve25519/ed25519/verify-detached.js';
import { fromHex, toHex, check, equalBytes } from './bytes.js';
import { ed25519Vector as v } from './vectors.js';

export function run() {
  const seed = fromHex(v.seed);
  const message = fromHex(v.message);
  const publicKey = new Uint8Array(32);
  const secretKey = new Uint8Array(64); // Library format: seed || publicKey.
  keyPair(publicKey, secretKey, seed);
  const signature = new Uint8Array(64);
  signDetached(signature, message, secretKey);

  const changed = message.slice();
  changed[0] ^= 1;
  const checks = [
    equalBytes(publicKey, fromHex(v.publicKey), 'Public key matches RFC 8032'),
    equalBytes(signature, fromHex(v.signature), 'Signature matches RFC 8032'),
    check(verifyDetached(signature, message, publicKey) === 0, 'Original message accepted'),
    check(verifyDetached(signature, changed, publicKey) === -1, 'Changed message rejected'),
  ];
  return { checks, input: { seed: v.seed, message: v.message },
    output: { publicKey: toHex(publicKey), signature: toHex(signature) } };
}
