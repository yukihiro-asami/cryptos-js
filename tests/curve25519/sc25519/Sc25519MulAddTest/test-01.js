import { sc25519 } from '../../../../src/curve25519/sc25519/sc25519.js';
import { sc25519MulAdd } from '../../../../src/curve25519/sc25519/sc25519-mul-add.js';
import { L } from '../../../../src/curve25519/const.js';
import {sc25519Reduce} from "../../../../src/curve25519/sc25519/sc25519-reduce.js";

let allPassed = true;

function testCase(label, aVal, bVal, cVal, expectedVal) {
    const a = sc25519();
    const b = sc25519();
    const c = sc25519();
    const s = sc25519();

    a.value = aVal;
    b.value = bVal;
    c.value = cVal;

    sc25519MulAdd(s, a, b, c);
    sc25519Reduce(s);

    const passed = s.value === expectedVal;
    if (!passed) {
        console.assert(false, `${label} failed: got ${s.value}, expected ${expectedVal}`);
        allPassed = false;
    }
}

// === テストケース ===
testCase("0 * 0 + 0", 0n, 0n, 0n, 0n);
testCase("1 * 1 + 0", 1n, 1n, 0n, 1n);
testCase("2 * 3 + 1", 2n, 3n, 1n, 7n);
testCase("L-1 * 1 + 0", L - 1n, 1n, 0n, L - 1n);
testCase("L-1 * L-1 + 0", L - 1n, L - 1n, 0n, 1n);
testCase("L-1 * L-1 + L-1", L - 1n, L - 1n, L - 1n, 0n);
testCase("123 * 456 + 789", 123n, 456n, 789n, (123n * 456n + 789n) % L);

if (allPassed) {
    console.log("tests_passed.");
}
