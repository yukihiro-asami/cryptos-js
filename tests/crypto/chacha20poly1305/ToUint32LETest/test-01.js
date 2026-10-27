import { toUint32LE } from '../../../../src/crypto/chacha20poly1305/to-uint32-le.js';

let allPassed = true;

const testCases = [
    // [bytes, index, expectedUint32]
    [[0x00, 0x00, 0x00, 0x00], 0, 0x00000000],
    [[0x01, 0x00, 0x00, 0x00], 0, 0x00000001],
    [[0x00, 0x01, 0x00, 0x00], 0, 0x00000100],
    [[0x00, 0x00, 0x01, 0x00], 0, 0x00010000],
    [[0x00, 0x00, 0x00, 0x01], 0, 0x01000000],
    [[0x78, 0x56, 0x34, 0x12], 0, 0x12345678],
    [[0xff, 0xff, 0xff, 0xff], 0, 0xffffffff],
    [[0x01, 0x02, 0x03, 0x04, 0xff], 1, 0xff040302]
];

for (const [byteArray, index, expected] of testCases) {
    const input = new Uint8Array(byteArray);
    const result = toUint32LE(input, index);
    const caseLabel = `toUint32LE([${byteArray.map(b => b.toString(16))}], ${index})`;

    if (result !== expected) {
        console.assert(false, `${caseLabel} failed: got 0x${result.toString(16)}, expected 0x${expected.toString(16)}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
