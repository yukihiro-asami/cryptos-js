import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519IsZero } from '../../../../src/curve25519/fe25519/fe25519-is-zero.js';

let allPassed = true;

{
    const f = fe25519(); f.value = 0n;
    const result = fe25519IsZero(f);

    if (result !== 1) {
        console.assert(false, `IsZero test (0n) failed: got ${result}, expected 1`);
        allPassed = false;
    }
}

{
    const f = fe25519(); f.value = 123n;
    const result = fe25519IsZero(f);

    if (result !== 0) {
        console.assert(false, `IsZero test (123n) failed: got ${result}, expected 0`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
