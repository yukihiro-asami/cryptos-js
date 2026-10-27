import { L } from '../../../src/curve25519/const.js';

let allPassed = true;

{
    const expected = (1n << 252n) + 27742317777372353535851937790883648493n;
    if (L !== expected) {
        console.assert(false, `L mismatch: got ${L}, expected ${expected}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}