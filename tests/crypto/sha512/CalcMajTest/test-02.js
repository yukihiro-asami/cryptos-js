import { calcMaj } from '../../../../src/crypto/sha512/calc-maj.js';

let allPassed = true;

const msb = 0x8000000000000000n;

const testCases = [
    // [xBit, yBit, zBit, expectedBit]
    [0n, 0n, 0n, 0n],
    [0n, 0n, 1n, 0n],
    [0n, 1n, 0n, 0n],
    [0n, 1n, 1n, 1n],
    [1n, 0n, 0n, 0n],
    [1n, 0n, 1n, 1n],
    [1n, 1n, 0n, 1n],
    [1n, 1n, 1n, 1n],
];

for (const [xBit, yBit, zBit, expectedBit] of testCases) {
    const x = xBit * msb;
    const y = yBit * msb;
    const z = zBit * msb;
    const expected = expectedBit * msb;
    const result = calcMaj(x, y, z);

    const caseLabel = `calcMaj(${x.toString(16)}n, ${y.toString(16)}n, ${z.toString(16)}n) [msb]`;
    if (result !== expected) {
        console.assert(false, `${caseLabel} failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
