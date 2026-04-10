import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/db/supabase';

// Keep-alive endpoint — Supabase pauses free-tier projects after 1 week of inactivity.
// A GitHub Actions cron calls this every 3 days to prevent pausing.
export const GET: RequestHandler = async () => {
	await supabase.from('profiles').select('id').limit(1);
	return json({ ok: true, ts: new Date().toISOString() });
};
