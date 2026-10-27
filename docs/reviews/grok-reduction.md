# Grok諮問：BigIntの折りたたみと先行手法

受領日：2026-10-27。ユーザーがこのチャットに貼り付けたGrokの回答を保存した。Grokのモデル名・実行日時・検索履歴は未確認。本記録は技術上の位置付けを検討する材料であり、暗号実装全体の監査結果ではない。

## 諮問の目的と取り扱い

乗算・二乗・加算の折りたたみ、二乗前の入力削減、完全な正規化を別の段階で行う構成について、方式名と一次資料を確認する。依頼では実際のfe25519Mul、fe25519Sq、fe25519Add、fe25519Sub、fe25519Reduce、P・MASK_255と呼び出し側の構成を提示した。

中心的な整理を採用する。演算はpseudo-Mersenne reduction、結果の扱いは部分還元、完全な正規化を遅らせる戦略はlazy reductionとして説明する。二乗前の折りたたみに独立した固有名称は今回確認できていない。先行手法をBigIntへ適用した実装として示す。

## 確認した修正点

1. ePrint 2018/985の著者は**Kaushik Nath and Palash Sarkar**。回答のSubhabrata Samajderは誤記。ここでは書誌情報が確認できる2018年のePrintとして引用する。[原資料とBibTeX](https://eprint.iacr.org/2018/985)
2. ePrint 2017/437はMichael Scottの**Slothful reduction**（2017年）。回答に記載されたSliding Windowsの論文とは別である。abstractがlazy reductionを直接説明している。[原資料とBibTeX](https://eprint.iacr.org/2017/437)
3. 負のBigIntでも`x = (x & MASK_255) + (x >> 255n) * 2^255`は成立する。したがって、負数であることによって折りたたみの合同性が壊れるという説明はしない。結果の符号や大きさ、完全な正規化とは別の問題である。[ECMAScript BigIntの定義](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-bigint-signedRightShift)
4. 回答は冒頭にCrandall reductionを挙げながら、後段で提案者名に由来する名称は確認できないとしており、説明が一致していない。今回はpseudo-Mersenne reductionを本文の名称に採用し、Crandallという帰属は確定記述にしない。
5. limb実装のcarry伝播とBigIntでの入力折りたたみは、同一の処理・同一の性能ではない。合同性と中間値の大きさを管理するという共通の目的を、異なる整数表現で実現するものとして説明する。

文献との対応は今回確認した説明上の対応である。開発当時にこれらの文献を直接参照したという来歴までは確認していない。公開文書は[BigIntの有限体演算](../bigint-field-arithmetic.md)を参照する。

## 受領した回答原文

以下はユーザーが提示したGrok回答の本文。上記の修正を原文へ遡って書き込まず保存する。末尾のユーザー自身のコメントは含めない。

---

以下に、提示された実装の位置付けを整理します。

### 1. 折りたたみ方式の名称と対応

この方式は **pseudo-Mersenne reduction**（擬似メルセンヌ還元、または Crandall reduction）の基本形です。

- \( p = 2^{255} - 19 \) なので \( 2^{255} \equiv 19 \pmod{p} \)
- 任意の整数 \( x \) を \( x = lo + hi \cdot 2^{255} \) と分割し、
  \[
  x \equiv lo + 19 \cdot hi \pmod{p}
  \]
  に置き換える。

コード対応：
- `MASK_255 = 2^{255}-1`
- `lo = x & MASK_255`、`hi = x >> 255n`
- `h.value = lo + 19n * hi`

これは Bernstein の Curve25519 / Ed25519 実装や、その後の多くの文献で標準的に使われる手法です。一度の適用で完全に \( [0, p) \) に入るとは限らず、出力はまだ \( p \) を超える可能性があります（部分的な還元）。

固有の提案者名に由来する特殊名称は確認できませんでした。一般に「pseudo-Mersenne reduction」または「reduction using \( 2^{255} \equiv 19 \)」と呼ばれます。

### 2. 二乗前後の両方で折りたたむ構成

これは **既知の削減手法を、入力サイズに応じて配置した実装上の選択** です。特定の方式名や先行研究で「二乗前折りたたみ + 二乗後折りたたみ」として独立に命名されたものは見当たりません。

- 二乗前の折りたたみ（`f_folded = f_lo + 19 * f_hi`）は、BigInt の乗算コストを抑えるための **入力の部分還元（partial reduction of the operand）**。
- 二乗後の折りたたみは通常の pseudo-Mersenne reduction。

limb 表現（固定幅の配列）を使う実装では、乗算・二乗の過程で carry 伝播と還元を混ぜるのが普通ですが、BigInt では「一度折りたたんでから二乗する」という形で同じ効果を得ています。これは自然な適応であり、新しいアルゴリズムというよりは表現に合わせた工夫です。

### 3. 部分削減・遅延削減の整理

| 用語 | 意味 | 本実装での対応 |
|------|------|----------------|
| **pseudo-Mersenne reduction** | \( 2^k \equiv c \pmod{p} \) を利用した還元そのもの | `lo + 19*hi` の操作 |
| **partial reduction / incomplete reduction** | 完全に \( [0,p) \) に落とさず、合同な小さな値に留める還元 | 乗算・二乗・加算後の折りたたみ結果 |
| **lazy reduction** | 演算のたびに完全還元せず、必要なタイミングまで遅延させる戦略 | 中間値を毎回 `% P` せず、点加算後や逆数計算の最後に `fe25519Reduce` を呼ぶ構成 |

演算そのものの名称（pseudo-Mersenne reduction）と、いつ還元を行うかの戦略（lazy / partial）は区別されます。本実装は両者を組み合わせています。

### 4. 入力・出力範囲の条件

コードから確認できること：
- 乗算・二乗・加算は、入力が非負であれば出力も非負の合同な値を返す（折りたたみ後も負にはならない）。
- 減算 `fe25519Sub` は単純な引き算のため、負の中間値を取り得る。
- `fe25519Reduce` は `((x % P) + P) % P` で \( [0, P) \) に正規化する。

呼び出し側の追加調査が必要なこと：
- 減算後の負の値が、その後の乗算・二乗に渡された場合の挙動（BigInt は符号付きなので動作はするが、折りたたみの前提が崩れる可能性がある）。
- 一連の演算後に値がどの程度大きくなり得るか（遅延還元の安全性の保証）。
- スカラー倍などの高レベル演算で、正規化のタイミングが十分か。

現状のコードだけでは「すべての中間値が常に非負で、かつある上限以下である」ことは保証されていません。

### 5. 一次資料

数学的に同じ手法（pseudo-Mersenne reduction）に直接対応するもの：

- Daniel J. Bernstein, *Curve25519: new Diffie-Hellman speed records*, 2006.  
  https://cr.yp.to/ecdh/curve25519-20060209.pdf  
  （\( p = 2^{255}-19 \) の選定と高速還元の動機が述べられている）

- Daniel J. Bernstein et al., *High-speed high-security signatures* (Ed25519), 2011 / Journal of Cryptographic Engineering 2012.  
  https://ed25519.cr.yp.to/ed25519-20110926.pdf

関連する考え方（部分還元・遅延還元）を扱うもの：

- Palash Sarkar, Subhabrata Samajder, *Efficient arithmetic in (pseudo-)Mersenne prime order fields*, Advances in Mathematics of Communications, 2022 (ePrint 2018/985).  
  https://eprint.iacr.org/2018/985  
  （partial reduction の有用性や還元アルゴリズムの分類）

- Michael Scott, *Sliding Right into Disaster: Left-to-Right Sliding Windows Leak*, または lazy reduction に関する議論を含む ECC 実装論文（例: ePrint 2017/437 など）。  
  https://eprint.iacr.org/2017/437  
  （lazy reduction の概念説明）

「二乗前に折りたたむ」という具体的な配置に完全一致する一次資料は確認できませんでした。既知手法の組み合わせです。

### 6. GitHub 向け短い日本語説明案

```text
本実装の有限体演算は、素数 p = 2^255 − 19 の性質（2^255 ≡ 19 (mod p)）を利用した
pseudo-Mersenne reduction を BigInt 上で直接表現したものです。

乗算・二乗・加算の後に、値を lo + hi·2^255 と分割して lo + 19·hi に置き換えることで、
合同性を保ちながら値を小さくしています（部分還元）。完全な正規化（0 以上 p 未満）は
必要なタイミングでのみ行い、中間計算では遅延させています（lazy reduction）。

二乗では入力を先に一度折りたたんでから二乗し、出力でも再度折りたたむことで、
BigInt の乗算サイズを抑えています。これは固定幅 limb 表現で行われる carry 伝播と
還元を、任意精度整数に合わせて配置した実装上の選択です。

独自のアルゴリズムではなく、既知の手法を BigInt に適した形で組み合わせた参照実装です。
```

---

**まとめ**  
適合する固有名称は「pseudo-Mersenne reduction（部分還元を伴うもの）」と「lazy reduction 戦略」の組み合わせです。二乗前後の二重折りたたみに特別な名称は確認できませんでした。既知手法の適切な適応として説明するのが正確です。
