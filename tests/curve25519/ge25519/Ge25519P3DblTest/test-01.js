import { ge25519P3Dbl } from '../../../../src/curve25519/ge25519/ge25519-p3-dbl.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';

let allPassed = true;

const p = ge25519P3();
p.X.value = 2n;
p.Y.value = 3n;
p.Z.value = 5n;
p.T.value = 999n; // 無視

const r = ge25519P1p1();
ge25519P3Dbl(r, p);

const X_sq = 4n;
const Y_sq = 9n;
const Z_sq2 = 2n * 25n;
const XY_sum_sq = 25n;
const YplusX = Y_sq + X_sq;
const YminusX = Y_sq - X_sq;
const X_result = XY_sum_sq - YplusX;
const T_result = Z_sq2 - YminusX;

if (r.X.value !== X_result) {
    console.assert(false, `X mismatch: expected ${X_result}, got ${r.X.value}`);
    allPassed = false;
}
if (r.Y.value !== YplusX) {
    console.assert(false, `Y mismatch: expected ${YplusX}, got ${r.Y.value}`);
    allPassed = false;
}
if (r.Z.value !== YminusX) {
    console.assert(false, `Z mismatch: expected ${YminusX}, got ${r.Z.value}`);
    allPassed = false;
}
if (r.T.value !== T_result) {
    console.assert(false, `T mismatch: expected ${T_result}, got ${r.T.value}`);
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
