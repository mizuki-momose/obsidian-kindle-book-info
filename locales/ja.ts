/**
 * Japanese translations
 */
export const ja = {
	// Modal
	modal_title: 'Kindle書籍URLを入力',
	modal_description: 'KindleのURLを入力してください。',
	modal_clipboard_button: 'クリップボードから検索',
	modal_search_button: '検索',
	
	// Notices
	notice_fetching: '書籍情報を取得中...',
	notice_creating: 'ノートを作成中...',
	notice_created: '✓ ノート「{{filename}}」を作成しました',
	notice_error: 'エラー: {{message}}',
	notice_timeout: '通信がタイムアウトしました。接続を確認してからお試しください。',
	notice_no_url: 'URLが見つかりません',
	notice_clipboard_empty: 'クリップボードが空です',
	notice_clipboard_failed: 'クリップボードの読み取りに失敗しました',
	notice_enter_url: 'URLを入力してください',
	
	// Errors
	error_asin_extract: '短縮URLからASINを抽出できませんでした',
	error_not_book: 'このURLは書籍ではありません。Kindle本または紙書籍の商品ページURLをご使用ください。',
	error_asin_failed: 'ASINの取得に失敗しました',
	error_fetch_failed: '書籍情報の取得に失敗しました: {{message}}',
	error_unknown: '不明なエラーが発生しました',
	error_paperback_isbn: '紙の本のページからISBN取得エラー:',
	
	// Commands
	command_create_note: 'Kindle書籍ノートを作成',
	
	// Ribbon
	ribbon_create_note: 'Kindle書籍ノートを作成',
	
	// Settings
	settings_title: 'Kindle Book Info Settings',
	settings_target_folder_name: '保存先フォルダ',
	settings_target_folder_desc: '作成したノートの保存先フォルダ（入力欄をクリックしてリストから選択）',
	settings_filename_template_name: 'ファイル名テンプレート',
	settings_filename_template_desc: 'ファイル名のテンプレート（使用可能: {{title}}, {{asin}}, {{isbn10}}, {{isbn13}}）',
	settings_template_file_name: 'テンプレートファイル',
	settings_template_file_desc: 'ノート作成時に使用するテンプレートファイル（空欄の場合はサンプルテンプレートが使用されます）',
	settings_download_images_name: '画像をダウンロード',
	settings_download_images_desc: 'サムネイル画像をVaultにダウンロードする',
	settings_image_folder_name: '画像保存フォルダ',
	settings_image_folder_desc: 'ダウンロードした画像の保存先フォルダ（入力欄をクリックしてリストから選択）',
	settings_show_ribbon_icon_name: 'リボンアイコンを表示',
	settings_show_ribbon_icon_desc: '左側のリボンエリアにKindle書籍ノート作成アイコンを表示する（変更後、Obsidianを再起動してください）',
	settings_sample_template_title: 'サンプルテンプレート',
	settings_sample_template_placeholders: `
		<p>使用可能なプレースホルダー:</p>
		<ul>
			<li><code>{{title}}</code> - タイトル</li>
			<li><code>{{authors}}</code> - 著者（YAML配列形式）</li>
			<li><code>{{published}}</code> - 発売日</li>
			<li><code>{{series}}</code> - シリーズ</li>
			<li><code>{{volume}}</code> - 巻数</li>
			<li><code>{{asin}}</code> - ASIN</li>
			<li><code>{{isbn10}}</code> - ISBN-10</li>
			<li><code>{{isbn13}}</code> - ISBN-13</li>
			<li><code>{{thumbnail}}</code> - サムネイル</li>
			<li><code>{{thumbnail_display}}</code> - サムネイル（表示形式）</li>
			<li><code>{{url}}</code> - URL</li>
			<li><code>{{description}}</code> - 概要（全文）</li>
			<li><code>{{description_short}}</code> - 概要（短縮）</li>
			<li><code>{{created}}</code> - 作成日</li>
		</ul>
		<p>条件付きブロック: <code>{{#isbn10}}...{{/isbn10}}</code>, <code>{{#isbn13}}...{{/isbn13}}</code></p>
	`,
	settings_reset_name: 'デフォルトに戻す',
	settings_reset_desc: '設定をデフォルトに戻します',
	settings_reset_button: 'リセット',
	
	// Sample template
	sample_template: `---
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
`,

	// Template metadata keys (Japanese versions)
	template_title: 'タイトル',
	template_authors: '著者',
	template_published: '発売日',
	template_series: 'シリーズ',
	template_volume: '巻数',
	template_asin: 'ASIN',
	template_isbn10: 'ISBN-10',
	template_isbn13: 'ISBN-13',
	template_thumbnail: 'サムネイル',
	template_url: 'URL',
	template_description: '概要',
	template_created: '作成日',
	template_description_heading: '## 概要',
	template_notes_heading: '## メモ',
};
