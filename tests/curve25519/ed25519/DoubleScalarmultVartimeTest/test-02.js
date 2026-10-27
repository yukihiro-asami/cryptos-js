import { doubleScalarmultVartime } from '../../../../src/curve25519/ed25519/double-scalarmult-vartime.js';
import { ge25519P2 } from '../../../../src/curve25519/ge25519/ge25519-p2.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { ge25519AddPrecomp } from '../../../../src/curve25519/ge25519/ge25519-add-precomp.js';
import { ge25519P1p1ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';
import { BASE_POINT_PRE_COMPUTED_TABLE_RADIX2 } from '../../../../src/curve25519/const.js';

function isValidFe25519Struct(obj) {
    return ['X', 'Y', 'Z'].every(k =>
        obj[k] &&
        typeof obj[k].value === 'bigint'
    );
}

// === 両方ゼロのケース ===
const zeroA = new Uint8Array(32); // a = 0
const zeroB = new Uint8Array(32); // b = 0
const dummyA = ge25519P3(); // Aは任意でよい（使われない）
ge25519P3Zero(dummyA);

const outZero = ge25519P2();
doubleScalarmultVartime(outZero, zeroA, dummyA, zeroB);

// 簡易的なゼロ点確認
const isZeroP2 = (p) =>
    p.X.value === 0n &&
    p.Y.value === 1n &&
    p.Z.value === 1n;

if (!isValidFe25519Struct(outZero) || !isZeroP2(outZero)) {
    console.error('FAILED: Zero-scalar case did not produce identity element');
    console.log('out.X.value', outZero.X.value);
    console.log('out.Y.value', outZero.Y.value);
    console.log('out.Z.value', outZero.Z.value);
    process.exit(1);
}

console.log('tests_passed.');

