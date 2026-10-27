import { sha512State } from '../../../../src/crypto/sha512/sha512-state.js';
import { sha512Final } from '../../../../src/crypto/sha512/sha512-final.js';

let allPassed = true;

const state = sha512State();
state.count = 80n;
for (let i = 0; i < 10; i++) {
    state.buf[i] = i;
}

const out = new Uint8Array(64);
sha512Final(state, out);

// === 出力配列の形式のみ確認 ===
if (!(out instanceof Uint8Array) || out.length !== 64) {
    console.assert(false, 'FAILED: out is not Uint8Array(64)');
    allPassed = false;
}

// === state の完全ゼロクリアを確認 ===
const cleared =
    state.state.every(s => s.value === 0n) &&
    state.count === 0n &&
    state.buf.every(b => b === 0);

if (!cleared) {
    console.assert(false, 'FAILED: state was not cleared after final');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
