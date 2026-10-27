import { ge25519Cmov8 } from '../../../../src/curve25519/ge25519/ge25519-cmov8.js';
import { ge25519Precomp } from '../../../../src/curve25519/ge25519/ge25519-precomp.js';

let allPassed = true;

//  テーブル準備（各インデックス = 値 * 10n）
const precomp = [];
for (let i = 0; i < 8; i++) {
    const p = ge25519Precomp();
    const v = BigInt((i + 1) * 10);
    p.yplusx.value = v + 1n;
    p.yminusx.value = v + 2n;
    p.xy2d.value    = v + 3n;
    precomp.push(p);
}

//  case: b = +3 → precomp[2] がそのまま入る
{
    const t = ge25519Precomp();
    ge25519Cmov8(t, precomp, 3);
    if (t.yplusx.value !== 31n) {
        console.assert(false, `b=3: yplusx should be 31n, got ${t.yplusx.value}`);
        allPassed = false;
    }
    if (t.yminusx.value !== 32n) {
        console.assert(false, `b=3: yminusx should be 32n, got ${t.yminusx.value}`);
        allPassed = false;
    }
    if (t.xy2d.value !== 33n) {
        console.assert(false, `b=3: xy2d should be 33n, got ${t.xy2d.value}`);
        allPassed = false;
    }
}

//  case: b = -3 → precomp[2] が反転されて入る
{
    const t = ge25519Precomp();
    ge25519Cmov8(t, precomp, -3);
    if (t.yplusx.value !== 32n) {
        console.assert(false, `b=-3: yplusx should be yminusx (32n), got ${t.yplusx.value}`);
        allPassed = false;
    }
    if (t.yminusx.value !== 31n) {
        console.assert(false, `b=-3: yminusx should be yplusx (31n), got ${t.yminusx.value}`);
        allPassed = false;
    }
    const expectedNeg = (1n << 255n) - 19n - 33n; // P - 33n
    if (t.xy2d.value !== expectedNeg) {
        console.assert(false, `b=-3: xy2d should be -33n mod P, got ${t.xy2d.value}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
