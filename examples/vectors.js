// Public test fixtures. Never use these known private keys for real data.
// RFC 8032 §7.1, TEST 2: https://www.rfc-editor.org/rfc/rfc8032.html#section-7.1
export const ed25519Vector = {
  seed: '4ccd089b28ff96da9db6c346ec114e0f5b8a319f35aba624da8cf6ed4fb8a6fb',
  publicKey: '3d4017c3e843895a92b70aa74d1b7ebc9c982ccf2ec4968cc0cd55f12af4660c',
  message: '72',
  signature: '92a009a9f0d4cab8720e820b5f642540a2b27b5416503f8fb3762223ebdb69da' +
    '085ac1e43e15996e458f3613d0f11d8c387b2eaeb4302aeeb00d291612bb0c00',
};

// RFC 7748 §6.1: https://www.rfc-editor.org/rfc/rfc7748.html#section-6.1
export const x25519Vector = {
  alicePrivate: '77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a',
  alicePublic: '8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a',
  bobPrivate: '5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb',
  bobPublic: 'de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f',
  shared: '4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742',
};

// SHA-512 of UTF-8 "abc"; checked independently with Node and Python hashlib.
export const sha512Expected =
  'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a219' +
  '2992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f';

// RFC 5869 A.1 INPUTS, adapted to SHA-512 (the RFC's output uses SHA-256).
// https://www.rfc-editor.org/rfc/rfc5869.html#appendix-A.1
// These SHA-512 expectations were computed with Node crypto and Python hmac,
// independently of cryptos-js. See the PLAN's checks/verify-fixtures.mjs and .py.
export const hkdfVector = {
  ikm: '0b'.repeat(22),
  salt: '000102030405060708090a0b0c',
  info: 'f0f1f2f3f4f5f6f7f8f9',
  length: 42,
  prk: '665799823737ded04a88e47e54a5890bb2c3d247c7a4254a8e61350723590a26' +
    'c36238127d8661b88cf80ef802d57e2f7cebcf1e00e083848be19929c61b4237',
  output: '832390086cda71fb47625bb5ceb168e4c8e26a1a16ed34d9fc7fe92c1481579338da362cb8d9f925d7cb',
};

// RFC 8439 §2.8.2: https://www.rfc-editor.org/rfc/rfc8439.html#section-2.8.2
export const chachaVector = {
  key: '808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f',
  nonce: '070000004041424344454647',
  aad: '50515253c0c1c2c3c4c5c6c7',
  plaintext: '4c616469657320616e642047656e746c656d656e206f662074686520636c617373206f66' +
    '202739393a204966204920636f756c64206f6666657220796f75206f6e6c79206f6e65207469702066' +
    '6f7220746865206675747572652c2073756e73637265656e20776f756c642062652069742e',
  ciphertext: 'd31a8d34648e60db7b86afbc53ef7ec2a4aded51296e08fea9e2b5a736ee62d6' +
    '3dbea45e8ca9671282fafb69da92728b1a71de0a9e060b2905d6a5b67ecd3b36' +
    '92ddbd7f2d778b8c9803aee328091b58fab324e4fad675945585808b4831d7bc' +
    '3ff4def08e4b7a9de576d26586cec64b6116',
  tag: '1ae10b594f09e26a7e902ecbd0600691',
};
