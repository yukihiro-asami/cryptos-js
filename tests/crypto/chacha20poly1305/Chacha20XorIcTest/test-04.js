import { chacha20XorIc } from '../../../../src/crypto/chacha20poly1305/chacha20-xor-ic.js';

function hexToBytes(hex) {
    return Uint8Array.from(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
}

function runTest() {
    let allPassed = true;

    const key = hexToBytes(
        '1c9240a5eb55d38af333888604f6b5f0' +
        '473917c1402b80099dca5cbc207075c0'
    );

    const nonce = hexToBytes('000000000000000000000002');

    const ic = 42;

    const plaintext = hexToBytes(
        '2754776173206272696c6c69672c2061' +
        '6e642074686520736c6974687920746f' +
        '7665730a446964206779726520616e64' +
        '2067696d626c6520696e207468652077' +
        '6162653a0a416c6c206d696d73792077' +
        '6572652074686520626f726f676f7665' +
        '732c0a416e6420746865206d6f6d6520' +
        '7261746873206f757467726162652e'
    );

    const expected = hexToBytes(
        '62e6347f95ed87a45ffae7426f27a1df' +
        '5fb69110044c0d73118effa95b01e5cf' +
        '166d3df2d721caf9b21e5fb14c616871' +
        'fd84c54f9d65b283196c7fe4f60553eb' +
        'f39c6402c42234e32a356b3e764312a6' +
        '1a5532055716ead6962568f87d3f3f77' +
        '04c6a8d1bcd1bf4d50d6154b6da731b1' +
        '87b58dfd728afa36757a797ac188d1'
    );

    const actual = new Uint8Array(plaintext.length);

    chacha20XorIc(actual, plaintext, ic, nonce, key);

    const passed = expected.every((b, i) => b === actual[i]);

    if (!passed) {
        console.error('chacha20XorIc (RFC8439 Test Vector #3) failed.');
        console.error('Expected:', Array.from(expected).map(b => b.toString(16).padStart(2, '0')).join(' '));
        console.error('Actual:  ', Array.from(actual).map(b => b.toString(16).padStart(2, '0')).join(' '));
        allPassed = false;
    }

    if (allPassed) {
        console.log('tests_passed.');
    }
}

runTest();
