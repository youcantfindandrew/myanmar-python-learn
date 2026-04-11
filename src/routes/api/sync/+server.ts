import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase-admin';
import { rateLimit, getClientIp } from '$lib/server/rate-limit';

const ALLOWED_TABLES = new Set(['progress', 'attempts', 'daily_activity']);
const MAX_CODE_LENGTH = 50_000; // characters
const MAX_ITEMS_PER_BATCH = 100;

interface SyncItem {
	id: string;
	table: 'progress' | 'attempts' | 'daily_activity';
	operation: 'upsert' | 'insert';
	data: Record<string, unknown>;
}

export const POST: RequestHandler = async ({ request }) => {
	// 60 sync batches per 15 minutes per IP (generous for offline catch-up)
	const ip = getClientIp(request, request.headers);
	const rl = rateLimit(`sync:${ip}`, 60, 15 * 60 * 1000);
	if (!rl.ok) {
		return json({ ok: false, error: 'rate_limited' }, {
			status: 429,
			headers: { 'Retry-After': String(rl.retryAfter) }
		});
	}

	const body = await request.json().catch(() => null);
	if (!body || !Array.isArray(body.items)) {
		throw error(400, 'Invalid payload');
	}

	if (body.items.length > MAX_ITEMS_PER_BATCH) {
		throw error(400, `Batch too large (max ${MAX_ITEMS_PER_BATCH} items)`);
	}

	// Validate and extract the student_id — must be the same for all items
	// (one sync call is always for one student)
	const studentId = body.items[0]?.data?.student_id;
	if (!studentId || typeof studentId !== 'string') {
		throw error(400, 'Missing student_id');
	}

	// Verify the student exists in the database and is actually a student.
	// This prevents forged student_ids pointing to non-existent or teacher profiles.
	const { data: profile, error: profileErr } = await supabaseAdmin
		.from('profiles')
		.select('id, role')
		.eq('id', studentId)
		.eq('role', 'student')
		.single();

	if (profileErr || !profile) {
		throw error(403, 'Student not found');
	}

	// Ensure every item targets the same verified student — no cross-student writes
	for (const item of body.items) {
		if (item.data?.student_id !== studentId) {
			throw error(403, 'All items must belong to the same student');
		}
	}

	// Validate items
	const items: SyncItem[] = [];
	for (const raw of body.items) {
		const validated = validateItem(raw);
		if (!validated.ok) throw error(400, validated.message);
		items.push(validated.item);
	}

	const errors: string[] = [];
	for (const item of items) {
		try {
			await syncItem(item);
		} catch (e) {
			errors.push(`${item.table}/${item.id}: ${String(e)}`);
		}
	}

	if (errors.length > 0) {
		return json({ ok: false, errors }, { status: 207 });
	}
	return json({ ok: true });
};

function validateItem(raw: any): { ok: true; item: SyncItem } | { ok: false; message: string } {
	if (!raw || typeof raw !== 'object') return { ok: false, message: 'Item must be an object' };
	if (!ALLOWED_TABLES.has(raw.table)) return { ok: false, message: `Unknown table: ${raw.table}` };
	if (raw.operation !== 'upsert' && raw.operation !== 'insert') return { ok: false, message: 'Invalid operation' };
	if (!raw.data || typeof raw.data !== 'object') return { ok: false, message: 'Item data missing' };

	// Table-specific field validation
	if (raw.table === 'attempts') {
		if (typeof raw.data.code === 'string' && raw.data.code.length > MAX_CODE_LENGTH) {
			return { ok: false, message: `code field exceeds ${MAX_CODE_LENGTH} character limit` };
		}
		if (raw.data.timeSpentSeconds !== undefined && typeof raw.data.timeSpentSeconds !== 'number') {
			return { ok: false, message: 'timeSpentSeconds must be a number' };
		}
	}
	if (raw.table === 'progress') {
		const validStatuses = new Set(['not_started', 'in_progress', 'completed']);
		if (raw.data.status !== undefined && !validStatuses.has(raw.data.status as string)) {
			return { ok: false, message: 'Invalid status value' };
		}
	}
	if (raw.table === 'daily_activity') {
		if (raw.data.totalSeconds !== undefined && typeof raw.data.totalSeconds !== 'number') {
			return { ok: false, message: 'totalSeconds must be a number' };
		}
		// Sanity-check: totalSeconds can't be negative or absurdly large (> 24 hours)
		if (typeof raw.data.totalSeconds === 'number' && (raw.data.totalSeconds < 0 || raw.data.totalSeconds > 86_400)) {
			return { ok: false, message: 'totalSeconds out of range' };
		}
	}

	return { ok: true, item: raw as SyncItem };
}

async function syncItem(item: SyncItem): Promise<void> {
	const { table, operation, data } = item;

	switch (table) {
		case 'progress': {
			const payload = {
				student_id: data.student_id as string,
				lesson_id: data.id as string,
				status: data.status as string,
				time_spent_seconds: data.timeSpentSeconds as number,
				started_at: data.startedAt ? new Date(data.startedAt as number).toISOString() : null,
				completed_at: data.completedAt ? new Date(data.completedAt as number).toISOString() : null,
				updated_at: new Date().toISOString()
			};
			await supabaseAdmin.from('student_progress').upsert(payload, { onConflict: 'student_id,lesson_id' });
			break;
		}

		case 'attempts': {
			const payload = {
				id: data.id as string,
				student_id: data.student_id as string,
				problem_id: data.problemId as string,
				code: (data.code as string).slice(0, MAX_CODE_LENGTH),
				passed: Boolean(data.passed),
				tests_passed: data.testsPassed as number,
				tests_total: data.testsTotal as number,
				error_message: (data.errorMessage as string | null) ?? null,
				time_spent_seconds: data.timeSpentSeconds as number,
				attempted_at: data.attemptedAt
					? new Date(data.attemptedAt as number).toISOString()
					: new Date().toISOString()
			};
			if (operation === 'insert') {
				await supabaseAdmin.from('problem_attempts').insert(payload);
			} else {
				await supabaseAdmin.from('problem_attempts').upsert(payload, { onConflict: 'id' });
			}
			break;
		}

		case 'daily_activity': {
			const payload = {
				student_id: data.student_id as string,
				activity_date: data.date as string,
				lessons_touched: data.lessonsTouched as number,
				problems_attempted: data.problemsAttempted as number,
				problems_solved: data.problemsSolved as number,
				total_seconds: data.totalSeconds as number
			};
			await supabaseAdmin
				.from('daily_activity')
				.upsert(payload, { onConflict: 'student_id,activity_date' });
			break;
		}
	}
}
