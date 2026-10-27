import { hkdfSha512Expand } from '../../../../src/crypto/sha512/hkdf-sha512-expand.js';

function testHkdfSha512ExpandBasic() {
    const prk = new Uint8Array(64);
    for (let i = 0; i < prk.length; i++) prk[i] = i;

    const ctx = new Uint8Array(10);
    for (let i = 0; i < ctx.length; i++) ctx[i] = 0xff - i;

    const outLen = 96;
    const out = new Uint8Array(outLen);

    hkdfSha512Expand(out, ctx, prk);

    const nonzero = out.some(b => b !== 0);
    console.assert(nonzero, 'FAILED: hkdfSha512Expand result is all zero');
    console.assert(out.length === outLen, 'FAILED: hkdfSha512Expand output length mismatch');
    return nonzero && out.length === outLen;
}

let allPassed = true;

allPassed &= testHkdfSha512ExpandBasic();

if (allPassed) {
    console.log('tests_passed.');
}
