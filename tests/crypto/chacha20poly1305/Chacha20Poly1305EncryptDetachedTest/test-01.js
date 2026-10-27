import { chacha20poly1305EncryptDetached } from '../../../../src/crypto/chacha20poly1305/chacha20poly1305-encrypt-detached.js';

let allPassed = true;

// 適当な固定値（ゼロで初期化）
const m = Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8]);
const ad = Uint8Array.from([9, 10, 11, 12]);
const npub = new Uint8Array(12);  // nonce 12バイト
const k = new Uint8Array(32);     // key 32バイト

// 出力領域
const c = new Uint8Array(m.length);
const mac = new Uint8Array(16);

// 実行
const result = chacha20poly1305EncryptDetached(c, mac, m, ad, npub, k);

// チェック関数
const assert = (cond, label) => {
    if (!cond) {
        console.assert(false, `${label} failed`);
        allPassed = false;
    }
};

// 確認ポイント
assert(result === 0, "return code === 0");
assert(c.length === m.length, "ciphertext length matches");
assert(mac.length === 16, "mac length is 16");
assert(c.some(b => b !== 0), "ciphertext is not all zero");
assert(mac.some(b => b !== 0), "mac is not all zero");

// 完了メッセージ
if (allPassed) {
    console.log("tests_passed.");
}
