import { sha512Transform } from '../../../../src/crypto/sha512/sha512-transform.js';
import { toUint64Array1024BE } from '../../../../src/crypto/sha512/to-uint64-array-1024-be.js';
import { calcRNDr } from '../../../../src/crypto/sha512/calc-rndr.js';
import { calcMSCH } from '../../../../src/crypto/sha512/calc-msch.js';
import { word64Add } from '../../../../src/crypto/sha512/word64-add.js';

let allPassed = true;

const block = new Uint8Array(128); // 全ゼロ

const mkState = () => Array.from({ length: 8 }, () => ({ value: 0n }));
const mkW = () => Array.from({ length: 80 }, () => ({ value: 0n }));

// 本体実行
const state1 = mkState();
const W1 = mkW();
const S1 = mkState();

sha512Transform(state1, block, W1, S1);

// 手動等価処理
const state2 = mkState();
const W2 = mkW();
const S2 = mkState();

toUint64Array1024BE(W2, block);

for (let i = 0; i < 8; i++) {
    S2[i].value = state2[i].value;
}

for (let i = 0; i < 80; i += 16) {
    for (let ii = 0; ii < 16; ii++) {
        calcRNDr(S2, W2, ii, i);
    }

    if (i !== 64) {
        for (let ii = 0; ii < 16; ii++) {
            calcMSCH(W2, ii, i);
        }
    }
}

for (let i = 0; i < 8; i++) {
    state2[i].value = word64Add(state2[i].value, S2[i].value);
}

// 比較
for (let i = 0; i < 8; i++) {
    const a = state1[i].value;
    const b = state2[i].value;
    const pass = a === b;
    const label = `sha512Transform vs manual[i=${i}]`;

    console.assert(pass, `${label} failed`);
    if (!pass) {
        console.error(`  ${label} failed`);
        console.error(`    state1: ${a}`);
        console.error(`    state2: ${b}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
