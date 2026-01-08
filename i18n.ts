import { moment } from 'obsidian';
import { en, TranslationKey } from './locales/en';
import { ja } from './locales/ja';

type Translations = typeof en;

const translations: Record<string, Translations> = {
	en,
	ja,
};

/**
 * Get the current locale based on Obsidian's language setting
 */
export function getCurrentLocale(): string {
	// Get Obsidian's locale setting
	const obsidianLocale = moment.locale();
	
	// Map Obsidian locale to our supported locales
	// Obsidian uses 'ja' for Japanese, 'en' for English, etc.
	if (obsidianLocale.startsWith('ja')) {
		return 'ja';
	}
	
	// Default to English
	return 'en';
}

/**
 * Get translation for a key
 */
export function t(key: TranslationKey, params?: Record<string, string>): string {
	const locale = getCurrentLocale();
	const translation = translations[locale] || translations.en;
	
	let text = translation[key];
	
	// Replace placeholders like {{filename}} with actual values
	if (params) {
		Object.keys(params).forEach(paramKey => {
			text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), params[paramKey]);
		});
	}
	
	return text;
}

/**
 * Get the entire translation object for the current locale
 */
export function getTranslations(): Translations {
	const locale = getCurrentLocale();
	return translations[locale] || translations.en;
}
