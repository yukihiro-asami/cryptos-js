import { sha512 } from '../../../../src/crypto/sha512/sha512.js';

let allPassed = true;

// 入力データ：文字列 "abc" の Uint8Array
const encoder = new TextEncoder();
const input = encoder.encode('abc');

// 出力先：64バイト確保
const output = new Uint8Array(64);

// 実行
sha512(input, output);

// === 出力型と長さの確認 ===
if (!(output instanceof Uint8Array)) {
    console.assert(false, 'FAILED: output is not Uint8Array');
    allPassed = false;
}
if (output.length !== 64) {
    console.assert(false, 'FAILED: output.length !== 64');
    allPassed = false;
}

// === 内容が undefined や NaN でないか（意味ある処理がされたか） ===
if (output.some(b => typeof b !== 'number' || Number.isNaN(b))) {
    console.assert(false, 'FAILED: output contains invalid bytes');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
