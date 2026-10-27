import { fe25519 } from '../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Add } from '../../../src/curve25519/fe25519/fe25519-add.js';
import { fe25519Reduce } from '../../../src/curve25519/fe25519/fe25519-reduce.js';
import { ED25519_D, ED25519_2D, P} from '../../../src/curve25519/const.js';

let allPassed = true;

{
    const d = fe25519(); d.value = ED25519_D;
    const expect = fe25519(); expect.value = ED25519_D;
    fe25519Add(expect, d, d);
    fe25519Reduce(expect);
    if (ED25519_2D !== expect.value) {
        console.assert(false, `2D constant mismatch: got ${expect.value}, expected ${ED25519_2D}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
