import { ge25519P3Sub } from '../../../../src/curve25519/ge25519/ge25519-p3-sub.js';
import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';

function ge25519P3IsIdentityNormalized(p) {
    const x = { value: p.X.value };
    const y = { value: p.Y.value };
    const z = { value: p.Z.value };
    const t = { value: p.T.value };

    fe25519Reduce(x);
    fe25519Reduce(y);
    fe25519Reduce(z);
    fe25519Reduce(t);

    return (
        x.value === 0n &&
        t.value === 0n &&
        y.value === z.value
    );
}

let allPassed = true;

// 中立元を使う → 曲線上で確実に妥当
const a = ge25519P3();
a.X.value = 0n;
a.Y.value = 1n;
a.Z.value = 1n;
a.T.value = 0n;

const r = ge25519P3();
ge25519P3Sub(r, a, a);

if (!ge25519P3IsIdentityNormalized(r)) {
    console.assert(false, 'a - a should be identity (on valid curve point)');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
