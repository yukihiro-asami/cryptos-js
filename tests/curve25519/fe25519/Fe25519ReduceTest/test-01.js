import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';
import { P } from '../../../../src/curve25519/const.js';

const h = fe25519();

h.value = P + 123n;

fe25519Reduce(h);

const expected = 123n;

let allPassed = true;

if (h.value !== expected) {
    console.assert(false, `fe25519Reduce failed: got ${h.value}, expected ${expected}`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
