# 一次資料の照合記録

確認日：2026-10-28。公開文書の閲覧のみ。外部AIへのコード送信は行っていない。

| 資料・著者 | 確認した箇所と公開解説での用途 |
|---|---|
| [RFC 8032 — Edwards-Curve Digital Signature Algorithm (EdDSA)](https://www.rfc-editor.org/rfc/rfc8032.html), Simon Josefsson / Ilari Liusvaara, 2017 | §1のSchnorrとの関係、§5.1.2–4の符号化・復元・拡張座標、§5.1.5–7の鍵生成・署名・検証。Sの範囲とcofactor付きの検証式、§7.1の公開ベクトルを実装と照合 |
| [RFC 7748 — Elliptic Curves for Security](https://www.rfc-editor.org/rfc/rfc7748.html), Adam Langley / Mike Hamburg / Sean Turner, 2016 | §4.1の曲線と素数、§5の入力整形とladder、§6.1の鍵共有。121665とコードの121666の式の等価性は独立に計算確認 |
| [FIPS 180-4 — Secure Hash Standard](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf), NIST, 2015 | §5.1.2のパディング、§6.4のSHA-512、64ビット語と80ラウンド。アルゴリズムの出典として使用 |
| [RFC 5869 — HMAC-based Extract-and-Expand Key Derivation Function](https://www.rfc-editor.org/rfc/rfc5869.html), Hugo Krawczyk / Pasi Eronen, 2010 | §2.2–3のExtract・Expand、1バイトカウンタと出力長上限。実装のctx/outとの対応を確認 |
| [RFC 8439 — ChaCha20 and Poly1305 for IETF Protocols](https://www.rfc-editor.org/rfc/rfc8439.html), Yoav Nir / Adam Langley, 2018 | §2.1–3のround・状態、§2.5のPoly1305、§2.8のAEAD、鍵・nonce・タグの長さとAAD・暗号文・長さの認証 |
| [High-speed high-security signatures](https://eprint.iacr.org/2011/368), Daniel J. Bernstein / Niels Duif / Tanja Lange / Peter Schwabe / Bo-Yin Yang, 2011 | IACRの著者・題名・abstractを確認し、Ed25519の原論文として案内。著者サイトは502、IACR PDFは403のため本文を今回取得したとは扱わない。解説の具体的な式は閲覧できたRFCと実装で照合 |
| [Twisted Edwards Curves Revisited](https://eprint.iacr.org/2008/522), Huseyin Hisil / Kenneth Koon-Ho Wong / Gary Carter / Ed Dawson, 2008 | IACRの書誌・abstract、RFC 8032の当論文への参照を確認。PDFは403。具体的な拡張座標の式はRFC §5.1.4とコードで照合し、completedからの変換もローカル計算で確認 |
| [Efficient Arithmetic In (Pseudo-)Mersenne Prime Order Fields](https://eprint.iacr.org/2018/985), Kaushik Nath / Palash Sarkar, 2018 | 書誌・abstractを再確認。有限体の乗算・二乗・還元を扱う先行研究として案内。PDFは403。本実装の範囲評価はコードから導出したもので、論文の定理と同一だとは記載しない |
| [Slothful reduction](https://eprint.iacr.org/2017/437), Michael Scott, 2017 | 書誌・abstractのlazy reductionの説明を再確認。PDFは403。遅延還元の考え方として参照し、個別アルゴリズムを同一視しない |
| [ECMAScript BigInt](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-bigint-signedRightShift), Ecma International / TC39 | BigIntの符号付きシフト・整数表現の定義と、負数を含む折りたたみの分解を対応付け。符号・合同性・正規化を分けて説明 |

現在のコードとの数学的な対応を確認するための出典であり、開発当時に各文献を直接参照したという来歴は断定しない。本文を取得できなかった論文の詳細に説明の成立を依存させず、確認済みの仕様とコードに根拠を置いた。

## 解説順序の再構成に伴う追加照合（2026-10-28）

- [RFC 8235 — Schnorr Non-interactive Zero-Knowledge Proof](https://www.rfc-editor.org/rfc/rfc8235.html), Feng Hao (editor), 2017：§2.1–3の整数群・指数・ハッシュによる検査値、§3の楕円曲線への対応を閲覧。本文の説明は同RFCの知識証明そのものの転載ではなく、メッセージを含むシュノア型署名の代数構造として記述する。RFCの減算形に対して、Ed25519と対応する加算形s=r+haを使うことを明示した。説明用の法q・位数nは、RFC §2のp・qを読み替えたもの。
- RFC 7748 §4.1のedwards25519／curve25519のorderとcofactor、§5のX25519の入出力を再確認。8ℓ個から8個の剰余類に分かれる説明と、8倍で基点の部分群へ入る説明は、この群の構造から導いた。曲線の全点を実際に列挙したとは扱わない。
- RFC 8032 §5.1のスカラ・符号化・検証式と実装を再照合。hとsは説明上の記号で、RFCのkとS、実装のhram/hとS等に対応する。
- scalarmult-curve25519-base.jsとedwards-to-montgomery.jsを読み、BigInt入力の整形→ℓでの還元→Edwards基点乗算→Montgomery u座標への変換という実際の処理を確認した。
