import { sha512State } from '../../../../src/crypto/sha512/sha512-state.js';
import { sha512Init } from '../../../../src/crypto/sha512/sha512-init.js';
import { sha512Update } from '../../../../src/crypto/sha512/sha512-update.js';
import { sha512Pad } from '../../../../src/crypto/sha512/sha512-pad.js';
import { INITIAL_STATE } from '../../../../src/crypto/const.js';

let allPassed = true;

function testWithLength(inputLen) {
    const state = sha512State();
    sha512Init(state);

    const input = new Uint8Array(inputLen);
    for (let i = 0; i < inputLen; i++) {
        input[i] = i & 0xff;
    }

    const W = Array.from({ length: 80 }, () => ({ value: 0n }));
    const S = Array.from({ length: 8 }, () => ({ value: 0n }));

    sha512Update(state, input);
    const beforeCount = state.count;
    sha512Pad(state, W, S);

    // === state が初期値から変化しているか ===
    const mutated = state.state.some((s, i) => s.value !== INITIAL_STATE[i]);
    if (!mutated) {
        console.assert(false, `FAILED: state.state not mutated for inputLen=${inputLen}`);
        allPassed = false;
    }

    // === count が変化していないか ===
    if (state.count !== beforeCount) {
        console.assert(false, `FAILED: count changed during pad for inputLen=${inputLen}`);
        allPassed = false;
    }

    // === buf[112..127] に書き込みがあるか ===
    const bufWritten = state.buf.slice(112, 128).some(b => b !== 0);
    if (!bufWritten) {
        console.assert(false, `FAILED: buf[112..127] not written for inputLen=${inputLen}`);
        allPassed = false;
    }
}

testWithLength(100);  // r < 112
testWithLength(122);  // r == 122
testWithLength(128);  // r == 0（ブロック境界）

if (allPassed) {
    console.log('tests_passed.');
}
