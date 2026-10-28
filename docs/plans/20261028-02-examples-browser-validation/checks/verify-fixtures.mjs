// Run from any directory with Node.js. Uses Node crypto, not cryptos-js arithmetic.
import assert from 'node:assert/strict';
import { createHash, createHmac, hkdfSync, createPrivateKey, createPublicKey,
  sign, diffieHellman, createCipheriv } from 'node:crypto';
import { ed25519Vector as ed, x25519Vector as x, sha512Expected,
  hkdfVector as h, chachaVector as c } from '../../../../examples/vectors.js';

const bytes = hex => Buffer.from(hex, 'hex');
const nativeKey = (hex, oid) => createPrivateKey({format:'der', type:'pkcs8',
  key:Buffer.concat([bytes('302e020100300506032b65' + oid + '04220420'), bytes(hex)])});
const pub = key => createPublicKey(key).export({format:'der', type:'spki'}).subarray(-32).toString('hex');
const edKey = nativeKey(ed.seed, '70');
assert.equal(pub(edKey), ed.publicKey);
assert.equal(sign(null, bytes(ed.message), edKey).toString('hex'), ed.signature);
const alice = nativeKey(x.alicePrivate, '6e'), bob = nativeKey(x.bobPrivate, '6e');
assert.equal(pub(alice), x.alicePublic);
assert.equal(pub(bob), x.bobPublic);
assert.equal(diffieHellman({privateKey:alice, publicKey:createPublicKey(bob)}).toString('hex'), x.shared);
assert.equal(createHash('sha512').update('abc').digest('hex'), sha512Expected);
assert.equal(createHmac('sha512', bytes(h.salt)).update(bytes(h.ikm)).digest('hex'), h.prk);
assert.equal(Buffer.from(hkdfSync('sha512',bytes(h.ikm),bytes(h.salt),bytes(h.info),h.length)).toString('hex'),h.output);
const cipher = createCipheriv('chacha20-poly1305', bytes(c.key), bytes(c.nonce),{authTagLength:16});
cipher.setAAD(bytes(c.aad),{plaintextLength:bytes(c.plaintext).length});
assert.equal(Buffer.concat([cipher.update(bytes(c.plaintext)),cipher.final()]).toString('hex'),c.ciphertext);
assert.equal(cipher.getAuthTag().toString('hex'),c.tag);
console.log(JSON.stringify({node:process.version, fixtureGroups:5, assertions:10,
  sha512:{message:'abc',digest:sha512Expected}, hkdf:h},null,2));
