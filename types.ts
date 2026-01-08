import { getTranslations } from './i18n';

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
 * サンプルテンプレートを取得
 * Get sample template based on current locale
 */
export function getSampleTemplate(): string {
	const translations = getTranslations();
	return translations.sample_template;
}

/**
 * サンプルテンプレート（デフォルト：英語）
 * Sample template (default: English)
 * @deprecated Use getSampleTemplate() instead to get the template for the current locale
 */
export const SAMPLE_TEMPLATE = `---
Title: {{title}}
Authors: {{authors}}
Published: {{published}}
Series: {{series}}
Volume: {{volume}}
ASIN: {{asin}}
ISBN-10: {{isbn10}}
ISBN-13: {{isbn13}}
Thumbnail: {{thumbnail}}
URL: {{url}}
Description: {{description_short}}
Created: {{created}}
---

{{thumbnail_display}}

## Description
{{description}}

## Notes
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
