import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';
import { ge25519HasSmallOrder } from '../../../../src/curve25519/ge25519/ge25519-has-small-order.js';
import { SQRT_MINUS_1, P } from '../../../../src/curve25519/const.js';

let allPassed = true;

function makeAffineP3(x, y) {
    const p = ge25519P3();
    p.X.value = x;
    p.Y.value = y;
    p.Z.value = 1n;
    p.T.value = (x * y) % P;
    return p;
}

// 1. 恒等点
const identity = ge25519P3();
ge25519P3Zero(identity);
if (ge25519HasSmallOrder(identity) !== 1) {
    console.assert(false, 'identity point should return 1');
    allPassed = false;
}

// 2. (√-1, 0)
const p1 = makeAffineP3(SQRT_MINUS_1, 0n);
if (ge25519HasSmallOrder(p1) !== 1) {
    console.assert(false, '(sqrt(-1), 0) should return 1');
    allPassed = false;
}

// 3. (-√-1, 0)
const p2 = makeAffineP3((P - SQRT_MINUS_1) % P, 0n);
if (ge25519HasSmallOrder(p2) !== 1) {
    console.assert(false, '(-sqrt(-1), 0) should return 1');
    allPassed = false;
}

// 4. (0, -1)
const p3 = makeAffineP3(0n, (P - 1n));
if (ge25519HasSmallOrder(p3) !== 1) {
    console.assert(false, '(0, -1) should return 1');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
