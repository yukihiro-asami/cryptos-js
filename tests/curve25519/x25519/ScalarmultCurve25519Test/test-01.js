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
const scalarHex = 'a546e36bf0527c9d3b16154b82465edd62144c0ac1fc5a18506a2244ba449ac4';
const uHex      = 'e6db6867583030db3594c1a424b15f7c726624ec26b3353b10a903a6d0ab1c4c';
const expected  = 'c3da55379de9c6908e94ea4df28d084f32eccf03491c71f754b4075577a28552';

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
