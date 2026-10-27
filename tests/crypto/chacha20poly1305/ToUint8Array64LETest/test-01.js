import { toUint8Array64LE } from '../../../../src/crypto/chacha20poly1305/to-uint8-array64-le.js';

let allPassed = true;

const testCases = [
    {
        value: 0x0000000000000000n,
        expected: [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
    },
    {
        value: 0x0102030405060708n,
        expected: [0x08, 0x07, 0x06, 0x05, 0x04, 0x03, 0x02, 0x01],
    },
    {
        value: 0xdeadbeefcafebaben,
        expected: [0xbe, 0xba, 0xfe, 0xca, 0xef, 0xbe, 0xad, 0xde],
    },
    {
        value: 0xffffffffffffffffn,
        expected: [0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff],
    },
];

for (const { value, expected } of testCases) {
    const arr = new Uint8Array(8); // 8バイト固定
    toUint8Array64LE(arr, value);

    const actual = Array.from(arr);
    const hex = b => '0x' + b.toString(16).padStart(2, '0');

    const label = `toUint8Array64LE(…, 0x${value.toString(16)})`;
    const passed = actual.every((b, i) => b === expected[i]);

    if (!passed) {
        console.assert(false, `${label} failed: got [${actual.map(hex).join(', ')}], expected [${expected.map(hex).join(', ')}]`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}