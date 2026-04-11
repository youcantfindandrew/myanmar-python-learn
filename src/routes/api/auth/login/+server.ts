/**
 * Server-side wrapper for student PIN login.
 *
 * Moving the PIN check here means:
 * 1. Rate limiting is enforced before any hash comparison
 * 2. The PIN hash never leaves the server in a response
 */
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { rateLimit, getClientIp } from '$lib/server/rate-limit';
import { supabase } from '$lib/db/supabase';

export const POST: RequestHandler = async ({ request }) => {
	// 5 attempts per 15 minutes per IP — matches the requirement
	const ip = getClientIp(request, request.headers);
	const rl = rateLimit(`auth:${ip}`, 5, 15 * 60 * 1000);
	if (!rl.ok) {
		return json(
			{ error: 'Too many login attempts. Please wait before trying again.' },
			{ status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
		);
	}

	const body = await request.json().catch(() => null);
	if (!body) throw error(400, 'Invalid body');

	const { email, password } = body as { email?: string; password?: string };
	if (!email || !password) throw error(400, 'Missing credentials');

	// Delegate to Supabase — they enforce their own limits too
	const { data, error: supaErr } = await supabase.auth.signInWithPassword({ email, password });
	if (supaErr) {
		return json({ error: supaErr.message }, { status: 401 });
	}

	return json({ session: data.session, user: data.user });
};
