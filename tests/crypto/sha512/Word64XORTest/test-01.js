import { word64XOR } from '../../../../src/crypto/sha512/word64-xor.js';

let allPassed = true;

// Test Case 1: Basic XOR
{
    const result = word64XOR(0b1010n, 0b1100n); // 0b0110
    if (result !== 0b0110n) {
        console.assert(false, `word64XOR(0b1010n, 0b1100n) failed: got ${result}, expected 0b0110n`);
        allPassed = false;
    }
}

// Test Case 2: XOR with 0 (identity)
{
    const result = word64XOR(0xffffffffffffffffn, 0n);
    if (result !== 0xffffffffffffffffn) {
        console.assert(false, `word64XOR(0xffffffffffffffffn, 0n) failed: got ${result}, expected 0xffffffffffffffffn`);
        allPassed = false;
    }
}

// Test Case 3: XOR with self (zero result)
{
    const result = word64XOR(0x123456789abcdef0n, 0x123456789abcdef0n);
    if (result !== 0n) {
        console.assert(false, `word64XOR(0x123456789abcdef0n, self) failed: got ${result}, expected 0n`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
