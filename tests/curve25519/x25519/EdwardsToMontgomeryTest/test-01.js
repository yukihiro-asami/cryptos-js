import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { edwardsToMontgomery } from '../../../../src/curve25519/x25519/edwards-to-montgomery.js';

let allPassed = true;

// 初期化
const edwardsY = fe25519();
const edwardsZ = fe25519();
const montgomeryX = fe25519();

// 任意の値を代入（Z ≠ Y にする）
edwardsY.value = 5n;
edwardsZ.value = 9n;

// 実行
try {
    edwardsToMontgomery(montgomeryX, edwardsY, edwardsZ);
} catch (e) {
    console.assert(false, 'edwardsToMontgomery threw an error: ' + e.message);
    allPassed = false;
}

// 結果チェック：valueがBigIntか
if (typeof montgomeryX.value !== 'bigint') {
    console.assert(false, 'montgomeryX.value should be a BigInt');
    allPassed = false;
}

// 結果チェック：変化があったか（初期値0nでない）
if (montgomeryX.value === 0n) {
    console.assert(false, 'montgomeryX.value should not remain 0n after transformation');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
