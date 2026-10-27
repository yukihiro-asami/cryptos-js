import { calcSu0 } from '../../../../src/crypto/sha512/calc-su0.js';

function rotateRight64(x, n) {
    const mask64 = 0xffffffffffffffffn;
    n = BigInt(n % 64);
    return ((x >> n) | (x << (64n - n))) & mask64;
}

function expectedSu0(x) {
    return rotateRight64(x, 28) ^ rotateRight64(x, 34) ^ rotateRight64(x, 39);
}

const testCases = [
    0xffffffffffffffffn,
    0x8000000000000000n,
    1n,
    0n,
];

let allPassed = true;

for (const x of testCases) {
    const result = calcSu0(x);
    const expected = expectedSu0(x);

    if (result !== expected) {
        console.assert(false, `calcSu0(${x.toString(16)}n) failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
