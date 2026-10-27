import { verifyDetached } from '../../../../src/curve25519/ed25519/verify-detached.js';
let allPassed = true;
function assert(cond, label) {
    if (!cond) {
        console.error(`FAILED: ${label}`);
        process.exit(1);
    }
}

// 拡散性のある確定擬似乱数シード生成（Xorshift32ベース）
function pseudoKey32(input) {
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

function pseudoKey64(input) {
    const bytes = new Uint8Array(64);
    let state = input >>> 0;
    for (let i = 0; i < 64; i++) {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        bytes[i] = state & 0xff;
    }
    return bytes;
}

// テスト本体
const SEED_CONST = 2654435761 >>> 0;

for (let i = 0; i < 2000; i++) {
    const input = (i * SEED_CONST) >>> 0;
    const pk = pseudoKey32(input);
    const sig = pseudoKey64(input);
    const msg = new Uint8Array(16).fill(i);  // 簡単な入力

    const verified = verifyDetached(sig, msg, pk);
    assert(verified !== 0 , `Round-trip signature test failed: case ${i}`);
}

if (allPassed) {
    console.log('tests_passed.');
}