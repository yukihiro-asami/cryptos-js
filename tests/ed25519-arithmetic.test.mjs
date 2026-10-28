import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';
import { sc25519MulAdd } from '../src/curve25519/sc25519/sc25519-mul-add.js';
import { ge25519P2 } from '../src/curve25519/ge25519/ge25519-p2.js';
import { ge25519P3 } from '../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P2ToP3 } from '../src/curve25519/ge25519/ge25519-p2-to-p3.js';
import { keyPair } from '../src/curve25519/ed25519/key-pair.js';
import { signDetached } from '../src/curve25519/ed25519/sign-detached.js';
import { verifyDetached } from '../src/curve25519/ed25519/verify-detached.js';

// Public test data. This oracle uses affine formulas and native %, not the
// library's reduction, projective coordinates, or precomputed point tables.
const P = (1n << 255n) - 19n;
const L = (1n << 252n) + 27742317777372353535851937790883648493n;
const mod = (x, m = P) => ((x % m) + m) % m;
const fromLE = bytes => bytes.reduceRight((x, b) => (x << 8n) | BigInt(b), 0n);
const toLE = x => Buffer.from(Array.from({ length: 32 }, (_, i) => Number((x >> BigInt(8 * i)) & 255n)));
function pow(x, n) {
  let result = 1n;
  for (x = mod(x); n; n >>= 1n, x = mod(x * x)) if (n & 1n) result = mod(result * x);
  return result;
}
const inverse = x => { assert.notEqual(mod(x), 0n); return pow(x, P - 2n); };
const D = mod(-121665n * inverse(121666n));
const O = [0n, 1n];
const B = [
  15112221349535400772501151409588531511454012693041857206046113283949847762202n,
  46316835694926478169428394003475163141307993866256225615783033603165251855960n,
];
const equal = (p, q) => mod(p[0] - q[0]) === 0n && mod(p[1] - q[1]) === 0n;
const onCurve = ([x, y]) => mod(-x*x + y*y - 1n - D*x*x*y*y) === 0n;
const negate = ([x, y]) => [mod(-x), y];
function add([x, y], [u, v]) {
  const t = mod(D*x*u*y*v);
  return [mod((x*v + y*u) * inverse(1n + t)), mod((y*v + x*u) * inverse(1n - t))];
}
function multiply(n, point) {
  let result = O;
  for (; n; n >>= 1n, point = add(point, point)) if (n & 1n) result = add(result, point);
  return result;
}
function encode([x, y]) {
  const result = toLE(y);
  result[31] |= Number((x & 1n) << 7n);
  return result;
}
function decode(bytes) {
  const n = fromLE(bytes), signBit = n >> 255n, y = n & ((1n << 255n) - 1n);
  assert.ok(y < P);
  const square = mod((y*y - 1n) * inverse(D*y*y + 1n));
  let x = pow(square, (P + 3n) / 8n);
  if (mod(x*x) !== square) x = mod(x * pow(2n, (P - 1n) / 4n));
  assert.equal(mod(x*x), square);
  if ((x & 1n) !== signBit) x = mod(-x);
  assert.ok(onCurve([x, y]));
  return [x, y];
}

test('scalar multiply-add: canonical result at multiples of L and 256-bit boundaries', () => {
  const max = (1n << 256n) - 1n;
  for (const a of [0n, 1n, L - 1n, L, max]) {
    for (const b of [0n, 1n, L - 1n, (1n << 254n), (1n << 255n) - 8n, max]) {
      const boundary = mod(-a*b, L);
      for (const c of [0n, L - 1n, max, boundary, mod(boundary - 1n, L), mod(boundary + 1n, L)]) {
        const out = { value: 0n };
        sc25519MulAdd(out, { value: a }, { value: b }, { value: c });
        // Do not normalize the function's output here: that hid the original bug.
        assert.equal(out.value, (a*b + c) % L, `a=${a}, b=${b}, c=${c}`);
        assert.ok(out.value >= 0n && out.value < L);
      }
    }
  }
});

