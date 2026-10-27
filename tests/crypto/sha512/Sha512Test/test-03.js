import { sha512 } from '../../../../src/crypto/sha512/sha512.js';

function hexToBytes(hex) {
    return Uint8Array.from(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
}

function checkSha512Vector(name, input, expectedHex) {
    const output = new Uint8Array(64);
    sha512(input, output);
    const expected = hexToBytes(expectedHex.replace(/\s+/g, ''));

    let passed = true;
    for (let i = 0; i < 64; i++) {
        if (output[i] !== expected[i]) {
            console.assert(false,
                `FAILED [${name}]: byte ${i} mismatch: got ${output[i].toString(16)}, expected ${expected[i].toString(16)}`);
            passed = false;
        }
    }
    return passed;
}

let allPassed = true;

// === 各ベクトル ===

allPassed &&= checkSha512Vector('#2: 111 zero bytes',
    new Uint8Array(111),
    `77ddd3a542e530fd 047b8977c657ba6c e72f1492e360b2b2 212cd264e75ec038
     82e4ff0525517ab4 207d14c70c2259ba 88d4d335ee0e7e20 543d22102ab1788c`);

allPassed &&= checkSha512Vector('#3: 112 zero bytes',
    new Uint8Array(112),
    `2be2e788c8a8adea a9c89a7f78904cac ea6e39297d75e057 3a73c756234534d6
     627ab4156b48a665 7b29ab8beb733340 40ad39ead81446bb 09c70704ec707952`);

allPassed &&= checkSha512Vector('#4: 113 zero bytes',
    new Uint8Array(113),
    `0e67910bcf0f9ccd e5464c63b9c850a1 2a759227d16b040d 98986d54253f9f34
     322318e56b8feb86 c5fb2270ed87f312 52f7f68493ee7597 43909bd75e4bb544`);

allPassed &&= checkSha512Vector('#5: 122 zero bytes',
    new Uint8Array(122),
    `4f3f095d015be4a7 a7cc0b8c04da4aa0 9e74351e3a97651f 744c23716ebd9b3e
     822e5077a01baa5c c0ed45b9249e88ab 343d4333539df21e d229da6f4a514e0f`);

allPassed &&= checkSha512Vector('#6: 1000 zero bytes',
    new Uint8Array(1000),
    `ca3dff61bb23477a a6087b27508264a6 f9126ee3a004f53c b8db942ed345f2f2
     d229b4b59c859220 a1cf1913f34248e3 803bab650e849a3d 9a709edc09ae4a76`);

allPassed &&= checkSha512Vector('#7: 1000 bytes of 0x41',
    new Uint8Array(1000).fill(0x41),
    `329c52ac62d1fe73 1151f2b895a00475 445ef74f50b979c6 f7bb7cae349328c1
     d4cb4f7261a0ab43 f936a24b000651d4 a824fcdd577f211a ef8f806b16afe8af`);

allPassed &&= checkSha512Vector('#8: 1005 bytes of 0x55',
    new Uint8Array(1005).fill(0x55),
    `59f5e54fe299c6a8 764c6b199e44924a 37f59e2b56c3ebad 939b7289210dc8e4
     c21b9720165b0f4d 4374c90f1bf4fb4a 5ace17a116179801 5052893a48c3d161`);

allPassed &&= checkSha512Vector('#9: 1000000 zero bytes',
    new Uint8Array(1_000_000),
    `ce044bc9fd43269d 5bbc946cbebc3bb7 11341115cc4abdf2 edbc3ff2c57ad4b1
     5deb699bda257fea 5aef9c6e55fcf4cf 9dc25a8c3ce25f2e fe90908379bff7ed`);

if (allPassed) {
    console.log("tests_passed.");
}
