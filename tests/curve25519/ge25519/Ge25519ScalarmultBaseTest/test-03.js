import { sc25519 } from '../../../../src/curve25519/sc25519/sc25519.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519ScalarmultBase } from '../../../../src/curve25519/ge25519/ge25519-scalarmult-base.js';
import { ge25519P3Reduce } from '../../../../src/curve25519/ge25519/ge25519-p3-reduce.js';
import { L } from '../../../../src/curve25519/const.js';

let allPassed = true;

const scalar = sc25519();
scalar.value = L - 1n;

const h = ge25519P3();

try {
    ge25519ScalarmultBase(h, scalar);
    console.log(h);

    for (const coord of ['X', 'Y', 'Z', 'T']) {
        if (typeof h[coord]?.value !== 'bigint') {
            console.assert(false, `${coord}.value is not BigInt`);
            allPassed = false;
        }
    }

    if (allPassed) {
        console.log('scalarmult(L - 1) completed successfully.');
    }
} catch (err) {
    console.error('scalarmult(L - 1) failed with exception:', err);
}
