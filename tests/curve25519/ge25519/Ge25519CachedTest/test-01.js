import { ge25519Cached } from '../../../../src/curve25519/ge25519/ge25519-cached.js';

let allPassed = true;

const c = ge25519Cached();

// 構造チェック
for (const coord of ['YplusX', 'YminusX', 'Z', 'T2d']) {
    if (!(coord in c)) {
        console.assert(false, `ge25519Cached object should have .${coord} property`);
        allPassed = false;
        continue;
    }
    const field = c[coord];
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

    // 書き換えチェック
    field.value = 123456789n;
    if (field.value !== 123456789n) {
        console.assert(false, `${coord}.value should be assignable`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}