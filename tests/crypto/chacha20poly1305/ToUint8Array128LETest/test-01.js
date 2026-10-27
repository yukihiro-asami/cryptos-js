import { toUint8Array128LE } from '../../../../src/crypto/chacha20poly1305/to-uint8-array128-le.js';

let allPassed = true;

const testCases = [
    {
        value: 0x00000000000000000000000000000000n,
        expected: new Array(16).fill(0x00),
    },
    {
        value: 0x0102030405060708090a0b0c0d0e0f10n,
        expected: [
            0x10, 0x0f, 0x0e, 0x0d,
            0x0c, 0x0b, 0x0a, 0x09,
            0x08, 0x07, 0x06, 0x05,
            0x04, 0x03, 0x02, 0x01
        ],
    },
    {
        value: 0xffffffffffffffffffffffffffffffffn,
        expected: new Array(16).fill(0xff),
    },
    {
        value: 0x000102030405060708090a0b0c0d0e0fn,
        expected: [
            0x0f, 0x0e, 0x0d, 0x0c,
            0x0b, 0x0a, 0x09, 0x08,
            0x07, 0x06, 0x05, 0x04,
            0x03, 0x02, 0x01, 0x00
        ],
    },
];

for (const { value, expected } of testCases) {
    const arr = new Uint8Array(16);
    toUint8Array128LE(arr, value);

    const actual = Array.from(arr);
    const hex = b => '0x' + b.toString(16).padStart(2, '0');

    const label = `toUint8Array128LE(…, 0x${value.toString(16)})`;
    const passed = actual.every((b, i) => b === expected[i]);

    if (!passed) {
        console.assert(false, `${label} failed: got [${actual.map(hex).join(', ')}], expected [${expected.map(hex).join(', ')}]`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
