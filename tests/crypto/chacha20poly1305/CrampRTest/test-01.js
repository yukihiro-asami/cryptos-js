import { clampR } from '../../../../src/crypto/chacha20poly1305/cramp-r.js';
import { toUint128LE } from '../../../../src/crypto/chacha20poly1305/to-uint128-le.js';

function fromUint128LE(value) {
    const out = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
        out[i] = Number((value >> BigInt(i * 8)) & 0xffn);
    }
    return out;
}

let allPassed = true;

const testCases = [
    {
        name: "Incrementing from 0x00",
        input: (() => {
            const u = new Uint8Array(32);
            for (let i = 0; i < 16; i++) u[i] = i;
            return u;
        })(),
    },
    {
        name: "All 0xff (every bit set)",
        input: (() => {
            const u = new Uint8Array(32);
            u.fill(0xff, 0, 16);
            return u;
        })(),
    },
    {
        name: "Patterned high/low bytes",
        input: (() => {
            const u = new Uint8Array(32);
            for (let i = 0; i < 16; i++) u[i] = (i % 2 === 0) ? 0xff : 0x00;
            return u;
        })(),
    },
    {
        name: "Bit-boundary clamp test (targeting specific clamp mask bits)",
        input: (() => {
            const u = new Uint8Array(32);
            u.fill(0, 0, 32);
            u[3]  = 0xf0;  // should become 0x00
            u[4]  = 0x03;  // should become 0x00
            u[7]  = 0xf0;  // should become 0x00
            u[8]  = 0x03;  // should become 0x00
            u[11] = 0xf0;  // should become 0x00
            u[12] = 0x03;  // should become 0x00
            u[15] = 0xf0;  // should become 0x00
            return u;
        })(),
    },
    {
        name: "All bits set in 128-bit region only",
        input: (() => {
            const u = new Uint8Array(32);
            u.fill(0xff, 0, 16); // only lower 128 bits
            u.fill(0x00, 16, 32);
            return u;
        })(),
    },
];

for (const { input, name } of testCases) {
    const rBigInt = toUint128LE(input, 0);
    const state = { r: rBigInt };

    clampR(state);
    const clampedBytes = fromUint128LE(state.r);

    const violations = [];

    // r[3], r[7], r[11], r[15] must have top 4 bits cleared
    for (const i of [3, 7, 11, 15]) {
        if ((clampedBytes[i] & 0xf0) !== 0x00) {
            violations.push(`byte[${i}] upper 4 bits not cleared: 0x${clampedBytes[i].toString(16).padStart(2, '0')}`);
        }
    }

    // r[4], r[8], r[12] must have bottom 2 bits cleared
    for (const i of [4, 8, 12]) {
        if ((clampedBytes[i] & 0x03) !== 0x00) {
            violations.push(`byte[${i}] lower 2 bits not cleared: 0x${clampedBytes[i].toString(16).padStart(2, '0')}`);
        }
    }

    if (violations.length > 0) {
        console.error(`FAILED: ${name}`);
        for (const msg of violations) console.error("  " + msg);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
