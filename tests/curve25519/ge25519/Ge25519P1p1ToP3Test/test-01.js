import { ge25519P1p1ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';

let allPassed = true;

// 入力p（P1P1形式）にフェイク値を設定
const p = ge25519P1p1();
p.X.value = 2n;
p.Y.value = 3n;
p.Z.value = 5n;
p.T.value = 7n;

// 出力r（P3形式）を空で準備
const r = ge25519P3();
ge25519P1p1ToP3(r, p);

// 期待値
const expectedX = p.X.value * p.T.value; // 2 * 7 = 14
const expectedY = p.Y.value * p.Z.value; // 3 * 5 = 15
const expectedZ = p.Z.value * p.T.value; // 5 * 7 = 35
const expectedT = p.X.value * p.Y.value; // 2 * 3 = 6

// 検証
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
