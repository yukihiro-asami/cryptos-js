import { word32Rotate } from '../../../../src/crypto/chacha20poly1305/word32-rotate.js';

let allPassed = true;

function rotl32(x, n) {
    return ((x << n) | (x >>> (32 - n))) >>> 0;
}

const testValues = [
    0x00000001,      // lsb
    0x80000000,      // msb
    0xffffffff,      // all bits
    0x0000ffff,      // half set
    0x12345678,      // mixed pattern
];

const indices = [0, 15];

for (const value of testValues) {
    for (const n of Array.from({ length: 32 }, (_, i) => i)) {
        for (const i of indices) {
            const a = new Uint32Array(16);
            a[i] = value;

            const expected = rotl32(value, n);

            word32Rotate(a, i, n);

            const result = a[i];
            const caseLabel = `word32Rotate([${value.toString(16)}] @ ${i}, n=${n})`;

            if (result !== expected) {
                console.assert(false, `${caseLabel} failed: got ${result.toString(16)}, expected ${expected.toString(16)}`);
                allPassed = false;
            }
        }
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
