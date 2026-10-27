import { sc25519ToBytes } from '../../../../src/curve25519/sc25519/sc25519-to-bytes.js';
import { sc25519 } from '../../../../src/curve25519/sc25519/sc25519.js';

let allPassed = true;

// 基本構造
const s = sc25519();
s.value = 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefn;

const out = new Uint8Array(32);
sc25519ToBytes(out, s);

// 構造チェック：戻り値はない
if (!(out instanceof Uint8Array)) {
    console.assert(false, 'Output must be Uint8Array');
    allPassed = false;
}

// バイト列チェック：Little Endian
const expectedLE = [];
let temp = s.value;
for (let i = 0; i < 32; i++) {
    expectedLE.push(Number(temp & 0xffn));
    temp >>= 8n;
}
for (let i = 0; i < 32; i++) {
    if (out[i] !== expectedLE[i]) {
        console.assert(false, `Byte mismatch at index ${i}: expected ${expectedLE[i]}, got ${out[i]}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
