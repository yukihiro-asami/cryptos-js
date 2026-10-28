# cryptos-js

[English](README.en.md)

**暗号アルゴリズムを、数式からバニラJavaScriptの実装まで。**

[浅見幸宏](https://github.com/yukihiro-asami)による、Ed25519・X25519・SHA-512・HKDF-SHA-512・ChaCha20-Poly1305の参照実装集です。スクラッチから書いた計算処理と解説を通じて、アルゴリズムを理解し、自ら実装・検証する技術を示します。

有限体演算はBigIntで直接表現し、既知の還元手法を中間値の大きさに合わせて配置しています。署名では座標変換と事前計算表を使い、SHA-512では64ビット語をBigInt、ChaCha20では32ビット語をNumberと型付き配列で扱います。それぞれの選択をコードに結び付けて説明しています。

## 読み始める

| 知りたいこと | 文書 |
|---|---|
| X25519 → シュノア署名 → Ed25519、有限体・部分群から内部計算まで | [数式からコードへ](docs/algorithms.md) |
| BigIntの折りたたみ、二乗前の部分還元、正規化の配置 | [BigIntの有限体演算](docs/bigint-field-arithmetic.md) |
| どの入力をどう比較し、何を確認したか | [取り込み・検証記録](docs/import-report.md)、[最新の修正・検証記録](docs/reviews/claude-ed25519-fixes.md) |
| 関数の呼び方と独立実装との比較 | [相互運用試験](tests/interop.test.mjs) |

解説は日本語・英語を用意しています。各文書から対応するコードと一次資料へ移動できます。

## 対象と入口

| 方式 | 実装 |
|---|---|
| Ed25519 | [鍵生成](src/curve25519/ed25519/key-pair.js)・[署名](src/curve25519/ed25519/sign-detached.js)・[検証](src/curve25519/ed25519/verify-detached.js) |
| X25519 | [スカラー倍](src/curve25519/x25519/scalarmult-curve25519.js)・[基点のスカラー倍](src/curve25519/x25519/scalarmult-curve25519-base.js) |
| SHA-512 | [ハッシュ](src/crypto/sha512/sha512.js) |
| HKDF-SHA-512 | [Extract](src/crypto/sha512/hkdf-sha512-extract.js)・[Expand](src/crypto/sha512/hkdf-sha512-expand.js) |
| ChaCha20-Poly1305 | [暗号化](src/crypto/chacha20poly1305/chacha20poly1305-encrypt.js)・[復号](src/crypto/chacha20poly1305/chacha20poly1305-decrypt.js) |

暗号処理はJavaScriptのES modulesとして実装し、WebCryptoや外部暗号パッケージへの委譲はしていません。既存の低水準APIを維持しており、seed・鍵・nonce・入出力バッファは呼び出し側が用意します。認証プロトコル、アプリ、サーバーは含みません。既存のCryptoJSとは別のプロジェクトです。

## 動かして読む

Node.js 24以降。依存パッケージのインストール・ビルドは不要です。リポジトリを取得して実行します。

```sh
git clone https://github.com/yukihiro-asami/cryptos-js.git
cd cryptos-js
npm run examples
npm run examples -- ed25519
npm run examples -- combined
```

引数なしで全6例を実行し、成功すると `6/6 examples passed; 24 checks.` と表示します。不一致や実行エラーは終了コード1になります。個別のIDは `ed25519`、`x25519`、`sha512`、`hkdf`、`chacha`、`combined` です。

ブラウザ用の確認ページは次で起動します。

```sh
npm run examples:browser
```

[http://127.0.0.1:3210/](http://127.0.0.1:3210/)を開き、「すべて実行」を押します。各例の入出力を展開し、呼び出しコードも読めます。ポートを変える場合は `npm run examples:browser -- 3211`、停止はCtrl+Cです。HTMLを直接開かず、ローカルサーバー経由で使います。

| 利用例 | 確かめること |
|---|---|
| [Ed25519](examples/ed25519.js) | 鍵生成・署名のRFC値との一致、検証、メッセージ改変の拒否 |
| [X25519](examples/x25519.js) | 公開鍵・共有秘密のRFC値との一致、双方の計算結果の一致 |
| [SHA-512](examples/sha512.js) | abcのハッシュと期待値の一致 |
| [HKDF-SHA-512](examples/hkdf-sha512.js) | Extract・Expandと独立に計算したSHA-512期待値の一致 |
| [ChaCha20-Poly1305](examples/chacha20-poly1305.js) | 暗号文・タグのRFC値との一致、復号、タグ改変の拒否 |
| [鍵共有 → 鍵導出 → 暗号化](examples/key-exchange-encryption.js) | 新しいデモ鍵を生成し、相手側で同じ鍵を導出してUTF-8の文を復号 |

Node.jsとブラウザは同じ利用例とライブラリを読みます。固定の例は[公開テスト値](examples/vectors.js)を使用します。HKDFはRFC 5869 A.1の入力をSHA-512に適用し、期待値をNode.jsとPythonで別途計算したもので、RFC掲載のSHA-256出力とは異なります。固定鍵は実データに使用しません。

組み合わせの例は毎回新しい鍵・salt・nonceを生成し、乱数の生成だけ実行環境の機能を使います。暗号計算は独自ライブラリで実行します。この例はローカルでの部品の接続を示すもので、認証付き鍵交換プロトコルではありません。ブラウザでの計算はタブ内で完結し、入力を送信・保存しません。

2026-10-28、macOS 26.3.1 (a) / arm64で確認しました。

| 実行環境 | 結果 |
|---|---|
| Node.js 24.22.1 | 6例・24項目成功 |
| Safari 26.3.1 (21623.2.7.111.2) | 6例・24項目成功。実際のSafariで確認 |
| Chrome 156.0.8078.49 | 6例・24項目成功。実際のChromeで確認 |

両ブラウザで入出力の展開、再実行、配信停止時のエラー表示、再読込後の復帰を確認しました。[工程と確認記録](docs/plans/20261028-02-examples-browser-validation/PLAN.md)に範囲を残しています。

## 検証する

Node.js 24以降。依存パッケージのインストールやビルドは不要です。

```sh
npm test
```

2026-10-28、Node.js v24.22.1 / macOS arm64で、次のすべてが成功しました。

| 確認 | 結果 |
|---|---|
| 選択した既存テスト | 201/201件成功。有限体の逆数を調べる100万回試験を含む |
| 追加回帰試験 | 11/11試験群成功。点の復元4群、署名sの範囲検査2群、乗加算・座標変換と署名の回帰5群 |
| Node.js標準暗号との比較 | 5/5試験群成功。公開鍵・署名・共有秘密・ハッシュ・導出値・暗号文とタグ等を照合 |
| 原本・変更台帳と依存関係 | 324ファイルのハッシュとローカルimport参照を確認 |

個別には`npm run check:imports`、`npm run test:reference`、`npm run test:regression`、`npm run test:interop`で実行できます。既存テストの時間上限は通常1ファイル15秒、100万回試験は600秒です。`npm run test:reference -- --timeout-ms=600000`で全件共通の上限を指定できます。時間切れは失敗になります。所要時間は環境によりますが、直前の工程では100万回試験が約42秒でした。

既存試験には形状確認だけのものもあり、件数はアルゴリズムの網羅率を表しません。試験した入力と結果は、上記の検証記録から確認できます。

## 参照実装としての位置付け

数学的な定義、先行手法、BigIntに合わせた実装上の工夫を区別して示します。JavaScriptのBigIntは定時間性を保証しないため、本実装もサイドチャネル攻撃耐性を保証しません。計算手順を読み、検証し、議論するための参照実装です。

元資産はrainfrog_truthのfrog/workerです。[出典台帳](docs/source-manifest.json)に元パス・commit・ハッシュ、[変更台帳](docs/source-changes.json)に取り込み後の修正理由とハッシュを残しています。[Grokの諮問原文と修正点](docs/reviews/grok-reduction.md)も保存しています。

Claudeによる指摘から再現・数学的な根拠・修正・回帰試験までを[レビュー対応記録](docs/reviews/claude-ed25519-fixes.md)に、修正後の[Grokの再評価](docs/reviews/grok-public-review.md)も別に残しています。各モデルの報告と、このリポジトリで実行して確認した結果は区別しています。

## ライセンス・著者

[MIT License](LICENSE)。Copyright (c) 2025-2026 Yukihiro Asami（浅見幸宏）。

ソース、解説、利用例と検証記録は[GitHubリポジトリ](https://github.com/yukihiro-asami/cryptos-js)にまとめています。npmパッケージとしての配布は行っていません。
