import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
const x = fe25519();
console.assert(typeof x.value === "bigint", "value should be of type bigint");
console.assert(x.value === 0n, "value should be 0n");
console.log("tests_passed.");