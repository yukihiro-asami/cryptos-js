import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Pow22523 } from '../../../../src/curve25519/fe25519/fe25519-pow22523.js';

const z = fe25519(); z.value = 10n;

const out = fe25519();
fe25519Pow22523(out, z);

const expected = 26805887988379872089515742372285469129990810741729865964264039942540546611171n;

let allPassed = true;
if (out.value !== expected) {
    console.assert(false, `pow22523(10n) failed: got ${out.value}, expected ${expected}`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
