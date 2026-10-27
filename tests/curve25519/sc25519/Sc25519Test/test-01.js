import { sc25519 } from '../../../../src/curve25519/sc25519/sc25519.js';

let allPassed = true;

const s = sc25519();

// 構造チェック
if (typeof s !== 'object') {
    console.assert(false, 'sc25519() should return an object');
    allPassed = false;
}
if (!('value' in s)) {
    console.assert(false, 'sc25519 object should have .value property');
    allPassed = false;
}
if (typeof s.value !== 'bigint') {
    console.assert(false, '.value should be a BigInt');
    allPassed = false;
}
if (s.value !== 0n) {
    console.assert(false, '.value should initialize to 0n');
    allPassed = false;
}

// 書き換えチェック
s.value = 123456789n;
if (s.value !== 123456789n) {
    console.assert(false, '.value should be assignable');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
