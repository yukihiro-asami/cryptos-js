import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3ToBytes } from '../../../../src/curve25519/ge25519/ge25519-p3-to-bytes.js';

let allPassed = true;

// P3要素の生成と座標の代入
const p = ge25519P3();
p.X.value = 9n;
p.Y.value = 1n;
p.Z.value = 1n;
p.T.value = (p.X.value * p.Y.value) % (2n ** 255n - 19n); // X * Y mod p

const output = new Uint8Array(32);
ge25519P3ToBytes(output, p);

// 出力がUint8Array(32)か
if (!(output instanceof Uint8Array)) {
    console.assert(false, 'Output should be a Uint8Array');
    allPassed = false;
} else if (output.length !== 32) {
    console.assert(false, 'Output Uint8Array length should be 32');
    allPassed = false;
}

// 出力からy座標の最下位ビットが立っていないことを確認（X=9 → 正）
const signBit = (output[31] >> 7) & 1;
if (signBit !== 1) {
    console.assert(false, 'Sign bit should be 1 for X = 9');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
