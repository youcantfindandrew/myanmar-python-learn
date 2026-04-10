import { writable } from 'svelte/store';
import type { Locale } from '$lib/i18n';

const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('locale') as Locale : null;

export const locale = writable<Locale>(stored || 'mm');

locale.subscribe((val) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('locale', val);
	}
});
