import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3Neg } from '../../../../src/curve25519/ge25519/ge25519-p3-neg.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';

let allPassed = true;

const p = ge25519P3();
p.X.value = 5n;
p.Y.value = 7n;
p.Z.value = 11n;
p.T.value = 13n;

const r = ge25519P3();
ge25519P3Neg(r, p);

// 明示的にreduceした参照値
const expectedX = { value: -5n };
fe25519Reduce(expectedX);

const expectedT = { value: -13n };
fe25519Reduce(expectedT);

// X, T は反転され reduce 済であること
if (r.X.value !== expectedX.value) {
    console.assert(false, `X should be -5 mod P`);
    allPassed = false;
}

if (r.T.value !== expectedT.value) {
    console.assert(false, `T should be -13 mod P`);
    allPassed = false;
}

// Y, Z はコピーされていること
if (r.Y.value !== 7n) {
    console.assert(false, `Y should be copied`);
    allPassed = false;
}

if (r.Z.value !== 11n) {
    console.assert(false, `Z should be copied`);
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
