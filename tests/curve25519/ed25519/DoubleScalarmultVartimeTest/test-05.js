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

function toAffineXY(p2) {
    const Zinv = fe25519(); fe25519Invert(Zinv, p2.Z);
    const X = fe25519(); fe25519Mul(X, p2.X, Zinv); fe25519Reduce(X);
    const Y = fe25519(); fe25519Mul(Y, p2.Y, Zinv); fe25519Reduce(Y);
    return { X, Y };
}

function eqP2(p, q) {
    const a = toAffineXY(p);
    const b = toAffineXY(q);
    return a.X.value === b.X.value && a.Y.value === b.Y.value;
}

// === Case: a = 3, A = B1, b = 1 → result = B1 + B1 + B1 + B ===
{
    const a = new Uint8Array(32); a[0] = 3;
    const b = new Uint8Array(32); b[0] = 1;

    // A = B1
    const dummy = ge25519P3(); ge25519P3Zero(dummy);
    const A = ge25519P3(); ge25519P3Zero(A);
    const t1 = ge25519P1p1();
    ge25519AddPrecomp(t1, A, BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0]); // B1
    ge25519P1p1ToP3(A, t1);
    ge25519P3Reduce(A);

    const out = ge25519P2();
    doubleScalarmultVartime(out, a, A, b);

    // expected = B1 + B1 + B1 + B
    const tmp1 = ge25519P1p1();
    const tmp2 = ge25519P3();
    const tmp3 = ge25519P1p1();
    const tmp4 = ge25519P3();
    const tmp5 = ge25519P1p1();
    const tmp6 = ge25519P3();
    const expected = ge25519P2();

    ge25519AddPrecomp(tmp1, dummy, BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0]); // B1
    ge25519P1p1ToP3(tmp2, tmp1);
    ge25519P3Reduce(tmp2);

    ge25519AddPrecomp(tmp3, tmp2, BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0]); // B1 + B1
    ge25519P1p1ToP3(tmp4, tmp3);
    ge25519P3Reduce(tmp4);

    ge25519AddPrecomp(tmp5, tmp4, BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0]); // B1 + B1 + B1
    ge25519P1p1ToP3(tmp6, tmp5);
    ge25519P3Reduce(tmp6);

    ge25519AddPrecomp(tmp1, tmp6, BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0]); // +B
    const tmpFinal = ge25519P3();
    ge25519P1p1ToP3(tmpFinal, tmp1);
    ge25519P3Reduce(tmpFinal);
    ge25519P3ToP2(expected, tmpFinal);

    if (!eqP2(out, expected)) {
        console.error('FAILED: a=3, A=B1, b=1 → should equal B1*3 + B');
        process.exit(1);
    }
}

console.log('tests_passed.');
