/**
 * English translations
 */
export const en = {
	// Modal
	modal_title: 'Enter kindle book URL',
	modal_description: 'Please enter the kindle book URL.',
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
	error_asin_extract: 'Could not extract asin from short URL',
	error_not_book: 'This URL is not a book. Please use a kindle book or paper book product page URL.',
	error_asin_failed: 'Failed to get asin',
	error_fetch_failed: 'Failed to fetch book information: {{message}}',
	error_unknown: 'An unknown error occurred',
	error_paperback_isbn: 'Error fetching isbn from paperback page:',
	
	// Commands
	command_create_note: 'Create kindle book note',
	
	// Ribbon
	ribbon_create_note: 'Create kindle book note',
	
	// Settings
	settings_title: 'Kindle book info settings',
	settings_target_folder_name: 'Target folder',
	settings_target_folder_desc: 'Folder to save created notes (click the input field to select from list)',
	settings_filename_template_name: 'Filename template',
	settings_filename_template_desc: 'Template for filename (Available: {{title}}, {{asin}}, {{isbn10}}, {{isbn13}})',
	settings_template_file_name: 'Template file',
	settings_template_file_desc: 'Template file used when creating notes (if empty, sample template will be used)',
	settings_download_images_name: 'Download images',
	settings_download_images_desc: 'Download thumbnail images to the vault',
	settings_image_folder_name: 'Image save folder',
	settings_image_folder_desc: 'Folder to save downloaded images (click the input field to select from list)',
	settings_show_ribbon_icon_name: 'Show ribbon icon',
	settings_show_ribbon_icon_desc: 'Display kindle book note creation icon in the left ribbon area (requires obsidian restart after change)',
	settings_sample_template_title: 'Sample template',
	settings_sample_template_intro: 'Available placeholders:',
	settings_conditional_blocks: 'Conditional blocks: {{#isbn10}}...{{/isbn10}}, {{#isbn13}}...{{/isbn13}}',
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
isbn-10: {{isbn10}}
isbn-13: {{isbn13}}
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
	template_asin: 'asin',
	template_isbn10: 'isbn-10',
	template_isbn13: 'isbn-13',
	template_thumbnail: 'Thumbnail',
	template_url: 'URL',
	template_description: 'Description',
	template_created: 'Created',
	template_description_heading: '## Description',
	template_notes_heading: '## Notes',
};

export type TranslationKey = keyof typeof en;

/**
 * Placeholder definitions for settings page
 */
export const placeholders_en = [
	{ key: '{{title}}', desc: 'Title' },
	{ key: '{{authors}}', desc: 'Authors' },
	{ key: '{{published}}', desc: 'Publication date' },
	{ key: '{{series}}', desc: 'Series' },
	{ key: '{{volume}}', desc: 'Volume' },
	{ key: '{{asin}}', desc: 'asin' },
	{ key: '{{isbn10}}', desc: 'isbn-10' },
	{ key: '{{isbn13}}', desc: 'isbn-13' },
	{ key: '{{thumbnail}}', desc: 'Thumbnail' },
	{ key: '{{thumbnail_display}}', desc: 'Thumbnail (display format)' },
	{ key: '{{url}}', desc: 'URL' },
	{ key: '{{description}}', desc: 'Description (full)' },
	{ key: '{{description_short}}', desc: 'Description (short)' },
	{ key: '{{created}}', desc: 'Created date' },
];
