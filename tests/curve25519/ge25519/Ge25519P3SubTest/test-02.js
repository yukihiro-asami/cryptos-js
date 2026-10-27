import { ge25519AddPrecomp } from '../../../../src/curve25519/ge25519/ge25519-add-precomp.js';
import { ge25519SubPrecomp } from '../../../../src/curve25519/ge25519/ge25519-sub-precomp.js';
import { ge25519P1p1ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Mul } from '../../../../src/curve25519/fe25519/fe25519-mul.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';
import { BASE_POINT_PRE_COMPUTED_TABLE_RADIX2 } from '../../../../src/curve25519/const.js';

// 比較用：射影座標の同値判定
function normalized(fe) {
    const tmp = fe25519();
    tmp.value = fe.value;
    fe25519Reduce(tmp);
    return tmp.value;
}

function p3EqualsProjective(p1, p2) {
    const tmp1 = fe25519(), tmp2 = fe25519();

    fe25519Mul(tmp1, p1.X, p2.Z);
    fe25519Mul(tmp2, p2.X, p1.Z);
    if (normalized(tmp1) !== normalized(tmp2)) return false;

    fe25519Mul(tmp1, p1.Y, p2.Z);
    fe25519Mul(tmp2, p2.Y, p1.Z);
    if (normalized(tmp1) !== normalized(tmp2)) return false;

    return true;
}

// === テスト本体 ===

// 0点
const zero = ge25519P3();
ge25519P3Zero(zero);

// q = [1]B
const q = BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0];

// p = 0 + q = [1]B
const tmp1 = ge25519P1p1();
ge25519AddPrecomp(tmp1, zero, q);
const p = ge25519P3();
ge25519P1p1ToP3(p, tmp1);

// r = p - q = 0
const tmp2 = ge25519P1p1();
ge25519SubPrecomp(tmp2, p, q);
const r = ge25519P3();
ge25519P1p1ToP3(r, tmp2);

// 検証
if (p3EqualsProjective(r, zero)) {
    console.log('tests_passed.');
} else {
    console.error('❌ 失敗: [1]B - [1]B != 0');
}
