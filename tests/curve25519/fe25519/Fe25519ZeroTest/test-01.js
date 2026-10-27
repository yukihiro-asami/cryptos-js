import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Zero } from '../../../../src/curve25519/fe25519/fe25519-zero.js';

const expected = 0n;

const h = fe25519();
h.value = 123456789n;
fe25519Zero(h);

let allPassed = true;
if (h.value !== expected) {
    console.assert(false, `Value mismatch: got ${h.value}, expected ${expected}`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
