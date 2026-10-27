import { signDetached } from '../../../../src/curve25519/ed25519/sign-detached.js';
import { verifyDetached } from '../../../../src/curve25519/ed25519/verify-detached.js';
import { keyPair } from '../../../../src/curve25519/ed25519/key-pair.js';
let allPassed = true;
function assert(cond, label) {
    if (!cond) {
        console.error(`FAILED: ${label}`);
        process.exit(1);
    }
}

function deriveKeypair(seed) {
    const sk = new Uint8Array(64);
    const pk = new Uint8Array(32);

    keyPair(pk, sk, seed);

    return { sk, pk };
}

// ランダムテストセット
const testCases = [
    {
        name: 'zero message',
        seed: new Uint8Array(32).fill(0x01),
        msg: new Uint8Array(0)
    },
    {
        name: 'short message',
        seed: new Uint8Array(32).map((_, i) => i + 1),
        msg: Uint8Array.from([0xde, 0xad, 0xbe, 0xef])
    },
    {
        name: 'long message',
        seed: new Uint8Array(32).fill(0x42),
        msg: new Uint8Array(1024).map((_, i) => i % 256)
    }
];

// 往復テスト実行
for (const { name, seed, msg } of testCases) {
    const { sk, pk } = deriveKeypair(seed);
    const sig = new Uint8Array(64);
    signDetached(sig, msg, sk);
    const verified = verifyDetached(sig, msg, pk);
    assert(verified === 0, `Round-trip signature test failed: ${name}`);
    if (verified !== 0)
    {
        allPassed = false;
    }
}

if (allPassed === true) {
    console.log('tests_passed.');
}
