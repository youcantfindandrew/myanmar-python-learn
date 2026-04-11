/**
 * Server-side profile upsert using the admin (service role) client.
 *
 * Called by upsertProfile() in sync-engine.ts when a student registers or
 * a teacher signs up. The anon key cannot insert profiles because RLS requires
 * auth.uid() = id, but students/new teachers have no Supabase session yet.
 */
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase-admin';
import { rateLimit, getClientIp } from '$lib/server/rate-limit';

const VALID_ROLES = new Set(['student', 'teacher']);
const VALID_LANGUAGES = new Set(['en', 'mm']);

export const POST: RequestHandler = async ({ request }) => {
	// Auth routes: 5 per 15 minutes per IP (same as global auth limit)
	const ip = getClientIp(request, request.headers);
	const rl = rateLimit(`profile:${ip}`, 5, 15 * 60 * 1000);
	if (!rl.ok) {
		return json({ error: 'rate_limited' }, {
			status: 429,
			headers: { 'Retry-After': String(rl.retryAfter) }
		});
	}

	const body = await request.json().catch(() => null);
	if (!body) throw error(400, 'Invalid body');

	const { id, display_name, role, age_group, preferred_language, teacher_id, teacher_code } = body;

	// Validate required fields
	if (!id || typeof id !== 'string' || !/^[0-9a-f-]{36}$/.test(id)) {
		throw error(400, 'Invalid id');
	}
	if (!display_name || typeof display_name !== 'string' || display_name.length > 100) {
		throw error(400, 'Invalid display_name');
	}
	if (!VALID_ROLES.has(role)) {
		throw error(400, 'Invalid role');
	}
	if (preferred_language && !VALID_LANGUAGES.has(preferred_language)) {
		throw error(400, 'Invalid preferred_language');
	}
	if (teacher_id && (typeof teacher_id !== 'string' || !/^[0-9a-f-]{36}$/.test(teacher_id))) {
		throw error(400, 'Invalid teacher_id');
	}

	const profile: Record<string, unknown> = {
		id,
		display_name: display_name.trim(),
		role,
		age_group: typeof age_group === 'string' ? age_group.slice(0, 20) : '',
		preferred_language: preferred_language ?? 'mm'
	};
	if (teacher_id) profile.teacher_id = teacher_id;
	if (teacher_code && typeof teacher_code === 'string') profile.teacher_code = teacher_code.slice(0, 20);

	const { error: dbErr } = await supabaseAdmin
		.from('profiles')
		.upsert(profile, { onConflict: 'id' });

	if (dbErr) {
		console.error('[api/auth/profile] upsert error:', dbErr.message);
		throw error(500, 'Failed to save profile');
	}

	return json({ ok: true });
};
