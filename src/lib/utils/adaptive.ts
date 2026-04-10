import type { LocalLesson, LocalAttempt, LocalProgress } from '$lib/db/schema';

const AGE_GROUP_ORDER = ['6-8', '9-11', '10-12', '12-14', '15-16', '16+'];

function ageGroupRank(group: string): number {
	const idx = AGE_GROUP_ORDER.indexOf(group);
	return idx === -1 ? 0 : idx;
}

export function recommendNextLesson(
	ageGroup: string,
	completedIds: string[],
	inProgressIds: string[],
	recentAttempts: LocalAttempt[],
	allLessons: LocalLesson[]
): LocalLesson | null {
	// In-progress first
	const inProgress = allLessons.find((l) => inProgressIds.includes(l.id));
	if (inProgress) return inProgress;

	const userRank = ageGroupRank(ageGroup);

	// Filter: age-appropriate, not completed, prerequisites met
	const candidates = allLessons.filter((l) => {
		if (completedIds.includes(l.id)) return false;
		if (ageGroupRank(l.ageGroupMin) > userRank) return false;
		const prereqsMet = l.prerequisites.every((p) => completedIds.includes(p));
		return prereqsMet;
	});

	if (candidates.length === 0) return null;

	// Calculate recent success rate (last 10 attempts)
	const recent = recentAttempts.slice(-10);
	const successRate =
		recent.length > 0 ? recent.filter((a) => a.passed).length / recent.length : 0.6;

	// Target difficulty based on success
	const maxCompleted = completedIds.length > 0
		? Math.max(...completedIds.map((id) => allLessons.find((l) => l.id === id)?.difficulty ?? 1))
		: 1;

	let targetDifficulty = maxCompleted;
	if (successRate > 0.8) targetDifficulty = Math.min(10, maxCompleted + 1);
	if (successRate < 0.4) targetDifficulty = Math.max(1, maxCompleted - 1);

	// Sort by closeness to target difficulty, then by orderIndex
	candidates.sort((a, b) => {
		const distA = Math.abs(a.difficulty - targetDifficulty);
		const distB = Math.abs(b.difficulty - targetDifficulty);
		if (distA !== distB) return distA - distB;
		return a.orderIndex - b.orderIndex;
	});

	return candidates[0];
}
