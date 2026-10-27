import { sc25519Reduce } from '../../../../src/curve25519/sc25519/sc25519-reduce.js';
import { L } from '../../../../src/curve25519/const.js';

// モッククラスの定義（sc25519構造体と同様）
function sc25519() {
    return new (class {
        constructor() {
            this.value = 0n;
        }
    })();
}

// テスト開始
const a = sc25519();
const expected = sc25519();

// value = L * 3 + 12345 として、reduce後は 12345 のみが残る
const input = 3n * L + 12345n;
a.value = input;
expected.value = 12345n;

sc25519Reduce(a);

if (a.value !== expected.value) {
    console.error(`test failed: got ${a.value}, expected ${expected.value}`);
    process.exit(1);
} else {
    console.log("tests_passed.");
}
