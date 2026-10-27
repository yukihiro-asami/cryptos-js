import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3Mul16 } from '../../../../src/curve25519/ge25519/ge25519-p3-mul16.js';

import { ge25519P3Dbl } from '../../../../src/curve25519/ge25519/ge25519-p3-dbl.js';
import { ge25519P2 } from '../../../../src/curve25519/ge25519/ge25519-p2.js';
import { ge25519P2Dbl } from '../../../../src/curve25519/ge25519/ge25519-p2-dbl.js';
import { ge25519P1p1ToP2 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p2.js';
import { ge25519P1p1ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';

let allPassed = true;

// 元点
const input = ge25519P3();
input.X.value = 2n;
input.Y.value = 3n;
input.Z.value = 1n;
input.T.value = 6n; // X * Y

// 期待値（手動で2倍を4回繰り返す）
const expected = ge25519P3();
expected.X.value = 2n;
expected.Y.value = 3n;
expected.Z.value = 1n;
expected.T.value = 6n;

const r = ge25519P1p1();
const s = ge25519P2();

ge25519P3Dbl(r, expected);     // 2x
ge25519P1p1ToP2(s, r);
ge25519P2Dbl(r, s);            // 4x
ge25519P1p1ToP2(s, r);
ge25519P2Dbl(r, s);            // 8x
ge25519P1p1ToP2(s, r);
ge25519P2Dbl(r, s);            // 16x
ge25519P1p1ToP3(expected, r);  // expected にセット

// テスト対象：同じ入力点を使って16倍させる
const actual = ge25519P3();
actual.X.value = 2n;
actual.Y.value = 3n;
actual.Z.value = 1n;
actual.T.value = 6n;

ge25519P3Mul16(actual); // ← テスト対象！

// 比較関数
function assertFeEqual(label, a, b) {
    if (a.value !== b.value) {
        console.assert(false, `${label} mismatch:\n  expected: ${b.value}\n  actual  : ${a.value}`);
        allPassed = false;
    }
}

assertFeEqual('X', actual.X, expected.X);
assertFeEqual('Y', actual.Y, expected.Y);
assertFeEqual('Z', actual.Z, expected.Z);
assertFeEqual('T', actual.T, expected.T);

if (allPassed) {
    console.log('tests_passed.');
}
