import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/db/supabase';

interface SyncItem {
	id: string;
	table: string;
	operation: 'upsert' | 'insert';
	data: Record<string, unknown>;
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => null);
	if (!body || !Array.isArray(body.items)) {
		throw error(400, 'Invalid payload');
	}

	const items: SyncItem[] = body.items;
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
			await supabase.from('student_progress').upsert(payload, { onConflict: 'student_id,lesson_id' });
			break;
		}

		case 'attempts': {
			const payload = {
				id: data.id as string,
				student_id: data.student_id as string,
				problem_id: data.problemId as string,
				code: data.code as string,
				passed: Boolean(data.passed),
				tests_passed: data.testsPassed as number,
				tests_total: data.testsTotal as number,
				error_message: data.errorMessage as string | null,
				time_spent_seconds: data.timeSpentSeconds as number,
				attempted_at: data.attemptedAt
					? new Date(data.attemptedAt as number).toISOString()
					: new Date().toISOString()
			};
			if (operation === 'insert') {
				await supabase.from('problem_attempts').insert(payload);
			} else {
				await supabase.from('problem_attempts').upsert(payload, { onConflict: 'id' });
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
			await supabase
				.from('daily_activity')
				.upsert(payload, { onConflict: 'student_id,activity_date' });
			break;
		}

		default:
			throw new Error(`Unknown table: ${table}`);
	}
}
