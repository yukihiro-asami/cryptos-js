import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Add } from '../../../../src/curve25519/fe25519/fe25519-add.js';

const f = fe25519();
const g = fe25519();
const h = fe25519();

f.value = 123n;
g.value = 456n;

const expected = 579n;

fe25519Add(h, f, g);

let allPassed = true;
if (h.value !== expected) {
    console.assert(false, `Value mismatch: got ${h.value}, expected ${expected}`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
