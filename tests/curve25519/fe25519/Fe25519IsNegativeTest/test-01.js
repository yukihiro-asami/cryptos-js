import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519IsNegative } from '../../../../src/curve25519/fe25519/fe25519-is-negative.js';

let allPassed = true;

{
    const f = fe25519(); f.value = 0n;
    const result = fe25519IsNegative(f);

    if (result !== 0) {
        console.assert(false, `IsNegative test (0n) failed: got ${result}, expected 0`);
        allPassed = false;
    }
}

{
    const f = fe25519(); f.value = 1n;
    const result = fe25519IsNegative(f);

    if (result !== 1) {
        console.assert(false, `IsNegative test (1n) failed: got ${result}, expected 1`);
        allPassed = false;
    }
}
{
    const f = fe25519(); f.value = 2n;
    const result = fe25519IsNegative(f);
    console.assert(result === 0, `Expected 0 for even input 2n, got ${result}`);
}
{
    const f = fe25519(); f.value = 3n;
    const result = fe25519IsNegative(f);
    console.assert(result === 1, `Expected 1 for odd input 3n, got ${result}`);
}
const q = (1n << 255n) - 19n;

{
    const f = fe25519(); f.value = q - 1n; // even
    const result = fe25519IsNegative(f);
    console.assert(result === 0, `Expected 0 for even input q-1, got ${result}`);
}
{
    const f = fe25519(); f.value = q - 2n; // odd
    const result = fe25519IsNegative(f);
    console.assert(result === 1, `Expected 1 for odd input q-2, got ${result}`);
}
if (allPassed) {
    console.log("tests_passed.");
}
