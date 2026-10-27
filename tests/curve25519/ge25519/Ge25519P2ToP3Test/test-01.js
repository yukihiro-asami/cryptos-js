import { ge25519P2 } from '../../../../src/curve25519/ge25519/ge25519-p2.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P2ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p2-to-p3.js';

let allPassed = true;

const p = ge25519P2();
const r = ge25519P3();

// 入力に任意の値をセット
p.X.value = 3n;
p.Y.value = 5n;
p.Z.value = 7n;

// 実行
ge25519P2ToP3(r, p);

// 検証
if (r.X.value !== 3n) {
    console.assert(false, 'r.X should be 3n');
    allPassed = false;
}
if (r.Y.value !== 5n) {
    console.assert(false, 'r.Y should be 5n');
    allPassed = false;
}
if (r.Z.value !== 7n) {
    console.assert(false, 'r.Z should be 7n');
    allPassed = false;
}
if (r.T.value !== 15n) { // 3n * 5n = 15n
    console.assert(false, 'r.T should be 15n');
    allPassed = false;
}

// 構造チェック
for (const coord of ['X', 'Y', 'Z', 'T']) {
    if (!(coord in r)) {
        console.assert(false, `r should have .${coord} property`);
        allPassed = false;
        continue;
    }
    const field = r[coord];
    if (typeof field !== 'object') {
        console.assert(false, `${coord} should be an object`);
        allPassed = false;
    } else if (!('value' in field)) {
        console.assert(false, `${coord}.value is missing`);
        allPassed = false;
    } else if (typeof field.value !== 'bigint') {
        console.assert(false, `${coord}.value should be a BigInt`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
