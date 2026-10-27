import { calcSl0 } from '../../../../src/crypto/sha512/calc-sl0.js';

let allPassed = true;

{
    const x = 0n;
    const expected = 0n;
    const result = calcSl0(x);
    if (result !== expected) {
        console.assert(false, `calcSl0(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}
{
    const x = 0x8000000000000000n;
    const expected = 0x4180000000000000n;
    const result = calcSl0(x);
    if (result !== expected) {
        console.assert(false, `calcSl0(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}
{
    const x = 1n;
    const expected = 0x8100000000000000n;
    const result = calcSl0(x);
    if (result !== expected) {
        console.assert(false, `calcSl0(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}
if (allPassed) {
    console.log("tests_passed.");
}
