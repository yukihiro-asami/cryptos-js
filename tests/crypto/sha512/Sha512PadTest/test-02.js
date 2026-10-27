import { sha512State } from '../../../../src/crypto/sha512/sha512-state.js';
import { sha512Init } from '../../../../src/crypto/sha512/sha512-init.js';
import { sha512Update } from '../../../../src/crypto/sha512/sha512-update.js';
import { toUint8Array128BE } from '../../../../src/crypto/sha512/to-uint8-array-128-be.js';

let allPassed = true;

/**
 * sha512Pad のテスト用コピー（副作用のないtransformを注入可能）
 */
function sha512PadTest(state, W, S, transform) {
    const r = Number((state.count >> 3n) & 0x7fn);

    state.buf[r] = 0x80;

    if (r < 112) {
        for (let i = r + 1; i < 112; i++) {
            state.buf[i] = 0;
        }
    } else {
        for (let i = r + 1; i < 128; i++) {
            state.buf[i] = 0;
        }
        transform(state.state, state.buf, W, S); // 1回目
        state.buf.fill(0, 0, 112);
    }

    toUint8Array128BE(state.buf, state.count);
    transform(state.state, state.buf, W, S); // 2回目
}

function runTest(inputLen, expectedTransformCalls) {
    const state = sha512State();
    sha512Init(state);

    const input = new Uint8Array(inputLen);
    for (let i = 0; i < inputLen; i++) {
        input[i] = i & 0xff;
    }

    sha512Update(state, input);

    const W = Array.from({ length: 80 }, () => ({ value: 0n }));
    const S = Array.from({ length: 8 }, () => ({ value: 0n }));
    const calls = [];

    function mockTransform(state, buf, W, S) {
        calls.push(buf.slice()); // buf を複製して記録
    }

    sha512PadTest(state, W, S, mockTransform);

    if (calls.length !== expectedTransformCalls) {
        console.assert(false,
            `FAILED: transform call count = ${calls.length}, expected = ${expectedTransformCalls} for inputLen=${inputLen}`);
        allPassed = false;
    }

    const lastBuf = state.buf.slice(112, 128);
    const hasBitLength = lastBuf.some(b => b !== 0);
    if (!hasBitLength) {
        console.assert(false,
            `FAILED: state.buf[112..127] was not written (bit length missing) for inputLen=${inputLen}`);
        allPassed = false;
    }
}

// === テストケース ===
runTest(100, 1);   // r < 112 → 1回Transform
runTest(122, 2);   // r >= 112 → 2回Transform
runTest(128, 1);   // r = 0 → 1回Transform（別ブロック）

if (allPassed) {
    console.log('tests_passed.');
}
