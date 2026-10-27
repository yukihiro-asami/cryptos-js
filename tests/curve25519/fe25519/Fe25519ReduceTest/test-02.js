import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';
import { P } from '../../../../src/curve25519/const.js';

let allPassed = true;

// 負の値：-2P + 456 → 456
{
    const h = fe25519();
    h.value = -2n * P + 456n;

    fe25519Reduce(h);

    const expected = 456n;

    if (h.value !== expected) {
        console.assert(false, `fe25519Reduce failed on negative input: got ${h.value}, expected ${expected}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
