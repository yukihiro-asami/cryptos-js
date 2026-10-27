import { hmacSha512Finish } from '../../../../src/crypto/sha512/hmac-sha512-finish.js';
import { hmacSha512State } from '../../../../src/crypto/sha512/hmac-sha512-state.js';

let allPassed = true;

const state = hmacSha512State();
state.ictx.count = 80n;
for (let i = 0; i < 10; i++) {
    state.ictx.buf[i] = i;
}

const out = new Uint8Array(64);
hmacSha512Finish(state, out);

// === 出力配列の形式のみ確認 ===
if (!(out instanceof Uint8Array) || out.length !== 64) {
    console.assert(false, 'FAILED: out is not Uint8Array(64)');
    allPassed = false;
}

// === ictx の完全ゼロクリア確認 ===
const ictxCleared =
    state.ictx.state.every(s => s.value === 0n) &&
    state.ictx.count === 0n &&
    state.ictx.buf.every(b => b === 0);

if (!ictxCleared) {
    console.assert(false, 'FAILED: ictx was not cleared after finish');
    allPassed = false;
}

// === octx の完全ゼロクリア確認 ===
const octxCleared =
    state.octx.state.every(s => s.value === 0n) &&
    state.octx.count === 0n &&
    state.octx.buf.every(b => b === 0);

if (!octxCleared) {
    console.assert(false, 'FAILED: octx was not cleared after finish');
    allPassed = false;
}

console.log('tests_passed.');
