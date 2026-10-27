import { word64Shift } from '../../../../src/crypto/sha512/word64-shift.js';

let allPassed = true;

{
    // SHR 1(0xFFFFFFFFFFFFFFFF) === 0x7FFFFFFFFFFFFFFF
    const input = 0xFFFFFFFFFFFFFFFFn;
    const shift = 1;
    const expected = 0x7FFFFFFFFFFFFFFFn;
    const result = word64Shift(input, shift);

    if (result !== expected) {
        console.assert(false, `Test failed: word64Shift(${input}, ${shift}) = ${result}, expected ${expected}`);
        allPassed = false;
    }
}

{
    // SHR 0(0x1234567890ABCDEFn) === 0x1234567890ABCDEFn
    const input = 0x1234567890ABCDEFn;
    const shift = 0;
    const expected = 0x1234567890ABCDEFn;
    const result = word64Shift(input, shift);

    if (result !== expected) {
        console.assert(false, `Test failed: word64Shift(${input}, ${shift}) = ${result}, expected ${expected}`);
        allPassed = false;
    }
}

{
    // SHR 4(0x10n) === 0x1n
    const input = 0x10n;
    const shift = 4;
    const expected = 0x1n;
    const result = word64Shift(input, shift);

    if (result !== expected) {
        console.assert(false, `Test failed: word64Shift(${input}, ${shift}) = ${result}, expected ${expected}`);
        allPassed = false;
    }
}

{
    // SHR 63(0x8000000000000000n) === 0x1n
    const input = 0x8000000000000000n;
    const shift = 63;
    const expected = 0x1n;
    const result = word64Shift(input, shift);

    if (result !== expected) {
        console.assert(false, `Test failed: word64Shift(${input}, ${shift}) = ${result}, expected ${expected}`);
        allPassed = false;
    }
}

{
    // SHR 64(0xFFFFFFFFFFFFFFFFn) === 0x0n
    const input = 0xFFFFFFFFFFFFFFFFn;
    const shift = 64;
    const expected = 0x0n;
    const result = word64Shift(input, shift);

    if (result !== expected) {
        console.assert(false, `Test failed: word64Shift(${input}, ${shift}) = ${result}, expected ${expected}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
