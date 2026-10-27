import { calcQuarterRound } from '../../../../src/crypto/chacha20poly1305/calc-quarter-round.js';

let allPassed = true;

// テストベクトル（RFC 7539）
const a = 0;
const b = 1;
const c = 2;
const d = 3;

const x = new Uint32Array(16);
x[a] = 0x11111111;
x[b] = 0x01020304;
x[c] = 0x9b8d6f43;
x[d] = 0x01234567;

const expected = [
    0xea2a92f4,
    0xcb1cf8ce,
    0x4581472e,
    0x5881c4bb,
];

// 実行
calcQuarterRound(x, a, b, c, d);

// 検証
for (let i = 0; i < 4; i++) {
    const actual = x[i];
    const exp = expected[i];
    const label = `x[${i}]`;
    if (actual !== exp) {
        console.assert(false, `${label} failed: got 0x${actual.toString(16)}, expected 0x${exp.toString(16)}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
