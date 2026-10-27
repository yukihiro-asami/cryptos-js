import { ge25519P2 } from '../../../../src/curve25519/ge25519/ge25519-p2.js';
import { ge25519P2Zero } from '../../../../src/curve25519/ge25519/ge25519-p2-zero.js';

let allPassed = true;

const p = ge25519P2();
ge25519P2Zero(p);

const expectedValues = {
    X: 0n,
    Y: 1n,
    Z: 1n,
};

for (const coord of ['X', 'Y', 'Z']) {
    if (!(coord in p)) {
        console.assert(false, `ge25519P2 object should have .${coord} property`);
        allPassed = false;
        continue;
    }

    const field = p[coord];

    if (typeof field !== 'object') {
        console.assert(false, `${coord} should be an object`);
        allPassed = false;
    } else if (!('value' in field)) {
        console.assert(false, `${coord}.value is missing`);
        allPassed = false;
    } else if (typeof field.value !== 'bigint') {
        console.assert(false, `${coord}.value should be a BigInt`);
        allPassed = false;
    } else if (field.value !== expectedValues[coord]) {
        console.assert(false, `${coord}.value should be ${expectedValues[coord]}n`);
        allPassed = false;
    }

    // 書き換えチェック
    field.value = 271828182n;
    if (field.value !== 271828182n) {
        console.assert(false, `${coord}.value should be assignable`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
