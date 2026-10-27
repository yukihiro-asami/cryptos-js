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

// === スカラー入力（固定）===
const a = Uint8Array.from([...Array(32)].map((_, i) => (i < 2 ? 1 : 0))); // small & deterministic
const b = Uint8Array.from([...Array(32)].map((_, i) => (i < 2 ? 2 : 0)));

// === A = 15 * B を構築 ===
const A_precomp = BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[7]; // 15 * B
const A = ge25519P3();
ge25519P3Zero(A);
const t = ge25519P1p1();
ge25519AddPrecomp(t, A, A_precomp);
ge25519P1p1ToP3(A, t); // now A = 15 * B

// === 実行 ===
const out = ge25519P2();
doubleScalarmultVartime(out, a, A, b);

if (!isValidFe25519Struct(out)) {
    console.error('FAILED: Output p2 is invalid');
    console.log('out.X.value', out.X.value);
    console.log('out.Y.value', out.Y.value);
    console.log('out.Z.value', out.Z.value);
    process.exit(1);
}

console.log('tests_passed.');
