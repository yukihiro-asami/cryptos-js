import { verifyDetached } from '../../../../src/curve25519/ed25519/verify-detached.js';

function assert(cond, label) {
    if (!cond) {
        console.error(`FAILED: ${label}`);
        process.exit(1);
    }
}

// === テストベクトル（-----TEST 1024） ===
// 公開鍵
const pk = Uint8Array.from([
    0x27, 0x81, 0x17, 0xfc, 0x14, 0x4c, 0x72, 0x34,
    0x0f, 0x67, 0xd0, 0xf2, 0x31, 0x6e, 0x83, 0x86,
    0xce, 0xff, 0xbf, 0x2b, 0x24, 0x28, 0xc9, 0xc5,
    0x1f, 0xef, 0x7c, 0x59, 0x7f, 0x1d, 0x42, 0x6e
]);

// メッセージ（1023バイト）
const msgHex = (
    '08b8b2b733424243760fe426a4b54908' +
    '632110a66c2f6591eabd3345e3e4eb98' +
    'fa6e264bf09efe12ee50f8f54e9f77b1' +
    'e355f6c50544e23fb1433ddf73be84d8' +
    '79de7c0046dc4996d9e773f4bc9efe57' +
    '38829adb26c81b37c93a1b270b20329d' +
    '658675fc6ea534e0810a4432826bf58c' +
    '941efb65d57a338bbd2e26640f89ffbc' +
    '1a858efcb8550ee3a5e1998bd177e93a' +
    '7363c344fe6b199ee5d02e82d522c4fe' +
    'ba15452f80288a821a579116ec6dad2b' +
    '3b310da903401aa62100ab5d1a36553e' +
    '06203b33890cc9b832f79ef80560ccb9' +
    'a39ce767967ed628c6ad573cb116dbef' +
    'efd75499da96bd68a8a97b928a8bbc10' +
    '3b6621fcde2beca1231d206be6cd9ec7' +
    'aff6f6c94fcd7204ed3455c68c83f4a4' +
    '1da4af2b74ef5c53f1d8ac70bdcb7ed1' +
    '85ce81bd84359d44254d95629e9855a9' +
    '4a7c1958d1f8ada5d0532ed8a5aa3fb2' +
    'd17ba70eb6248e594e1a2297acbbb39d' +
    '502f1a8c6eb6f1ce22b3de1a1f40cc24' +
    '554119a831a9aad6079cad88425de6bd' +
    'e1a9187ebb6092cf67bf2b13fd65f270' +
    '88d78b7e883c8759d2c4f5c65adb7553' +
    '878ad575f9fad878e80a0c9ba63bcbcc' +
    '2732e69485bbc9c90bfbd62481d9089b' +
    'eccf80cfe2df16a2cf65bd92dd597b07' +
    '07e0917af48bbb75fed413d238f5555a' +
    '7a569d80c3414a8d0859dc65a46128ba' +
    'b27af87a71314f318c782b23ebfe808b' +
    '82b0ce26401d2e22f04d83d1255dc51a' +
    'ddd3b75a2b1ae0784504df543af8969b' +
    'e3ea7082ff7fc9888c144da2af58429e' +
    'c96031dbcad3dad9af0dcbaaaf268cb8' +
    'fcffead94f3c7ca495e056a9b47acdb7' +
    '51fb73e666c6c655ade8297297d07ad1' +
    'ba5e43f1bca32301651339e22904cc8c' +
    '42f58c30c04aafdb038dda0847dd988d' +
    'cda6f3bfd15c4b4c4525004aa06eeff8' +
    'ca61783aacec57fb3d1f92b0fe2fd1a8' +
    '5f6724517b65e614ad6808d6f6ee34df' +
    'f7310fdc82aebfd904b01e1dc54b2927' +
    '094b2db68d6f903b68401adebf5a7e08' +
    'd78ff4ef5d63653a65040cf9bfd4aca7' +
    '984a74d37145986780fc0b16ac451649' +
    'de6188a7dbdf191f64b5fc5e2ab47b57' +
    'f7f7276cd419c17a3ca8e1b939ae49e4' +
    '88acba6b965610b5480109c8b17b80e1' +
    'b7b750dfc7598d5d5011fd2dcc5600a3' +
    '2ef5b52a1ecc820e308aa342721aac09' +
    '43bf6686b64b2579376504ccc493d97e' +
    '6aed3fb0f9cd71a43dd497f01f17c0e2' +
    'cb3797aa2a2f256656168e6c496afc5f' +
    'b93246f6b1116398a346f1a641f3b041' +
    'e989f7914f90cc2c7fff357876e506b5' +
    '0d334ba77c225bc307ba537152f3f161' +
    '0e4eafe595f6d9d90d11faa933a15ef1' +
    '369546868a7f3a45a96768d40fd9d034' +
    '12c091c6315cf4fde7cb68606937380d' +
    'b2eaaa707b4c4185c32eddcdd306705e' +
    '4dc1ffc872eeee475a64dfac86aba41c' +
    '0618983f8741c5ef68d3a101e8a3b8ca' +
    'c60c905c15fc910840b94c00a0b9d0'
);
const msg = Uint8Array.from(msgHex.match(/.{2}/g).map(b => parseInt(b, 16)));

// 署名（64バイト）
const sig = Uint8Array.from([
    0x0a, 0xab, 0x4c, 0x90, 0x05, 0x01, 0xb3, 0xe2,
    0x4d, 0x7c, 0xdf, 0x46, 0x63, 0x32, 0x6a, 0x3a,
    0x87, 0xdf, 0x5e, 0x48, 0x43, 0xb2, 0xcb, 0xdb,
    0x67, 0xcb, 0xf6, 0xe4, 0x60, 0xfe, 0xc3, 0x50,
    0xaa, 0x53, 0x71, 0xb1, 0x50, 0x8f, 0x9f, 0x45,
    0x28, 0xec, 0xea, 0x23, 0xc4, 0x36, 0xd9, 0x4b,
    0x5e, 0x8f, 0xcd, 0x4f, 0x68, 0x1e, 0x30, 0xa6,
    0xac, 0x00, 0xa9, 0x70, 0x4a, 0x18, 0x8a, 0x03
]);

const result = verifyDetached(sig, msg, pk);
assert(result === 0, 'Ed25519 signature verification failed (TEST 1024)');

console.log('tests_passed.');
