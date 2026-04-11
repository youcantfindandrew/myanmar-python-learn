/**
 * Server-only Supabase client using the service role key.
 *
 * NEVER import this in client-side code. The service role key bypasses
 * RLS entirely — all authorization checks must be done explicitly in the
 * calling code before using this client to write data.
 *
 * Required env var: SUPABASE_SERVICE_ROLE_KEY
 * Found in: Supabase dashboard → Project Settings → API → service_role key
 */
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!serviceRoleKey) {
	console.warn(
		'[supabase-admin] SUPABASE_SERVICE_ROLE_KEY is not set. ' +
		'Server-side sync writes will fail. Add this key to your .env and Vercel environment variables.'
	);
}

export const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, serviceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});
