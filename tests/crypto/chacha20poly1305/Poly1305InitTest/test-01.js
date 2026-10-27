import { poly1305Init } from '../../../../src/crypto/chacha20poly1305/poly1305-init.js';
import { poly1305State } from '../../../../src/crypto/chacha20poly1305/poly1305-state.js';

let allPassed = true;

const testCases = [
    {
        input: Uint8Array.from([
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, // r
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00  // pad
        ]),
        expectedPad: 0n,
    },
    {
        input: Uint8Array.from([
            0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
            0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, // r
            0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
            0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20  // pad
        ]),
        expectedPad: 0x201f1e1d1c1b1a191817161514131211n,
    },
];

for (const { input, expectedPad } of testCases) {
    const state = poly1305State();
    poly1305Init(state, input);

    const passed =
        typeof state.r === 'bigint' &&
        typeof state.pad === 'bigint' &&
        typeof state.h === 'bigint' &&
        state.pad === expectedPad;

    if (!passed) {
        console.assert(false, `poly1305Init failed: pad=${state.pad}, expected=${expectedPad}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
