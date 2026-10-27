import { ge25519P1p1ToP2 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p2.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { ge25519P2 } from '../../../../src/curve25519/ge25519/ge25519-p2.js';

let allPassed = true;

// フェイクP1P1点を作成
const p = ge25519P1p1();
p.X.value = 3n;
p.Y.value = 5n;
p.Z.value = 7n;
p.T.value = 11n;

// 出力用P2点を作成
const r = ge25519P2();
ge25519P1p1ToP2(r, p);

// 手計算で期待値を確認
const expectedX = p.X.value * p.T.value; // 3 * 11 = 33
const expectedY = p.Y.value * p.Z.value; // 5 * 7  = 35
const expectedZ = p.Z.value * p.T.value; // 7 * 11 = 77

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

if (allPassed) {
    console.log('tests_passed.');
}
