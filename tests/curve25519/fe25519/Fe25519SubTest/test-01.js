import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Sub } from '../../../../src/curve25519/fe25519/fe25519-sub.js';

const f = fe25519();
const g = fe25519();
const h = fe25519();

f.value = 123n;
g.value = 23n;

const expected = 100n;

fe25519Sub(h, f, g);

let allPassed = true;
if (h.value !== expected) {
    console.assert(false, `Value mismatch: got ${h.value}, expected ${expected}`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
