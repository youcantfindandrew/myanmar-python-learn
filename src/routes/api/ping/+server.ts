import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/db/supabase';
import { rateLimit, getClientIp } from '$lib/server/rate-limit';

// Keep-alive endpoint — Supabase pauses free-tier projects after 1 week of inactivity.
// A GitHub Actions cron calls this every 3 days to prevent pausing.
export const GET: RequestHandler = async ({ request }) => {
	// 5 requests per 15 minutes per IP — only the cron should ever call this
	const ip = getClientIp(request, request.headers);
	const rl = rateLimit(`ping:${ip}`, 5, 15 * 60 * 1000);
	if (!rl.ok) {
		return json({ ok: false }, {
			status: 429,
			headers: { 'Retry-After': String(rl.retryAfter) }
		});
	}

	await supabase.from('profiles').select('id').limit(1);
	return json({ ok: true, ts: new Date().toISOString() });
};
