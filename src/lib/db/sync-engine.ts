import { db } from './schema';
import { supabase } from './supabase';
import { isSyncing, pendingSyncCount, isOnline } from '$lib/stores/sync';
import { get } from 'svelte/store';

const MAX_RETRIES = 5;
const BATCH_SIZE = 50;

export async function syncToServer(userId: string): Promise<void> {
	if (!get(isOnline)) return;
	if (get(isSyncing)) return;

	const queue = await db.syncQueue
		.where('retries').below(MAX_RETRIES)
		.sortBy('createdAt');

	if (queue.length === 0) return;

	isSyncing.set(true);

	try {
		// Process in batches
		for (let i = 0; i < queue.length; i += BATCH_SIZE) {
			const batch = queue.slice(i, i + BATCH_SIZE);
			await pushBatch(userId, batch);
		}
	} finally {
		isSyncing.set(false);
		const remaining = await db.syncQueue.count();
		pendingSyncCount.set(remaining);
	}
}

async function pushBatch(userId: string, items: typeof db.syncQueue extends import('dexie').Table<infer T, any> ? T[] : never[]): Promise<void> {
	const payload = items.map((item) => ({
		id: String(item.id),
		table: item.table,
		operation: item.operation,
		data: { ...item.data, student_id: userId }
	}));

	const resp = await fetch('/api/sync', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ items: payload })
	}).catch(() => null);

	const syncOk = resp !== null && resp.ok;

	if (syncOk) {
		// Remove successfully synced items
		const ids = items.map((i) => i.id!).filter(Boolean) as number[];
		await db.syncQueue.bulkDelete(ids);

		// Mark local records as synced
		for (const item of items) {
			await markSynced(item.table, item.data);
		}
	} else {
		// Increment retries
		for (const item of items) {
			await db.syncQueue.update(item.id!, { retries: (item.retries ?? 0) + 1 });
		}
	}
}

async function markSynced(table: string, data: any): Promise<void> {
	if (table === 'progress' && data.id) {
		await db.progress.update(data.id, { synced: true });
	} else if (table === 'attempts' && data.id) {
		await db.attempts.update(data.id, { synced: true });
	} else if (table === 'daily_activity' && data.date) {
		await db.dailyActivity.update(data.date, { synced: true });
	}
}

export async function pullFromServer(userId: string, lastSyncedAt?: number): Promise<void> {
	if (!get(isOnline)) return;

	try {
		const since = lastSyncedAt ? new Date(lastSyncedAt).toISOString() : '1970-01-01T00:00:00Z';

		// Pull assignments created after last sync
		const { data: assignments } = await supabase
			.from('assignments')
			.select('*')
			.gte('created_at', since)
			.order('created_at', { ascending: false })
			.limit(20);

		if (assignments) {
			// Store assignments in a simple key-value in profiles table for now
			// Full assignment display handled by teacher dashboard
			localStorage.setItem('cached_assignments', JSON.stringify(assignments));
		}
	} catch {
		// Network errors are silent — offline mode handles it
	}
}

export async function upsertProfile(profile: {
	id: string;
	display_name: string;
	role: string;
	age_group: string;
	preferred_language: string;
	teacher_id?: string;
}): Promise<void> {
	if (!get(isOnline)) return;
	await supabase.from('profiles').upsert(profile, { onConflict: 'id' });
}

export async function getTeacherStudents(teacherId: string) {
	const { data, error } = await supabase
		.from('profiles')
		.select(`
			id,
			display_name,
			age_group,
			preferred_language,
			created_at
		`)
		.eq('teacher_id', teacherId)
		.eq('role', 'student')
		.order('display_name');

	if (error) return [];
	return data ?? [];
}

export async function getStudentProgress(studentId: string) {
	const [{ data: progress }, { data: attempts }, { data: activity }] = await Promise.all([
		supabase.from('student_progress').select('*').eq('student_id', studentId),
		supabase.from('problem_attempts').select('*').eq('student_id', studentId).order('attempted_at', { ascending: false }).limit(50),
		supabase.from('daily_activity').select('*').eq('student_id', studentId).order('activity_date', { ascending: false }).limit(30)
	]);

	return {
		progress: progress ?? [],
		attempts: attempts ?? [],
		activity: activity ?? []
	};
}

export async function createAssignment(assignment: {
	teacher_id: string;
	title: string;
	problem_ids: string[];
	assigned_to: string[] | null;
	due_date: string | null;
}) {
	const { data, error } = await supabase.from('assignments').insert(assignment).select().single();
	return { data, error };
}

export async function getAssignments(teacherId: string) {
	const { data } = await supabase
		.from('assignments')
		.select('*')
		.eq('teacher_id', teacherId)
		.order('created_at', { ascending: false });
	return data ?? [];
}
