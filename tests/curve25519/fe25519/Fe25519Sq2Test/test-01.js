import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Sq2 } from '../../../../src/curve25519/fe25519/fe25519-sq2.js';

const f = fe25519(); f.value = 2n;
const h = fe25519();

fe25519Sq2(h, f);

let allPassed = true;
if (h.value !== 8n) {
    console.assert(false, `Sq2 test failed: got ${h.value}, expected 8n`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
