// test-calc-sl1-zero.js
import { calcSl1 } from '../../../../src/crypto/sha512/calc-sl1.js';

let allPassed = true;

{
    const x = 0n;
    const expected = 0n;
    const result = calcSl1(x);
    if (result !== expected) {
        console.assert(false, `calcSl1(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}
{
    const x = 0x8000000000000000n;
    const expected =  0x0200100000000004n;
    const result = calcSl1(x);
    if (result !== expected) {
        console.assert(false, `calcSl1(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}


if (allPassed) {
    console.log("tests_passed.");
}
