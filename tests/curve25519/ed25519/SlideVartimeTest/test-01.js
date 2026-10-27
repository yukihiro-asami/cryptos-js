import { slideVartime } from '../../../../src/curve25519/ed25519/slide-vartime.js';

function hexToUint8ArrayLE(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}

function runTest(name, inputHex, expectedBits) {
    const a = hexToUint8ArrayLE(inputHex);
    const r = new Int8Array(256);
    slideVartime(r, a);
    for (let i = 0; i < 256; i++) {
        const expected = expectedBits[i] ?? 0;
        if (r[i] !== expected) {
            console.error(`FAILED: ${name}`);
            console.error(`Mismatch at bit ${i}: got ${r[i]}, expected ${expected}`);
            process.exit(1);
        }
    }
}

// === 各テスト定義 ===
const tests = [
    {
        name: 'bit 0 = 1',
        inputHex: '01' + '00'.repeat(31),
        expected: (() => {
            const out = new Int8Array(256);
            out[0] = 1;
            return out;
        })(),
    },
    {
        name: 'bits 0,1 = 1',
        inputHex: '03' + '00'.repeat(31),
        expected: (() => {
            const out = new Int8Array(256);
            out[0] = 3; // 合成される
            return out;
        })(),
    },
    {
        name: 'bits 0,1,2 = 1',
        inputHex: '07' + '00'.repeat(31), // 00000111
        expected: (() => {
            const out = new Int8Array(256);
            out[0] = 7; // 1 + 2 + 4 = 7
            return out;
        })(),
    },
    {
        name: 'bits 0–3 = 1',
        inputHex: '0f' + '00'.repeat(31),
        expected: (() => {
            const out = new Int8Array(256);
            out[0] = 15; // 1 + 2 + 4 + 8 = 15
            return out;
        })(),
    },
    {
        name: 'bits 0–4 = 1',
        inputHex: '1f' + '00'.repeat(31), // 00011111
        expected: (() => {
            const out = new Int8Array(256);
            out[0] = -1;  // r[0] が -1 に置き換えられ、
            out[5] = 1;   // キャリーが r[5] に
            return out;
        })(),
    },
];

// === 実行 ===
for (const test of tests) {
    runTest(test.name, test.inputHex, test.expected);
}

console.log('tests_passed.');
