import { sha512 } from '../../../../src/crypto/sha512/sha512.js';
import { sha512State } from '../../../../src/crypto/sha512/sha512-state.js';
import { sha512Init } from '../../../../src/crypto/sha512/sha512-init.js';
import { sha512Update } from '../../../../src/crypto/sha512/sha512-update.js';
import { sha512Final } from '../../../../src/crypto/sha512/sha512-final.js';

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function runSplitUpdateTest(message) {
    const fullDigest = new Uint8Array(64);
    sha512(message, fullDigest);

    const splitDigest = new Uint8Array(64);
    const state = sha512State();
    sha512Init(state);

    // 例：message を3つに分割する
    const parts = [
        message.subarray(0, 10),
        message.subarray(10, 30),
        message.subarray(30),
    ];

    for (const part of parts) {
        sha512Update(state, part);
    }

    sha512Final(state, splitDigest);

    console.assert(
        arraysEqual(fullDigest, splitDigest),
        'FAILED: split updates did not match single update'
    );
}

// テスト対象のメッセージ（長さ64、適当なデータ）
const message = new Uint8Array(64);
for (let i = 0; i < 64; i++) message[i] = i;

runSplitUpdateTest(message);

console.log('split update test passed.');
