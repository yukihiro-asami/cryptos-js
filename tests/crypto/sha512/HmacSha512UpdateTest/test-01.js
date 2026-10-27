import { hmacSha512Update } from '../../../../src/crypto/sha512/hmac-sha512-update.js';
import { sha512Init } from '../../../../src/crypto/sha512/sha512-init.js';
import { hmacSha512State } from '../../../../src/crypto/sha512/hmac-sha512-state.js';
import { INITIAL_STATE } from '../../../../src/crypto/const.js';

let allPassed = true;

function runTest(inputLen) {
    const state = hmacSha512State();
    sha512Init(state.ictx);

    const input = new Uint8Array(inputLen);
    for (let i = 0; i < inputLen; i++) {
        input[i] = i & 0xff;
    }

    hmacSha512Update(state, input);

    const mutated = state.ictx.state.some((s, i) => s.value !== INITIAL_STATE[i]);
    const expectedToMutate = inputLen >= 128;

    if (expectedToMutate && !mutated) {
        console.assert(false, `FAILED: ictx.state unchanged but should be mutated for inputLen=${inputLen}`);
        allPassed = false;
    }

    if (!expectedToMutate && mutated) {
        console.assert(false, `FAILED: ictx.state mutated but should not be for inputLen=${inputLen}`);
        allPassed = false;
    }

    const expectedCount = BigInt(inputLen) * 8n;
    if (state.ictx.count !== expectedCount) {
        console.assert(false, `FAILED: ictx.count (${state.ictx.count}) !== ${expectedCount} for inputLen=${inputLen}`);
        allPassed = false;
    }

    const tailLen = inputLen % 128;
    for (let i = 0; i < tailLen; i++) {
        const expectedByte = input[inputLen - tailLen + i];
        if (state.ictx.buf[i] !== expectedByte) {
            console.assert(false,
                `FAILED: ictx.buf[${i}] (${state.ictx.buf[i]}) !== input[${inputLen - tailLen + i}] (${expectedByte})`);
            allPassed = false;
            break;
        }
    }
}

// テスト本体
runTest(100);  // 1024ビット未満
runTest(200);  // 1024ビット以上

if (allPassed) {
    console.log('tests_passed.');
}
