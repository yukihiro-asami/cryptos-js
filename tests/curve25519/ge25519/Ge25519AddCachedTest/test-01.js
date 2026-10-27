import { ge25519AddCached } from '../../../../src/curve25519/ge25519/ge25519-add-cached.js';
import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';

// P1P1 出力用のオブジェクトを構築
function ge25519P1p1() {
    return {
        X: fe25519(),
        Y: fe25519(),
        Z: fe25519(),
        T: fe25519(),
    };
}

// Cached 形式のオブジェクトを構築
function ge25519Cached() {
    return {
        YplusX: fe25519(),
        YminusX: fe25519(),
        Z: fe25519(),
        T2d: fe25519(),
    };
}

let allPassed = true;

// フェイクP3点（p）とcached点（q）を作成
const p = {
    X: fe25519(), Y: fe25519(), Z: fe25519(), T: fe25519()
};
p.X.value = 3n;
p.Y.value = 5n;
p.Z.value = 7n;
p.T.value = 11n;

const q = ge25519Cached();
q.YplusX.value = 13n;
q.YminusX.value = 17n;
q.Z.value = 23n;
q.T2d.value = 19n;

const r = ge25519P1p1();
ge25519AddCached(r, p, q);

// 手計算による期待値
const X_plus_Y = p.Y.value + p.X.value;               // 5 + 3 = 8
const Y_minus_X = p.Y.value - p.X.value;              // 5 - 3 = 2
const Z_intermediate = X_plus_Y * q.YplusX.value;     // 8 * 13 = 104
const Y_intermediate = Y_minus_X * q.YminusX.value;   // 2 * 17 = 34
const T_intermediate = q.T2d.value * p.T.value;       // 19 * 11 = 209
const XZ = p.Z.value * q.Z.value;                     // 7 * 23 = 161
const t0 = XZ + XZ;                                   // 161 + 161 = 322

const expectedX = Z_intermediate - Y_intermediate;    // 104 - 34 = 70
const expectedY = Z_intermediate + Y_intermediate;    // 104 + 34 = 138
const expectedZ = t0 + T_intermediate;                // 322 + 209 = 531
const expectedT = t0 - T_intermediate;                // 322 - 209 = 113

// テスト検証
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
