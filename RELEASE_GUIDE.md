# リリースガイド

このドキュメントは、Obsidian Kindle Book Info プラグインの新しいバージョンをリリースする手順を説明します。

## 前提条件

- リポジトリへのプッシュ権限
- ローカル環境でビルドが成功すること
- 変更内容のテストが完了していること

## リリース手順

### 1. バージョン番号の更新

`package.json`、`manifest.json`、`versions.json` のバージョン番号を更新します。

```bash
# バージョンを更新（例: 1.0.1）
npm version patch  # パッチバージョンアップ (1.0.0 -> 1.0.1)
# または
npm version minor  # マイナーバージョンアップ (1.0.0 -> 1.1.0)
# または
npm version major  # メジャーバージョンアップ (1.0.0 -> 2.0.0)
```

このコマンドは以下を自動的に実行します:
- `package.json` のバージョン更新
- `version-bump.mjs` スクリプトの実行（`manifest.json` と `versions.json` を更新）
- 変更のコミット
- Gitタグの作成

### 2. 変更をGitHubにプッシュ

```bash
# 変更とタグをプッシュ
git push origin main
git push origin --tags
```

### 3. GitHub Actionsの確認

タグがプッシュされると、GitHub Actionsが自動的に:
1. プラグインをビルド
2. `main.js`、`manifest.json`、`styles.css` を含むドラフトリリースを作成

[GitHub Actions](https://github.com/mizuki-momose/obsidian-kindle-book-info/actions) でワークフローの実行状況を確認できます。

### 4. リリースノートの作成と公開

1. [Releases ページ](https://github.com/mizuki-momose/obsidian-kindle-book-info/releases) にアクセス
2. 作成されたドラフトリリースを開く
3. リリースノートを追加（変更内容、新機能、バグ修正など）
4. 「Publish release」をクリックして公開

## リリースノートの例

```markdown
## 新機能
- 〇〇機能を追加

## 改善
- △△のパフォーマンスを向上

## バグ修正
- □□の問題を修正

## その他
- ドキュメントの更新
```

## 初回リリース（コミュニティプラグイン申請前）

初回リリースの場合は、以下の手順も実行してください:

### 1. リリースの作成（上記手順に従う）

### 2. コミュニティプラグイン申請

1. [obsidian-releases リポジトリ](https://github.com/obsidianmd/obsidian-releases) をフォーク
2. `community-plugins.json` に以下を追加:

```json
{
  "id": "obsidian-kindle-book-info",
  "name": "Kindle Book Info",
  "author": "mizuki-momose",
  "description": "Fetch Kindle book information from share URLs and create notes with templates",
  "repo": "mizuki-momose/obsidian-kindle-book-info"
}
```

3. Pull Requestを作成
4. PR説明に以下を含める:
   - プラグインの概要
   - 主な機能
   - スクリーンショット（可能であれば）

### 3. 審査待ち

Obsidianチームによる審査が完了すると、コミュニティプラグインとして公開されます。
通常、数日から数週間かかることがあります。

## トラブルシューティング

### ビルドエラーが発生した場合

```bash
# 依存関係を再インストール
pnpm install

# ビルドを実行
pnpm run build
```

### バージョン番号を間違えた場合

```bash
# タグを削除（ローカル）
git tag -d v1.0.1

# タグを削除（リモート）
git push origin :refs/tags/v1.0.1

# 正しいバージョンで再実行
npm version patch
git push origin main
git push origin --tags
```

## 参考資料

- [Obsidian Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)
- [Obsidian Plugin Developer Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [obsidian-releases リポジトリ](https://github.com/obsidianmd/obsidian-releases)
