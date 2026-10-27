import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';
import { montgomeryLadder } from '../../../../src/curve25519/x25519/montgomery-ladder.js';

let allPassed = true;

const u = fe25519();
u.value = 9n;
fe25519Reduce(u);

const k = 1n;
let result;

try {
    result = montgomeryLadder(k, u);
} catch (e) {
    console.assert(false, 'montgomeryLadder threw an error with k=1: ' + e.message);
    allPassed = false;
}

if (result !== u.value) {
    console.assert(false, 'montgomeryLadder(k=1, u) should return u.value exactly');
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
