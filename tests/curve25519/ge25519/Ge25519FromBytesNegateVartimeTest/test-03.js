import { BASE_POINT_PRE_COMPUTED_TABLE_RADIX2 } from '../../../../src/curve25519/const.js';

import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { ge25519AddPrecomp } from '../../../../src/curve25519/ge25519/ge25519-add-precomp.js';
import { ge25519P1p1ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';
import { ge25519P3ToBytes } from '../../../../src/curve25519/ge25519/ge25519-p3-to-bytes.js';
import { ge25519FromBytesNegateVartime } from '../../../../src/curve25519/ge25519/ge25519-from-bytes-negate-vartime.js';

let allPassed = true;

// 1. B1点を構築（ゼロ点 + B1加算）
const A = ge25519P3();
ge25519P3Zero(A);
const t1 = ge25519P1p1();
ge25519AddPrecomp(t1, A, BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0]);
ge25519P1p1ToP3(A, t1);

// 2. A をバイト列に変換
const bytes = new Uint8Array(32);
ge25519P3ToBytes(bytes, A);

// 3. 復元
const B = ge25519P3();
const res = ge25519FromBytesNegateVartime(B, bytes);

if (res !== 0) {
    console.assert(false, 'ge25519FromBytesNegateVartime failed for base point B1');
    allPassed = false;
}
// 5. 再シリアライズ（B → bytes2）
const bytes2 = new Uint8Array(32);
ge25519P3ToBytes(bytes2, B);

// NegateVartime returns -A. For this nonzero-x base point, only the sign bit changes.
const expected = bytes.slice();
expected[31] ^= 0x80;

// 6. バイト列比較
for (let i = 0; i < 32; i++) {
    if (expected[i] !== bytes2[i]) {
        console.assert(false, `Byte mismatch at index ${i}:\n  negated=${expected[i]}\n  roundtrip=${bytes2[i]}`);
        allPassed = false;
        break;
    }
}
// Negating once more must recover A.
const C = ge25519P3();
const secondResult = ge25519FromBytesNegateVartime(C, bytes2);
console.assert(secondResult === 0, 'second negating decode must succeed');
if (secondResult !== 0) allPassed = false;
const bytes3 = new Uint8Array(32);
ge25519P3ToBytes(bytes3, C);
const recovered = bytes.every((byte, i) => byte === bytes3[i]);
console.assert(recovered, 'double negation must recover the original point');
if (!recovered) allPassed = false;
if (allPassed) {
    console.log('tests_passed.');
}
