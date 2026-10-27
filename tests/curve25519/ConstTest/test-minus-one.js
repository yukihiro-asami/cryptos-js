import { P, SQRT_MINUS_1 } from '../../../src/curve25519/const.js';

let allPassed = true;

// SQRT_MINUS_1^2 mod P ≡ -1 mod P を確認する
{
    const minusOne = (P - 1n) % P;
    const square = (SQRT_MINUS_1 * SQRT_MINUS_1) % P;

    if (square !== minusOne) {
        console.assert(false, `SQRT_MINUS_1 test failed: got ${square}, expected ${minusOne}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
