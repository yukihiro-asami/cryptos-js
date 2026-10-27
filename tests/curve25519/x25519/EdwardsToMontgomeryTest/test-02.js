import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { edwardsToMontgomery } from '../../../../src/curve25519/x25519/edwards-to-montgomery.js';
function modPow(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp & 1n) result = (result * base) % mod;
        base = (base * base) % mod;
        exp >>= 1n;
    }
    return result;
}

const P = (1n << 255n) - 19n;

let allPassed = true;

const cases = [
    { y: 0n, z: 1n, desc: 'Y=0, Z=1' },
    { y: P - 1n, z: 1n, desc: 'Y=P-1, Z=1' },
    { y: 1n, z: P - 1n, desc: 'Y=1, Z=P-1' },
    { y: P - 1n, z: P - 2n, desc: 'Y=P-1, Z=P-2' },
];

for (const { y, z, desc } of cases) {
    const edwardsY = fe25519();
    const edwardsZ = fe25519();
    const montgomeryX = fe25519();

    edwardsY.value = y;
    edwardsZ.value = z;

    try {
        edwardsToMontgomery(montgomeryX, edwardsY, edwardsZ);
    } catch (e) {
        console.assert(false, `[${desc}] should not throw: ${e.message}`);
        allPassed = false;
        continue;
    }

    const num = (z + y) % P;
    const den = (z - y + P) % P;
    const denInv = modPow(den, P - 2n, P);
    const expected = (num * denInv) % P;
    const normalize = (x) => ((x % P) + P) % P;
    if (normalize(montgomeryX.value) !== expected) {
        console.assert(false, `[${desc}] unexpected result: got ${montgomeryX.value}, expected ${expected}`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log('tests_passed.');
}
