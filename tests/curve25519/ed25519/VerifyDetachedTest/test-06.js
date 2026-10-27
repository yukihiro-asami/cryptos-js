import { signDetached } from '../../../../src/curve25519/ed25519/sign-detached.js';
import { verifyDetached } from '../../../../src/curve25519/ed25519/verify-detached.js';
import { keyPair } from '../../../../src/curve25519/ed25519/key-pair.js';

function assert(cond, label) {
    if (!cond) {
        console.error(`FAILED: ${label}`);
        process.exit(1);
    }
}

// キーペア生成ユーティリティ
function generateKeypair(seed) {
    const pk = new Uint8Array(32);
    const sk = new Uint8Array(64);
    keyPair(pk, sk, seed);
    return { pk, sk };
}

// テストケース定義
const testCases = [
    {
        name: 'empty message',
        seed: new Uint8Array(32).fill(0x00),
        msg: new Uint8Array(0)
    },
    {
        name: 'short message',
        seed: Uint8Array.from({ length: 32 }, (_, i) => i),
        msg: Uint8Array.from([0x41, 0x42, 0x43])
    },
    {
        name: 'long message',
        seed: new Uint8Array(32).fill(0x42),
        msg: new Uint8Array(512).map((_, i) => i % 256)
    }
];

// 往復署名テストの実行
for (const { name, seed, msg } of testCases) {
    const { sk, pk } = generateKeypair(seed);
    const sig = new Uint8Array(64);
    signDetached(sig, msg, sk);
    const verified = verifyDetached(sig, msg, pk);
    assert(verified === 0, `Signature verification failed: ${name}`);
}
console.log('tests_passed.');