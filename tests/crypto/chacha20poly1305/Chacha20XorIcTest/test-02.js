import { chacha20XorIc } from '../../../../src/crypto/chacha20poly1305/chacha20-xor-ic.js';

function hexToBytes(hex) {
    return Uint8Array.from(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
}

function runTest() {
    let allPassed = true;

    const key = hexToBytes(
        '00000000000000000000000000000000' +
        '00000000000000000000000000000000'
    );

    const nonce = hexToBytes(
        '000000000000000000000000'
    );

    const ic = 0;

    const plaintext = hexToBytes(
        '00000000000000000000000000000000' +
        '00000000000000000000000000000000' +
        '00000000000000000000000000000000' +
        '00000000000000000000000000000000'
    );

    const expected = hexToBytes(
        '76b8e0ada0f13d90405d6ae55386bd28' +
        'bdd219b8a08ded1aa836efcc8b770dc7' +
        'da41597c5157488d7724e03fb8d84a37' +
        '6a43b8f41518a11cc387b669b2ee6586'
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
