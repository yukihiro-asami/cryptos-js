import { poly1305State } from '../../../../src/crypto/chacha20poly1305/poly1305-state.js';

let allPassed = true;

const state = poly1305State();

const tests = [
    {
        label: 'r is BigInt',
        passed: typeof state.r === 'bigint',
    },
    {
        label: 'h is BigInt',
        passed: typeof state.h === 'bigint',
    },
    {
        label: 'pad is BigInt',
        passed: typeof state.pad === 'bigint',
    },
    {
        label: 'leftover is number',
        passed: typeof state.leftover === 'number',
    },
    {
        label: 'buffer is Uint8Array(16)',
        passed: state.buffer instanceof Uint8Array && state.buffer.length === 16,
    },
    {
        label: 'buffer is zero-initialized',
        passed: state.buffer.every(b => b === 0),
    },
    {
        label: 'final is number',
        passed: typeof state.final === 'number',
    },
    {
        label: 'final default is 0',
        passed: state.final === 0,
    },
];

for (const { label, passed } of tests) {
    if (!passed) {
        console.assert(false, `${label} failed`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
