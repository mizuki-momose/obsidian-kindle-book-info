# Obsidian Kindle Book Info Plugin

## プロジェクト概要
TypeScriptで開発するObsidianプラグイン。KindleのシェアURL（短縮URL含む）から書籍情報を取得し、テンプレートを使用してObsidianの新規ファイルを作成します。

## 開発環境
- **Volta**: Node.js、npm、pnpmのバージョン管理に使用
- セットアップ後は `volta install` で推奨バージョンが自動適用される

## アーキテクチャ
- **ベース**: Obsidianサンプルプラグインの構造を使用
- **言語**: TypeScript
- **主要機能**:
  - URL入力処理（通常URL・短縮URL対応）
  - OGP/HTMLパース機能
  - 書籍メタデータ抽出
  - テンプレートエンジン
  - Obsidianファイル作成API連携

## 取得する書籍情報
以下の情報をAmazon/KindleのURLから抽出します:
- `title`: 作品名
- `authors`: 著者（配列形式）
- `description`: 概要
- `published`: 発売日（YYYY-MM-DD）
- `asin`: ASIN（Amazon Standard Identification Number）
- `isbn10`: ISBN-10（存在する場合）
- `isbn13`: ISBN-13（存在する場合）
- `thumbnail`: サムネイル（URLまたはダウンロード画像）
- `url`: 正規化した商品URL（https://www.amazon.co.jp/dp/ASIN）
- `series`: シリーズ名（存在する場合）
- `volume`: 巻数（存在する場合）

## 技術的なポイント

### URL処理
- 短縮URL（`https://a.co/xxxxxxx`）のリダイレクト追跡が必要
- 最終的なAmazon商品ページURLの取得

### データ抽出方法
1. OGPタグ（`og:title`, `og:image`, `og:description`等）
2. JSON-LD（`@type: Book` を優先判定）
3. パンくず（`Kindleストア > Kindle本` または トップレベルが「本」）
4. HTML要素（商品詳細セクション、著者リンク等）
5. Kindle版から紙版のISBN補完（形式選択に「単行本/文庫/コミック/新書/ペーパーバック/Hardcover」を含む場合にASIN追跡）

### Obsidian統合
- `Plugin`クラスの継承
- `onload()`でコマンド登録
- `registerObsidianProtocolHandler('kindle-book-info', params)` によりURI呼出し対応（`obsidian://kindle-book-info?url=...`）
- Advanced URI経由の呼出し例: `obsidian://advanced-uri?vault=YourVaultName&uid=kindle-book-info&url=...`
- `vault.create()`で新規ファイル作成
- テンプレート設定のための`PluginSettingTab`実装

## 開発規約
- **エラーハンドリング**: ネットワークエラー、パースエラー、無効なURLに対する適切な通知
- **非同期処理**: `async/await`を使用してURL取得・パース処理
- **型安全性**: 書籍情報の型定義（interfaceまたはtype）を必ず作成
- **ユーザー設定**: テンプレートファイルパス、保存先フォルダ、画像ダウンロード有無、ファイル名テンプレート
- **UI/UX**:
  - デスクトップ: モーダル起動時にクリップボードからURLのみ自動入力（URL非含有なら未入力）
  - モバイル: 「クリップボードから検索」ボタンでURL抽出して即検索
  - キャンセルボタンは廃止、右上の閉じるボタンのみ

## 要件追加（2026年1月6日）

### 1. フォルダ選択UI の実装
- 設定画面の「保存先フォルダ」「画像保存フォルダ」はフリー入力ではなく、既存のディレクトリを参照して選ぶタイプに変更
- Obsidian APIの `FolderSuggest` または同等の機能を使用してフォルダを選択可能に

### 2. テンプレートファイル読み込み機能
- テンプレートは設定画面で直接編集するのではなく、指定した`.mdファイル`をテンプレートとして読み込む方式に変更
- 設定画面では「テンプレートファイルパス」を指定（例：`Templates/kindle-book-template.md`）
- サンプルテンプレートのプレビュー・リセット機能は設定画面に残す
- テンプレートファイルが見つからない場合はエラー通知

### 3. メタデータ + 見出し構造 での情報管理
- テンプレート内の情報をメタデータ（frontmatter）形式で管理
- **メタデータに含める情報**:
  - `タイトル`: 作品名（`{{title}}`）
  - `著者`: 著者（YAML配列 `{{authors}}`）
  - `発売日`: `{{published}}`
  - `シリーズ`: `{{series}}`
  - `巻数`: `{{volume}}`
  - `ASIN`: `{{asin}}`
  - `ISBN-10`: `{{isbn10}}`
  - `ISBN-13`: `{{isbn13}}`
  - `サムネイル`: 画像ファイル名またはURL（`{{thumbnail}}`）
  - `URL`: Amazon URL（`{{url}}`）
  - `概要`: 短縮概要（`{{description_short}}`）
  - `作成日`: `{{created}}`
  
- **概要の表示方法**:
  - 本文中に「## 概要」という見出しを作成
  - その下に完全な概要テキストを記載
  - サムネイルと概要の間に配置

**テンプレート例** (frontmatter + 本文):
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

## 要件追加（2026年1月7日）

### 1. URL入力モーダルの改修
- キャンセルボタンを削除（右上の閉じるボタンのみ）
- デスクトップ: クリップボードからURLのみ自動入力（非URLは無視）
- モバイル: 「クリップボードから検索」ボタン追加（URL抽出して即検索）

### 2. Advanced URI連携
- `registerObsidianProtocolHandler('kindle-book-info')` により `obsidian://kindle-book-info?url=...` で直接呼び出し可能
- `vault` パラメータ指定可（例: `obsidian://kindle-book-info?vault=VaultName&url=...`）
- Advanced URI経由: `obsidian://advanced-uri?vault=VaultName&uid=kindle-book-info&url=...`

### 3. ビルド出力
- ビルド成果物はプロジェクト直下（`./main.js`, `./manifest.json`, `./styles.css`）に配置

## 参考資料
- [Obsidian Plugin Developer Docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
