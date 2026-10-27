import { doubleScalarmultVartime } from '../../../../src/curve25519/ed25519/double-scalarmult-vartime.js';
import { ge25519P2 } from '../../../../src/curve25519/ge25519/ge25519-p2.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { ge25519AddPrecomp } from '../../../../src/curve25519/ge25519/ge25519-add-precomp.js';
import { ge25519P1p1ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';
import { ge25519P3ToP2 } from '../../../../src/curve25519/ge25519/ge25519-p3-to-p2.js';
import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Mul } from '../../../../src/curve25519/fe25519/fe25519-mul.js';
import { fe25519Invert } from '../../../../src/curve25519/fe25519/fe25519-invert.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';
import { BASE_POINT_PRE_COMPUTED_TABLE_RADIX2 } from '../../../../src/curve25519/const.js';
import {ge25519P3Reduce} from "../../../../src/curve25519/ge25519/ge25519-p3-reduce.js";

function isValidFe25519Struct(obj) {
    return ['X', 'Y', 'Z'].every(k => obj[k] && typeof obj[k].value === 'bigint');
}

function isZeroP2(p) {
    return p.X.value === 0n && p.Y.value === 1n && p.Z.value === 1n;
}

function toAffineXY(p2) {
    const Zinv = fe25519(); fe25519Invert(Zinv, p2.Z);
    const X = fe25519(); fe25519Mul(X, p2.X, Zinv);
    fe25519Reduce(X);
    const Y = fe25519(); fe25519Mul(Y, p2.Y, Zinv);
    fe25519Reduce(Y);
    return { X, Y };
}

function eqP2(p, q) {
    const a = toAffineXY(p);
    const b = toAffineXY(q);

    return a.X.value === b.X.value && a.Y.value === b.Y.value;
}


// === Case 1: a = 0, b = 0 ===
{
    const a = new Uint8Array(32);
    const b = new Uint8Array(32);
    const dummyA = ge25519P3(); ge25519P3Zero(dummyA);

    const r = ge25519P2();
    doubleScalarmultVartime(r, a, dummyA, b);

    if (!isValidFe25519Struct(r) || !isZeroP2(r)) {
        console.error('FAILED: a=0, b=0 → should be identity element');
        process.exit(1);
    }
}
// === Case 2: a = 1, b = 0 ===
{
    const a = new Uint8Array(32); a[0] = 1;
    const b = new Uint8Array(32);
    const A = ge25519P3(); ge25519P3Zero(A);
    const t = ge25519P1p1();
    ge25519AddPrecomp(t, A, BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0]);
    ge25519P1p1ToP3(A, t);
    ge25519P3Reduce(A);
    const expected = ge25519P2(); ge25519P3ToP2(expected, A);
    const out = ge25519P2();
    doubleScalarmultVartime(out, a, A, b);

    if (!eqP2(out, expected)) {
        console.error('FAILED: a=1, b=0 → should equal A');
        process.exit(1);
    }
}
// === Case 3: a = 0, b = 1 ===
{
    const a = new Uint8Array(32);
    const b = new Uint8Array(32); b[0] = 1;

    const dummyA = ge25519P3(); ge25519P3Zero(dummyA);
    const expected = ge25519P1p1();
    ge25519AddPrecomp(expected, dummyA, BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0]);
    const expectedP3 = ge25519P3(); ge25519P1p1ToP3(expectedP3, expected);
    ge25519P3Reduce(expectedP3);
    const expectedP2 = ge25519P2(); ge25519P3ToP2(expectedP2, expectedP3);

    const out = ge25519P2();
    doubleScalarmultVartime(out, a, dummyA, b);

    if (!eqP2(out, expectedP2)) {
        console.error('FAILED: a=0, b=1 → should equal B');
        process.exit(1);
    }
}
console.log('tests_passed.');
