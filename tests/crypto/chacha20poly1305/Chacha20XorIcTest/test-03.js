import { chacha20XorIc } from '../../../../src/crypto/chacha20poly1305/chacha20-xor-ic.js';

function hexToBytes(hex) {
    return Uint8Array.from(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
}

function runTest() {
    let allPassed = true;

    const key = hexToBytes(
        '00000000000000000000000000000000' +
        '00000000000000000000000000000001'
    );

    const nonce = hexToBytes(
        '000000000000000000000002'
    );

    const ic = 1;

    const plaintext = hexToBytes(
        '416e79207375626d697373696f6e2074' +
        '6f20746865204945544620696e74656e' +
        '6465642062792074686520436f6e7472' +
        '696275746f7220666f72207075626c69' +
        '636174696f6e20617320616c6c206f72' +
        '2070617274206f6620616e2049455446' +
        '20496e7465726e65742d447261667420' +
        '6f722052464320616e6420616e792073' +
        '746174656d656e74206d616465207769' +
        '7468696e2074686520636f6e74657874' +
        '206f6620616e20494554462061637469' +
        '7669747920697320636f6e7369646572' +
        '656420616e20224945544620436f6e74' +
        '7269627574696f6e222e205375636820' +
        '73746174656d656e747320696e636c75' +
        '6465206f72616c2073746174656d656e' +
        '747320696e2049455446207365737369' +
        '6f6e732c2061732077656c6c20617320' +
        '7772697474656e20616e6420656c6563' +
        '74726f6e696320636f6d6d756e696361' +
        '74696f6e73206d61646520617420616e' +
        '792074696d65206f7220706c6163652c' +
        '20776869636820617265206164647265' +
        '7373656420746f'
    );

    const expected = hexToBytes(
        'a3fbf07df3fa2fde4f376ca23e827370' +
        '41605d9f4f4f57bd8cff2c1d4b7955ec' +
        '2a97948bd3722915c8f3d337f7d37005' +
        '0e9e96d647b7c39f56e031ca5eb6250d' +
        '4042e02785ececfa4b4bb5e8ead0440e' +
        '20b6e8db09d881a7c6132f420e527950' +
        '42bdfa7773d8a9051447b3291ce1411c' +
        '680465552aa6c405b7764d5e87bea85a' +
        'd00f8449ed8f72d0d662ab052691ca66' +
        '424bc86d2df80ea41f43abf937d3259d' +
        'c4b2d0dfb48a6c9139ddd7f76966e928' +
        'e635553ba76c5c879d7b35d49eb2e62b' +
        '0871cdac638939e25e8a1e0ef9d5280f' +
        'a8ca328b351c3c765989cbcf3daa8b6c' +
        'cc3aaf9f3979c92b3720fc88dc95ed84' +
        'a1be059c6499b9fda236e7e818b04b0b' +
        'c39c1e876b193bfe5569753f88128cc0' +
        '8aaa9b63d1a16f80ef2554d7189c411f' +
        '5869ca52c5b83fa36ff216b9c1d30062' +
        'bebcfd2dc5bce0911934fda79a86f6e6' +
        '98ced759c3ff9b6477338f3da4f9cd85' +
        '14ea9982ccafb341b2384dd902f3d1ab' +
        '7ac61dd29c6f21ba5b862f3730e37cfd' +
        'c4fd806c22f221'
    );

    const actual = new Uint8Array(plaintext.length);

    chacha20XorIc(actual, plaintext, ic, nonce, key);

    const passed = expected.every((b, i) => b === actual[i]);

    if (!passed) {
        console.error('chacha20XorIc Test Vector #2 failed.');
        console.error('Expected:', Array.from(expected).map(b => b.toString(16).padStart(2, '0')).join(' '));
        console.error('Actual:  ', Array.from(actual).map(b => b.toString(16).padStart(2, '0')).join(' '));
        allPassed = false;
    }

    if (allPassed) {
        console.log('tests_passed.');
    }
}

runTest();
