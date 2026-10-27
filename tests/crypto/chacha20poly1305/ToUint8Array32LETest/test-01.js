import { toUint8Array32LE } from '../../../../src/crypto/chacha20poly1305/to-uint8-array32-le.js';

let allPassed = true;

const testCases = [
    {
        value: 0x00000000,
        index: 0,
        expected: [0x00, 0x00, 0x00, 0x00],
    },
    {
        value: 0x01020304,
        index: 4,
        expected: [0x04, 0x03, 0x02, 0x01],
    },
    {
        value: 0xdeadbeef,
        index: 8,
        expected: [0xef, 0xbe, 0xad, 0xde],
    },
    {
        value: 0xffffffff,
        index: 28,
        expected: [0xff, 0xff, 0xff, 0xff],
    },
];

for (const { value, index, expected } of testCases) {
    const arr = new Uint8Array(32); // 常に32バイト固定
    toUint8Array32LE(arr, index, value);

    const actual = Array.from(arr.slice(index, index + 4));
    const hex = b => '0x' + b.toString(16).padStart(2, '0');

    const label = `toUint8Array32LE(…, ${index}, 0x${value.toString(16)})`;
    const passed = actual.every((b, i) => b === expected[i]);

    if (!passed) {
        console.assert(false, `${label} failed: got [${actual.map(hex).join(', ')}], expected [${expected.map(hex).join(', ')}]`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
