import { fe25519 } from '../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Invert } from '../../../src/curve25519/fe25519/fe25519-invert.js';
import { fe25519Neg } from '../../../src/curve25519/fe25519/fe25519-neg.js';
import { fe25519Reduce } from '../../../src/curve25519/fe25519/fe25519-reduce.js';
import { ED25519_D, P} from '../../../src/curve25519/const.js';

let allPassed = true;

// D = (-121665 / 121666) mod P の一致を検証
{
    const minus121665 = fe25519(); minus121665.value = 121665n;
    const negNumerator = fe25519(); // -121665 mod P
    const denom = fe25519(); denom.value = 121666n;
    const denomInv = fe25519();
    const result = fe25519();

    // negNumerator = -121665 mod P
    fe25519Neg(negNumerator, minus121665);

    // denomInv = 1 / 121666 mod P
    fe25519Invert(denomInv, denom);

    // result = (-121665 * denomInv) mod P
    result.value = (negNumerator.value * denomInv.value) % P;
    fe25519Reduce(result);

    if (result.value !== ED25519_D) {
        console.assert(false, `D constant mismatch: got ${ED25519_D}, expected ${result.value}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
