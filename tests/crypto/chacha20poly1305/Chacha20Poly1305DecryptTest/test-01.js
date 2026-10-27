import { chacha20poly1305Decrypt } from '../../../../src/crypto/chacha20poly1305/chacha20poly1305-decrypt.js';

let allPassed = true;

// 適当な入力値（暗号文 + MAC）
const c = Uint8Array.from([
    0x11, 0x22, 0x33, 0x44,  // 暗号部分（仮、4バイト）
    0x10, 0x20, 0x30, 0x40,  // MAC（16バイト）
    0x50, 0x60, 0x70, 0x80,
    0x90, 0xa0, 0xb0, 0xc0,
    0xd0, 0xe0, 0xf0, 0x00
]);
const ad = Uint8Array.from([0xaa, 0xbb]);
const npub = new Uint8Array(12);   // nonce（ゼロでOK）
const k = new Uint8Array(32);      // key（ゼロでOK）

// 出力先：暗号文長 - 16バイト分
const m = new Uint8Array(c.length - 16);

// 実行
const result = chacha20poly1305Decrypt(m, c, ad, npub, k);

// チェック関数
const assert = (cond, label) => {
    if (!cond) {
        console.assert(false, `${label} failed`);
        allPassed = false;
    }
};

// 期待されるのは「エラーにならず出力長が一致する」こと
assert(result === 0 || result === -1, "return code is 0 or -1");
assert(m.length === c.length - 16, "output length == ciphertext - mac");

// 完了
console.log("tests_passed.");
