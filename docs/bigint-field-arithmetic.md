# BigIntで表現する有限体演算：折りたたみと正規化

[English](bigint-field-arithmetic.en.md) · [アルゴリズムの解説](algorithms.md) · [README](../README.md)

本実装では、素数 **p = 2^255 − 19** の性質を利用したpseudo-Mersenne reductionを、JavaScriptのBigIntで直接表現している。演算途中は部分還元で値の大きさを抑え、完全な正規化は計算の区切りで行う。二乗では入力にも部分還元を施す。

ここで示すのは、既知の数学的手法を整数の表現形式に合わせて実装する判断である。新しい暗号方式や、二乗前後の折りたたみという独立した新アルゴリズムを提案するものではない。

## 255ビットより上を19倍して戻す

`B = 2^255`と置くと、`p = B − 19`なので、pを法とする計算ではBと19が合同になる。整数を下位部分loと上位部分hiに分けると、

$$
x = lo + hi B \equiv lo + 19hi \pmod p
$$

と置き換えられる。[乗算の実装](../src/curve25519/fe25519/fe25519-mul.js)はこの関係をそのまま書いている。

```js
export function fe25519Mul(h, f, g) {
    const x = f.value * g.value;
    const lo = x & MASK_255;
    const hi = x >> 255n;
    h.value = lo + 19n * hi;
}
```

[MASK_255](../src/curve25519/const.js)は`2^255 − 1`であり、ANDで下位255ビットを取り出す。右シフトで得た上位部分を19倍して加えることで、積をそのまま`% P`に渡す代わりに折りたたむ。例えば`x = 2^255 + 7`なら、結果は`7 + 19 = 26`となる。

2の累乗から小さな整数を引いた素数を利用するこの種の還元は、pseudo-Mersenne reductionと呼ばれる。各種の乗算・二乗・還元をまとめた先行研究として、NathとSarkarの論文がある。[Efficient Arithmetic In (Pseudo-)Mersenne Prime Order Fields, 2018](https://eprint.iacr.org/2018/985)

## 二乗の前にも折りたたむ

[二乗の実装](../src/curve25519/fe25519/fe25519-sq.js)では、入力を一度折りたたんでから二乗し、結果も折りたたむ。

```js
export function fe25519Sq(h, f) {
    const f_lo = f.value & MASK_255;
    const f_hi = f.value >> 255n;
    const f_folded = f_lo + 19n * f_hi;

    const x = f_folded * f_folded;
    const lo = x & MASK_255;
    const hi = x >> 255n;
    h.value = lo + 19n * hi;
}
```

折りたたんだ値と元の値はpを法として合同なので、それぞれを二乗しても合同性が保たれる。入力が大きくなっている場合に、そのまま二乗して中間値を膨らませることを避ける配置である。この配置自体の独立した固有名称は今回確認できていない。

BigIntを使うと、ソースコードでは1個の整数として乗算やシフトを記述できる。固定幅の整数を複数並べるlimb表現では、桁ごとの演算やcarryの伝播も実装側で扱う。両者は同じ有限体演算を実現するが、処理の配置も計算コストも同一ではない。本コードは、任意精度整数を使って中間値の大きさを管理する選択をしている。この折りたたみ単独の速度改善量は未測定である。

## 部分還元と遅延還元

| 用語 | 本コードでの意味 |
|---|---|
| pseudo-Mersenne reduction | `2^255 ≡ 19 (mod p)`を利用して上位部分を折りたたむ演算 |
| 部分還元（partial reduction） | 完全に`0 ≤ x < p`へ収めることを要求せず、合同な値として計算を続ける |
| 遅延還元（lazy reduction） | 完全な正規化を個々の演算のたびには行わず、区切りまで遅らせる戦略 |

部分還元は値の表現について、遅延還元は処理のタイミングについての説明である。完全な還元を毎回行わない考え方は、ScottのSlothful reductionでもlazy reductionとして説明されている。本実装を、その論文の個々のアルゴリズムと同一だとするものではない。[Slothful reduction, 2017](https://eprint.iacr.org/2017/437)

一度の折りたたみは、結果がp未満になることを保証しない。例えば、`0 ≤ f,g < p`という条件なら、積は`B^2`未満であり、折りたたんだ値は`20B`未満に収まる。この範囲の値をさらに一度折りたたむと`B + 361`未満になるが、それでも必ずp未満とは限らない。これは指定した入力条件での範囲の説明であり、呼び出し全体の中間値上限を証明したものではない。

完全に`0 ≤ x < p`へ収める処理は[fe25519Reduce](../src/curve25519/fe25519/fe25519-reduce.js)に分けている。

```js
export function fe25519Reduce(h) {
    h.value = ((h.value % P) + P) % P;
}
```

実際の配置は次のコードで確認できる。

- [基点のスカラー倍](../src/curve25519/ge25519/ge25519-scalarmult-base.js)：点加算・座標変換の後に各座標を正規化する。
- [逆数計算](../src/curve25519/fe25519/fe25519-invert.js)：二乗と乗算の列の最後で正規化する。
- [X25519のMontgomery ladder](../src/curve25519/x25519/montgomery-ladder.js)：ループ各回で座標を正規化する。

「最後まで一切正規化しない」構成ではなく、演算のまとまりに応じて配置している。

## 負のBigIntでも合同性は保たれる

[減算](../src/curve25519/fe25519/fe25519-sub.js)は負の中間値を返す場合がある。JavaScriptのBigIntは符号付き右シフトと2の補数に基づくビット演算を定義しており、負数でも次の分解が成立する。[ECMAScript仕様：BigInt](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-bigint-signedRightShift)

$$
hi = \lfloor x/B \rfloor,\quad lo = x-hiB,\quad 0\le lo<B
$$

折りたたんだ値をF(x)とすれば、

$$
F(x) = lo+19hi = x-hi(B-19)=x-hi p
$$

なので、符号にかかわらず元の値と合同である。例えば`x = -1`では、`lo = B−1`、`hi = -1`となり、結果は`B−20 = p−1`になる。

部分還元の結果は必ず非負になるわけではなく、任意の小さい負数について絶対値が小さくなるという意味でもない。合同性、値の大きさ、`0 ≤ x < p`への正規化は分けて考える。BigIntには固定幅整数の桁あふれによる折り返しはないが、扱う桁数は計算時間とメモリ使用量に関係する。

## 検証と位置付け

[取り込み記録](import-report.md)には、原本との一致確認、指定した入力に対する独立実装との比較、当初のテスト失敗とその解消を残している。今回の解説照合で追加したEd25519の入力検査は[実施PLAN](plans/20261028-01-public-explanations/PLAN.md)を参照する。有限体演算の解説更新自体によって、算術の試験範囲を広げたものではない。

本ライブラリは、先行手法の数学的根拠をコードへ結び付ける参照実装である。BigIntの定時間性は保証されないため、本実装もサイドチャネル攻撃耐性を保証しない。出典の整理に用いた諮問原文と修正点は[諮問記録](reviews/grok-reduction.md)に保存している。
