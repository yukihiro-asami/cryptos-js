import { calcSu1 } from '../../../../src/crypto/sha512/calc-su1.js';

function rotateRight64(x, n) {
    const mask64 = 0xffffffffffffffffn;
    n = BigInt(n % 64);
    return ((x >> n) | (x << (64n - n))) & mask64;
}

function expectedSu1(x) {
    return rotateRight64(x, 14) ^ rotateRight64(x, 18) ^ rotateRight64(x, 41);
}

const testCases = [
    0xffffffffffffffffn,
    0x8000000000000000n,
    1n,
    0n,
];

let allPassed = true;

for (const x of testCases) {
    const result = calcSu1(x);
    const expected = expectedSu1(x);

    if (result !== expected) {
        console.assert(false, `calcSu1(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
