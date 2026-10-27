import { calcSl1 } from '../../../../src/crypto/sha512/calc-sl1.js';

function rotateRight64(x, n) {
    const mask = 0xffffffffffffffffn;
    n = BigInt(n % 64);
    return ((x >> n) | (x << (64n - n))) & mask;
}

function shiftRight64(x, n) {
    const mask = 0xffffffffffffffffn;
    return (x >> BigInt(n)) & (mask >> BigInt(n));
}

function expectedSl1(x) {
    return rotateRight64(x, 19) ^ rotateRight64(x, 61) ^ shiftRight64(x, 6);
}

const testCases = [
    0n,
    0x8000000000000000n,
    1n,
    0xffffffffffffffffn,
];

let allPassed = true;

for (const x of testCases) {
    const expected = expectedSl1(x);
    const result = calcSl1(x);
    if (result !== expected) {
        console.assert(false, `calcSl1(${x.toString(16)}n) failed:\n  got      = ${result.toString(16)}\n  expected = ${expected.toString(16)}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
