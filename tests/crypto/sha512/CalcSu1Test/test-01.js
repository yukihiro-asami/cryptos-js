import { calcSu1 } from '../../../../src/crypto/sha512/calc-su1.js';

let allPassed = true;

{
    const x = 0x8000000000000000n;
    const expected = 0x2200000400000n;
    const result = calcSu1(x);
    if (result !== expected) {
        console.assert(false, `calcSu1(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}

{
    const x = 1n;
    const expected = 0x4400000800000n;
    const result = calcSu1(x);
    if (result !== expected) {
        console.assert(false, `calcSu1(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
