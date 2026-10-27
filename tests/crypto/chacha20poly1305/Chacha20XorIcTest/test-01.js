import { chacha20XorIc } from '../../../../src/crypto/chacha20poly1305/chacha20-xor-ic.js';

function hexToBytes(hex) {
    return Uint8Array.from(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
}

function runTest() {
    let allPassed = true;

    const key = hexToBytes(
        '000102030405060708090a0b0c0d0e0f' +
        '101112131415161718191a1b1c1d1e1f'
    );

    const nonce = hexToBytes(
        '000000000000004a00000000'
    );

    const ic = 1;

    const plaintext = hexToBytes(
        '4c616469657320616e642047656e746c' +
        '656d656e206f662074686520636c6173' +
        '73206f66202739393a20496620492063' +
        '6f756c64206f6666657220796f75206f' +
        '6e6c79206f6e652074697020666f7220' +
        '746865206675747572652c2073756e73' +
        '637265656e20776f756c642062652069' +
        '742e'
    );

    const expected = hexToBytes(
        '6e2e359a2568f98041ba0728dd0d6981' +
        'e97e7aec1d4360c20a27afccfd9fae0b' +
        'f91b65c5524733ab8f593dabcd62b357' +
        '1639d624e65152ab8f530c359f0861d8' +
        '07ca0dbf500d6a6156a38e088a22b65e' +
        '52bc514d16ccf806818ce91ab7793736' +
        '5af90bbf74a35be6b40b8eedf2785e42' +
        '874d'
    );

    const actual = new Uint8Array(plaintext.length);

    chacha20XorIc(actual, plaintext, ic, nonce, key);

    const passed = expected.every((b, i) => b === actual[i]);

    if (!passed) {
        console.error('chacha20XorIc failed.');
        console.error('Expected:', Array.from(expected).map(b => b.toString(16).padStart(2, '0')).join(' '));
        console.error('Actual:  ', Array.from(actual).map(b => b.toString(16).padStart(2, '0')).join(' '));
        allPassed = false;
    }

    if (allPassed) {
        console.log('tests_passed.');
    }
}

runTest();
