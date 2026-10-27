import { sha512State } from '../../../../src/crypto/sha512/sha512-state.js';
import { sha512Init } from '../../../../src/crypto/sha512/sha512-init.js';
import { INITIAL_STATE } from '../../../../src/crypto/const.js';

let allPassed = true;

const state = sha512State();
sha512Init(state);

// === state.state の内容が INITIAL_STATE に一致するかを検証 ===
for (let i = 0; i < 8; i++) {
    const actual = state.state[i]?.value;
    const expected = INITIAL_STATE[i];
    if (actual !== expected) {
        console.assert(false,
            `FAILED: state.state[${i}].value !== INITIAL_STATE[${i}]`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
