import { hkdfSha512Extract } from '../../../../src/crypto/sha512/hkdf-sha512-extract.js';

function testHkdfSha512ExtractBasic() {
    const salt = new Uint8Array(16);
    const ikm = new Uint8Array(32);
    for (let i = 0; i < salt.length; i++) salt[i] = i + 1;
    for (let i = 0; i < ikm.length; i++) ikm[i] = 0xaa;

    const prk = new Uint8Array(64);
    hkdfSha512Extract(prk, salt, ikm);

    const nonzero = prk.some(b => b !== 0);
    console.assert(nonzero, 'FAILED: hkdfSha512Extract result is all zero');
    return nonzero;
}

let allPassed = true;

allPassed &= testHkdfSha512ExtractBasic();

if (allPassed) {
    console.log('tests_passed.');
}