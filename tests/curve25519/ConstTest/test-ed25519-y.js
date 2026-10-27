// noinspection DuplicatedCode

import { fe25519 } from '../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Invert } from '../../../src/curve25519/fe25519/fe25519-invert.js';
import { fe25519Mul } from '../../../src/curve25519/fe25519/fe25519-mul.js';
import { fe25519Reduce } from '../../../src/curve25519/fe25519/fe25519-reduce.js';
import { ED25519_BASE_Y, P } from '../../../src/curve25519/const.js';

let allPassed = true;

// === ステップ 1: y = 4 / 5 mod p ===
{
    const a = fe25519(); a.value = 4n;
    const b = fe25519(); b.value = 5n;
    const invB = fe25519();
    const y = fe25519();

    fe25519Invert(invB, b);
    fe25519Mul(y, a, invB);
    fe25519Reduce(y);

    if (y.value !== ED25519_BASE_Y) {
        console.assert(false, `ED25519_BASE_Y mismatch: got ${ED25519_BASE_Y}, expected ${y.value}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
