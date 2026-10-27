import { BASE_POINT_PRE_COMPUTED_TABLE_RADIX2 } from '../../../../src/curve25519/const.js';

import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { ge25519AddPrecomp } from '../../../../src/curve25519/ge25519/ge25519-add-precomp.js';
import { ge25519P1p1ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';
import { ge25519P3Mul16 } from '../../../../src/curve25519/ge25519/ge25519-p3-mul16.js';
import { ge25519P3ToBytes } from '../../../../src/curve25519/ge25519/ge25519-p3-to-bytes.js';
import { ge25519FromBytesNegateVartime } from '../../../../src/curve25519/ge25519/ge25519-from-bytes-negate-vartime.js';

let allPassed = true;

// 1. ゼロ点 + B1 を生成
const A = ge25519P3();
ge25519P3Zero(A);
const t1 = ge25519P1p1();
ge25519AddPrecomp(t1, A, BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0]); // B1
ge25519P1p1ToP3(A, t1);

// 2. 16倍
ge25519P3Mul16(A);

// 3. バイト列に変換
const bytes = new Uint8Array(32);
ge25519P3ToBytes(bytes, A);

// 4. 復元
const B = ge25519P3();
const res = ge25519FromBytesNegateVartime(B, bytes);

// 5. 結果確認
if (res !== 0) {
    console.assert(false, 'ge25519FromBytesNegateVartime failed on 16×B1');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
