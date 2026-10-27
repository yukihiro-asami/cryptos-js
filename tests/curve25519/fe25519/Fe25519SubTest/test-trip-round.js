import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Add } from '../../../../src/curve25519/fe25519/fe25519-add.js';
import { fe25519Sub } from '../../../../src/curve25519/fe25519/fe25519-sub.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';

function assertEqual(label, actual, expected) {
    if (actual !== expected) {
        console.assert(false, `${label} failed: got ${actual}, expected ${expected}`);
        return false;
    }
    return true;
}

let allPassed = true;
const cases = [
    { name: "case1", f: 100n, g: 50n },
    { name: "case2", f: 123456789n, g: 9876543n },
    { name: "case3", f: 0n, g: 777n },
    { name: "case4", f: 98765n, g: 0n },
    { name: "case5", f: 55555n, g: 55555n },
    { name: "case6", f: -1n, g: 1n },
    { name: "case7", f: (1n << 255n) - 1n, g: 1n },
    { name: "case8", f: 1n << 255n, g: 1n },
    { name: "case9", f: -1n, g: -2n },
    { name: "case10", f: (1n << 256n) - 1n, g: 1n },
];

for (const { name, f: fVal, g: gVal } of cases) {
    const f = fe25519();
    f.value = fVal;
    const g = fe25519();
    g.value = gVal;
    const tmp = fe25519();
    const round = fe25519();

    fe25519Add(tmp, f, g);
    fe25519Sub(round, tmp, g);
    fe25519Reduce(f);
    fe25519Reduce(round);
    allPassed &= assertEqual(`${name} (Add→Sub)`, round.value, f.value);
}

for (const { name, f: fVal, g: gVal } of cases) {
        const f = fe25519(); f.value = fVal;
        const g = fe25519(); g.value = gVal;
        const tmp = fe25519();
        const round = fe25519();
    fe25519Sub(tmp, f, g);
    fe25519Add(round, tmp, g);
    fe25519Reduce(f);
    fe25519Reduce(round);
    allPassed &= assertEqual(`${name} (Sub→Add)`, round.value, f.value);
}

if (allPassed) {
    console.log("tests_passed.");
}
