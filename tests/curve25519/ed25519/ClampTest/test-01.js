import { clamp } from '../../../../src/curve25519/ed25519/clamp.js';

function assertEqual(actual, expected, label) {
    if (actual !== expected) {
        console.error(`FAILED: ${label} expected=${expected}, got=${actual}`);
        process.exit(1);
    }
}

// === テスト対象データ ===
const k = new Uint8Array(32);
k[0] = 0b11111111;  // should become 0b11111000 (248)
k[31] = 0b11111111; // should become 0b01000000 | 0b00111111 = 0b01111111

// === 実行 ===
clamp(k);

// === 検証 ===
assertEqual(k[0], 248, 'k[0] clamp failed');
assertEqual(k[31] & 0b10000000, 0, 'k[31] top bit not cleared');
assertEqual(k[31] & 0b01000000, 0b01000000, 'k[31] second top bit not set');

console.log('tests_passed.');
