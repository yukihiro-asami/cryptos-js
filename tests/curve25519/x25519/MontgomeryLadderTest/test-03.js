import { montgomeryLadder } from '../../../../src/curve25519/x25519/montgomery-ladder.js';
import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';

// リトルエンディアン形式での変換関数
function hexToBigIntLE(hex) {
    let n = 0n;
    for (let i = hex.length / 2 - 1; i >= 0; i--) {
        const byteHex = hex.slice(i * 2, i * 2 + 2);
        const byte = BigInt(parseInt(byteHex, 16));
        n = (n << 8n) | byte;
    }
    return n;
}

let allPassed = true;

// 入力スカラーとu座標（リトルエンディアンで処理）
let k = hexToBigIntLE('a546e36bf0527c9d3b16154b82465edd62144c0ac1fc5a18506a2244ba449ac4');
// The low-level ladder receives an already decoded/clamped scalar (RFC 7748 §5).
k &= (1n << 255n) - 1n;
k &= ~7n;
k |= 1n << 254n;
const u = fe25519();
u.value = hexToBigIntLE('e6db6867583030db3594c1a424b15f7c726624ec26b3353b10a903a6d0ab1c4c');
fe25519Reduce(u); // 念のため正規化

// 期待される出力u座標
// RFC 7748 §5.2 gives bytes in little-endian order, not a BigInt literal.
const expectedOutput = hexToBigIntLE('c3da55379de9c6908e94ea4df28d084f32eccf03491c71f754b4075577a28552');

// モントゴメリー乗算実行
let result;
try {
    result = montgomeryLadder(k, u);
} catch (e) {
    console.assert(false, 'scalarmultCurve25519 threw an error: ' + e.message);
    allPassed = false;
}

// 結果チェック：BigIntかどうか
if (typeof result !== 'bigint') {
    console.assert(false, 'Result should be a BigInt');
    allPassed = false;
}

// 結果チェック：期待される出力と一致するか
if (result !== expectedOutput) {
    console.assert(false, `Expected: ${expectedOutput.toString(16)}, got: ${result.toString(16)}`);
    allPassed = false;
}

if (allPassed) {
    console.log('tests_passed.');
}
