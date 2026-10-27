import { chachaIvSetUp } from '../../../../src/crypto/chacha20poly1305/chacha-iv-set-up.js';
import { chachaCtx } from '../../../../src/crypto/chacha20poly1305/chacha-ctx.js';

let allPassed = true;

const msb = 0x80000000;
const lsb = 0x00000001;

const testBits = [
    { label: 'msb', bytes: [0x00, 0x00, 0x00, 0x80], expected: msb },
    { label: 'lsb', bytes: [0x01, 0x00, 0x00, 0x00], expected: lsb },
];

// counter, iv[0..3], iv[4..7], iv[8..11] にビットをセットして確認
for (const { label, bytes, expected } of testBits) {
    const blank = [0x00, 0x00, 0x00, 0x00];

    // テストケース定義: 各位置にビットをセットし、他はゼロ
    const cases = [
        {
            name: `counter [${label}]`,
            counter: new Uint8Array(bytes),
            iv: new Uint8Array([...blank, ...blank, ...blank]),
            expect: [expected, 0, 0, 0]
        },
        {
            name: `iv[0..3] [${label}]`,
            counter: null,
            iv: new Uint8Array([...bytes, ...blank, ...blank]),
            expect: [0, expected, 0, 0]
        },
        {
            name: `iv[4..7] [${label}]`,
            counter: null,
            iv: new Uint8Array([...blank, ...bytes, ...blank]),
            expect: [0, 0, expected, 0]
        },
        {
            name: `iv[8..11] [${label}]`,
            counter: null,
            iv: new Uint8Array([...blank, ...blank, ...bytes]),
            expect: [0, 0, 0, expected]
        }
    ];

    for (const { name, counter, iv, expect } of cases) {
        const ctx = chachaCtx();
        chachaIvSetUp(ctx, iv, counter);

        const actual = ctx.input.slice(12, 16);
        let passed = true;

        for (let i = 0; i < 4; i++) {
            if (actual[i] !== expect[i]) {
                console.assert(false, `${name} [word ${12 + i}]: got 0x${actual[i].toString(16)}, expected 0x${expect[i].toString(16)}`);
                passed = false;
                allPassed = false;
            }
        }

    }
}

if (allPassed) {
    console.log("tests_passed.");
}
