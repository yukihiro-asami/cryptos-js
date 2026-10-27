import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Invert } from '../../../../src/curve25519/fe25519/fe25519-invert.js';
import { fe25519Mul } from '../../../../src/curve25519/fe25519/fe25519-mul.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';

const z = fe25519(); z.value = 5n;
const inv = fe25519();
const product = fe25519();

fe25519Invert(inv, z);
fe25519Mul(product, z, inv);
fe25519Reduce(product);

let allPassed = true;
if (product.value !== 1n) {
    console.assert(false, `Invert test failed: got ${product.value}, expected 1n`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
