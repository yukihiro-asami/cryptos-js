import { equal } from '../../../../src/curve25519/ge25519/equal.js'; // 適切なパスに調整してください

let allPassed = true;

// 等しい値（Uint8Array前提で 0–255 の範囲）
if (equal(0, 0) !== 1) {
    console.assert(false, 'equal(0, 0) should return 1');
    allPassed = false;
}
if (equal(255, 255) !== 1) {
    console.assert(false, 'equal(255, 255) should return 1');
    allPassed = false;
}
if (equal(128, 128) !== 1) {
    console.assert(false, 'equal(128, 128) should return 1');
    allPassed = false;
}

if (equal(0, 1) !== 0) {
    console.assert(false, 'equal(0, 1) should return 0');
    allPassed = false;
}
if (equal(123, 122) !== 0) {
    console.assert(false, 'equal(123, 122) should return 0');
    allPassed = false;
}
if (equal(255, 0) !== 0) {
    console.assert(false, 'equal(255, 0) should return 0');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
