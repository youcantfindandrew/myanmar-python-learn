import { writable, get } from 'svelte/store';
import { db, type LocalProgress, type DailyActivity } from '$lib/db/schema';
import { currentUser } from '$lib/stores/auth';

export const progressMap = writable<Map<string, LocalProgress>>(new Map());

export async function loadProgress(): Promise<void> {
	const all = await db.progress.toArray();
	const map = new Map(all.map((p) => [p.id, p]));
	progressMap.set(map);
}

export async function startLesson(lessonId: string): Promise<void> {
	const existing = await db.progress.get(lessonId);
	if (existing && existing.status !== 'not_started') return;

	const progress: LocalProgress = {
		id: lessonId,
		status: 'in_progress',
		timeSpentSeconds: existing?.timeSpentSeconds ?? 0,
		scrollPosition: 0,
		startedAt: existing?.startedAt ?? Date.now(),
		completedAt: null,
		updatedAt: Date.now(),
		synced: false
	};
	await db.progress.put(progress);
	await addToSyncQueue('progress', 'upsert', progress);
	await loadProgress();
}

export async function completeLesson(lessonId: string): Promise<void> {
	const existing = await db.progress.get(lessonId);
	const progress: LocalProgress = {
		id: lessonId,
		status: 'completed',
		timeSpentSeconds: existing?.timeSpentSeconds ?? 0,
		scrollPosition: 0,
		startedAt: existing?.startedAt ?? Date.now(),
		completedAt: Date.now(),
		updatedAt: Date.now(),
		synced: false
	};
	await db.progress.put(progress);
	await addToSyncQueue('progress', 'upsert', progress);
	await loadProgress();
}

export async function updateTimeSpent(lessonId: string, additionalSeconds: number): Promise<void> {
	const existing = await db.progress.get(lessonId);
	if (!existing) return;
	existing.timeSpentSeconds += additionalSeconds;
	existing.updatedAt = Date.now();
	existing.synced = false;
	await db.progress.put(existing);

	// Update daily activity
	const today = new Date().toISOString().split('T')[0];
	const daily = (await db.dailyActivity.get(today)) ?? {
		date: today,
		lessonsTouched: 0,
		problemsAttempted: 0,
		problemsSolved: 0,
		totalSeconds: 0,
		synced: false
	};
	daily.totalSeconds += additionalSeconds;
	daily.synced = false;
	await db.dailyActivity.put(daily);
}

export async function getStreak(): Promise<number> {
	const activities = await db.dailyActivity.orderBy('date').reverse().toArray();
	if (activities.length === 0) return 0;

	let streak = 0;
	const today = new Date();
	for (let i = 0; i < activities.length; i++) {
		const expected = new Date(today);
		expected.setDate(expected.getDate() - i);
		const expectedDate = expected.toISOString().split('T')[0];
		if (activities[i].date === expectedDate && activities[i].totalSeconds > 0) {
			streak++;
		} else {
			break;
		}
	}
	return streak;
}

async function addToSyncQueue(table: string, operation: 'upsert' | 'insert', data: any): Promise<void> {
	// Only queue if a student is logged in — no point syncing anonymous activity
	const user = get(currentUser);
	if (!user || user.role !== 'student') return;
	await db.syncQueue.add({
		table,
		operation,
		data: { ...data, student_id: user.id },
		createdAt: Date.now(),
		retries: 0
	});
}
