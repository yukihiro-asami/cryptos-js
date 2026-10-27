import { hkdfSha512Expand } from '../../../../src/crypto/sha512/hkdf-sha512-expand.js';
import { hkdfSha512Extract } from '../../../../src/crypto/sha512/hkdf-sha512-extract.js';

function toUint8(hex) {
    if (!hex) return new Uint8Array(0);
    if (hex.length % 2 !== 0) throw new Error('Invalid hex string length');
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) {
        out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return out;
}

function hexEquals(buf, hex) {
    const expected = toUint8(hex);
    if (expected.length !== buf.length) return false;
    for (let i = 0; i < expected.length; i++) {
        if (expected[i] !== buf[i]) return false;
    }
    return true;
}

function testHkdfSha512Vector({ name, ikm, salt, info, length, okmHex }) {
    const prk = new Uint8Array(64);
    hkdfSha512Extract(prk, toUint8(salt), toUint8(ikm));

    const out = new Uint8Array(length);
    hkdfSha512Expand(out, toUint8(info), prk);

    const pass = hexEquals(out, okmHex);
    console.assert(pass, `FAILED: ${name}`);
    return pass;
}

const vectors = [
    {
        name: 'RFC5869 A.1',
        ikm: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b',
        salt: '000102030405060708090a0b0c',
        info: 'f0f1f2f3f4f5f6f7f8f9',
        length: 42,
        okmHex: '832390086cda71fb47625bb5ceb168e4c8e26a1a16ed34d9fc7fe92c1481579338da362cb8d9f925d7cb'
    },
    {
        name: 'RFC5869 A.2',
        ikm: '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f' +
            '202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f' +
            '404142434445464748494a4b4c4d4e4f',
        salt: '606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f' +
            '808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f' +
            'a0a1a2a3a4a5a6a7a8a9aaabacadaeaf',
        info: 'b0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecf' +
            'd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeef' +
            'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff',
        length: 82,
        okmHex: 'ce6c97192805b346e6161e821ed165673b84f400a2b514b2fe23d84cd189ddf1' +
            'b695b48cbd1c8388441137b3ce28f16aa64ba33ba466b24df6cfcb021ecff235' +
            'f6a2056ce3af1de44d572097a8505d9e7a93'
    },
    {
        name: 'RFC5869 A.3',
        ikm: '0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b',
        salt: '',
        info: '',
        length: 42,
        okmHex: 'f5fa02b18298a72a8c23898a8703472c6eb179dc204c03425c970e3b164bf90f' +
            'ff22d04836d0e2343bac'
    },
    {
        name: 'RFC5869 A.4',
        ikm: '0b0b0b0b0b0b0b0b0b0b0b',
        salt: '000102030405060708090a0b0c',
        info: 'f0f1f2f3f4f5f6f7f8f9',
        length: 42,
        okmHex: '7413e8997e020610fbf6823f2ce14bff01875db1ca55f68cfcf3954dc8aff535' +
            '59bd5e3028b080f7c068'
    },
    {
        name: 'RFC5869 A.7',
        ikm: '0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c',
        salt: '',
        info: '',
        length: 42,
        okmHex: '1407d46013d98bc6decefcfee55f0f90b0c7f63d68eb1a80eaf07e953cfc0a3a' +
            '5240a155d6e4daa965bb'
    }
];

let allPassed = true;

for (const vec of vectors) {
    allPassed &= testHkdfSha512Vector(vec);
}

if (allPassed) {
    console.log('tests_passed.');
}
