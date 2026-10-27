import { word64Rotate } from '../../../../src/crypto/sha512/word64-rotate.js';

let allPassed = true;

{
    const x = 0x0123456789abcdefn;
    const w = 64n;

    for (let n = 0; n < 64; n++) {
        const bn = BigInt(n);
        const expected = ((x >> bn) | (x << (w - bn))) & 0xffffffffffffffffn;
        const actual = word64Rotate(x, n);

        if (actual !== expected) {
            console.assert(false, `Rotate test failed at n=${n}: got ${actual.toString(16)}, expected ${expected.toString(16)}`);
            allPassed = false;
        }
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
