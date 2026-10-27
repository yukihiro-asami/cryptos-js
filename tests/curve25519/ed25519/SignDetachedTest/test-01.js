import { signDetached } from '../../../../src/curve25519/ed25519/sign-detached.js';

function assertBytesEqual(actual, expectedHex, label) {
    const expected = Uint8Array.from(Buffer.from(expectedHex.replace(/\s/g, ''), 'hex'));
    const fail = actual.length !== expected.length || actual.some((b, i) => b !== expected[i]);
    if (fail) {
        console.error(`FAILED: ${label}`);
        console.error('Expected:', Buffer.from(expected).toString('hex'));
        console.error('Actual:  ', Buffer.from(actual).toString('hex'));
        process.exit(1);
    }
}

// === テストベクトル ===
// 秘密鍵（32バイト）＋公開鍵（32バイト）
const sk = Uint8Array.from([
    0x9d, 0x61, 0xb1, 0x9d, 0xef, 0xfd, 0x5a, 0x60,
    0xba, 0x84, 0x4a, 0xf4, 0x92, 0xec, 0x2c, 0xc4,
    0x44, 0x49, 0xc5, 0x69, 0x7b, 0x32, 0x69, 0x19,
    0x70, 0x3b, 0xac, 0x03, 0x1c, 0xae, 0x7f, 0x60,
    0xd7, 0x5a, 0x98, 0x01, 0x82, 0xb1, 0x0a, 0xb7,
    0xd5, 0x4b, 0xfe, 0xd3, 0xc9, 0x64, 0x07, 0x3a,
    0x0e, 0xe1, 0x72, 0xf3, 0xda, 0xa6, 0x23, 0x25,
    0xaf, 0x02, 0x1a, 0x68, 0xf7, 0x07, 0x51, 0x1a
]);

const msg = new Uint8Array([]); // メッセージ：長さ0

const sig = new Uint8Array(64);
signDetached(sig, msg, sk);

const expectedSigHex = `
    e5564300c360ac729086e2cc806e828a
    84877f1eb8e5d974d873e06522490155
    5fb8821590a33bacc61e39701cf9b46b
    d25bf5f0595bbe24655141438e7a100b
`;

assertBytesEqual(sig, expectedSigHex, 'Ed25519 signature mismatch');

console.log('tests_passed.');
