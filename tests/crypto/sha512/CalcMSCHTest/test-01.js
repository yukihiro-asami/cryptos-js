import { calcMSCH } from '../../../../src/crypto/sha512/calc-msch.js';
import { word64Add } from '../../../../src/crypto/sha512/word64-add.js';
import { calcSl0 } from '../../../../src/crypto/sha512/calc-sl0.js';
import { calcSl1 } from '../../../../src/crypto/sha512/calc-sl1.js';

let allPassed = true;

const iiList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // 入力範囲の多様性確認用
const iList = [0, 16, 32, 48]; // iブロック位置確認用

for (const i of iList) {
    for (const ii of iiList) {
        const W = Array.from({ length: 80 }, (_, j) => ({
            value: BigInt(j + 1000),
        }));

        const t = i + ii + 16;
        const w_2  = W[t - 2].value;
        const w_7  = W[t - 7].value;
        const w_15 = W[t - 15].value;
        const w_16 = W[t - 16].value;

        const expected = word64Add(
            word64Add(
                word64Add(
                    calcSl1(w_2),
                    w_7
                ),
                calcSl0(w_15)
            ),
            w_16
        );

        calcMSCH(W, ii, i);

        const actual = W[t].value;

        const pass = actual === expected;
        const label = `calcMSCH(i=${i}, ii=${ii})`;

        console.assert(pass, `${label} failed`);
        if (!pass) {
            console.error(`  expected: ${expected}`);
            console.error(`  actual:   ${actual}`);
            allPassed = false;
        }
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
