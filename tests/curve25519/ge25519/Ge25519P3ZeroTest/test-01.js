import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';

let allPassed = true;

const p = ge25519P3();
ge25519P3Zero(p);

const expected = {
    X: 0n,
    Y: 1n,
    Z: 1n,
    T: 0n,
};

for (const coordinate of ['X', 'Y', 'Z', 'T']) {
    if (p[coordinate].value !== expected[coordinate]) {
        console.assert(false, `ge25519P3Zero should set ${coord}.value to ${expected[coord]}, got ${p[coord].value}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
