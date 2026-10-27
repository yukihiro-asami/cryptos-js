import { chacha20EncryptBytes } from '../../../../src/crypto/chacha20poly1305/chacha20-encrypt-bytes.js';
import { chachaKeySetUp } from '../../../../src/crypto/chacha20poly1305/chacha-key-set-up.js';
import { chachaIvSetUp } from '../../../../src/crypto/chacha20poly1305/chacha-iv-set-up.js';
import { chachaCtx } from '../../../../src/crypto/chacha20poly1305/chacha-ctx.js';

let allPassed = true;

const ctx = chachaCtx();

// 任意の32バイトキー（例：0x00..0x1f）
const key = new Uint8Array(32);
for (let i = 0; i < 32; i++) key[i] = i;

// 任意の12バイトIV（例：0x00..0x0b）
const iv = new Uint8Array(12);
for (let i = 0; i < 12; i++) iv[i] = i;

// カウンタは 0
const counter = new Uint8Array(4); // ゼロ初期化

// 32バイトの入力（任意：今回は 0x00埋め）
const plaintext = new Uint8Array(32);
const ciphertext = new Uint8Array(32);

chachaKeySetUp(ctx, key);
chachaIvSetUp(ctx, iv, counter);
chacha20EncryptBytes(ctx, plaintext, ciphertext);

// 出力が32バイトで全バイト何らかの値（すべてゼロではない）であることを確認
const nonZero = ciphertext.some(b => b !== 0);
const correctLength = ciphertext.length === 32;

if (!nonZero || !correctLength) {
    console.assert(false, `Encryption failed: ciphertext = [${Array.from(ciphertext).map(b => b.toString(16).padStart(2, '0')).join(', ')}]`);
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
