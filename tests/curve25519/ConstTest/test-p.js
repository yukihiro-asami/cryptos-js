import { P } from '../../../src/curve25519/const.js';

let allPassed = true;

{
    const calculated = (1n << 255n) - 19n;

    if (P !== calculated) {
        console.assert(false, `P constant mismatch: got ${P}, expected ${calculated}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
