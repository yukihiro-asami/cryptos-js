import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Sq } from '../../../../src/curve25519/fe25519/fe25519-sq.js';

const f = fe25519(); f.value = 2n;
const h = fe25519();

fe25519Sq(h, f);

let allPassed = true;
if (h.value !== 4n) {
    console.assert(false, `Sq test failed: got ${h.value}, expected 4n`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
