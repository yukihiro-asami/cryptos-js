import { sc25519 } from '../../../../src/curve25519/sc25519/sc25519.js';
import { sc25519IsCanonical } from '../../../../src/curve25519/sc25519/sc25519-is-canonical.js';
import { L } from '../../../../src/curve25519/const.js';

const testCases = [
    { name: '0 is canonical', value: 0n, expected: true },
    { name: 'L - 1 is canonical', value: L - 1n, expected: true },
    { name: 'L is non-canonical', value: L, expected: false },
    { name: 'L + 1 is non-canonical', value: L + 1n, expected: false },
];

let allPassed = true;

for (const { name, value, expected } of testCases) {
    const x = sc25519();
    x.value = value;
    const result = sc25519IsCanonical(x);
    if (result !== expected) {
        console.error(`FAILED: ${name} (got ${result}, expected ${expected})`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
