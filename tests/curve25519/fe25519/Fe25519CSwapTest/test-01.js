import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519CSwap } from '../../../../src/curve25519/fe25519/fe25519-cswap.js';

let allPassed = true;

const originalF = 111n;
const originalG = 999n;

{
    const f = fe25519(); f.value = originalF;
    const g = fe25519(); g.value = originalG;

    fe25519CSwap(f, g, 1);

    if (f.value !== originalG || g.value !== originalF) {
        console.assert(false, `CSwap test (b=1) failed: f=${f.value}, g=${g.value}`);
        allPassed = false;
    }
}

{
    const f = fe25519(); f.value = originalF;
    const g = fe25519(); g.value = originalG;

    fe25519CSwap(f, g, 0);

    if (f.value !== originalF || g.value !== originalG) {
        console.assert(false, `CSwap test (b=0) failed: f=${f.value}, g=${g.value}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
