import { fe25519 } from '../../../../src/curve25519/fe25519/fe25519.js';
import { fe25519FromBytes } from '../../../../src/curve25519/fe25519/fe25519-from-bytes.js';
import { fe25519ToBytes } from '../../../../src/curve25519/fe25519/fe25519-to-bytes.js';
import { fe25519Reduce } from '../../../../src/curve25519/fe25519/fe25519-reduce.js';

// テスト対象: すべてのビットが立っているバイト列
const input = new Uint8Array(32).fill(0xff);

// fe インスタンス生成
const h = fe25519();

// fromBytesで読み込む
fe25519FromBytes(h, input);
console.log("Original value:", h.value.toString(16));

// reduceで正規化
fe25519Reduce(h);
console.log("Reduced value :", h.value.toString(16));

// toBytesで出力
const output = new Uint8Array(32);
fe25519ToBytes(output, h);
console.log("Output bytes  :", Array.from(output).map(b => b.toString(16).padStart(2, '0')).join(' '));
