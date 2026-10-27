import { chacha20poly1305EncryptDetached } from '../../../../src/crypto/chacha20poly1305/chacha20poly1305-encrypt-detached.js';
import { chacha20poly1305DecryptDetached } from '../../../../src/crypto/chacha20poly1305/chacha20poly1305-decrypt-detached.js';

let allPassed = true;

const assert = (cond, label) => {
    if (!cond) {
        console.assert(false, `${label} failed`);
        allPassed = false;
    }
};

// 共通入力
const k = Uint8Array.from({ length: 32 }, (_, i) => i);         // 0x00〜0x1f
const npub = Uint8Array.from({ length: 12 }, (_, i) => 0x10 ^ i);
const ad = Uint8Array.from({ length: 20 }, (_, i) => 0x20 + i); // 適当なAAD

// テストする長さ（境界意識）
const lengths = [
    0,      // 最小
    1,      // 1バイト
    15,     // Poly1305 padding あり
    16,     // Poly1305 blockサイズぴったり
    63,     // ChaCha20 padding あり
    64,     // ChaCha20 blockサイズぴったり
    65,     // 境界＋1
    128,    // 2ブロック
    255,    // 端数付き複数ブロック
    256,    // ちょうど4ブロック
    1024    // 大きめデータ
];

for (const len of lengths) {
    const m = Uint8Array.from({ length: len }, (_, i) => (i * 7) & 0xff);

    const c = new Uint8Array(len);
    const mac = new Uint8Array(16);
    const m2 = new Uint8Array(len);

    const encResult = chacha20poly1305EncryptDetached(c, mac, m, ad, npub, k);
    assert(encResult === 0, `encrypt return code for len=${len}`);

    const decResult = chacha20poly1305DecryptDetached(m2, c, mac, ad, npub, k);
    assert(decResult === 0, `decrypt return code for len=${len}`);

    assert(m.length === m2.length, `length match for len=${len}`);
    assert(m.every((v, i) => v === m2[i]), `content match for len=${len}`);
}

if (allPassed) {
    console.log('tests_passed.');
}
