# cryptos-js

Handwritten JavaScript cryptographic reference implementations by Yukihiro Asami.

Ed25519、X25519、SHA-512、HKDF-SHA-512、ChaCha20-Poly1305を、バニラJavaScriptでスクラッチから実装した参照実装集です。アルゴリズムの数学的な定義と実際の計算手順を結び付け、自ら実装・検証できることをコードと説明で示します。

BigIntを用いた有限体演算や、既知の計算手法を実装へ落とし込む判断を解説することを目指しています。JavaScriptのBigInt演算は定時間性を保証しないため、本実装もサイドチャネル攻撃耐性を保証しません。既存のCryptoJSとは別のプロジェクトです。

## 現在地

公開準備中です。選択取り込み後、点の復元処理2ファイルの入力検査と既存テスト6ファイルを修正しました。既存201件（100万回の逆数試験を含む）、追加した境界条件の4試験群、Node.js標準実装との5方式の比較がすべて成功しています。原本のハッシュと取り込み後の変更を別々に記録しています。認証プロトコル・アプリ・サーバーは含みません。ライセンスは未選定で、npm公開は無効にしています。

## 構成

| 方式 | 入口（src/以下） |
|---|---|
| Ed25519 | curve25519/ed25519/key-pair.js、sign-detached.js、verify-detached.js |
| X25519 | curve25519/x25519/scalarmult-curve25519.js、scalarmult-curve25519-base.js |
| SHA-512 | crypto/sha512/sha512.js |
| HKDF-SHA-512 | crypto/sha512/hkdf-sha512-extract.js、hkdf-sha512-expand.js |
| ChaCha20-Poly1305 | crypto/chacha20poly1305/chacha20poly1305-encrypt.js、chacha20poly1305-decrypt.js |

元の低水準APIを維持しています。使い方は[独立実装との比較試験](tests/interop.test.mjs)で確認できます。ブラウザ用のビルドや依存パッケージは不要なES modulesです。現在の実行検証はNode.jsで行っています。

## 検証

Node.js 24以降。npm installは不要です。

```sh
npm test
```

`npm test`は以下を順番に実行します。2026-10-28の確認ではすべて成功しました。100万回の逆数試験は約42秒、既存201件全体は約51秒でした（Node.js v24.22.1 / macOS arm64）。所要時間は環境により変わります。

- `npm run check:imports`：未変更ファイルは原本、修正ファイルは変更台帳のハッシュと照合し、ローカル依存を確認。
- `npm run test:reference`：選択した既存テストを別プロセスで実行。console.assertの失敗も検出。
- `npm run test:regression`：点の復元の正常・異常な境界条件と署名検証経路を確認。
- `npm run test:interop`：Node.js標準暗号実装との比較。

既存テストの時間上限は通常1ファイル15秒、100万回試験だけ600秒です。`npm run test:reference -- --timeout-ms=600000`で全件共通の上限を指定できます。時間切れは失敗として扱います。

結果と未確認範囲は[取り込み記録](docs/import-report.md)を参照してください。既存テストには形状確認だけのものもあり、実行件数をアルゴリズムの網羅率とみなしません。

## 出典と説明の方針

元資産はrainfrog_truthのfrog/workerです。選択したファイルのパス・commit・SHA-256は[台帳](docs/source-manifest.json)に記録しています。取り込み後の修正は[変更台帳](docs/source-changes.json)で元ハッシュ・修正後ハッシュ・理由を追跡します。標準的な計算手法と実装上の選択を区別し、先行研究との対応を示します。

[BigIntで表現する有限体演算：折りたたみと正規化](docs/bigint-field-arithmetic.md)では、pseudo-Mersenne reduction、二乗前の部分還元、完全な正規化を遅らせる戦略を、実際のコードと数学的な根拠に沿って説明しています。[Grokの諮問結果と修正点](docs/reviews/grok-reduction.md)も保存しています。

シュノア署名、座標表現、他の方式の計算手順などの解説は今後追加します。

作業範囲と結果は[取り込みPLAN](docs/plans/20261027-00-selective-import/PLAN.md)、[解説反映PLAN](docs/plans/20261027-01-reduction-explanation/PLAN.md)、[既存テスト修正PLAN](docs/plans/20261028-00-resolve-reference-tests/PLAN.md)を参照してください。
