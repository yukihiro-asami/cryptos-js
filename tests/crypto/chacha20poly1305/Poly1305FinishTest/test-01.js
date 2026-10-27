import { poly1305State } from '../../../../src/crypto/chacha20poly1305/poly1305-state.js';
import { poly1305Finish } from '../../../../src/crypto/chacha20poly1305/poly1305-finish.js';

let allPassed = true;

/**
 * Utility: create Uint8Array filled with given value
 */
function pattern(size, byte = 1) {
    return new Uint8Array(size).fill(byte);
}

const tests = [
    {
        label: 'poly1305Finish: no leftover, state.final remains 0',
        run: () => {
            const state = poly1305State();
            const mac = new Uint8Array(16);
            poly1305Finish(state, mac);
            return state.final === 0 && state.leftover === 0;
        }
    },
    {
        label: 'poly1305Finish: h updated with pad mod 2^128',
        run: () => {
            const state = poly1305State();
            state.h = 5n;
            state.pad = 10n;
            const mac = new Uint8Array(16);
            poly1305Finish(state, mac);
            return state.h === 15n;
        }
    },
    {
        label: 'poly1305Finish: overflow in pad + h wraps mod 2^128',
        run: () => {
            const state = poly1305State();
            state.h = (1n << 127n) + 1n;
            state.pad = (1n << 127n) + 2n;
            const mac = new Uint8Array(16);
            poly1305Finish(state, mac);
            return state.h === 3n;
        }
    }
];

for (const { label, run } of tests) {
    const passed = run();
    if (!passed) {
        console.assert(false, `${label} failed`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
