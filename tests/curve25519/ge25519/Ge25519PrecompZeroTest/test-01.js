import { ge25519Precomp } from '../../../../src/curve25519/ge25519/ge25519-precomp.js';
import { ge25519PrecompZero } from '../../../../src/curve25519/ge25519/ge25519-precomp-zero.js';

let allPassed = true;

const p = ge25519Precomp();
ge25519PrecompZero(p);

const expected = {
    yplusx: 1n,
    yminusx: 1n,
    xy2d: 0n,
};

for (const field of ['yplusx', 'yminusx', 'xy2d']) {
    if (p[field].value !== expected[field]) {
        console.assert(false, `ge25519PrecompZero should set ${field}.value to ${expected[field]}, got ${p[field].value}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
