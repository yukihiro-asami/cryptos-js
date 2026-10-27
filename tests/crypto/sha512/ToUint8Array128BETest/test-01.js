import { toUint8Array128BE } from '../../../../src/crypto/sha512/to-uint8-array-128-be.js';

let allPassed = true;

const UINT128_MODULUS = 2n ** 128n;

const tests = [
    {
        value: 0n,
        expectedHex: '00000000000000000000000000000000'
    },
    {
        value: 1n,
        expectedHex: '00000000000000000000000000000001'
    },
    {
        value: 0x0123456789ABCDEFFEDCBA0987654321n,
        expectedHex: '0123456789abcdeffedcba0987654321'
    },
    {
        value: UINT128_MODULUS + 2n,
        expectedHex: '00000000000000000000000000000002'
    },
    {
        value: UINT128_MODULUS * 5n + 0xFFn,
        expectedHex: '000000000000000000000000000000ff'
    },
];

for (const { value, expectedHex } of tests) {
    const buf = new Uint8Array(128).fill(0xAA); // 未使用領域が書き換わらないことも検証
    toUint8Array128BE(buf, value);

    const actualHex = Array.from(buf.slice(112, 128))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    if (actualHex !== expectedHex) {
        console.assert(false,
            `FAILED\nvalue:     ${value}\nexpected:  ${expectedHex}\nactual:    ${actualHex}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
