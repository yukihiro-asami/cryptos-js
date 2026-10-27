import { createHash } from 'crypto';
import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Invert } from '../../../../src/curve25519/fe25519/fe25519-invert.js';
import { fe25519Mul } from '../../../../src/curve25519/fe25519/fe25519-mul.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';

function generateValidZ(seed, index) {
    const P = (1n << 255n) - 19n;
    const input = Buffer.from(`${seed}-${index}`);
    const hash = createHash('sha256').update(input).digest(); // 256-bit
    let val = BigInt('0x' + hash.toString('hex'));

    // 確実に 1 <= z < P に収める
    val = val % (P - 1n) + 1n;
    return val;
}

const numTests = 1000000;
const seed = "invert-test-seed";
let allPassed = true;
const started = performance.now();

for (let i = 0; i < numTests; i++) {
    const val = generateValidZ(seed, i);

    const z = fe25519(); z.value = val;
    const inv = fe25519();
    const product = fe25519();

    fe25519Invert(inv, z);
    fe25519Mul(product, z, inv);
    fe25519Reduce(product);

    const passed = product.value === 1n;
    if (!passed) {
        console.assert(false, `Invert failed for z=${val}, got ${product.value}, expected 1n`);
        allPassed = false;
    }
    if ((i + 1) % 100000 === 0) {
        console.log(`invert-progress ${i + 1}/${numTests}`);
    }
}

if (allPassed) {
    console.log(JSON.stringify({ test: "invert-sweep", completed: numTests, passed: numTests, durationMs: performance.now() - started }));
    console.log("✅ All valid-range invert tests passed.");
}
