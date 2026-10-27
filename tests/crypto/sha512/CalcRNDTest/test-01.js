import { calcRND } from '../../../../src/crypto/sha512/calc-rnd.js';
import { calcSu0 } from '../../../../src/crypto/sha512/calc-su0.js';
import { calcSu1 } from '../../../../src/crypto/sha512/calc-su1.js';
import { calcCh } from '../../../../src/crypto/sha512/calc-ch.js';
import { calcMaj } from '../../../../src/crypto/sha512/calc-maj.js';
import { word64Add } from '../../../../src/crypto/sha512/word64-add.js';

let allPassed = true;

const MASK64 = (1n << 64n) - 1n;

// 初期化
const a = { value: 1n };
const b = { value: 1n };
const c = { value: 1n };
const d = { value: 1n };
const e = { value: 1n };
const f = { value: 1n };
const g = { value: 1n };
const h = { value: 1n };
const k = { value: 1n };

// 手動で期待値計算
const su1 = calcSu1(e.value);               // → 0x4400000800000n
const ch = calcCh(e.value, f.value, g.value); // → 1n
const t1 = word64Add(word64Add(word64Add(h.value, su1), ch), k.value);

const su0 = calcSu0(a.value);               // → 0x0000001042000000n
const maj = calcMaj(a.value, b.value, c.value); // → 1n
const t2 = word64Add(su0, maj);

const expectedD = word64Add(d.value, t1);
const expectedH = word64Add(t1, t2);

// テスト対象呼び出し
calcRND(a, b, c, d, e, f, g, h, k);

// アサート
if (d.value !== expectedD) {
    console.assert(false, `d.value failed: got ${d.value.toString(16)}, expected ${expectedD.toString(16)}`);
    allPassed = false;
}
if (h.value !== expectedH) {
    console.assert(false, `h.value failed: got ${h.value.toString(16)}, expected ${expectedH.toString(16)}`);
    allPassed = false;
}

if (allPassed) {
    console.log("tests_passed.");
}
