
import { BASE_POINT_PRE_COMPUTED_TABLE_RADIX2 } from  '../../../src/curve25519/const.js';
import { ge25519P3 } from '../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519Precomp } from '../../../src/curve25519/ge25519/ge25519-precomp.js';
import { ge25519AddPrecomp } from '../../../src/curve25519/ge25519/ge25519-add-precomp.js';
import { ge25519P1p1 } from '../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { ge25519P1p1ToP3 } from '../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';
import { ge25519P3Reduce } from '../../../src/curve25519/ge25519/ge25519-p3-reduce.js';
import { ge25519P3Dbl } from '../../../src/curve25519/ge25519/ge25519-p3-dbl.js';

const P = (1n << 255n) - 19n;

function loadPrecompFromJson(jsonEntry) {
    const pre = ge25519Precomp();
    pre.yplusx.value = BigInt(jsonEntry.yplusx.value);
    pre.yminusx.value = BigInt(jsonEntry.yminusx.value);
    pre.xy2d.value = BigInt(jsonEntry.xy2d.value);
    return pre;
}

function addRadixPair(i, j) {
    const pre1 = loadPrecompFromJson(BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[i]);
    const pre2 = loadPrecompFromJson(BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[j]);

    const p = ge25519P3();
    // p = i倍の初期化
    const r1 = ge25519P1p1();
    ge25519AddPrecomp(r1, ge25519P3(), pre1);
    ge25519P1p1ToP3(p, r1);
    ge25519P3Reduce(p);

    const r2 = ge25519P1p1();
    ge25519AddPrecomp(r2, p, pre2);
    ge25519P1p1ToP3(p, r2);
    ge25519P3Reduce(p);
    return p;
}

function multiply16(base) {
    const r = ge25519P1p1();
    for (let i = 0; i < 4; i++) {
        ge25519P3Dbl(r, base);
        ge25519P1p1ToP3(base, r);
        ge25519P3Reduce(base);
    }
    return base;
}

// 各ペアで検証
const pairs = [
    [0, 7], // 1+15
    [1, 6], // 3+13
    [2, 5], // 5+11
    [3, 4], // 7+9
];

let allPass = true;

pairs.forEach(([i, j]) => {
    const sum = addRadixPair(i, j);
    const base = loadPrecompFromJson(BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0]);
    const b = ge25519P3();
    const r0 = ge25519P1p1();
    ge25519AddPrecomp(r0, ge25519P3(), base);
    ge25519P1p1ToP3(b, r0);
    ge25519P3Reduce(b);

    const b16 = multiply16(b);

    const match =
        sum.X.value === b16.X.value &&
        sum.Y.value === b16.Y.value &&
        sum.Z.value === b16.Z.value &&
        sum.T.value === b16.T.value;

    if (!match) {
        console.error(`❌ Pair ${i}+${j} failed`);
        console.log('Expected:', b16);
        console.log('Got     :', sum);
        allPass = false;
    }
});

if (allPass) {
    console.log('tests_passed.');
}
