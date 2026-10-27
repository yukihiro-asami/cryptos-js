import { calcRND } from '../../../../src/crypto/sha512/calc-rnd.js';
import { calcSu0 } from '../../../../src/crypto/sha512/calc-su0.js';
import { calcSu1 } from '../../../../src/crypto/sha512/calc-su1.js';
import { calcCh } from '../../../../src/crypto/sha512/calc-ch.js';
import { calcMaj } from '../../../../src/crypto/sha512/calc-maj.js';
import { word64Add } from '../../../../src/crypto/sha512/word64-add.js';

let allPassed = true;

const MASK64 = (1n << 64n) - 1n;

// ✅ ベースケース（すべて1n）
{
    const a = { value: 1n };
    const b = { value: 1n };
    const c = { value: 1n };
    const d = { value: 1n };
    const e = { value: 1n };
    const f = { value: 1n };
    const g = { value: 1n };
    const h = { value: 1n };
    const k = { value: 1n };

    const su1 = calcSu1(e.value);
    const ch = calcCh(e.value, f.value, g.value);
    const t1 = word64Add(word64Add(word64Add(h.value, su1), ch), k.value);

    const su0 = calcSu0(a.value);
    const maj = calcMaj(a.value, b.value, c.value);
    const t2 = word64Add(su0, maj);

    const expectedD = word64Add(d.value, t1);
    const expectedH = word64Add(t1, t2);

    calcRND(a, b, c, d, e, f, g, h, k);

    if (d.value !== expectedD) {
        console.assert(false, `base case: d.value failed: got ${d.value.toString(16)}, expected ${expectedD.toString(16)}`);
        allPassed = false;
    }
    if (h.value !== expectedH) {
        console.assert(false, `base case: h.value failed: got ${h.value.toString(16)}, expected ${expectedH.toString(16)}`);
        allPassed = false;
    }
}

// ✅ エッジケース群
const testVectors = [
    {
        name: "All ones",
        args: {
            a: 0xffffffffffffffffn,
            b: 0xffffffffffffffffn,
            c: 0xffffffffffffffffn,
            d: 0xffffffffffffffffn,
            e: 0xffffffffffffffffn,
            f: 0xffffffffffffffffn,
            g: 0xffffffffffffffffn,
            h: 0xffffffffffffffffn,
            k: 1n,
        }
    },
    {
        name: "All zeros",
        args: {
            a: 0n, b: 0n, c: 0n, d: 0n, e: 0n, f: 0n, g: 0n, h: 0n, k: 1n
        }
    },
    {
        name: "Alternating bits (0xAAAAAAAA...)",
        args: {
            a: 0xaaaaaaaaaaaaaaaan,
            b: 0xaaaaaaaaaaaaaaaan,
            c: 0xaaaaaaaaaaaaaaaan,
            d: 0xaaaaaaaaaaaaaaaan,
            e: 0xaaaaaaaaaaaaaaaan,
            f: 0xaaaaaaaaaaaaaaaan,
            g: 0xaaaaaaaaaaaaaaaan,
            h: 0xaaaaaaaaaaaaaaaan,
            k: 1n,
        }
    },
    {
        name: "MSB only",
        args: {
            a: 0x8000000000000000n,
            b: 0x8000000000000000n,
            c: 0x8000000000000000n,
            d: 0x8000000000000000n,
            e: 0x8000000000000000n,
            f: 0x8000000000000000n,
            g: 0x8000000000000000n,
            h: 0x8000000000000000n,
            k: 1n,
        }
    },
    {
        name: "Carry-over: d.value + t1 causes overflow",
        args: {
            a: 1n, b: 1n, c: 1n,
            d: 0xffffffffffffffffn,
            e: 1n, f: 1n, g: 1n,
            h: 1n,
            k: 1n,
        }
    }
];

for (const { name, args } of testVectors) {
    const a = { value: args.a };
    const b = { value: args.b };
    const c = { value: args.c };
    const d = { value: args.d };
    const e = { value: args.e };
    const f = { value: args.f };
    const g = { value: args.g };
    const h = { value: args.h };
    const k = { value: args.k };

    const su1 = calcSu1(e.value);
    const ch = calcCh(e.value, f.value, g.value);
    const t1 = word64Add(word64Add(word64Add(h.value, su1), ch), k.value);

    const su0 = calcSu0(a.value);
    const maj = calcMaj(a.value, b.value, c.value);
    const t2 = word64Add(su0, maj);

    const expectedD = word64Add(d.value, t1);
    const expectedH = word64Add(t1, t2);

    calcRND(a, b, c, d, e, f, g, h, k);

    if (d.value !== expectedD) {
        console.assert(false, `${name}: d.value failed: got ${d.value.toString(16)}, expected ${expectedD.toString(16)}`);
        allPassed = false;
    }
    if (h.value !== expectedH) {
        console.assert(false, `${name}: h.value failed: got ${h.value.toString(16)}, expected ${expectedH.toString(16)}`);
        allPassed = false;
    }
}

// ✅ 完了表示
if (allPassed) {
    console.log("tests_passed.");
}
