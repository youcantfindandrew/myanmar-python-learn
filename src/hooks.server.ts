import type { Handle } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { rateLimit, getClientIp } from '$lib/server/rate-limit';

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

	return resolve(event);
};
