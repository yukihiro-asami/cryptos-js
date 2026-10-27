import { calcMaj } from '../../../../src/crypto/sha512/calc-maj.js';

let allPassed = true;

const msb = 0x8000000000000000n;
const lsb = 0x1n;

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
    const variants = [
        { label: 'msb', mask: msb },
        { label: 'lsb', mask: lsb },
    ];

    for (const { label, mask } of variants) {
        const x = xBit * mask;
        const y = yBit * mask;
        const z = zBit * mask;
        const expected = expectedBit * mask;
        const result = calcMaj(x, y, z);

        const caseLabel = `calcMaj(${x.toString(16)}n, ${y.toString(16)}n, ${z.toString(16)}n) [${label}]`;
        if (result !== expected) {
            console.assert(false, `${caseLabel} failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
            allPassed = false;
        }
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
