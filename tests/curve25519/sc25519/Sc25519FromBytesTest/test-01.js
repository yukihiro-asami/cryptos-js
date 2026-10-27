import { sc25519 } from '../../../../src/curve25519/sc25519/sc25519.js';
import { sc25519FromBytes } from '../../../../src/curve25519/sc25519/sc25519-from-bytes.js';
import { L } from '../../../../src/curve25519/const.js';

let allPassed = true;

// テスト用の 64バイト入力を定義（すべて 0xFF）
const input = new Uint8Array(64).fill(0xFF);
const s = sc25519();

sc25519FromBytes(s, input);

// s.value は (2^512 - 1) % L と一致する必要がある
let expected = (1n << 512n) - 1n;
expected %= L;

if (s.value !== expected) {
    console.assert(false, 'sc25519FromBytes should reduce 64-byte input mod L');
    allPassed = false;
}

// 構造再確認
if (typeof s !== 'object' || !('value' in s) || typeof s.value !== 'bigint') {
    console.assert(false, 'sc25519 object structure broken');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
