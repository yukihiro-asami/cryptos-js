import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';
import { montgomeryLadder } from '../../../../src/curve25519/x25519/montgomery-ladder.js';
import { P } from '../../../../src/curve25519/const.js';

let allPassed = true;

// スカラー（例：9n）
const k = 9n;

// 入力点 u（モントゴメリーのベースポイント）
const u = fe25519();
u.value = 9n;
fe25519Reduce(u); // 念のため正規化

let result;

try {
    result = montgomeryLadder(k, u);
} catch (e) {
    console.assert(false, 'montgomeryLadder threw an error: ' + e.message);
    allPassed = false;
}

// 結果チェック：BigIntかどうか
if (typeof result !== 'bigint') {
    console.assert(false, 'Result should be a BigInt');
    allPassed = false;
}

// 結果チェック：0 <= result < P
if (result < 0n || result >= P) {
    console.assert(false, 'Result is out of field range: 0 <= result < P');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
