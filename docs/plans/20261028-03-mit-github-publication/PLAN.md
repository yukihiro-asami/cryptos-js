# 20261028-03-mit-github-publication

## 状態・目的

実行中。2026-10-28、ユーザーの「PLANを承認します。実行して、GitHub公開まで進めてください」により、MITの反映・コミット・GitHub公開まで承認された。中断後の「続けて」を受け、起草時の状態から実行を開始した。

cryptos-jsを浅見幸宏のGitHubアカウントで公開する。5方式の手書き参照実装、日英の解説、利用例、検証・レビュー対応記録を、技術を理解し自ら実装できることを伝える成果として整える。

## 基点と合意

- 対象：`/Users/asamiyukihiro/Documents/GitHub/cryptos-js`、branch：`main`。
- 基点commit：`66da03cd6b6d8480db5c575e58dccd7376178ee9`（`Add runnable crypto examples and browser verification`）。起草前の作業ツリーは空、remoteは未設定。
- [利用例・ブラウザ検証PLAN](../20261028-02-examples-browser-validation/PLAN.md)は完了済み。Node.jsと実際のSafari・Chromeで6例・24項目が成功している。
- ライセンスはMITを採用する。著作権者はYukihiro Asami（浅見幸宏）とし、年は元資産と本リポジトリの記録に沿って記載する。
- 指摘を受けて修正した経緯も公開する。指摘・数学的な根拠・修正・検証結果を一組として、関心のある読者が辿れる既存の技術記録を活用する。レビュー対応を主たる宣伝にせず、今回の合意を理由とした別のCHANGELOGは新設しない。
- GitHub上のソース公開を対象とする。npm公開は行わず、`private: true`を維持する。

## 成果物・作業境界

| 対象 | 今回の変更 |
|---|---|
| `LICENSE` | MITの標準英文と著作権表示を追加 |
| `package.json` | `license`を`MIT`へ変更。必要に応じて確定した公開URLを記載 |
| `README.md`・`README.en.md` | MITと著者の表示、公開URL・取得手順、レビュー対応記録への案内、準備中という現在状態の更新 |
| 本PLAN配下 | 公開対象・検証結果・公開URL・成果commitの記録 |
| 本リポジトリのGit設定とGitHub | `origin`の設定、浅見さんのアカウントへの公開リポジトリ作成、mainのpush |

- 起草時は本PLANのみ編集する。実行承認後の編集範囲は上表。`src/`、`tests/`、`examples/`、`scripts/`、解説本文、出典・変更台帳、既存の諮問原文と過去PLANは読み取り専用。既存の修正・検証記録への案内で公開方針を実現する。
- 取り込み元`/Users/asamiyukihiro/Documents/GitHub/rainfrog_truth/`、`/Users/asamiyukihiro/Documents/GitHub/rainfrog-project/`、ui-labを含む他プロジェクトは変更しない。
- 本PLAN全体の実行承認後は、cryptos-jsのmainへのコミット、GitHubへの公開リポジトリ作成とpushまでを対象とする。既存履歴を引き継ぎ、履歴の書き換え・force pushは行わない。
- 公開先は浅見さん本人のGitHubアカウント配下の`cryptos-js`。実行時に接続アカウントと名前の空きを確認し、確定したownerとURLを本PLANへ記録する。
- 外部送信は、確認した本リポジトリとGit履歴のGitHub公開、および公開ページの確認に限る。npm公開、Webサイト配備、GitHub Pages、Release作成、migration、DB・VPS接続、他AIへの追加諮問は対象外。fixtureは既存の公開テスト値と利用例のデモ値を使用する。

## 実施手順

1. **公開する内容と出典を確認する**
   現在の追跡ファイルと公開するGit履歴を確認する。出典台帳・著作権表示とMITの適用範囲を照合し、引用・参照資料は出典と元の扱いを保つ。実データや認証情報が混入していないことを確認する。過去のPLANや諮問原文は記録として保持し、当時の未完了・未公開という表記を現在の事実に書き換えない。

