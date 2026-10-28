import { scalarmultCurve25519 } from '../src/curve25519/x25519/scalarmult-curve25519.js';
import { scalarmultCurve25519Base } from '../src/curve25519/x25519/scalarmult-curve25519-base.js';
import { fromHex, toHex, fromLE, toLE32, equalBytes } from './bytes.js';
import { x25519Vector as v } from './vectors.js';

export function run() {
  const alice = fromHex(v.alicePrivate);
  const bob = fromHex(v.bobPrivate);
  // Base-point API takes a little-endian BigInt; general API takes byte arrays.
  // Both return a BigInt u-coordinate, converted here to 32 little-endian bytes.
  const alicePublic = toLE32(scalarmultCurve25519Base(fromLE(alice)));
  const bobPublic = toLE32(scalarmultCurve25519Base(fromLE(bob)));
  const aliceShared = toLE32(scalarmultCurve25519(alice, bobPublic));
  const bobShared = toLE32(scalarmultCurve25519(bob, alicePublic));
  const checks = [
    equalBytes(alicePublic, fromHex(v.alicePublic), 'Alice public key matches RFC 7748'),
    equalBytes(bobPublic, fromHex(v.bobPublic), 'Bob public key matches RFC 7748'),
    equalBytes(aliceShared, fromHex(v.shared), 'Shared secret matches RFC 7748'),
    equalBytes(aliceShared, bobShared, 'Both parties obtain the same shared secret'),
  ];
  return { checks, input: { alicePrivate: v.alicePrivate, bobPrivate: v.bobPrivate },
    output: { alicePublic: toHex(alicePublic), bobPublic: toHex(bobPublic),
      shared: toHex(aliceShared) } };
}
