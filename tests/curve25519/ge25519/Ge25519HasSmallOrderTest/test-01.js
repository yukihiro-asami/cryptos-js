import { ge25519P3 } from '../../../../src/curve25519/ge25519/ge25519-p3.js';
import { ge25519P3Zero } from '../../../../src/curve25519/ge25519/ge25519-p3-zero.js';
import { ge25519HasSmallOrder } from '../../../../src/curve25519/ge25519/ge25519-has-small-order.js';

let allPassed = true;

// p = 0 (identity element, small order)
const p = ge25519P3();
ge25519P3Zero(p);
const result = ge25519HasSmallOrder(p);

if (result !== 1) {
    console.assert(false, `ge25519HasSmallOrder should return 1 for identity point, got ${result}`);
    allPassed = false;
}

// Add other known non-small order points if available here
// e.g. base point, random valid point, etc. → expect 0
// このテストでは identity のみ確認（仕様方針により最小限にとどめる）

if (allPassed) {
    console.log('tests_passed.');
}
