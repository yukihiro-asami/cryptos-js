import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';

let allPassed = true;

const p = ge25519P1p1();

// 構造チェック
for (const coord of ['X', 'Y', 'Z', 'T']) {
    if (!(coord in p)) {
        console.assert(false, `ge25519P1p1 object should have .${coord} property`);
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

    // 書き換えチェック
    field.value = 987654321n;
    if (field.value !== 987654321n) {
        console.assert(false, `${coord}.value should be assignable`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}