import { sha512State } from '../../../../src/crypto/sha512/sha512-state.js';

let allPassed = true;

const state = sha512State();

// === state の検証 ===
if (!Array.isArray(state.state) || state.state.length !== 8) {
    console.assert(false, 'FAILED: state.state is not an array of length 8');
    allPassed = false;
} else {
    for (let i = 0; i < 8; i++) {
        const entry = state.state[i];
        if (typeof entry !== 'object' || typeof entry.value !== 'bigint' || entry.value !== 0n) {
            console.assert(false,
                `FAILED: state.state[${i}] is not { value: 0n }`);
            allPassed = false;
        }
    }
}

// === count の検証 ===
if (typeof state.count !== 'bigint' || state.count !== 0n) {
    console.assert(false, 'FAILED: state.count !== 0n');
    allPassed = false;
}

// === buf の検証 ===
if (!(state.buf instanceof Uint8Array) || state.buf.length !== 128) {
    console.assert(false, 'FAILED: state.buf is not Uint8Array(128)');
    allPassed = false;
} else {
    for (let i = 0; i < 128; i++) {
        if (state.buf[i] !== 0) {
            console.assert(false, `FAILED: state.buf[${i}] !== 0`);
            allPassed = false;
            break;
        }
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
