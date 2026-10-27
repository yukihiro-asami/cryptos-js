import { calcRNDr } from '../../../../src/crypto/sha512/calc-rndr.js';
import { calcRND } from '../../../../src/crypto/sha512/calc-rnd.js';
import { word64Add } from '../../../../src/crypto/sha512/word64-add.js';
import { Krand } from '../../../../src/crypto/const.js';

let allPassed = true;

const S = Array.from({ length: 80 }, (_, i) => ({ value: BigInt(i) }));
const W = Array.from({ length: 80 }, (_, i) => ( {value : BigInt(i + 2000)}));

const iiList = [0, 16, 32, 48, 64];

for (const ii of iiList) {
    for (let i = 0; i < 16; i++) {
        // 対象インデックス
        const idxD = (83 - i) % 8;
        const idxH = (87 - i) % 8;

        // コピーして期待値用に実行
        const sCopy = Array.from({ length: 8 }, (_, j) => ({
            value: S[j].value
        }));

        const args = [
            sCopy[(80 - i) % 8],
            sCopy[(81 - i) % 8],
            sCopy[(82 - i) % 8],
            sCopy[(83 - i) % 8],
            sCopy[(84 - i) % 8],
            sCopy[(85 - i) % 8],
            sCopy[(86 - i) % 8],
            sCopy[(87 - i) % 8],
            { value: word64Add(W[i + ii].value, Krand[i + ii]) },
        ];

        calcRND(...args);

        // 実行前のバックアップ
        const beforeD = S[idxD].value;
        const beforeH = S[idxH].value;

        // 実行
        calcRNDr(S, W, i, ii);

        const pass =
            S[idxD].value === args[3].value &&
            S[idxH].value === args[7].value;

        const label = `calcRNDr(i=${i}, ii=${ii})`;

        console.assert(pass, `${label} failed: d or h incorrect.`);
        if (!pass) {
            console.error(`  expected d=${args[3].value} h=${args[7].value}`);
            console.error(`  actual   d=${S[idxD].value} h=${S[idxH].value}`);
            console.error(`  before   d=${beforeD} h=${beforeH}`);
            allPassed = false;
        }
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
