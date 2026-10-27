import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Copy } from '../../../../src/curve25519/fe25519/fe25519-copy.js';

const f = fe25519();
const h = fe25519();

f.value = 123456789n;
fe25519Copy(h, f);

let allPassed = true;
if (h.value !== f.value) {
    console.assert(false, `Copy test failed: got ${h.value}, expected ${f.value}`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
