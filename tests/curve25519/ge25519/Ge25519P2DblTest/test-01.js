import { ge25519P2Dbl } from '../../../../src/curve25519/ge25519/ge25519-p2-dbl.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';

let allPassed = true;

// 入力 p（P2形式）
const p = {
    X: fe25519(),
    Y: fe25519(),
    Z: fe25519()
};
p.X.value = 2n;
p.Y.value = 3n;
p.Z.value = 5n;

// 出力 r（P1P1形式）
const r = ge25519P1p1();
ge25519P2Dbl(r, p);

// 手計算
const X_sq = p.X.value * p.X.value;     // 2^2 = 4
const Y_sq = p.Y.value * p.Y.value;     // 3^2 = 9
const Z_sq2 = 2n * p.Z.value * p.Z.value; // 2 * 5^2 = 50
const XY_sum = p.X.value + p.Y.value;   // 2 + 3 = 5
const XY_sum_sq = XY_sum * XY_sum;      // 5^2 = 25
const YplusX = Y_sq + X_sq;             // 9 + 4 = 13
const YminusX = Y_sq - X_sq;            // 9 - 4 = 5
const X_result = XY_sum_sq - YplusX;    // 25 - 13 = 12
const T_result = Z_sq2 - YminusX;       // 50 - 5 = 45

// 検証
if (r.X.value !== X_result) {
    console.assert(false, `r.X expected ${X_result}, got ${r.X.value}`);
    allPassed = false;
}
if (r.Y.value !== YplusX) {
    console.assert(false, `r.Y expected ${YplusX}, got ${r.Y.value}`);
    allPassed = false;
}
if (r.Z.value !== YminusX) {
    console.assert(false, `r.Z expected ${YminusX}, got ${r.Z.value}`);
    allPassed = false;
}
if (r.T.value !== T_result) {
    console.assert(false, `r.T expected ${T_result}, got ${r.T.value}`);
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
