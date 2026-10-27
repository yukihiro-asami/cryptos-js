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

// 拡散性のある確定擬似乱数シード生成（Xorshift32ベース）
function pseudoSeed32(input) {
    const bytes = new Uint8Array(32);
    let state = input >>> 0;
    for (let i = 0; i < 32; i++) {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        bytes[i] = state & 0xff;
    }
    return bytes;
}

// テスト本体
const SEED_CONST = 2654435761 >>> 0;

for (let i = 0; i < 100; i++) {
    const input = (i * SEED_CONST) >>> 0;
    const seed = pseudoSeed32(input);
    const msg = new Uint8Array(16).fill(i);  // 簡単な入力

    const pk = new Uint8Array(32);
    const sk = new Uint8Array(64);
    keyPair(pk, sk, seed);

    // 明示的に seed + pk を sk に詰め直す（signDetached仕様に忠実に）
    sk.set(seed, 0);
    sk.set(pk, 32);

    const sig = new Uint8Array(64);
    signDetached(sig, msg, sk);
    const verified = verifyDetached(sig, msg, pk);

    if (verified !== 0) {
        console.log(`case ${i}`);
        console.log(`seed: ${Buffer.from(seed).toString('hex')}`);
        console.log(`sk: ${Buffer.from(sk).toString('hex')}`);
        console.log(`pk  : ${Buffer.from(pk).toString('hex')}`);
        console.log(`msg  : ${Buffer.from(msg).toString('hex')}`);
        console.log(`sig : ${Buffer.from(sig).toString('hex')}`);
    }

    assert(verified === 0, `Round-trip signature test failed: case ${i}`);
}

if (allPassed) {
    console.log('tests_passed.');
}