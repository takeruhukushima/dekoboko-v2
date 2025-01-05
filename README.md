# 開発手順

## githubのブランチ運用ルール

\url{https://qiita.com/c6tower/items/fe2aa4ecb78bef69928f}を参考にする。

<!-- テーブル -->

| ブランチ名 | 用途                     | 派生元  | マージ先            |
| :--------- | :----------------------- | :------ | :------------------ |
| main       | ユーザーが見れるブランチ | なし    | develop             |
| develop    | 開発者が使うブランチ     | main    | feature/_, hotfix/_ |
| feature/*  | 機能追加                 | develop | develop/main        |
| hotfix/*   | 緊急修正                 | main    | develop/main        |

このブランチ運用ルールに従って開発を行う。

```bash
git checkout -b feature/{branch_name}
```

のようにしてブランチを作成して開発を行う。

### コミットメッセージルール

開発のコミットは機能の節目ごとにまめに行ってください。
Issueを作成している機能の追加の場合は、Issue番号をコミットメッセージに含めるようにしてください。

```bash
git commit -m "Issue #1: ログイン機能の実装"
```

またはVSCode/Cursor のGUIからコミットメッセージを入力してください。

### プルリクエストのルール

プルリクエストを作成する際は、以下のルールに従ってください。

- プルリクエストのタイトルは、Issue番号と機能の内容を簡潔に記述する
- プルリクエストの本文には、機能の詳細や変更点を記述する
- 開発者はほかの人にレビューを依頼する

レビューを行う際は、以下を確認してください。

- コードは適切に動くか？
- コードの内容は適切か？後で技術的負債が発生しないか？

レビューが終了したら、プルリクエストをマージしてください。

## 開発手順

1. リポジトリをクローンする

```bash
git clone https://github.com/takeruhukushima/dekoboko.git
```

2. ブランチを作成する

```bash
git checkout -b feature/{branch_name}
```

3. 開発を行う
4. プルリクエストを作成する
