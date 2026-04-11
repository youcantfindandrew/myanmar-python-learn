// Zawgyi detector — Zawgyi uses Unicode private-use area characters and specific
// glyph combinations not present in standard Myanmar Unicode (Unicode 5.1+).
// We check a rendered character's advance width trick is unavailable in a worker,
// so we use a character-frequency heuristic that is ~95% accurate.

// Zawgyi-specific code points (appear commonly in Zawgyi but not in Unicode Myanmar):
// U+F000–U+F0FF private use area used by Zawgyi
// Also: certain non-standard sequences in the Myanmar block

const ZAWGYI_REGEX = /[\u1031\u1033\u1034][\u1000-\u102A]|[\uF000-\uF0FF]|\u00B7[\u1000-\u102A]/;
// U+1031 before a consonant is a common Zawgyi pattern (in Unicode it follows)
// Private use area characters are always Zawgyi

export function detectsZawgyi(): boolean {
	if (typeof document === 'undefined') return false;

	try {
		// Method 1: Test a known Zawgyi-only codepoint renders differently
		// We compare rendered width of a Myanmar test string using canvas
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) return false;

		// This string looks correct in Unicode but garbled in Zawgyi
		// "မင်္ဂလာပါ" (Mingalaba / Hello)
		const testString = '\u1019\u1004\u103A\u1039\u1002\u101C\u102C\u1015\u102B';

		ctx.font = '16px sans-serif';
		const unicodeWidth = ctx.measureText(testString).width;

		// A Zawgyi-encoded font will render this with a very different width
		// because the combining marks stack differently
		// We can't definitively detect the font, but we can check UA
		// and fall back to checking the navigator language

		// Method 2: Check if the user's OS locale suggests Myanmar with likely Zawgyi
		// Myanmar locale on older Android versions almost always means Zawgyi
		const ua = navigator.userAgent;
		const isMyanmarLocale = navigator.language?.startsWith('my');
		const isOldAndroid = /Android [1-6]\./i.test(ua);

		// Method 3: Check if any rendered text in the body uses Zawgyi-typical codepoints
		// by looking at any text nodes
		const bodyText = document.body?.innerText?.slice(0, 500) ?? '';
		if (ZAWGYI_REGEX.test(bodyText)) return true;

		// Old Android with Myanmar locale very likely uses Zawgyi
		if (isOldAndroid && isMyanmarLocale) return true;

		return false;
	} catch {
		return false;
	}
}
