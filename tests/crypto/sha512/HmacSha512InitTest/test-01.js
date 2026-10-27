import { hmacSha512State } from '../../../../src/crypto/sha512/hmac-sha512-state.js';
import { hmacSha512Init } from '../../../../src/crypto/sha512/hmac-sha512-init.js';

function checkStateStructure(label, ctx) {
    if (typeof ctx !== 'object') {
        console.assert(false, `FAILED: ${label} is not an object`);
        return false;
    }

    let passed = true;

    if (!Array.isArray(ctx.state) || ctx.state.length !== 8) {
        console.assert(false, `FAILED: ${label}.state is not an array of length 8`);
        passed = false;
    } else {
        for (let i = 0; i < 8; i++) {
            const entry = ctx.state[i];
            if (typeof entry !== 'object' || typeof entry.value !== 'bigint') {
                console.assert(false, `FAILED: ${label}.state[${i}] is not { value: bigint }`);
                passed = false;
            }
        }
    }

    if (typeof ctx.count !== 'bigint') {
        console.assert(false, `FAILED: ${label}.count is not bigint`);
        passed = false;
    }

    if (!(ctx.buf instanceof Uint8Array) || ctx.buf.length !== 128) {
        console.assert(false, `FAILED: ${label}.buf is not Uint8Array(128)`);
        passed = false;
    }

    return passed;
}

function testHmacSha512InitWithKey(keyBytes, label) {
    const state = hmacSha512State();
    hmacSha512Init(state, keyBytes);

    let passed = true;

    // ictx構造チェック
    passed &= checkStateStructure(`${label}.ictx`, state.ictx);

    // octx構造チェック
    passed &= checkStateStructure(`${label}.octx`, state.octx);

    // ictx.bufとoctx.bufの中身（先頭数バイト）に何か入っているか（0以外の値があるか）
    const ictxNonzero = state.ictx.buf.some(b => b !== 0);
    const octxNonzero = state.octx.buf.some(b => b !== 0);
    if (!ictxNonzero) {
        console.assert(false, `FAILED: ${label}.ictx.buf is all zero`);
        passed = false;
    }
    if (!octxNonzero) {
        console.assert(false, `FAILED: ${label}.octx.buf is all zero`);
        passed = false;
    }

    return passed;
}

let allPassed = true;

// key.length < 128
allPassed &= testHmacSha512InitWithKey(
    new Uint8Array([0x01, 0x02, 0x03, 0x04]),
    'key<128'
);

// key.length === 128
const key128 = new Uint8Array(128);
for (let i = 0; i < 128; i++) key128[i] = i;
allPassed &= testHmacSha512InitWithKey(
    key128,
    'key==128'
);

// key.length > 128
const key256 = new Uint8Array(256);
for (let i = 0; i < 256; i++) key256[i] = i;
allPassed &= testHmacSha512InitWithKey(
    key256,
    'key>128'
);

if (allPassed) {
    console.log('tests_passed.');
}
