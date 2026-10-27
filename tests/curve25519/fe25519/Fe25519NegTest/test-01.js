import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Neg } from '../../../../src/curve25519/fe25519/fe25519-neg.js';
import { fe25519Add } from '../../../../src/curve25519/fe25519/fe25519-add.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';


const f = fe25519();
const neg = fe25519();
const result = fe25519();

// テスト値設定
f.value = 123456789n;

// パターン: -f + f == 0
fe25519Neg(neg, f);     // neg = -f
fe25519Add(result, neg, f);  // result = -f + f
fe25519Reduce(result);

let allPassed = true;
if (result.value !== 0n) {
    console.assert(false, `Neg test failed: got ${result.value}, expected 0n`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
