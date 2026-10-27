import { ge25519AddPrecomp } from '../../../../src/curve25519/ge25519/ge25519-add-precomp.js';
import { ge25519SubPrecomp } from '../../../../src/curve25519/ge25519/ge25519-sub-precomp.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';
import { ge25519P1p1ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Mul } from '../../../../src/curve25519/fe25519/fe25519-mul.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';
import { BASE_POINT_PRE_COMPUTED_TABLE_RADIX2 } from '../../../../src/curve25519/const.js';

// 正規化して BigInt 値を返す
function normalized(fe) {
    const tmp = fe25519();
    tmp.value = fe.value;
    fe25519Reduce(tmp);
    return tmp.value;
}

// 射影座標での等価性を確認（X1*Z2 == X2*Z1, Y1*Z2 == Y2*Z1）
function p3EqualsProjective(p1, p2) {
    const tmp1 = fe25519(), tmp2 = fe25519();

    // X
    fe25519Mul(tmp1, p1.X, p2.Z);
    fe25519Mul(tmp2, p2.X, p1.Z);
    if (normalized(tmp1) !== normalized(tmp2)) return false;

    // Y
    fe25519Mul(tmp1, p1.Y, p2.Z);
    fe25519Mul(tmp2, p2.Y, p1.Z);
    if (normalized(tmp1) !== normalized(tmp2)) return false;

    return true;
}

// --- テスト開始 ---

// ベースポイント0としてゼロ点使用
const p0 = {
    X: fe25519(), Y: fe25519(), Z: fe25519(), T: fe25519()
};
ge25519P3Zero(p0);

// 1倍の precomp 点を使用
const q = BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[0];

// p0 + q
const r_add = ge25519P1p1();
ge25519AddPrecomp(r_add, p0, q);
const p1 = {
    X: fe25519(), Y: fe25519(), Z: fe25519(), T: fe25519()
};
ge25519P1p1ToP3(p1, r_add);

// p1 - q
const r_sub = ge25519P1p1();
ge25519SubPrecomp(r_sub, p1, q);
const p2 = {
    X: fe25519(), Y: fe25519(), Z: fe25519(), T: fe25519()
};
ge25519P1p1ToP3(p2, r_sub);

// 比較
if (p3EqualsProjective(p0, p2)) {
    console.log('tests_passed.');
} else {
    console.error('❌ 単純往復テスト: NG');
    console.log('期待値:', p0);
    console.log('実際値:', p2);
}
