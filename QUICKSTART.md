# クイックスタート: 今すぐリリースする

このプラグインはすぐにリリースできる状態です！以下の簡単な手順で公開できます。

## 🚀 5分でリリース

### ステップ1: バージョンを作成

```bash
# package.json, manifest.json, versions.json を自動更新
npm version 1.0.0

# GitHubにプッシュ（タグも含む）
git push origin main --tags
```

### ステップ2: 待つ

GitHub Actionsが自動で以下を実行します（約1-2分）:
1. ✅ TypeScriptをビルド
2. ✅ main.js, manifest.json, styles.css を生成
3. ✅ ドラフトリリースを作成

[Actions タブ](https://github.com/mizuki-momose/obsidian-kindle-book-info/actions) で進捗確認できます。

### ステップ3: リリースを公開

1. [Releases ページ](https://github.com/mizuki-momose/obsidian-kindle-book-info/releases) を開く
2. ドラフトリリース "v1.0.0" をクリック
3. リリースノートを書く（例は下記）
4. 「Publish release」ボタンをクリック

```markdown
## 🎉 初回リリース

Obsidian Kindle Book Info プラグインをリリースしました！

### 主な機能
- 📚 Kindle/Amazon URLから書籍情報を自動取得
- ✏️ カスタマイズ可能なテンプレート
- 🖼️ サムネイル画像のダウンロード
- 📱 デスクトップ・モバイル対応
- 🔗 Advanced URI連携

### インストール方法
手動インストールの手順は [README](https://github.com/mizuki-momose/obsidian-kindle-book-info#インストール) を参照してください。

コミュニティプラグインとしての公開準備中です。
```

## 📝 コミュニティプラグイン申請

リリース公開後、コミュニティプラグインに申請しましょう！

### ステップ1: フォーク

[obsidian-releases](https://github.com/obsidianmd/obsidian-releases) をフォーク

### ステップ2: 編集

`community-plugins.json` の末尾（`]` の前）に追加:

```json
	{
		"id": "obsidian-kindle-book-info",
		"name": "Kindle Book Info",
		"author": "mizuki-momose",
		"description": "Fetch Kindle book information from share URLs and create notes with templates",
		"repo": "mizuki-momose/obsidian-kindle-book-info"
	}
```

### ステップ3: Pull Request

PRタイトル: `Add Kindle Book Info plugin`

PR説明:
```markdown
## Plugin Information

**Name**: Kindle Book Info
**Repository**: https://github.com/mizuki-momose/obsidian-kindle-book-info
**Initial Release**: v1.0.0

## Description

Kindle/AmazonのURLから書籍情報を取得し、テンプレートを使用してObsidianノートを自動作成します。

### Features
- KindleシェアURL（短縮URL含む）対応
- 書籍メタデータ自動抽出（タイトル、著者、ASIN、ISBN等）
- カスタマイズ可能なテンプレート
- サムネイル画像ダウンロード
- デスクトップ・モバイル対応
- Advanced URI連携

### Checklist
- [x] v1.0.0リリース作成済み
- [x] 必須ファイル添付済み（main.js, manifest.json, styles.css）
- [x] manifest.json 完備
- [x] README.md 充実
- [x] MIT License
```

### ステップ4: 審査待ち

Obsidianチームが審査します（通常数日〜数週間）。
GitHubの通知を確認して、フィードバックがあれば対応してください。

## ✅ 完了！

承認されると、世界中のObsidianユーザーがあなたのプラグインを使えるようになります！

---

## 📚 詳細ガイド

もっと詳しい情報が必要な場合:
- [PUBLICATION_CHECKLIST.md](PUBLICATION_CHECKLIST.md) - 完全なチェックリスト
- [RELEASE_GUIDE.md](RELEASE_GUIDE.md) - リリース手順の詳細
- [COMMUNITY_PLUGIN_SUBMISSION.md](COMMUNITY_PLUGIN_SUBMISSION.md) - 申請の完全ガイド

## ❓ トラブルシューティング

### ビルドが失敗した
```bash
pnpm install
pnpm run build
```
でローカルビルドを確認してください。

### タグを間違えた
```bash
# ローカルのタグを削除
git tag -d v1.0.0

# リモートのタグを削除
git push origin :refs/tags/v1.0.0

# 正しいバージョンで再実行
npm version 1.0.0
git push origin main --tags
```

### その他の問題
[RELEASE_GUIDE.md](RELEASE_GUIDE.md) の「トラブルシューティング」セクションを参照してください。

---

**準備完了！** さっそくリリースしてみましょう！ 🚀
