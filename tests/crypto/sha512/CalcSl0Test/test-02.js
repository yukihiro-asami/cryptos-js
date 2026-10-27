import { calcSl0 } from '../../../../src/crypto/sha512/calc-sl0.js';

// 自前のローテート実装（64bit）
function rotateRight64(x, n) {
    const mask = 0xffffffffffffffffn;
    n = BigInt(n % 64);
    return ((x >> n) | (x << (64n - n))) & mask;
}

// 自前の論理シフト（符号なし 右シフト）
function shiftRight64(x, n) {
    const mask = 0xffffffffffffffffn;
    return (x >> BigInt(n)) & (mask >> BigInt(n));
}

// SHA-512 σ₀(x) = ROTR(x,1) ^ ROTR(x,8) ^ SHR(x,7)
function expectedSl0(x) {
    return rotateRight64(x, 1) ^ rotateRight64(x, 8) ^ shiftRight64(x, 7);
}

// テストケース（意味のある境界と代表値）
const testCases = [
    0n,
    1n,
    0x8000000000000000n,
    0xffffffffffffffffn,
];

let allPassed = true;

for (const x of testCases) {
    const expected = expectedSl0(x);
    const actual = calcSl0(x);

    if (actual !== expected) {
        console.assert(false, `calcSl0(${x.toString(16)}n) failed:\n  got      = ${actual.toString(16)}\n  expected = ${expected.toString(16)}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
