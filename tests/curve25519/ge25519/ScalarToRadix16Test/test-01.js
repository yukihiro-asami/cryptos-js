import { sc25519 } from '../../../../src/curve25519/sc25519/sc25519.js';
import { scalarToRadix16 } from '../../../../src/curve25519/ge25519/scalar-to-radix16.js';

let allPassed = true;

// テスト対象のスカラー値（例: 適当なBigInt値）
const testValue = 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefn;

const scalar = sc25519();
scalar.value = testValue;

const e = scalarToRadix16(scalar);

// 構造チェックと値の範囲チェック
if (!(e instanceof Int8Array) || e.length !== 64) {
    console.assert(false, 'scalarToRadix16 should return Int8Array(64)');
    allPassed = false;
} else {
    for (let i = 0; i < 64; i++) {
        const v = e[i];
        if (typeof v !== 'number') {
            console.assert(false, `e[${i}] is not a number`);
            allPassed = false;
        } else if (v < -8 || v > 8) {
            console.assert(false, `e[${i}] = ${v} is out of range [-8, 8]`);
            allPassed = false;
        }
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
