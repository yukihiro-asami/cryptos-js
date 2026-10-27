import { ge25519AddPrecomp } from '../../../../src/curve25519/ge25519/ge25519-add-precomp.js';
import { ge25519SubPrecomp } from '../../../../src/curve25519/ge25519/ge25519-sub-precomp.js';
import { ge25519P1p1ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';

import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Mul } from '../../../../src/curve25519/fe25519/fe25519-mul.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';

import { BASE_POINT_PRE_COMPUTED_TABLE_RADIX2 } from '../../../../src/curve25519/const.js';

// 正規化して比較
function normalized(fe) {
    const tmp = fe25519();
    tmp.value = fe.value;
    fe25519Reduce(tmp);
    return tmp.value;
}

// 射影座標の等価比較
function p3EqualsProjective(p1, p2) {
    const t1 = fe25519(), t2 = fe25519();

    fe25519Mul(t1, p1.X, p2.Z);
    fe25519Mul(t2, p2.X, p1.Z);
    if (normalized(t1) !== normalized(t2)) return false;

    fe25519Mul(t1, p1.Y, p2.Z);
    fe25519Mul(t2, p2.Y, p1.Z);
    if (normalized(t1) !== normalized(t2)) return false;

    return true;
}

// Precomp点からP3を作る（0 + q）
function precompToP3(q) {
    const p0 = ge25519P3();
    ge25519P3Zero(p0);

    const tmp = ge25519P1p1();
    ge25519AddPrecomp(tmp, p0, q);

    const p = ge25519P3();
    ge25519P1p1ToP3(p, tmp);
    return p;
}

let allPassed = true;

// --- [1]B - [1]B = 0 ---
{
    const q = BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0];
    const p1 = precompToP3(q);

    const tmp = ge25519P1p1();
    ge25519SubPrecomp(tmp, p1, q);
    const r = ge25519P3();
    ge25519P1p1ToP3(r, tmp);

    const zero = ge25519P3();
    ge25519P3Zero(zero);

    if (!p3EqualsProjective(r, zero)) {
        console.error('❌ [1]B - [1]B != 0');
        allPassed = false;
    }
}

// --- ([3]B - [1]B) + [1]B = [3]B ---
{
    const q1 = BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0];
    const q3 = BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[1];
    const p3 = precompToP3(q3);

    const tmp1 = ge25519P1p1();
    ge25519SubPrecomp(tmp1, p3, q1);
    const p2 = ge25519P3();
    ge25519P1p1ToP3(p2, tmp1);

    const tmp2 = ge25519P1p1();
    ge25519AddPrecomp(tmp2, p2, q1);
    const p3_check = ge25519P3();
    ge25519P1p1ToP3(p3_check, tmp2);

    if (!p3EqualsProjective(p3, p3_check)) {
        console.error('❌ ([3]B - [1]B) + [1]B != [3]B');
        allPassed = false;
    }
}

// --- [5]B - [3]B = [1]B + [1]B ---
{
    const q1 = BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0];
    const q3 = BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[1];
    const q5 = BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[2];

    const p5 = precompToP3(q5);
    const tmp1 = ge25519P1p1();
    ge25519SubPrecomp(tmp1, p5, q3);
    const p2a = ge25519P3();
    ge25519P1p1ToP3(p2a, tmp1);

    const p1 = precompToP3(q1);
    const tmp2 = ge25519P1p1();
    ge25519AddPrecomp(tmp2, p1, q1);
    const p2b = ge25519P3();
    ge25519P1p1ToP3(p2b, tmp2);

    if (!p3EqualsProjective(p2a, p2b)) {
        console.error('❌ [5]B - [3]B != 2 * [1]B');
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
