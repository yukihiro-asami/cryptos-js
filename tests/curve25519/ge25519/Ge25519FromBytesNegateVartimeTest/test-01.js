import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519FromBytesNegateVartime } from '../../../../src/curve25519/ge25519/ge25519-from-bytes-negate-vartime.js';
import { ge25519P3ToBytes } from '../../../../src/curve25519/ge25519/ge25519-p3-to-bytes.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';

let allPassed = true;

// 単純な点：Y = 0, X = 0, Z = 1, T = 0
const p = ge25519P3();
ge25519P3Zero(p);

// バイト列に変換
const input = new Uint8Array(32);
ge25519P3ToBytes(input, p);

// バイト列から復元
const h = ge25519P3();
const result = ge25519FromBytesNegateVartime(h, input);

// 復元失敗チェック
if (result !== 0) {
    console.assert(false, 'ge25519FromBytesNegateVartime should return 0');
    allPassed = false;
}

console.log(h);

// 各フィールド値を照合
if (p.X.value !== h.X.value) {
    console.assert(false, 'X mismatch');
    allPassed = false;
}
if (p.Y.value !== h.Y.value) {
    console.assert(false, 'Y mismatch');
    allPassed = false;
}
if (p.Z.value !== h.Z.value) {
    console.assert(false, 'Z mismatch');
    allPassed = false;
}
if (p.T.value !== h.T.value) {
    console.assert(false, 'T mismatch');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
