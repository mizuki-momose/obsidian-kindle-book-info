# コミュニティプラグイン申請ガイド

このドキュメントは、Obsidian Kindle Book Info プラグインをObsidianコミュニティプラグインディレクトリに申請する手順を説明します。

## 申請前のチェックリスト

以下の項目を確認してください:

- [x] 最初のリリース（1.0.0以上）が作成されている
- [x] リリースに `main.js`, `manifest.json`, `styles.css` が含まれている
- [x] `manifest.json` に必須フィールドが含まれている
  - [x] `id`: "obsidian-kindle-book-info"
  - [x] `name`: "Kindle Book Info"
  - [x] `version`: "1.0.0"
  - [x] `minAppVersion`: "0.15.0"
  - [x] `description`: 説明文
  - [x] `author`: "mizuki-momose"
  - [x] `authorUrl`: GitHubプロフィールURL
- [x] README.mdが充実している
  - [x] プラグインの説明
  - [x] インストール方法
  - [x] 使い方
  - [x] 設定項目
- [x] LICENSEファイルが含まれている
- [x] `.gitignore` で build artifacts が除外されている

## 申請手順

### 1. obsidian-releases リポジトリをフォーク

1. [obsidian-releases リポジトリ](https://github.com/obsidianmd/obsidian-releases) にアクセス
2. 右上の「Fork」ボタンをクリック
3. フォークが完了するまで待つ

### 2. community-plugins.json を編集

1. フォークしたリポジトリで `community-plugins.json` を開く
2. ファイルの最後（`]` の直前）に以下のエントリを追加:

```json
	{
		"id": "obsidian-kindle-book-info",
		"name": "Kindle Book Info",
		"author": "mizuki-momose",
		"description": "Fetch Kindle book information from share URLs and create notes with templates",
		"repo": "mizuki-momose/obsidian-kindle-book-info"
	}
```

**注意**: 
- 既存のエントリとの間にカンマ `,` を忘れずに追加
- アルファベット順に挿入する必要はありません（ファイルの最後に追加でOK）
- インデントはタブを使用

### 3. Pull Request を作成

1. 変更をコミット
2. フォークしたリポジトリから元のリポジトリへPull Requestを作成
3. PRのタイトル: "Add Kindle Book Info plugin"
4. PRの説明に以下を含める:

```markdown
## Plugin Information

**Name**: Kindle Book Info
**Author**: mizuki-momose
**Repository**: https://github.com/mizuki-momose/obsidian-kindle-book-info
**Initial Release**: v1.0.0

## Description

このプラグインは、Kindle/AmazonのURLから書籍情報を取得し、テンプレートを使用してObsidianのノートを自動作成します。

## Features

- KindleシェアURL（短縮URL含む）からの書籍情報取得
- 書籍メタデータ（タイトル、著者、ASIN、ISBN等）の自動抽出
- カスタマイズ可能なテンプレート（外部.mdファイル）
- サムネイル画像のダウンロードと表示
- デスクトップ・モバイル両対応
- Advanced URI連携

## Screenshots

（可能であればスクリーンショットを追加）

## Checklist

- [x] 初回リリース（v1.0.0）が作成済み
- [x] リリースに必須ファイル（main.js, manifest.json, styles.css）が含まれている
- [x] manifest.json に必須フィールドがすべて含まれている
- [x] README.md が充実している
- [x] MIT License
- [x] プラグインはObsidianのプラグインガイドラインに準拠している
```

### 4. 審査

Obsidianチームがプラグインを審査します。以下の点がチェックされます:

- **コード品質**: セキュリティ、パフォーマンス
- **機能性**: 説明通りに動作するか
- **ユーザー体験**: UIが使いやすいか
- **ドキュメント**: README が充実しているか
- **ライセンス**: オープンソースライセンスか

審査には通常**数日から数週間**かかります。

### 5. フィードバック対応

審査中にフィードバックがある場合:

1. GitHubの通知を確認
2. 指摘された問題を修正
3. 新しいバージョンをリリース
4. Pull Requestにコメントで報告

### 6. 承認と公開

Pull Requestがマージされると、プラグインがコミュニティプラグインディレクトリに追加されます。

数時間以内に、Obsidianのコミュニティプラグイン検索で表示されるようになります。

## 申請後のメンテナンス

### バージョン更新

新しいバージョンをリリースするたびに、以下が自動的に更新されます:

1. GitHubにタグをプッシュ
2. GitHub Actionsが自動でリリースを作成
3. Obsidianが自動で新バージョンを検出

**community-plugins.json を再度編集する必要はありません**。

### プラグイン情報の更新

以下を変更する場合は、obsidian-releases リポジトリへPRが必要です:

- プラグイン名
- 説明文
- リポジトリURL

## トラブルシューティング

### PR が却下された場合

1. 却下理由を確認
2. 指摘された問題を修正
3. 新しいバージョンをリリース
4. 再度PR を作成

### リリースファイルが見つからないエラー

1. [Releases ページ](https://github.com/mizuki-momose/obsidian-kindle-book-info/releases) で最新リリースを確認
2. `main.js`, `manifest.json`, `styles.css` が添付されているか確認
3. ない場合は、タグを削除して再度リリース

```bash
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
npm version 1.0.0
git push origin main
git push origin --tags
```

## 参考資料

- [Obsidian Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- [Obsidian Plugin Submission Guide](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin)
- [obsidian-releases リポジトリ](https://github.com/obsidianmd/obsidian-releases)
- [コミュニティプラグイン一覧](https://obsidian.md/plugins)
