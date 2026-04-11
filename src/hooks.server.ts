import type { Handle } from '@sveltejs/kit';
import { rateLimit, getClientIp } from '$lib/server/rate-limit';

// Supabase project URL host (for CSP connect-src)
// We derive it at module load time — only the host part is needed.
const SUPABASE_HOST = (() => {
	try {
		// PUBLIC_SUPABASE_URL is inlined by Vite at build time via $env/static/public,
		// but hooks.server.ts runs at runtime too. Grab it from the process env directly.
		const url = process.env.PUBLIC_SUPABASE_URL ?? '';
		return url ? new URL(url).host : '*.supabase.co';
	} catch {
		return '*.supabase.co';
	}
})();

const CSP = [
	"default-src 'self'",
	// SvelteKit inlines small style chunks; Pyodide worker needs eval for WASM compilation
	"script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net",
	"style-src 'self' 'unsafe-inline'",
	// Pyodide WASM + CDN assets, Supabase, Groq (via our own /api/ai/hint proxy)
	`connect-src 'self' https://${SUPABASE_HOST} wss://${SUPABASE_HOST} https://cdn.jsdelivr.net`,
	"font-src 'self'",
	"img-src 'self' data:",
	// Workers need blob: for Pyodide
	"worker-src 'self' blob:",
	"frame-ancestors 'none'",
	"form-action 'self'",
	"base-uri 'self'"
].join('; ');

export const handle: Handle = async ({ event, resolve }) => {
	const ip = getClientIp(event.request, event.request.headers);
	const path = event.url.pathname;

	// Strict limit for auth routes: 5 per 15 minutes
	if (path.startsWith('/api/auth')) {
		const rl = rateLimit(`auth:${ip}`, 5, 15 * 60 * 1000);
		if (!rl.ok) {
			return new Response(
				JSON.stringify({ error: 'Too many login attempts. Please wait before trying again.' }),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': String(rl.retryAfter)
					}
				}
			);
		}
	}

	// General API limit: 200 requests per 15 minutes per IP
	if (path.startsWith('/api/')) {
		const rl = rateLimit(`api:${ip}`, 200, 15 * 60 * 1000);
		if (!rl.ok) {
			return new Response(
				JSON.stringify({ error: 'Rate limit exceeded. Please slow down.' }),
				{
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': String(rl.retryAfter)
					}
				}
			);
		}
	}

	const response = await resolve(event);

	response.headers.set('Content-Security-Policy', CSP);
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	return response;
};
