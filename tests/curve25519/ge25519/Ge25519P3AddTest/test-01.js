import { ge25519P3Add } from '../../../../src/curve25519/ge25519/ge25519-p3-add.js';
import { ge25519AddPrecomp } from '../../../../src/curve25519/ge25519/ge25519-add-precomp.js';
import { ge25519Precomp } from '../../../../src/curve25519/ge25519/ge25519-precomp.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { ge25519P1p1ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';

import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';
import { fe25519Invert } from '../../../../src/curve25519/fe25519/fe25519-invert.js';
import { ED25519_2D, P } from '../../../../src/curve25519/const.js';

let allPassed = true;

// フェイク元点 p
const p = ge25519P3();
p.X.value = 3n;
p.Y.value = 5n;
p.Z.value = 7n;
p.T.value = 11n;

// precomp形式の q（成功テストの値と同じ）
const pre = ge25519Precomp();
pre.yplusx.value = 13n;
pre.yminusx.value = 17n;
pre.xy2d.value = 19n;

// r_expected ← Precompから得た値を比較用P3形式に変換
const r1 = ge25519P1p1();
ge25519AddPrecomp(r1, p, pre);

const r_expected = ge25519P3();
ge25519P1p1ToP3(r_expected, r1);

// q（P3形式） ← precompに対応する点を再構成
const q = ge25519P3();
q.Y.value = (pre.yplusx.value + pre.yminusx.value) / 2n; // y = (y+x + y−x)/2
q.X.value = (pre.yplusx.value - pre.yminusx.value) / 2n; // x = (y+x − y−x)/2
q.Z.value = 1n;

// q.T.value = pre.xy2d * (ED25519_2D)^-1 mod p
const inv = fe25519();
fe25519Invert(inv, { value: ED25519_2D });
q.T.value = (pre.xy2d.value * inv.value) % P;

// r を計算
const r = ge25519P3();
ge25519P3Add(r, p, q);

// 比較用reduce関数
const f = v => {
    const tmp = fe25519(); tmp.value = v; fe25519Reduce(tmp); return tmp.value;
};

// 比較
if (f(r.X.value) !== f(r_expected.X.value)) {
    console.assert(false, `r.X expected ${f(r_expected.X.value)}, got ${f(r.X.value)}`);
    allPassed = false;
}
if (f(r.Y.value) !== f(r_expected.Y.value)) {
    console.assert(false, `r.Y expected ${f(r_expected.Y.value)}, got ${f(r.Y.value)}`);
    allPassed = false;
}
if (f(r.Z.value) !== f(r_expected.Z.value)) {
    console.assert(false, `r.Z expected ${f(r_expected.Z.value)}, got ${f(r.Z.value)}`);
    allPassed = false;
}
if (f(r.T.value) !== f(r_expected.T.value)) {
    console.assert(false, `r.T expected ${f(r_expected.T.value)}, got ${f(r.T.value)}`);
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
