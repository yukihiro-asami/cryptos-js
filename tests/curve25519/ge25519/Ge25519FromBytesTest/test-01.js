import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519FromBytes } from '../../../../src/curve25519/ge25519/ge25519-from-bytes.js';

let allPassed = true;

function hexToBytes(hex) {
    const bytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}

function testCase(hexStr, expectSuccess, label) {
    const s = hexToBytes(hexStr);
    const p = ge25519P3();
    const ret = ge25519FromBytes(p, s);
    const passed = expectSuccess ? (ret === 0) : (ret === -1);
    if (!passed) {
        console.assert(false, label + ` failed (ret=${ret})`);
        allPassed = false;
    }
}

// 1. y=0の点（恒等点ではない）
testCase(
    '00'.repeat(32),
    true,
    'accept encoded point with y=0'
);

// 2. y=1ではx=0。符号ビット1はRFC 8032 §5.1.3で拒否する。
testCase(
    '0100000000000000000000000000000000000000000000000000000000000080',
    false,
    'reject x=0 with sign bit 1'
);

// 3. 基本的な有効点（Y = 1, 符号ビット = 0）
testCase(
    '0100000000000000000000000000000000000000000000000000000000000000',
    true,
    'accept valid Y = 1 point'
);

// 4. y=0、符号ビット1も有効（xが非ゼロの反対側の点）。
testCase(
    '0000000000000000000000000000000000000000000000000000000000000080',
    true,
    'accept encoded point with y=0 and sign bit 1'
);

if (allPassed) {
    console.log('tests_passed.');
}
