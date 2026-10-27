import { chacha20poly1305Encrypt } from '../../../../src/crypto/chacha20poly1305/chacha20poly1305-encrypt.js';
import { chacha20poly1305Decrypt } from '../../../../src/crypto/chacha20poly1305/chacha20poly1305-decrypt.js';

let allPassed = true;

// 平文（適当）
const m = Uint8Array.from([0x10, 0x20, 0x30, 0x40, 0x50, 0x60]);

// 鍵（32バイト）とノンス（12バイト）とAAD（任意長）も適当な固定値
const k = Uint8Array.from({ length: 32 }, (_, i) => i);       // 0x00〜0x1f
const npub = Uint8Array.from({ length: 12 }, (_, i) => 0xaa ^ i);
const ad = Uint8Array.from([0x01, 0x02, 0x03]);

// 出力用バッファ（暗号文 + MAC）
const c = new Uint8Array(m.length + 16);

// 暗号化
const encResult = chacha20poly1305Encrypt(c, m, ad, npub, k);
console.assert(encResult === 0, 'encryption return code === 0');

// 復号用バッファ
const m2 = new Uint8Array(c.length - 16);
const decResult = chacha20poly1305Decrypt(m2, c, ad, npub, k);
console.assert(decResult === 0, 'decryption return code === 0');

// 内容比較
const assert = (cond, label) => {
    if (!cond) {
        console.assert(false, `${label} failed`);
        allPassed = false;
    }
};

assert(m.length === m2.length, 'length matches');
assert(m.every((v, i) => v === m2[i]), 'plaintext content matches');

if (allPassed) {
    console.log('tests_passed.');
}
