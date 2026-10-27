import { word64Add } from '../../../../src/crypto/sha512/word64-add.js';

let allPassed = true;

// Test Case 1: Basic addition
{
    const result = word64Add(1n, 2n);
    if (result !== 3n) {
        console.assert(false, `word64Add(1n, 2n) failed: got ${result}, expected 3n`);
        allPassed = false;
    }
}

// Test Case 2: Zero + Zero
{
    const result = word64Add(0n, 0n);
    if (result !== 0n) {
        console.assert(false, `word64Add(0n, 0n) failed: got ${result}, expected 0n`);
        allPassed = false;
    }
}

// Test Case 3: Carry wraps to 0
{
    const result = word64Add(0xFFFFFFFFFFFFFFFFn, 1n);
    if (result !== 0n) {
        console.assert(false, `word64Add(0xFFFFFFFFFFFFFFFFn, 1n) failed: got ${result}, expected 0n`);
        allPassed = false;
    }
}

// Test Case 4: Max - 1 + 1
{
    const result = word64Add(0xFFFFFFFFFFFFFFFEn, 1n);
    if (result !== 0xFFFFFFFFFFFFFFFFn) {
        console.assert(false, `word64Add(0xFFFFFFFFFFFFFFFEn, 1n) failed: got ${result}, expected 0xFFFFFFFFFFFFFFFFn`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
