import { ge25519SubCached } from '../../../../src/curve25519/ge25519/ge25519-sub-cached.js';
import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';

// 出力形式
function ge25519P1p1() {
    return {
        X: fe25519(), Y: fe25519(), Z: fe25519(), T: fe25519(),
    };
}

// 入力点
const p = {
    X: fe25519(), Y: fe25519(), Z: fe25519(), T: fe25519()
};
p.X.value = 3n;
p.Y.value = 5n;
p.Z.value = 7n;
p.T.value = 11n;

const q = {
    YplusX: fe25519(),
    YminusX: fe25519(),
    Z: fe25519(),
    T2d: fe25519()
};
q.YplusX.value = 13n;
q.YminusX.value = 17n;
q.Z.value = 23n;
q.T2d.value = 19n;

const r = ge25519P1p1();
ge25519SubCached(r, p, q);

// 手計算期待値
const X_plus_Y = p.Y.value + p.X.value;              // 8
const Y_minus_X = p.Y.value - p.X.value;             // 2
const Z1 = X_plus_Y * q.YminusX.value;               // 8 * 17 = 136
const Y1 = Y_minus_X * q.YplusX.value;               // 2 * 13 = 26
const T1 = q.T2d.value * p.T.value;                  // 19 * 11 = 209
const XZ = p.Z.value * q.Z.value;                    // 7 * 23 = 161
const t0 = XZ + XZ;                                  // 322

const expectedX = Z1 - Y1;                           // 136 - 26 = 110
const expectedY = Z1 + Y1;                           // 136 + 26 = 162
const expectedZ = t0 - T1;                           // 322 - 209 = 113
const expectedT = t0 + T1;                           // 322 + 209 = 531

let allPassed = true;

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
