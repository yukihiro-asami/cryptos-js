import { ge25519Cmov8Base } from '../../../../src/curve25519/ge25519/ge25519-cmov8-base.js';
import { ge25519Precomp } from '../../../../src/curve25519/ge25519/ge25519-precomp.js';
import { BASE_POINT_PRE_COMPUTED_TABLE_RADIX16, P } from '../../../../src/curve25519/const.js';

let allPassed = true;

// テスト対象: pos = 5, b = 3 → index = 2
const pos = 5;
const b = 3;
const index = b - 1;

const expected = BASE_POINT_PRE_COMPUTED_TABLE_RADIX16[pos][index];

// 正常（正の係数）
const t = ge25519Precomp();
ge25519Cmov8Base(t, pos, b);

if (t.yplusx.value !== BigInt(expected.yplusx.value)) {
    console.assert(false, `yplusx mismatch: expected ${expected.yplusx.value}, got ${t.yplusx.value}`);
    allPassed = false;
}
if (t.yminusx.value !== BigInt(expected.yminusx.value)) {
    console.assert(false, `yminusx mismatch: expected ${expected.yminusx.value}, got ${t.yminusx.value}`);
    allPassed = false;
}
if (t.xy2d.value !== BigInt(expected.xy2d.value)) {
    console.assert(false, `xy2d mismatch: expected ${expected.xy2d.value}, got ${t.xy2d.value}`);
    allPassed = false;
}

// 反転テスト：b = -3
const t2 = ge25519Precomp();
ge25519Cmov8Base(t2, pos, -3);

const expectedNegX = BigInt(expected.yminusx.value);
const expectedNegY = BigInt(expected.yplusx.value);
const expectedNegZ = (P - BigInt(expected.xy2d.value)) % P;

if (t2.yplusx.value !== expectedNegX) {
    console.assert(false, `yplusx (neg) mismatch: expected ${expectedNegX}, got ${t2.yplusx.value}`);
    allPassed = false;
}
if (t2.yminusx.value !== expectedNegY) {
    console.assert(false, `yminusx (neg) mismatch: expected ${expectedNegY}, got ${t2.yminusx.value}`);
    allPassed = false;
}
if (t2.xy2d.value !== expectedNegZ) {
    console.assert(false, `xy2d (neg) mismatch: expected ${expectedNegZ}, got ${t2.xy2d.value}`);
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
