import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519FromBytes } from '../../../../src/curve25519/fe25519/fe25519-from-bytes.js';
import { fe25519ToBytes } from '../../../../src/curve25519/fe25519/fe25519-to-bytes.js';

const testCases = [
    new Uint8Array(32).fill(0),
    Uint8Array.from([...Array(32)].map((_, i) => i)),
    Uint8Array.from([
        0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef,
        0xfe, 0xdc, 0xba, 0x98, 0x76, 0x54, 0x32, 0x10,
        0x10, 0x32, 0x54, 0x76, 0x98, 0xba, 0xdc, 0xfe,
        0xef, 0xcd, 0xab, 0x89, 0x67, 0x45, 0x23, 0x01
    ]),
    Uint8Array.from([
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88,
        0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0x00,
        0x00, 0xff, 0xee, 0xdd, 0xcc, 0xbb, 0xaa, 0x99,
        0x88, 0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11
    ]),
    (() => {
        const a = new Uint8Array(32).fill(0x80);
        a[31] = 0x00; // bit 255が立たないように
        return a;
    })()
];

let allPassed = true;

for (let i = 0; i < testCases.length; i++) {
    const original = testCases[i];
    const h = fe25519();

    fe25519FromBytes(h, original);
    const roundtrip = new Uint8Array(32);
    fe25519ToBytes(roundtrip, h);

    for (let j = 0; j < 32; j++) {
        if (roundtrip[j] !== original[j]) {
            console.assert(false, `Test ${i} failed at byte ${j}: got ${roundtrip[j]}, expected ${original[j]}`);
            allPassed = false;
            break;
        }
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
