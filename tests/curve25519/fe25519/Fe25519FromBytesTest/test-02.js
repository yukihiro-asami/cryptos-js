import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519FromBytes } from '../../../../src/curve25519/fe25519/fe25519-from-bytes.js';
import { MASK_255 } from '../../../../src/curve25519/const.js';

// テスト対象のデータ：下位255ビット = 1n
const yEncoded = new Uint8Array(32);
yEncoded[0] = 1; // LSB = 1 → 全体で y = 1n
yEncoded[31] = 0x80; // 最上位ビット（bit 255）を 1 にセット → xの符号だけ

// fe25519 へ変換
const fe = fe25519();
fe25519FromBytes(fe, yEncoded);

// 確認: value は 1n のまま（bit 255 は無視されている）
console.assert(typeof fe.value === "bigint", "value should be of type bigint");
console.assert(fe.value === 1n, `value should be 1n, got ${fe.value}`);

// さらに安全のため MASK_255 との論理積を確認
console.assert((fe.value & ~MASK_255) === 0n, "value must not contain bit 255");

console.log("test_passed.");
