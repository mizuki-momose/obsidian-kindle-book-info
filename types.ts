/**
 * 書籍情報の型定義
 */
export interface BookInfo {
	/** 作品名 */
	title: string;
	/** 著者（配列形式） */
	authors: string[];
	/** 概要 */
	description: string;
	/** 公開日 */
	published: string;
	/** ASIN (Amazon Standard Identification Number) */
	asin: string;
	/** ISBN-10(紙の書籍が存在する場合) */
	isbn10: string;
	/** ISBN-13(紙の書籍が存在する場合) */
	isbn13: string;
	/** サムネイルURL */
	thumbnail: string;
	/** 元のURL */
	url: string;
	/** シリーズ名 */
	series: string;
	/** 巻数 */
	volume: string;
}

/**
 * プラグイン設定の型定義
 */
export interface KindleBookInfoSettings {
	/** ファイルの保存先フォルダパス */
	targetFolder: string;
	/** 画像の保存先フォルダパス */
	imageFolder: string;
	/** 画像をダウンロードするかどうか */
	downloadImages: boolean;
	/** ファイル名のテンプレート */
	filenameTemplate: string;
	/** テンプレートファイルのパス */
	templateFilePath: string;
	/** リボンアイコンを表示するかどうか */
	showRibbonIcon: boolean;
}

/**
 * サンプルテンプレート
 */
export const SAMPLE_TEMPLATE = `---
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

{{thumbnail_display}}

## 概要
{{description}}

## メモ
`;

/**
 * デフォルト設定
 */
export const DEFAULT_SETTINGS: KindleBookInfoSettings = {
	targetFolder: 'Books',
	imageFolder: 'Books/Covers',
	downloadImages: true,
	filenameTemplate: '{{title}}',
	templateFilePath: '',
	showRibbonIcon: false,
};
