<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/auth';
	import { progressMap, getStreak } from '$lib/stores/progress';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';
	import { db } from '$lib/db/schema';
	import type { LocalLesson } from '$lib/db/schema';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import ProgressRing from '$lib/components/dashboard/ProgressRing.svelte';
	import LessonCard from '$lib/components/lesson/LessonCard.svelte';

	let lessons = $state<LocalLesson[]>([]);
	let streak = $state(0);
	let totalMinutes = $state(0);
	let problemsSolved = $state(0);

	const completedCount = $derived(
		[...$progressMap.values()].filter((p) => p.status === 'completed').length
	);
	const completionPercent = $derived(
		lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0
	);

	onMount(async () => {
		lessons = await db.lessons.orderBy('orderIndex').toArray();
		streak = await getStreak();

		const allProgress = [...$progressMap.values()];
		totalMinutes = Math.round(
			allProgress.reduce((sum, p) => sum + p.timeSpentSeconds, 0) / 60
		);

		const attempts = await db.attempts.where('passed').equals(1).count();
		problemsSolved = attempts;
	});

	// Next recommended lesson
	const nextLesson = $derived(
		lessons.find((l) => {
			const prog = $progressMap.get(l.id);
			return !prog || prog.status !== 'completed';
		})
	);
</script>

<div class="container dashboard">
	<div class="greeting">
		<h1>{t($locale, 'dashboard.greeting', { name: $currentUser?.displayName ?? '' })}</h1>
	</div>

	<div class="stats-grid">
		<StatCard icon="🔥" value={streak} label={t($locale, 'dashboard.streak')} />
		<StatCard icon="📖" value={completedCount} label={t($locale, 'dashboard.lessonsCompleted')} />
		<StatCard icon="✅" value={problemsSolved} label={t($locale, 'dashboard.problemsSolved')} />
		<StatCard icon="⏱️" value={totalMinutes} label={t($locale, 'dashboard.timeSpent') + ' (' + t($locale, 'dashboard.minutes') + ')'} />
	</div>

	{#if lessons.length > 0}
		<div class="progress-section card">
			<div class="progress-ring-wrap">
				<ProgressRing percent={completionPercent} size={100} />
			</div>
			<div class="progress-text">
				<h3>{$locale === 'en' ? 'Overall Progress' : 'စုစုပေါင်း တိုးတက်မှု'}</h3>
				<p>{completedCount} / {lessons.length} {t($locale, 'dashboard.lessonsCompleted').toLowerCase()}</p>
			</div>
		</div>
	{/if}

	{#if nextLesson}
		<div class="next-section">
			<h2 class="section-title">{t($locale, 'dashboard.nextLesson')}</h2>
			<LessonCard lesson={nextLesson} progress={$progressMap.get(nextLesson.id)} />
		</div>
	{/if}

	<div class="all-lessons">
		<div class="section-header">
			<h2 class="section-title">{t($locale, 'nav.lessons')}</h2>
			<a href="/student/lessons" class="see-all">
				{$locale === 'en' ? 'See all →' : 'အားလုံး ကြည့်ရန် →'}
			</a>
		</div>
		<div class="lessons-list">
			{#each lessons.slice(0, 3) as lesson}
				<LessonCard lesson={lesson} progress={$progressMap.get(lesson.id)} />
			{/each}
		</div>
	</div>
</div>

<style>
	.dashboard {
		padding-top: 1.5rem;
		padding-bottom: 2rem;
	}

	.greeting {
		margin-bottom: 1.25rem;
	}

	.greeting h1 {
		font-size: 1.4rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.progress-section {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding: 1rem 1.25rem;
	}

	.progress-text h3 {
		font-size: 1rem;
		margin-bottom: 0.25rem;
	}

	.progress-text p {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	.next-section, .all-lessons {
		margin-bottom: 1.5rem;
	}

	.section-title {
		font-size: 1rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.8rem;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.see-all {
		font-size: 0.85rem;
		font-weight: 600;
	}

	.lessons-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
