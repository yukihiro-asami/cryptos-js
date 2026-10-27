import { ge25519P3ToCached } from '../../../../src/curve25519/ge25519/ge25519-p3-to-cached.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519Cached } from '../../../../src/curve25519/ge25519/ge25519-cached.js';

import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';
import { ED25519_2D } from '../../../../src/curve25519/const.js';

let allPassed = true;

// フェイクP3点を作成
const p = ge25519P3();
p.X.value = 2n;
p.Y.value = 10n;
p.Z.value = 123n;
p.T.value = 7n;

// 出力用cached点を作成
const r = ge25519Cached();
ge25519P3ToCached(r, p);

// 手計算で期待値を作成し、必要な場合は正規化
const expectedYplusX = p.Y.value + p.X.value;
const expectedYminusX = p.Y.value - p.X.value;
const expectedZ = p.Z.value;

const expectedT2d = { value: p.T.value * ED25519_2D };
fe25519Reduce(expectedT2d);

// 検証
if (r.YplusX.value !== expectedYplusX) {
    console.assert(false, `r.YplusX expected ${expectedYplusX}, got ${r.YplusX.value}`);
    allPassed = false;
}
if (r.YminusX.value !== expectedYminusX) {
    console.assert(false, `r.YminusX expected ${expectedYminusX}, got ${r.YminusX.value}`);
    allPassed = false;
}
if (r.Z.value !== expectedZ) {
    console.assert(false, `r.Z expected ${expectedZ}, got ${r.Z.value}`);
    allPassed = false;
}
if (r.T2d.value !== expectedT2d.value) {
    console.assert(false, `r.T2d expected ${expectedT2d.value}, got ${r.T2d.value}`);
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
