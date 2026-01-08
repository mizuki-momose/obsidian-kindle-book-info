# Obsidian Kindle Book Info

Kindle/AmazonのURLから書籍情報を取り込み、テンプレートでノートを作成します。短縮URL（a.co）にも対応します。

## できること
- URLを入れるだけで書籍ノートを自動作成
- 必要な情報をFrontmatterに保存（タイトル/著者/発売日/ASIN/ISBN/URLなど）
- サムネイル表示と概要セクションの自動挿入
- テンプレートは外部の.mdファイルを読み込み（設定で指定）

## インストール

### コミュニティプラグインから（推奨）
1. Obsidianの設定を開く
2. 「コミュニティプラグイン」→「閲覧」をクリック
3. "Kindle Book Info" を検索
4. インストールして有効化

### 手動インストール
- GitHubの [Releases](https://github.com/mizuki-momose/obsidian-kindle-book-info/releases) から `main.js`・`manifest.json`・`styles.css` をダウンロード
- Vaultの `.obsidian/plugins/obsidian-kindle-book-info/` に配置してObsidianを再起動

## 使い方
- デスクトップ: モーダル起動時にクリップボードのURLを自動入力（URLが含まれない場合は未入力のまま）
- モバイル: モーダルの「クリップボードから検索」ボタンでURL抽出→即検索
- コマンドパレットから起動、またはリボンアイコンで起動

## 保存される情報（Frontmatter）
以下のキーで保存されます（テンプレート例参照）。
- タイトル: {{title}}
- 著者: {{authors}}（YAML配列）
- 発売日: {{published}}
- シリーズ: {{series}}
- 巻数: {{volume}}
- ASIN: {{asin}}
- ISBN-10: {{isbn10}}
- ISBN-13: {{isbn13}}
- サムネイル: {{thumbnail}}
- URL: {{url}}
- 概要: {{description_short}}
- 作成日: {{created}}

## テンプレート例
設定でテンプレートファイル（例: Templates/kindle-book-template.md）を指定してください。

```yaml
---
タイトル: {{title}}
著者: {{authors}}
発売日: {{published}}
シリーズ: {{series}}
巻数: {{volume}}
ASIN: {{asin}}
ISBN-10: {{isbn10}}
ISBN-13: {{isbn13}}
サムネイル: {{thumbnail}}
URL: {{url}}
概要: {{description_short}}
作成日: {{created}}
---

## サムネイル
{{thumbnail_display}}

## 概要
{{description}}

## メモ
```

## Advanced URI（任意）
- 直接呼び出し: obsidian://kindle-book-info?url=https://a.co/xxxx
- Vault指定: obsidian://kindle-book-info?vault=VaultName&url=https://www.amazon.co.jp/dp/ASIN
- Advanced URI経由: obsidian://advanced-uri?vault=VaultName&uid=kindle-book-info&url=...

## 設定項目
- 保存先フォルダ/画像保存フォルダ: 既存フォルダから選択（フォルダサジェスト）
- テンプレートファイルパス: 読み込む.mdテンプレートのパス
- 画像ダウンロード: サムネイルをVaultへ保存するか
- ファイル名テンプレート: 例）{{title}} - {{authors}}

## 補足
- 書籍判定はJSON-LDの`@type: Book`とパンくず（Kindleストア>Kindle本、またはトップが「本」）を利用
- 紙版のISBNは形式選択からASINを辿って補完（単行本/文庫/コミック/新書/ペーパーバック/Hardcover）
- 対応バージョン: Obsidian 0.15.0 以上（デスクトップ/モバイル対応）
- プライバシー: Amazonのページ取得に外部アクセスしますが、Vault内の内容は外部へ送信しません

## 開発

### セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発ビルド（ウォッチモード）
pnpm run dev

# プロダクションビルド
pnpm run build
```

### ビルド出力
ビルド成果物はプロジェクト直下に生成されます:
- `./main.js` - プラグイン本体
- `./manifest.json` - プラグインマニフェスト
- `./styles.css` - スタイルシート

## 貢献

バグ報告や機能提案は [Issues](https://github.com/mizuki-momose/obsidian-kindle-book-info/issues) でお願いします。
Pull Requestも歓迎です！

## ライセンス
MIT
