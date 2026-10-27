import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Sq } from '../../../../src/curve25519/fe25519/fe25519-sq.js';
import { P } from '../../../../src/curve25519/const.js';
import {fe25519Reduce} from "../../../../src/curve25519/fe25519/fe25519-reduce.js";

const testVals = [
    0n,
    1n,
    2n,
    19n,
    (1n << 255n) - 20n,
    (1n << 255n) - 19n,
    (1n << 255n) + 1n,
    (1n << 256n),
    (1n << 300n),
];

let allPassed = true;

for (const x of testVals) {
    const f = fe25519(); f.value = x;
    const h = fe25519();

    fe25519Sq(h, f);
    fe25519Reduce(h);
    const expected = (x % P) ** 2n % P;
    if (h.value !== expected) {
        console.assert(false, `fe25519Sq failed for ${x}n: got ${h.value}, expected ${expected}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
