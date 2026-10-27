import { word32Rotate } from '../../../../src/crypto/chacha20poly1305/word32-rotate.js';

let allPassed = true;

const testCases = [
    // [value, rotateAmount, expectedResult]
    [0x80000000, 1, 0x00000001],
    [0x80000000, 4, 0x00000008],
    [0x80000000, 31, 0x40000000],

    [0x00000001, 1, 0x00000002],
    [0x00000001, 4, 0x00000010],
    [0x00000001, 31, 0x80000000],
];

const indices = [0, 15];

for (const [value, rotateAmount, expected] of testCases) {
    for (const i of indices) {
        const a = new Uint32Array(16);
        a[i] = value;

        word32Rotate(a, i, rotateAmount);

        const result = a[i];
        const caseLabel = `word32Rotate([${value.toString(16)}] @ ${i}, n=${rotateAmount})`;

        if (result !== expected) {
            console.assert(false, `${caseLabel} failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
            allPassed = false;
        }
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
