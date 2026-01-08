# コミュニティプラグイン公開 チェックリスト

このプラグインをObsidianコミュニティプラグインとして公開するための準備が整っています。

## ✅ 完了している項目

### リポジトリ構造
- [x] `manifest.json` - すべての必須フィールドを含む
  - id, name, version, minAppVersion, description, author, authorUrl
- [x] `versions.json` - バージョン履歴管理
- [x] `LICENSE` - MITライセンス
- [x] `README.md` - 充実したドキュメント
  - インストール方法（コミュニティ＆手動）
  - 使い方
  - 設定項目
  - 機能説明
- [x] `.gitignore` - ビルド成果物を適切に除外

### ビルドシステム
- [x] TypeScript設定（`tsconfig.json`）
- [x] esbuild設定（`esbuild.config.mjs`）
- [x] パッケージ管理（`package.json`）
- [x] バージョン管理スクリプト（`version-bump.mjs`）
- [x] ビルドプロセスが正常動作

### 自動化
- [x] GitHub Actions ワークフロー（`.github/workflows/release.yml`）
  - タグpush時の自動ビルド
  - リリース自動作成
  - 必須ファイル自動添付

### ドキュメント
- [x] `RELEASE_GUIDE.md` - リリース手順の詳細説明
- [x] `COMMUNITY_PLUGIN_SUBMISSION.md` - 申請手順の完全ガイド

### プラグイン機能
- [x] コマンドパレット対応
- [x] リボンアイコン
- [x] Obsidian Protocol Handler（`obsidian://kindle-book-info`）
- [x] 設定画面（Setting Tab）
- [x] デスクトップ・モバイル対応

## 📋 次のステップ

### 1. 初回リリースの作成

```bash
# バージョン1.0.0でリリース
npm version 1.0.0

# GitHubにプッシュ
git push origin main
git push origin --tags
```

これにより：
1. `package.json`, `manifest.json`, `versions.json` が更新される
2. v1.0.0 タグが作成される
3. GitHub Actionsが自動でビルド・リリース作成
4. `main.js`, `manifest.json`, `styles.css` がリリースに添付される

### 2. リリースの確認と公開

1. [Actions](https://github.com/mizuki-momose/obsidian-kindle-book-info/actions) でワークフロー成功を確認
2. [Releases](https://github.com/mizuki-momose/obsidian-kindle-book-info/releases) でドラフトリリースを確認
3. リリースノートを追加:

```markdown
## 🎉 初回リリース

Obsidian Kindle Book Info v1.0.0 をリリースしました！

### 主な機能
- 📚 Kindle/Amazon URLから書籍情報を自動取得
- ✏️ カスタマイズ可能なテンプレート
- 🖼️ サムネイル画像のダウンロード
- 📱 デスクトップ・モバイル対応
- 🔗 Advanced URI連携

### インストール方法
手動インストールの手順は [README.md](https://github.com/mizuki-momose/obsidian-kindle-book-info#インストール) を参照してください。

コミュニティプラグインとしての公開準備中です。
```

4. 「Publish release」をクリック

### 3. プラグインのテスト（推奨）

リリース前に、実際のObsidian環境でテストすることをお勧めします：

1. テスト用Vaultを作成
2. `.obsidian/plugins/obsidian-kindle-book-info/` ディレクトリを作成
3. リリースファイル（`main.js`, `manifest.json`, `styles.css`）をコピー
4. Obsidianを再起動
5. プラグインを有効化
6. すべての機能をテスト:
   - コマンドパレットからの起動
   - リボンアイコンからの起動
   - URL入力と書籍情報取得
   - テンプレート適用
   - 設定画面の動作

### 4. コミュニティプラグイン申請

テストが完了したら、Obsidianコミュニティプラグインに申請：

詳細な手順は [COMMUNITY_PLUGIN_SUBMISSION.md](COMMUNITY_PLUGIN_SUBMISSION.md) を参照してください。

簡単な流れ:
1. [obsidian-releases](https://github.com/obsidianmd/obsidian-releases) をフォーク
2. `community-plugins.json` にエントリ追加
3. Pull Request作成
4. 審査待ち（数日〜数週間）

## 🎯 申請時の情報

### community-plugins.json エントリ

```json
{
  "id": "obsidian-kindle-book-info",
  "name": "Kindle Book Info",
  "author": "mizuki-momose",
  "description": "Fetch Kindle book information from share URLs and create notes with templates",
  "repo": "mizuki-momose/obsidian-kindle-book-info"
}
```

### プラグイン説明（PR用）

```markdown
Kindle/AmazonのURLから書籍情報を取得し、テンプレートを使用してObsidianのノートを自動作成するプラグインです。

**主な機能:**
- KindleシェアURL（短縮URL含む）からの書籍情報取得
- 書籍メタデータ（タイトル、著者、ASIN、ISBN等）の自動抽出
- カスタマイズ可能なテンプレート（外部.mdファイル）
- サムネイル画像のダウンロードと表示
- デスクトップ・モバイル両対応
- Advanced URI連携
```

## 📚 参考資料

- [RELEASE_GUIDE.md](RELEASE_GUIDE.md) - リリース作成の詳細手順
- [COMMUNITY_PLUGIN_SUBMISSION.md](COMMUNITY_PLUGIN_SUBMISSION.md) - 申請の完全ガイド
- [Obsidian Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- [Obsidian Plugin Submission](https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin)

## ⚠️ 注意事項

1. **初回リリースは慎重に**: 一度公開すると取り消しできません
2. **十分なテスト**: 複数の環境でテストしてください
3. **バージョン管理**: セマンティックバージョニングに従ってください
4. **ユーザーサポート**: Issues への対応を準備してください
5. **アップデート計画**: 定期的なメンテナンスを考慮してください

## 🚀 準備完了！

このチェックリストのすべての項目が完了しており、プラグインはコミュニティプラグインとして公開する準備が整っています。

上記の「次のステップ」に従って、リリースと申請を進めてください。

何か問題があれば、GitHubのIssuesでお知らせください。
