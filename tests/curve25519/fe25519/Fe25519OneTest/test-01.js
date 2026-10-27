import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519One } from '../../../../src/curve25519/fe25519/fe25519-one.js';

const expected = 1n;

const h = fe25519();
h.value = 987654321n;
fe25519One(h);

let allPassed = true;
if (h.value !== expected) {
    console.assert(false, `Value mismatch: got ${h.value}, expected ${expected}`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
