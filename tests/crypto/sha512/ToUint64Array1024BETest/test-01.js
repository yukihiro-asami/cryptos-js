// test-to-uint64-array-1024-be.js
import { toUint64Array1024BE } from '../../../../src/crypto/sha512/to-uint64-array-1024-be.js';

let allPassed = true;

// 初期化：W[0..79] = { value: 0xffffffffffffffffn }
const W = Array.from({ length: 80 }, () => ({ value: 0xffffffffffffffffn }));

// 入力ブロック：0〜127 の Uint8Array（連番）
const block = new Uint8Array(128);
for (let i = 0; i < 128; i++) {
    block[i] = i;
}

// 実行
toUint64Array1024BE(W, block);

// 比較対象：BigEndianで8バイト単位に詰めたBigInt値
const expected = [];
for (let i = 0; i < 16; i++) {
    const offset = i * 8;
    let v = 0n;
    for (let j = 0; j < 8; j++) {
        v |= BigInt(block[offset + j]) << (56n - BigInt(j * 8));
    }
    expected.push(v);
}

// 検証：W[0..15] が正しく上書きされているか
for (let i = 0; i < 16; i++) {
    if (W[i].value !== expected[i]) {
        console.assert(false, `W[${i}].value mismatch: got ${W[i].value.toString(16)}, expected ${expected[i].toString(16)}`);
        allPassed = false;
    }
}

// 検証：W[16..79] は元の値（0xffffffffffffffffn）のままか
for (let i = 16; i < 80; i++) {
    if (W[i].value !== 0xffffffffffffffffn) {
        console.assert(false, `W[${i}].value was modified: got ${W[i].value.toString(16)}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
