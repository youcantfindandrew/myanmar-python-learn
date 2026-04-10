import en from './en.json';
import mm from './mm.json';

export type Locale = 'en' | 'mm';

const translations: Record<Locale, Record<string, any>> = { en, mm };

function getNestedValue(obj: any, path: string): string {
	return path.split('.').reduce((current, key) => current?.[key], obj) ?? path;
}

export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
	let text = getNestedValue(translations[locale], key);
	if (params) {
		for (const [k, v] of Object.entries(params)) {
			text = text.replace(`{${k}}`, String(v));
		}
	}
	return text;
}
