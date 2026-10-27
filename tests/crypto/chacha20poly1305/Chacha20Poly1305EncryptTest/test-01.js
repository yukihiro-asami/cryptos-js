import { chacha20poly1305Encrypt } from '../../../../src/crypto/chacha20poly1305/chacha20poly1305-encrypt.js';

let allPassed = true;

// 適当な入力
const m = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]);
const ad = Uint8Array.from([9, 10, 11, 12]);
const npub = new Uint8Array(12);  // nonce 12バイト
const k = new Uint8Array(32);     // key 32バイト

// 出力領域（ciphertext + MAC）
const c = new Uint8Array(m.length + 16);

// 実行
const result = chacha20poly1305Encrypt(c, m, ad, npub, k);

// チェック関数
const assert = (cond, label) => {
    if (!cond) {
        console.assert(false, `${label} failed`);
        allPassed = false;
    }
};

// 確認ポイント
assert(result === 0, "return code === 0");
assert(c.length === m.length + 16, "ciphertext + mac length matches");
assert(c.subarray(0, m.length).some(b => b !== 0), "ciphertext is not all zero");
assert(c.subarray(m.length).some(b => b !== 0), "mac is not all zero");

// 完了メッセージ
if (allPassed) {
    console.log("tests_passed.");
}
