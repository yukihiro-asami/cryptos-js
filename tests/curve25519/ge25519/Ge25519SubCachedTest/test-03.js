import { ge25519AddPrecomp } from '../../../../src/curve25519/ge25519/ge25519-add-precomp.js';
import { ge25519SubPrecomp } from '../../../../src/curve25519/ge25519/ge25519-sub-precomp.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P1p1ToP3 } from '../../../../src/curve25519/ge25519/ge25519-p1p1-to-p3.js';
import { ge25519P1p1 } from '../../../../src/curve25519/ge25519/ge25519-p1p1.js';
import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Mul } from '../../../../src/curve25519/fe25519/fe25519-mul.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';
import { BASE_POINT_PRE_COMPUTED_TABLE_RADIX2 } from '../../../../src/curve25519/const.js';

function normalized(fe) {
    const tmp = fe25519();
    tmp.value = fe.value;
    fe25519Reduce(tmp);
    return tmp.value;
}

function p3EqualsProjective(p1, p2) {
    const tmp1 = fe25519(), tmp2 = fe25519();
    fe25519Mul(tmp1, p1.X, p2.Z);
    fe25519Mul(tmp2, p2.X, p1.Z);
    if (normalized(tmp1) !== normalized(tmp2)) return false;

    fe25519Mul(tmp1, p1.Y, p2.Z);
    fe25519Mul(tmp2, p2.Y, p1.Z);
    if (normalized(tmp1) !== normalized(tmp2)) return false;

    return true;
}

// --- テスト本体 ---

const p = ge25519P3();
ge25519P3Zero(p);

const steps = [
    { op: 'add', index: 0 },
    { op: 'add', index: 1 },
    { op: 'add', index: 2 },
    { op: 'sub', index: 2 },
    { op: 'add', index: 3 },
    { op: 'sub', index: 1 },
    { op: 'sub', index: 3 },
    { op: 'sub', index: 0 },
];

for (let i = 0; i < steps.length; i++) {
    const { op, index } = steps[i];
    const q = BASE_POINT_PRE_COMPUTED_TABLE_RADIX2[index];
    const r = ge25519P1p1();
    if (op === 'add') {
        ge25519AddPrecomp(r, p, q);
    } else if (op === 'sub') {
        ge25519SubPrecomp(r, p, q);
    }
    const nextP = ge25519P3();
    ge25519P1p1ToP3(nextP, r);
    p.X.value = nextP.X.value;
    p.Y.value = nextP.Y.value;
    p.Z.value = nextP.Z.value;
    p.T.value = nextP.T.value;
}

// p 最終結果は恒等元と一致するはず
const p0 = ge25519P3();
ge25519P3Zero(p0);

if (p3EqualsProjective(p, p0)) {
    console.log('tests_passed.');
} else {
    console.error('❌ Precomp 多段往復テスト: NG');
    console.log('期待値:', p0);
    console.log('実際値:', p);
}
