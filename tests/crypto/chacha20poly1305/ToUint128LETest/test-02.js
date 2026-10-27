import { toUint128LE } from '../../../../src/crypto/chacha20poly1305/to-uint128-le.js';

let allPassed = true;

const testCases = [
    {
        input: (() => {
            const u = new Uint8Array(32);
            u[0] = 0x01; // LSB
            return u;
        })(),
        offset: 0,
        expected: 0x01n,
    },
    {
        input: (() => {
            const u = new Uint8Array(32);
            u[15] = 0x01; // MSB of first 128 bits
            return u;
        })(),
        offset: 0,
        expected: 1n << 120n,
    },
    {
        input: (() => {
            const u = new Uint8Array(32);
            u[16] = 0x01; // LSB of second 128 bits
            return u;
        })(),
        offset: 16,
        expected: 0x01n,
    },
    {
        input: (() => {
            const u = new Uint8Array(32);
            u[31] = 0x01; // MSB of second 128 bits
            return u;
        })(),
        offset: 16,
        expected: 1n << 120n,
    },
    {
        input: (() => {
            const u = new Uint8Array(2024);
            for (let i = 0; i < 16; i++) {
                u[1000 + i] = i + 1; // 0x01 to 0x10
            }
            return u;
        })(),
        offset: 1000,
        expected: (() => {
            let r = 0n;
            for (let i = 0; i < 16; i++) {
                r |= BigInt(i + 1) << (8n * BigInt(i));
            }
            return r;
        })(),
    },
];

for (const { input, offset, expected } of testCases) {
    const actual = toUint128LE(input, offset);
    const passed = actual === expected;

    if (!passed) {
        console.assert(false, `toUint128LE([...], ${offset}) failed: got ${actual}, expected ${expected}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}