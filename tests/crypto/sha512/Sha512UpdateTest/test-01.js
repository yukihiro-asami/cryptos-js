import { sha512State } from '../../../../src/crypto/sha512/sha512-state.js';
import { sha512Init } from '../../../../src/crypto/sha512/sha512-init.js';
import { sha512Update } from '../../../../src/crypto/sha512/sha512-update.js';
import { INITIAL_STATE } from '../../../../src/crypto/const.js';

let allPassed = true;

function runTest(inputLen) {
    const state = sha512State();
    sha512Init(state);

    const input = new Uint8Array(inputLen);
    for (let i = 0; i < inputLen; i++) {
        input[i] = i & 0xff;
    }

    sha512Update(state, input);

    const mutated = state.state.some((s, i) => s.value !== INITIAL_STATE[i]);
    const expectedToMutate = inputLen >= 128;

    if (expectedToMutate && !mutated) {
        console.assert(false, `FAILED: state.state unchanged but should be mutated for inputLen=${inputLen}`);
        allPassed = false;
    }

    if (!expectedToMutate && mutated) {
        console.assert(false, `FAILED: state.state mutated but should not be for inputLen=${inputLen}`);
        allPassed = false;
    }

    // === count が正しいか ===
    const expectedCount = BigInt(inputLen) * 8n;
    if (state.count !== expectedCount) {
        console.assert(false, `FAILED: state.count (${state.count}) !== ${expectedCount} for inputLen=${inputLen}`);
        allPassed = false;
    }

    // === buf の残りが正しいか ===
    const tailLen = inputLen % 128;
    for (let i = 0; i < tailLen; i++) {
        const expectedByte = input[inputLen - tailLen + i];
        if (state.buf[i] !== expectedByte) {
            console.assert(false,
                `FAILED: buf[${i}] (${state.buf[i]}) !== input[${inputLen - tailLen + i}] (${expectedByte})`);
            allPassed = false;
            break;
        }
    }
}
runTest(0);  // 1024ビット未満
// テスト本体
runTest(100);  // 1024ビット未満
runTest(200);  // 1024ビット以上

if (allPassed) {
    console.log('tests_passed.');
}
