import { ge25519Precomp } from '../../../../src/curve25519/ge25519/ge25519-precomp.js';

let allPassed = true;

const p = ge25519Precomp();

for (const coord of ['yplusx', 'yminusx', 'xy2d']) {
    if (!(coord in p)) {
        console.assert(false, `ge25519Precomp object should have .${coord} property`);
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
    } else if (field.value !== 0n) {
        console.assert(false, `${coord}.value should initialize to 0n`);
        allPassed = false;
    }

    // 書き換え確認
    field.value = 42n;
    if (field.value !== 42n) {
        console.assert(false, `${coord}.value should be assignable`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
