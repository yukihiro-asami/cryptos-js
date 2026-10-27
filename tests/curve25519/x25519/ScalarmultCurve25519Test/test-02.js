import { scalarmultCurve25519 } from '../../../../src/curve25519/x25519/scalarmult-curve25519.js';
// リトルエンディアンでHex → BigInt
function hexToBigIntLE(hex) {
    let n = 0n;
    for (let i = hex.length / 2 - 1; i >= 0; i--) {
        const byteHex = hex.slice(i * 2, i * 2 + 2);
        const byte = BigInt(parseInt(byteHex, 16));
        n = (n << 8n) | byte;
    }
    return n;
}

// BigInt → リトルエンディアンHex文字列
function bigintToHexLE(bi, byteLength = 32) {
    const bytes = [];
    for (let i = 0; i < byteLength; i++) {
        bytes.push(Number((bi >> (8n * BigInt(i))) & 0xffn));
    }
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

// === RFC 7748 test vector ===
const scalarHex = '4b66e9d4d1b4673c5ad22691957d6af5c11b6421e0ea01d42ca4169e7918ba0d';
const uHex      = 'e5210f12786811d3f4b7959d0538ae2c31dbe7106fc03c3efc4cd549c715a493';
const expected  = '95cbde9476e8907d7aade45cb4b873f88b595a68799fa152e6f8f7647aac7957';

// 入力値のセットアップ
const k = Uint8Array.from(
    scalarHex.match(/.{2}/g).map(b => parseInt(b, 16))
);
const u = Uint8Array.from(
    uHex.match(/.{2}/g).map(b => parseInt(b, 16))
);

const result = scalarmultCurve25519(k, u);
const resultHex = bigintToHexLE(result);

if (resultHex === expected) {
    console.log('tests_passed.');
} else {
    console.error('FAILED');
    console.error('output  :', resultHex);
    console.error('expected:', expected);
}
