/**
 * In-memory rate limiter for SvelteKit server routes.
 *
 * Each Vercel serverless function instance is single-request, so the Map
 * is ephemeral but still effective for burst protection within a single
 * cold-start lifetime. For stricter enforcement across instances, swap
 * the store for a KV (Vercel KV, Upstash Redis, etc.).
 */

interface Window {
	count: number;
	resetAt: number;
}

const store = new Map<string, Window>();

/**
 * Check and record a rate-limit hit.
 *
 * @param key      Unique key, e.g. IP + route
 * @param limit    Max requests allowed in the window
 * @param windowMs Window size in milliseconds
 * @returns `{ ok: true }` when allowed, `{ ok: false, retryAfter }` when blocked
 */
export function rateLimit(
	key: string,
	limit: number,
	windowMs: number
): { ok: true } | { ok: false; retryAfter: number } {
	const now = Date.now();

	// Prune expired entries to avoid unbounded growth
	if (store.size > 10_000) {
		for (const [k, w] of store) {
			if (w.resetAt < now) store.delete(k);
		}
	}

	let win = store.get(key);
	if (!win || win.resetAt < now) {
		win = { count: 0, resetAt: now + windowMs };
		store.set(key, win);
	}

	win.count++;
	if (win.count > limit) {
		return { ok: false, retryAfter: Math.ceil((win.resetAt - now) / 1000) };
	}
	return { ok: true };
}

/**
 * Extract client IP from a SvelteKit RequestEvent, checking
 * the standard Vercel/Cloudflare forwarded headers first.
 */
export function getClientIp(request: Request, headers: Headers): string {
	return (
		headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
		headers.get('cf-connecting-ip') ??
		'unknown'
	);
}
