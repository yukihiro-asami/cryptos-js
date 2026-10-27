// test-calc-su0.js
import { calcSu0 } from '../../../../src/crypto/sha512/calc-su0.js';

let allPassed = true;
{
    const x = 0xffffffffffffffffn;
    const result = calcSu0(x);
    const expected = 0xffffffffffffffffn;

    if (result !== expected) {
        console.assert(false, `calcSu0(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}
{
    const x = 0x8000000000000000n;
    const result = calcSu0(x);
    const expected = 0x0000000821000000n;

    if (result !== expected) {
        console.assert(false, `calcSu0(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}
{
    const x = 1n;
    const result = calcSu0(x);
    const expected = 0x0000001042000000n;

    if (result !== expected) {
        console.assert(false, `calcSu0(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}
{
    const x = 0n;
    const result = calcSu0(x);
    const expected = 0n;

    if (result !== expected) {
        console.assert(false, `calcSu0(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}
if (allPassed) {
    console.log("tests_passed.");
}