test('Ed25519 signing: zero seed / 0c230000 produces canonical S and matches Node', () => {
  const seed = Buffer.alloc(32), message = Buffer.from('0c230000', 'hex');
  const nativeKey = createPrivateKey({ format: 'der', type: 'pkcs8',
    key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), seed]) });
  const nativePublic = createPublicKey(nativeKey);
  const pk = new Uint8Array(32), sk = new Uint8Array(64), signature = new Uint8Array(64);
  keyPair(pk, sk, seed);
  assert.deepEqual(Buffer.from(pk), nativePublic.export({ format: 'der', type: 'spki' }).subarray(-32));
  assert.equal(signDetached(signature, message, sk), 0);
  const expected = sign(null, message, nativeKey);
  assert.deepEqual(Buffer.from(signature), expected);
  assert.ok(fromLE(signature.subarray(32)) < L);
  assert.equal(verifyDetached(signature, message, pk), 0);
  assert.equal(verify(null, message, nativePublic, signature), true);
  assert.equal(verifyDetached(expected, message, pk), 0);
});

test('P2 to P3: preserve the affine point and XY=ZT at non-unit Z, including in-place conversion', () => {
  for (const point of [B, negate(B), O, [0n, P - 1n]]) {
    assert.ok(onCurve(point));
    for (const z of [1n, 2n, 7n, P - 1n, P + 1n]) {
      for (const inPlace of [false, true]) {
        const p = inPlace ? ge25519P3() : ge25519P2();
        p.X.value = mod(z * point[0]); p.Y.value = mod(z * point[1]); p.Z.value = z;
        const original = [p.X.value, p.Y.value, p.Z.value];
        const r = inPlace ? p : ge25519P3();
        ge25519P2ToP3(r, p);
        const { X: { value: X }, Y: { value: Y }, Z: { value: Z }, T: { value: T } } = r;
        assert.equal(mod(X*Y - Z*T), 0n, `extended invariant, z=${z}, inPlace=${inPlace}`);
        const affine = [mod(X * inverse(Z)), mod(Y * inverse(Z))];
        assert.ok(equal(affine, point));
        assert.ok(onCurve(affine));
        if (!inPlace) assert.deepEqual([p.X.value, p.Y.value, p.Z.value], original);
      }
    }
  }
});

function mixedOrderVectors() {
  const torsionBytes = Buffer.from('c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a', 'hex');
  const torsion = decode(torsionBytes);
  assert.deepEqual(encode(torsion), torsionBytes);
  assert.ok(equal(multiply(8n, torsion), O));
  assert.ok(!equal(multiply(4n, torsion), O));
  assert.ok(onCurve(B) && equal(multiply(L, B), O));
  const a = 1234567n, r = 7654321n;
  const A = add(multiply(a, B), torsion), R = multiply(r, B);
  const pk = encode(A), encodedR = encode(R);
  assert.ok(!equal(multiply(8n, A), O) && !equal(multiply(8n, R), O));
  const cases = [];
  for (const [byte, order] of [[13, 1], [5, 2], [10, 4], [0, 8]]) {
    const message = Buffer.from([byte]);
    const h = mod(fromLE(createHash('sha512').update(Buffer.concat([encodedR, pk, message])).digest()), L);
    const s = mod(r + h*a, L);
    const left = multiply(s, B), right = add(R, multiply(h, A));
    // The oracle is the cofactored equation, not Node's stricter acceptance rule.
    assert.ok(equal(multiply(8n, left), multiply(8n, right)));
    const difference = add(right, negate(left));
    assert.ok(equal(difference, multiply(h % 8n, torsion)));
    assert.ok(equal(multiply(BigInt(order), difference), O));
    if (order > 1) assert.ok(!equal(multiply(BigInt(order / 2), difference), O));
    cases.push({ order, pk, message, signature: Buffer.concat([encodedR, toLE(s)]), torsionBytes });
  }
  return cases;
}
const mixedCases = mixedOrderVectors();

test('Ed25519 cofactored verification: accept independently checked differences of order 1, 2, 4 and 8', () => {
  for (const { order, pk, message, signature } of mixedCases) {
    assert.equal(verifyDetached(signature, message, pk), 0, `difference order ${order}`);
  }
});

test('Ed25519 cofactored verification: still reject altered S/message and small-order public keys/R', () => {
  for (const { pk, message, signature, torsionBytes } of mixedCases) {
    const changedS = Buffer.concat([signature.subarray(0, 32), toLE(mod(fromLE(signature.subarray(32)) + 1n, L))]);
    assert.equal(verifyDetached(changedS, message, pk), -1);
    assert.equal(verifyDetached(signature, Buffer.concat([message, Buffer.from([0xff])]), pk), -1);
    assert.equal(verifyDetached(signature, message, torsionBytes), -1);
    assert.equal(verifyDetached(Buffer.concat([torsionBytes, signature.subarray(32)]), message, pk), -1);
  }
});
