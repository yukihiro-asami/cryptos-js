import { ge25519Precomp } from '../../../../src/curve25519/ge25519/ge25519-precomp.js';
import { ge25519PrecompZero } from '../../../../src/curve25519/ge25519/ge25519-precomp-zero.js';
import { ge25519Cmov } from '../../../../src/curve25519/ge25519/ge25519-cmov.js';

let allPassed = true;

// 準備：t はゼロ初期化、u は任意の定数で初期化
const t = ge25519Precomp();
const u = ge25519Precomp();
ge25519PrecompZero(u);
const uTest = ge25519Precomp();
uTest.yplusx.value = 11n;
uTest.yminusx.value = 22n;
uTest.xy2d.value = 33n;

// case 1: b = 0（変更されない）
t.yplusx.value = 1000n;
t.yminusx.value = 2000n;
t.xy2d.value = 3000n;

ge25519Cmov(t, uTest, 0);

if (t.yplusx.value !== 1000n) {
    console.assert(false, `b=0: yplusx should remain 1000n`);
    allPassed = false;
}
if (t.yminusx.value !== 2000n) {
    console.assert(false, `b=0: yminusx should remain 2000n`);
    allPassed = false;
}
if (t.xy2d.value !== 3000n) {
    console.assert(false, `b=0: xy2d should remain 3000n`);
    allPassed = false;
}

// case 2: b = 1（コピーされる）
ge25519Cmov(t, uTest, 1);

if (t.yplusx.value !== 11n) {
    console.assert(false, `b=1: yplusx should be 11n`);
    allPassed = false;
}
if (t.yminusx.value !== 22n) {
    console.assert(false, `b=1: yminusx should be 22n`);
    allPassed = false;
}
if (t.xy2d.value !== 33n) {
    console.assert(false, `b=1: xy2d should be 33n`);
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
