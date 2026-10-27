import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3ToBytes } from '../../../../src/curve25519/ge25519/ge25519-p3-to-bytes.js';
import { ge25519FromBytes } from '../../../../src/curve25519/ge25519/ge25519-from-bytes.js';

const R_bytes = Uint8Array.from([
    0xe5, 0x56, 0x43, 0x00, 0xc3, 0x60, 0xac, 0x72,
    0x90, 0x86, 0xe2, 0xcc, 0x80, 0x6e, 0x82, 0x8a,
    0x84, 0x87, 0x7f, 0x1e, 0xb8, 0xe5, 0xd9, 0x74,
    0xd8, 0x73, 0xe0, 0x65, 0x22, 0x49, 0x01, 0x55,
]);

const R_point = ge25519P3();
const result = ge25519FromBytes(R_point, R_bytes);

console.assert(result === 0, 'Failed to decode R point');

const R_roundtrip = new Uint8Array(32);
ge25519P3ToBytes(R_roundtrip, R_point);
console.log(R_bytes);
console.log(R_roundtrip);

// 比較
for (let i = 0; i < 32; i++) {
    if (R_bytes[i] !== R_roundtrip[i]) {
        console.error(`Byte mismatch at index ${i}: original=${R_bytes[i]}, roundtrip=${R_roundtrip[i]}`);
        throw new Error('R point roundtrip mismatch');
    }
}

console.log('R point roundtrip OK');
