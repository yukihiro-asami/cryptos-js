import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3ToBytes } from '../../../../src/curve25519/ge25519/ge25519-p3-to-bytes.js';
import { ge25519FromBytes } from '../../../../src/curve25519/ge25519/ge25519-from-bytes.js';

const R_bytes = Uint8Array.from([
    0x92, 0xa0, 0x09, 0xa9, 0xf0, 0xd4, 0xca, 0xb8,
    0x72, 0x0e, 0x82, 0x0b, 0x5f, 0x64, 0x25, 0x40,
    0xa2, 0xb2, 0x7b, 0x54, 0x16, 0x50, 0x3f, 0x8f,
    0xb3, 0x76, 0x22, 0x23, 0xeb, 0xdb, 0x69, 0xda
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
