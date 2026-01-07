import { BookInfo } from './types';

/**
 * 文字列を指定文字数で短縮
 */
function truncateText(text: string, length: number): string {
	if (text.length <= length) {
		return text;
	}
	return text.substring(0, length) + '...';
}

/**
 * 書籍情報からメタデータ用の短い概要を生成
 */
export function generateDescriptionShort(description: string): string {
	return truncateText(description.trim(), 100);
}

/**
 * 簡易的なテンプレートエンジン
 * Mustache風の記法をサポート
 */
export function renderTemplate(template: string, data: BookInfo): string {
	let result = template;
	
	// 短い概要を生成
	const descriptionShort = generateDescriptionShort(data.description);
	
	// 作成日を生成（今日の日付をYYYY-MM-DD形式で）
	const today = new Date();
	const created = today.toISOString().split('T')[0];
	
	// 著者のフォーマット（YAMLリスト形式）
	const authors = data.authors.length === 1 
		? `"${data.authors[0]}"`
		: `[${data.authors.map(a => `"${a}"`).join(', ')}]`;
	
	// サムネイルの表示形式を判定（URL形式かローカルファイル名か）
	const isLocalThumbnail = !data.thumbnail.startsWith('http');
	const thumbnailDisplay = isLocalThumbnail 
		? `![[${data.thumbnail}]]`  // ローカルファイル: Wikiリンク
		: `![](${data.thumbnail})`; // URL: Markdown画像リンク
	
	// 通常のプレースホルダー {{key}}
	result = result.replace(/\{\{title\}\}/g, data.title);
	result = result.replace(/\{\{authors\}\}/g, authors);
	result = result.replace(/\{\{description\}\}/g, data.description);
	result = result.replace(/\{\{description_short\}\}/g, descriptionShort);
	result = result.replace(/\{\{published\}\}/g, data.published);
	result = result.replace(/\{\{created\}\}/g, created);
	result = result.replace(/\{\{asin\}\}/g, data.asin);
	result = result.replace(/\{\{isbn10\}\}/g, data.isbn10 || '');
	result = result.replace(/\{\{isbn13\}\}/g, data.isbn13 || '');
	result = result.replace(/\{\{thumbnail_display\}\}/g, thumbnailDisplay);
	result = result.replace(/\{\{thumbnail\}\}/g, data.thumbnail);
	result = result.replace(/\{\{url\}\}/g, data.url);
	result = result.replace(/\{\{series\}\}/g, data.series);
	result = result.replace(/\{\{volume\}\}/g, data.volume);
	
	// 条件付きブロック {{#isbn10}}...{{/isbn10}}
	if (data.isbn10) {
		result = result.replace(/\{\{#isbn10\}\}([\s\S]*?)\{\{\/isbn10\}\}/g, (_, content) => {
			return content.replace(/\{\{isbn10\}\}/g, data.isbn10);
		});
	} else {
		result = result.replace(/\{\{#isbn10\}\}[\s\S]*?\{\{\/isbn10\}\}/g, '');
	}
	
	// 条件付きブロック {{#isbn13}}...{{/isbn13}}
	if (data.isbn13) {
		result = result.replace(/\{\{#isbn13\}\}([\s\S]*?)\{\{\/isbn13\}\}/g, (_, content) => {
			return content.replace(/\{\{isbn13\}\}/g, data.isbn13);
		});
	} else {
		result = result.replace(/\{\{#isbn13\}\}[\s\S]*?\{\{\/isbn13\}\}/g, '');
	}
	
	return result;
}

/**
 * ファイル名として使用できない文字を除去
 */
export function sanitizeFilename(filename: string): string {
	return filename
		.replace(/[\\/:*?"<>|]/g, '-')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * ファイル名テンプレートをレンダリング
 */
export function renderFilename(template: string, data: BookInfo): string {
	let filename = template;
	filename = filename.replace(/\{\{title\}\}/g, data.title);
	filename = filename.replace(/\{\{authors\}\}/g, data.authors.join(', '));
	filename = filename.replace(/\{\{asin\}\}/g, data.asin);
	
	return sanitizeFilename(filename);
}
