import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519CMov } from '../../../../src/curve25519/fe25519/fe25519-cmov.js';

let allPassed = true;

// テスト値
const originalF = 111n;
const originalG = 999n;

// === ケース1: b = 1 → f should become g ===
{
    const f = fe25519(); f.value = originalF;
    const g = fe25519(); g.value = originalG;

    fe25519CMov(f, g, 1);

    if (f.value !== originalG) {
        console.assert(false, `CMov test (b=1) failed: got ${f.value}, expected ${originalG}`);
        allPassed = false;
    }
}

// === ケース2: b = 0 → f should remain unchanged ===
{
    const f = fe25519(); f.value = originalF;
    const g = fe25519(); g.value = originalG;

    fe25519CMov(f, g, 0);

    if (f.value !== originalF) {
        console.assert(false, `CMov test (b=0) failed: got ${f.value}, expected ${originalF}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
