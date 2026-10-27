import { chacha20EncryptBytes } from '../../../../src/crypto/chacha20poly1305/chacha20-encrypt-bytes.js';
import { chachaKeySetUp } from '../../../../src/crypto/chacha20poly1305/chacha-key-set-up.js';
import { chachaIvSetUp } from '../../../../src/crypto/chacha20poly1305/chacha-iv-set-up.js';
import { chachaCtx } from '../../../../src/crypto/chacha20poly1305/chacha-ctx.js';

let allPassed = true;

const ctx = chachaCtx();

// Key: 00..1f
const key = new Uint8Array(32);
for (let i = 0; i < 32; i++) key[i] = i;

// Nonce: 00 00 00 09  00 00 00 4a  00 00 00 00
const nonce = new Uint8Array([
    0x00, 0x00, 0x00, 0x09,
    0x00, 0x00, 0x00, 0x4a,
    0x00, 0x00, 0x00, 0x00
]);

// Block count = 1 -> counter = 1
const counter = new Uint8Array([0x01, 0x00, 0x00, 0x00]);

// セットアップ
chachaKeySetUp(ctx, key);
chachaIvSetUp(ctx, nonce, counter);

// 期待されるUint32表現（RFC表記順に小端変換された数値）
const expected = [
    0x61707865, 0x3320646e, 0x79622d32, 0x6b206574,
    0x03020100, 0x07060504, 0x0b0a0908, 0x0f0e0d0c,
    0x13121110, 0x17161514, 0x1b1a1918, 0x1f1e1d1c,
    0x00000001, 0x09000000, 0x4a000000, 0x00000000,
];

// 確認
for (let i = 0; i < 16; i++) {
    const actual = ctx.input[i] >>> 0;
    const expect = expected[i] >>> 0;
    if (actual !== expect) {
        console.assert(false, `input[${i}] = 0x${actual.toString(16)}; expected 0x${expect.toString(16)}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
