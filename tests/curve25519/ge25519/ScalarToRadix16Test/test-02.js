import { scalarToRadix16 } from '../../../../src/curve25519/ge25519/scalar-to-radix16.js';

let allPassed = true;

function testCase(label, bigintValue, expectedStart = null) {
    const scalar = { value: bigintValue };
    const e = scalarToRadix16(scalar);

    if (!(e instanceof Int8Array) || e.length !== 64) {
        console.assert(false, `${label}: scalarToRadix16 should return Int8Array(64)`);
        allPassed = false;
        return;
    }

    for (let i = 0; i < 64; i++) {
        if (e[i] < -8 || e[i] > 8) {
            console.assert(false, `${label}: e[${i}] = ${e[i]} out of range [-8,8]`);
            allPassed = false;
        }
    }

    if (expectedStart !== null) {
        for (let i = 0; i < expectedStart.length; i++) {
            if (e[i] !== expectedStart[i]) {
                console.assert(false, `${label}: e[${i}] expected ${expectedStart[i]} but got ${e[i]}`);
                allPassed = false;
            }
        }
    }
}

// Test case 1: Zero
testCase('zero', 0n, new Array(64).fill(0));

// Test case 2: One
testCase('one', 1n, [1, ...new Array(63).fill(0)]);

// Test case 3: 0x22-filled
{
    const bytes = new Uint8Array(32).fill(0x22);
    let value = 0n;
    for (let i = 31; i >= 0; i--) {
        value = (value << 8n) + BigInt(bytes[i]);
    }
    testCase('0x22 fill', value);
}

// Test case 4: Max scalar (all bits set)
testCase('max', (1n << 256n) - 1n);

if (allPassed) {
    console.log('tests_passed.');
}
