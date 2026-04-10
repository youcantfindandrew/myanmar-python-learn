<script lang="ts">
	import { onMount } from 'svelte';
	import { progressMap, getStreak } from '$lib/stores/progress';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';
	import { db, type LocalLesson, type DailyActivity } from '$lib/db/schema';
	import ProgressRing from '$lib/components/dashboard/ProgressRing.svelte';

	let lessons = $state<LocalLesson[]>([]);
	let recentActivity = $state<DailyActivity[]>([]);
	let streak = $state(0);
	let totalAttempts = $state(0);
	let passedAttempts = $state(0);

	onMount(async () => {
		lessons = await db.lessons.orderBy('orderIndex').toArray();
		streak = await getStreak();
		recentActivity = await db.dailyActivity.orderBy('date').reverse().limit(14).toArray();
		totalAttempts = await db.attempts.count();
		passedAttempts = await db.attempts.where('passed').equals(1).count();
	});

	const completedCount = $derived(
		[...$progressMap.values()].filter((p) => p.status === 'completed').length
	);
	const inProgressCount = $derived(
		[...$progressMap.values()].filter((p) => p.status === 'in_progress').length
	);
	const completionPercent = $derived(
		lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0
	);
	const accuracy = $derived(
		totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0
	);
	const totalMinutes = $derived(
		Math.round([...$progressMap.values()].reduce((s, p) => s + p.timeSpentSeconds, 0) / 60)
	);

	// Max minutes for chart scale
	const maxMinutes = $derived(
		Math.max(...recentActivity.map((a) => a.totalSeconds / 60), 1)
	);

	function formatDate(dateStr: string) {
		const d = new Date(dateStr);
		return $locale === 'en'
			? d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
			: d.toLocaleDateString('my', { month: 'short', day: 'numeric' });
	}
</script>

<div class="container progress-page">
	<h1 class="page-title">{t($locale, 'progress.title')}</h1>

	<div class="rings-row">
		<div class="ring-item">
			<ProgressRing percent={completionPercent} size={110} />
			<p>{$locale === 'en' ? 'Lessons' : 'သင်ခန်းစာ'}</p>
		</div>
		<div class="ring-item">
			<ProgressRing percent={accuracy} size={110} />
			<p>{t($locale, 'progress.accuracy')}</p>
		</div>
	</div>

	<div class="stats-list card">
		<div class="stat-row">
			<span>🔥 {t($locale, 'dashboard.streak')}</span>
			<strong>{streak} {$locale === 'en' ? 'days' : 'ရက်'}</strong>
		</div>
		<div class="stat-row">
			<span>✅ {t($locale, 'dashboard.lessonsCompleted')}</span>
			<strong>{completedCount} / {lessons.length}</strong>
		</div>
		<div class="stat-row">
			<span>📝 {$locale === 'en' ? 'In progress' : 'လုပ်ဆောင်နေသော'}</span>
			<strong>{inProgressCount}</strong>
		</div>
		<div class="stat-row">
			<span>🧩 {t($locale, 'dashboard.problemsSolved')}</span>
			<strong>{passedAttempts} / {totalAttempts}</strong>
		</div>
		<div class="stat-row">
			<span>⏱️ {t($locale, 'dashboard.timeSpent')}</span>
			<strong>{totalMinutes} {t($locale, 'dashboard.minutes')}</strong>
		</div>
	</div>

	{#if recentActivity.length > 0}
		<div class="chart-section card">
			<h3 class="chart-title">{t($locale, 'progress.timeChart')} ({$locale === 'en' ? 'last 14 days' : 'နောက်ဆုံး ၁၄ ရက်'})</h3>
			<div class="bar-chart">
				{#each [...recentActivity].reverse() as day}
					<div class="bar-item">
						<div class="bar-wrap">
							<div
								class="bar"
								style="height: {Math.max(4, ((day.totalSeconds / 60) / maxMinutes) * 100)}%"
							></div>
						</div>
						<span class="bar-label">{formatDate(day.date).split(' ')[1]}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.progress-page {
		padding-top: 1.25rem;
		padding-bottom: 3rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.page-title { font-size: 1.4rem; }

	.rings-row {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
	}

	.ring-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.ring-item p {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.stats-list {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.stat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
		font-size: 0.9rem;
	}

	.stat-row:last-child { border-bottom: none; }

	.chart-title {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		margin-bottom: 0.75rem;
		text-transform: uppercase;
	}

	.bar-chart {
		display: flex;
		align-items: flex-end;
		gap: 4px;
		height: 80px;
	}

	.bar-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		flex: 1;
	}

	.bar-wrap {
		height: 64px;
		display: flex;
		align-items: flex-end;
		width: 100%;
	}

	.bar {
		width: 100%;
		background: var(--color-primary);
		border-radius: 3px 3px 0 0;
		min-height: 4px;
		transition: height 0.3s ease;
	}

	.bar-label {
		font-size: 0.65rem;
		color: var(--color-text-secondary);
	}
</style>
