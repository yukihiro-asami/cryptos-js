import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519ToBytes } from '../../../../src/curve25519/fe25519/fe25519-to-bytes.js';

// テスト対象の値：0x00010203...1f
const expected = new Uint8Array(32);
for (let i = 0; i < 32; i++) {
    expected[i] = i;
}

const h = fe25519();
h.value = BigInt(0);
for (let i = 0; i < 32; i++) {
    h.value |= BigInt(i) << BigInt(8 * i);
}

const actual = new Uint8Array(32);
fe25519ToBytes(actual, h);

let allPassed = true;
for (let i = 0; i < 32; i++) {
    if (actual[i] !== expected[i]) {
        console.assert(false, `byte ${i} mismatch: got ${actual[i]}, expected ${expected[i]}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
