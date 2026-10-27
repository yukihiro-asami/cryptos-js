import { ge25519SubPrecomp } from '../../../../src/curve25519/ge25519/ge25519-sub-precomp.js';
import { ge25519Precomp } from '../../../../src/curve25519/ge25519/ge25519-precomp.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';

let allPassed = true;

// 入力データを定義
const p = {
    X: fe25519(), Y: fe25519(), Z: fe25519(), T: fe25519()
};
p.X.value = 3n;
p.Y.value = 5n;
p.Z.value = 7n;
p.T.value = 11n;

const q = ge25519Precomp();
q.yplusx.value = 13n;
q.yminusx.value = 17n;
q.xy2d.value = 19n;

const r = ge25519P1p1();
ge25519SubPrecomp(r, p, q);

// 手計算による期待値（Sub）
const X_plus_Y = p.Y.value + p.X.value;               // 5 + 3 = 8
const Y_minus_X = p.Y.value - p.X.value;              // 5 - 3 = 2
const Z_intermediate = X_plus_Y * q.yminusx.value;    // 8 * 17 = 136
const Y_intermediate = Y_minus_X * q.yplusx.value;    // 2 * 13 = 26
const T_intermediate = q.xy2d.value * p.T.value;      // 19 * 11 = 209
const t0 = p.Z.value + p.Z.value;                     // 7 + 7 = 14

const expectedX = Z_intermediate - Y_intermediate;    // 136 - 26 = 110
const expectedY = Z_intermediate + Y_intermediate;    // 136 + 26 = 162
const expectedZ = t0 - T_intermediate;                // 14 - 209 = -195
const expectedT = t0 + T_intermediate;                // 14 + 209 = 223

// テスト
if (r.X.value !== expectedX) {
    console.assert(false, `r.X expected ${expectedX}, got ${r.X.value}`);
    allPassed = false;
}
if (r.Y.value !== expectedY) {
    console.assert(false, `r.Y expected ${expectedY}, got ${r.Y.value}`);
    allPassed = false;
}
if (r.Z.value !== expectedZ) {
    console.assert(false, `r.Z expected ${expectedZ}, got ${r.Z.value}`);
    allPassed = false;
}
if (r.T.value !== expectedT) {
    console.assert(false, `r.T expected ${expectedT}, got ${r.T.value}`);
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
