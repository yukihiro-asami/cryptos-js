import { toUint8Array512BE } from '../../../../src/crypto/sha512/to-uint8-array-512-be.js';

let allPassed = true;

{
    const src = [
        { value: 0n },
        { value: 1n },
        { value: 0x0123456789ABCDEFn },
        { value: 0xFFFFFFFFFFFFFFFFn },
        { value: 0x8000000000000000n },
        { value: 0x7FFFFFFFFFFFFFFFn },
        { value: 0x00000000FFFFFFFFn },
        { value: 0xFFFFFFFF00000000n },
    ];
    const dist = new Uint8Array(64);
    toUint8Array512BE(dist, src);

    const expected = [
        // 0n
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        // 1n
        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,
        // 0x0123456789ABCDEF
        0x01,0x23,0x45,0x67,0x89,0xAB,0xCD,0xEF,
        // 0xFFFFFFFFFFFFFFFF
        0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,
        // 0x8000000000000000
        0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
        // 0x7FFFFFFFFFFFFFFF
        0x7F,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,0xFF,
        // 0x00000000FFFFFFFF
        0x00,0x00,0x00,0x00,0xFF,0xFF,0xFF,0xFF,
        // 0xFFFFFFFF00000000
        0xFF,0xFF,0xFF,0xFF,0x00,0x00,0x00,0x00,
    ];

    for (let i = 0; i < 64; i++) {
        if (dist[i] !== expected[i]) {
            console.assert(false,
                `toUint8Array512BE failed at index ${i}: got 0x${dist[i].toString(16).padStart(2, '0')}, expected 0x${expected[i].toString(16).padStart(2, '0')}`);
            allPassed = false;
        }
    }
}
{
    const src = [
        { value: 0x0123456789ABCDEFn },
        { value: 0x0000000000000001n },
        { value: 0x0000000100000000n },
        { value: 0x1234567890ABCDEFn },
        { value: 0xA5A5A5A5A5A5A5A5n },
        { value: 0x5A5A5A5A5A5A5A5An },
        { value: 0x0000FFFF0000FFFFn },
        { value: 0xFFFF0000FFFF0000n },
    ];
    const dist = new Uint8Array(64);
    toUint8Array512BE(dist, src);

    for (let i = 0; i < 8; i++) {
        let reconstructed = 0n;
        for (let j = 0; j < 8; j++) {
            reconstructed = (reconstructed << 8n) | BigInt(dist[i * 8 + j]);
        }
        if (reconstructed !== src[i].value) {
            console.assert(false,
                `roundtrip mismatch at index ${i}: got ${reconstructed.toString(16)}, expected ${src[i].value.toString(16)}`);
            allPassed = false;
        }
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