2. **MITと日英の公開案内を整える**
   [MIT標準文](https://opensource.org/license/mit)を確認し、`LICENSE`を追加、package.jsonの指定を変更する。日英READMEのライセンス未選定・公開準備中の記載を整理する。既存のClaude指摘への対応とGrokの再評価へ辿れるよう案内する。現在の参照実装の位置付けと、既に説明している保証範囲は維持する。

3. **確認してコミットする**
   MIT本文・著作権表示・package.json・日英READMEの整合、ローカルリンク、差分と変更範囲を確認する。`npm run check:imports`と`npm run examples`を実行する。実装・試験・利用例を変更しないため、既存の回帰・相互運用・ブラウザ検証と100万回試験は成功記録を引き継ぎ、一律に繰り返さない。結果を本PLANへ記録し、公開準備の成果をmainへコミットする。

4. **GitHubで公開し、利用者の入口を確認する**
   確認した浅見さんのアカウントに公開リポジトリ`cryptos-js`を作成し、originを設定してmainをpushする。公開状態、既定branch、リモートとローカルのcommit一致を確認する。認証なしでREADME・LICENSE・日英解説・利用例・レビュー対応記録を閲覧できることを確認する。公開先を一時ディレクトリへcloneし、READMEの手順で利用例を実行する。使用した一時ディレクトリは確認後に片付ける。

5. **公開結果を記録して閉じる**
   本PLANに公開URL、成果commit、確認結果を記録し、必要なREADMEの公開状態の更新とともにコミット・pushする。最終のcommit一致と作業ツリーを確認して本PLANを閉じる。その後はrainfrog-projectのMVP・MCPの実現可能性検討へ戻る。そちらのPLANを本工程で起草・実行することはしない。

## 完了条件・停止条件

- LICENSE、著作権表示、package.json、日英READMEがMIT採用と整合している。
- 実装・解説・利用例と、指摘から修正・検証までの記録を公開リポジトリから辿れる。
- 公開先をcloneして利用例を実行でき、検証範囲と結果が記録されている。
- 公開URLと成果commitを本PLANに残し、mainの内容がGitHubと一致し、作業ツリーが空である。

実装変更、公開できない資料の除外や履歴の修正、MIT適用に関する具体的な未解決事項が見つかった場合は、対象と理由を示してその扱いを相談する。接続アカウントが浅見さん本人と確認できない、同名リポジトリに既存内容がある、公開に必要な権限がない場合は、上書きや別の公開先への切り替えをせず状況を報告する。通常の文書調整と公開確認は本PLAN内で進める。

## 起草記録

2026-10-28：作業入口、日英README、package.json、直前のPLAN、Claude・Grokのレビュー記録、Gitの状態を確認した。MIT採用とレビュー対応の公開方針を記録した。本PLANのみを追加し、LICENSE等の変更、コミット、GitHub作成・pushは未実施。


## 実施記録：公開前確認（2026-10-28）

公開先は`yukihiro-asami/cryptos-js`と確定した。接続アカウントのloginと本リポジトリの著者を照合し、同名リポジトリが存在しないことをAPIで確認した。

- `LICENSE`にMIT標準文、`Copyright (c) 2025-2026 Yukihiro Asami`を追加した。元資産の履歴には2025-05-12の`7a8fec9`から浅見さんの実装があり、今回の公開準備は2026年のため、この年範囲とした。
- OSIのMIT本文を確認し、GitHubのMITテンプレートとも著作権欄・改行以外の許諾・免責本文が一致することを確認した。package.jsonは`MIT`、`private: true`を維持し、著者と公開先を記載した。
- 日英READMEに取得手順・MIT・著者を反映し、Claudeの指摘から修正と検証へ、Grokの再評価へ辿れる案内を追加した。独立したCHANGELOGは新設していない。
- 公開対象は既存の400ファイルと今回の公開準備成果。既存4commitの422個の固有blobを確認し、認証情報のパターンや秘密ファイル名に該当するものはなかった。唯一の画像は公開テスト値を使う利用例画面であることを目視確認した。出典台帳、一次資料の参照、諮問原文、過去PLANは保持した。確認範囲は[公開対象の確認記録](checks/publication-review.json)に残した。

| 確認 | 結果 |
|---|---|
| `npm run check:imports` | 324ファイル、原本一致311・記録済み変更13、ローカルimport 881件 |
| `npm run examples` | 6/6例、24項目成功（Node.js v24.22.1） |
| READMEのリンク | 日英各33参照。ローカルリンク先が存在 |
| 変更範囲 | 既存400ファイル中、README日英・package.jsonの3件だけ変更。残る397ファイルは不変 |
| MIT・書式 | 標準本文と一致、package.jsonと整合、`git diff --check`成功 |

[ローカル検証記録](checks/local-verification.json)を保存した。暗号コード・試験・利用例は変更せず、既存の回帰・相互運用・ブラウザ・100万回試験の成功結果を引き継ぐ。

公開準備の成果commitは本節を含む`Prepare MIT-licensed GitHub publication`（親：`66da03cd6b6d8480db5c575e58dccd7376178ee9`）。GitHub公開と公開後の確認を続ける。
