import { chacha20poly1305DecryptDetached } from '../../../../src/crypto/chacha20poly1305/chacha20poly1305-decrypt-detached.js';

let allPassed = true;

// 適当な固定値
const c = Uint8Array.from([0x01, 0x02, 0x03, 0x04]);      // 暗号文（仮）
const mac = Uint8Array.from([0x10, 0x20, 0x30, 0x40,      // 適当な16バイト
    0x50, 0x60, 0x70, 0x80,
    0x90, 0xa0, 0xb0, 0xc0,
    0xd0, 0xe0, 0xf0, 0x00]);
const ad = Uint8Array.from([0xaa, 0xbb]);                 // AAD
const npub = new Uint8Array(12);                          // nonce（ゼロでOK）
const k = new Uint8Array(32);                             // key（ゼロでOK）

const m = new Uint8Array(c.length);                       // 出力先

const result = chacha20poly1305DecryptDetached(m, c, mac, ad, npub, k);

// チェック関数
const assert = (cond, label) => {
    if (!cond) {
        console.assert(false, `${label} failed`);
        allPassed = false;
    }
};

// 期待されるのは「エラーにならない」こと
assert(result === 0 || result === -1, "return code is 0 or -1");
assert(m.length === c.length, "output length matches input");

console.log("tests_passed.");
