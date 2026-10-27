import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3Reduce } from '../../../../src/curve25519/ge25519/ge25519-p3-reduce.js';
import { P } from '../../../../src/curve25519/const.js';

let allPassed = true;

function assertEqual(label, actual, expected) {
    if (actual !== expected) {
        console.assert(false, `${label} mismatch:\n  expected: ${expected}\n  actual  : ${actual}`);
        allPassed = false;
    }
}

// === テストケース 1: 正のオーバーフロー ===

{
    const p = ge25519P3();
    p.X.value = P + 123n;
    p.Y.value = P * 2n + 456n;
    p.Z.value = P * 3n + 789n;
    p.T.value = 999n; // 範囲内

    ge25519P3Reduce(p);

    const expectedX = (P + 123n) % P;
    const expectedY = (P * 2n + 456n) % P;
    const expectedZ = (P * 3n + 789n) % P;
    const expectedT = 999n;

    assertEqual('Positive X', p.X.value, expectedX);
    assertEqual('Positive Y', p.Y.value, expectedY);
    assertEqual('Positive Z', p.Z.value, expectedZ);
    assertEqual('Positive T', p.T.value, expectedT);
}

// === テストケース 2: 負のオーバーフロー（商 = -2） ===

{
    const p = ge25519P3();
    p.X.value = -2n * P + 123n;
    p.Y.value = -2n * P + 456n;
    p.Z.value = -2n * P + 789n;
    p.T.value = -2n * P + 999n;

    ge25519P3Reduce(p);

    const expectedX = 123n;
    const expectedY = 456n;
    const expectedZ = 789n;
    const expectedT = 999n;

    assertEqual('Negative X', p.X.value, expectedX);
    assertEqual('Negative Y', p.Y.value, expectedY);
    assertEqual('Negative Z', p.Z.value, expectedZ);
    assertEqual('Negative T', p.T.value, expectedT);
}

if (allPassed) {
    console.log('tests_passed.');
}
