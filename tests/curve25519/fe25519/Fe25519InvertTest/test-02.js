import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Invert } from '../../../../src/curve25519/fe25519/fe25519-invert.js';
import { fe25519Mul } from '../../../../src/curve25519/fe25519/fe25519-mul.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';

const testValues = [
    1n,                              // 最小の正の値
    2n,                              // 小さい値
    123456789n,                      // 中程度の任意値
    (1n << 255n) - 20n,              // P - 1
    (1n << 255n) - 21n,              // P - 2
    (1n << 255n) - 100n,             // P - 100（高位ギリギリ）
    (1n << 254n),                    // ちょうど 2^254（高位1ビット）
    (1n << 200n),                    // 中央付近の2冪
    (1n << 128n),                    // 下半分の中心
    (1n << 64n),                     // 下位中心（小さくはない）
    (1n << 32n),                     // 32bitの境界
    (1n << 8n),                      // 1バイトの境界
    3n, 5n, 7n, 11n, 13n,            // 小さな素数（冪乗最適化と相性悪い）
    2n ** 64n - 59n,                 // プライム近傍の大きな値
    2n ** 64n,                       // ちょうどオーバーフロー境界
];

let allPassed = true;

for (const val of testValues) {
    const z = fe25519(); z.value = val;
    const inv = fe25519();
    const product = fe25519();

    const start = performance.now();

    fe25519Invert(inv, z);
    const end = performance.now();

    fe25519Mul(product, z, inv);
    fe25519Reduce(product);

    const passed = product.value === 1n;
    if (!passed) {
        console.assert(false, `Invert failed for ${val}: got ${product.value}, expected 1n`);
        allPassed = false;
    }
}

if (allPassed) {
    console.log("tests_passed.");
}
