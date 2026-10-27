import { poly1305State } from '../../../../src/crypto/chacha20poly1305/poly1305-state.js';
import { poly1305Update } from '../../../../src/crypto/chacha20poly1305/poly1305-update.js';

let allPassed = true;

/**
 * Utility: create Uint8Array of given size filled with a pattern value
 */
function createPattern(size, value = 1) {
    return new Uint8Array(Array.from({ length: size }, () => value));
}

const tests = [
    {
        label: 'Empty input leaves state unchanged',
        run: () => {
            const state = poly1305State();
            poly1305Update(state, new Uint8Array(0));
            return state.leftover === 0 &&
                state.buffer.every(b => b === 0n || b === 0);
        }
    },
    {
        label: 'Partial block gets stored in buffer',
        run: () => {
            const state = poly1305State();
            const input = createPattern(5, 0xAA);
            poly1305Update(state, input);
            return state.leftover === 5 &&
                state.buffer.slice(0, 5).every(b => b === 0xAA);
        }
    },
    {
        label: 'Full block triggers poly1305Blocks and clears leftover',
        run: () => {
            const state = poly1305State();
            const input = createPattern(16, 0xBB);
            poly1305Update(state, input);
            return state.leftover === 0 &&
                state.buffer.every(b => b === 0);
        }
    },
    {
        label: 'Partial + Full + Partial blocks handled correctly',
        run: () => {
            const state = poly1305State();
            const first = createPattern(5, 0x01);     // stored in buffer
            const second = createPattern(20, 0x02);   // completes one block, leaves 9
            poly1305Update(state, first);
            poly1305Update(state, second);
            return state.leftover === 9 &&
                state.buffer.slice(0, 9).every(b => b === 0x02);
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
