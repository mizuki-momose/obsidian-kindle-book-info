/**
 * English translations
 */
export const en = {
	// Modal
	modal_title: 'Enter Kindle Book URL',
	modal_description: 'Please enter the Kindle URL.',
	modal_clipboard_button: 'Search from clipboard',
	modal_search_button: 'Search',
	
	// Notices
	notice_fetching: 'Fetching book information...',
	notice_creating: 'Creating note...',
	notice_created: '✓ Note "{{filename}}" created',
	notice_error: 'Error: {{message}}',
	notice_timeout: 'Communication timed out. Please check your connection and try again.',
	notice_no_url: 'URL not found',
	notice_clipboard_empty: 'Clipboard is empty',
	notice_clipboard_failed: 'Failed to read clipboard',
	notice_enter_url: 'Please enter a URL',
	
	// Errors
	error_asin_extract: 'Could not extract ASIN from short URL',
	error_not_book: 'This URL is not a book. Please use a Kindle book or paper book product page URL.',
	error_asin_failed: 'Failed to get ASIN',
	error_fetch_failed: 'Failed to fetch book information: {{message}}',
	error_unknown: 'An unknown error occurred',
	error_paperback_isbn: 'Error fetching ISBN from paperback page:',
	
	// Commands
	command_create_note: 'Create Kindle Book Note',
	
	// Ribbon
	ribbon_create_note: 'Create Kindle Book Note',
	
	// Settings
	settings_title: 'Kindle Book Info Settings',
	settings_target_folder_name: 'Target folder',
	settings_target_folder_desc: 'Folder to save created notes (click the input field to select from list)',
	settings_filename_template_name: 'Filename template',
	settings_filename_template_desc: 'Template for filename (Available: {{title}}, {{asin}}, {{isbn10}}, {{isbn13}})',
	settings_template_file_name: 'Template file',
	settings_template_file_desc: 'Template file used when creating notes (if empty, sample template will be used)',
	settings_download_images_name: 'Download images',
	settings_download_images_desc: 'Download thumbnail images to the Vault',
	settings_image_folder_name: 'Image save folder',
	settings_image_folder_desc: 'Folder to save downloaded images (click the input field to select from list)',
	settings_show_ribbon_icon_name: 'Show ribbon icon',
	settings_show_ribbon_icon_desc: 'Display Kindle book note creation icon in the left ribbon area (requires Obsidian restart after change)',
	settings_sample_template_title: 'Sample Template',
	settings_sample_template_placeholders: `
		<p>Available placeholders:</p>
		<ul>
			<li><code>{{title}}</code> - Title</li>
			<li><code>{{authors}}</code> - Authors (YAML array format)</li>
			<li><code>{{published}}</code> - Publication date</li>
			<li><code>{{series}}</code> - Series</li>
			<li><code>{{volume}}</code> - Volume</li>
			<li><code>{{asin}}</code> - ASIN</li>
			<li><code>{{isbn10}}</code> - ISBN-10</li>
			<li><code>{{isbn13}}</code> - ISBN-13</li>
			<li><code>{{thumbnail}}</code> - Thumbnail</li>
			<li><code>{{thumbnail_display}}</code> - Thumbnail (display format)</li>
			<li><code>{{url}}</code> - URL</li>
			<li><code>{{description}}</code> - Description (full)</li>
			<li><code>{{description_short}}</code> - Description (short)</li>
			<li><code>{{created}}</code> - Created date</li>
		</ul>
		<p>Conditional blocks: <code>{{#isbn10}}...{{/isbn10}}</code>, <code>{{#isbn13}}...{{/isbn13}}</code></p>
	`,
	settings_reset_name: 'Reset to default',
	settings_reset_desc: 'Reset settings to default',
	settings_reset_button: 'Reset',
	
	// Sample template
	sample_template: `---
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
`,

	// Template metadata keys (English versions)
	template_title: 'Title',
	template_authors: 'Authors',
	template_published: 'Published',
	template_series: 'Series',
	template_volume: 'Volume',
	template_asin: 'ASIN',
	template_isbn10: 'ISBN-10',
	template_isbn13: 'ISBN-13',
	template_thumbnail: 'Thumbnail',
	template_url: 'URL',
	template_description: 'Description',
	template_created: 'Created',
	template_description_heading: '## Description',
	template_notes_heading: '## Notes',
};

export type TranslationKey = keyof typeof en;
