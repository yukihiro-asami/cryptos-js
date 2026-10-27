import { chachaCtx } from '../../../../src/crypto/chacha20poly1305/chacha-ctx.js';
import { chachaKeySetUp } from '../../../../src/crypto/chacha20poly1305/chacha-key-set-up.js';

let allPassed = true;

const expectedConstants = [
    0x61707865, // "expa"
    0x3320646e, // "nd 3"
    0x79622d32, // "2-by"
    0x6b206574, // "te k"
];

const sampleKey = new Uint8Array(32);
for (let i = 0; i < 32; i++) {
    sampleKey[i] = i;
}

const expectedKeyWords = [
    0x03020100,
    0x07060504,
    0x0b0a0908,
    0x0f0e0d0c,
    0x13121110,
    0x17161514,
    0x1b1a1918,
    0x1f1e1d1c,
];

const ctx = chachaCtx();
chachaKeySetUp(ctx, sampleKey);

// 検証：input[0]〜[3]（定数）
for (let i = 0; i < 4; i++) {
    const actual = ctx.input[i];
    const expected = expectedConstants[i];
    const label = `const[${i}]`;
    if (actual !== expected) {
        console.assert(false, `${label} failed: got 0x${actual.toString(16)}, expected 0x${expected.toString(16)}`);
        allPassed = false;
    }
}

// 検証：input[4]〜[11]（キー）
for (let i = 0; i < 8; i++) {
    const actual = ctx.input[i + 4];
    const expected = expectedKeyWords[i];
    const label = `key[${i}]`;
    if (actual !== expected) {
        console.assert(false, `${label} failed: got 0x${actual.toString(16)}, expected 0x${expected.toString(16)}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
