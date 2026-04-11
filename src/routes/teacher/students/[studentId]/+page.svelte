<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { locale } from '$lib/stores/locale';
	import { getStudentProgress } from '$lib/db/sync-engine';

	const studentId = $derived(page.params.studentId);

	interface ProgressRow { lesson_id: string; status: string; time_spent_seconds: number; completed_at: string | null }
	interface AttemptRow { problem_id: string; passed: boolean; attempted_at: string; time_spent_seconds: number }
	interface ActivityRow { activity_date: string; problems_solved: number; total_seconds: number }

	let progress = $state<ProgressRow[]>([]);
	let attempts = $state<AttemptRow[]>([]);
	let activity = $state<ActivityRow[]>([]);
	let loading = $state(true);

	onMount(async () => {
		const result = await getStudentProgress(studentId);
		progress = result.progress as ProgressRow[];
		attempts = result.attempts as AttemptRow[];
		activity = result.activity as ActivityRow[];
		loading = false;
	});

	const t = (en: string, mm: string) => ($locale === 'en' ? en : mm);

	const completedLessons = $derived(progress.filter((p) => p.status === 'completed').length);
	const totalMinutes = $derived(Math.round(progress.reduce((s, p) => s + p.time_spent_seconds, 0) / 60));
	const problemsSolved = $derived(attempts.filter((a) => a.passed).length);
	const successRate = $derived(
		attempts.length > 0 ? Math.round((attempts.filter((a) => a.passed).length / attempts.length) * 100) : 0
	);
</script>

<div class="student-detail">
	<a href="/teacher" class="back-link">← {t('Back to Dashboard', 'Dashboard သို့ ပြန်')}</a>

	<h1 class="page-title">{t('Student Progress', 'ကျောင်းသား တိုးတက်မှု')}</h1>

	{#if loading}
		<p class="loading">{t('Loading...', 'ခဏစောင့်ပါ...')}</p>
	{:else}
		<!-- Stats -->
		<div class="stats-grid">
			<div class="stat-card card">
				<span class="stat-value">{completedLessons}</span>
				<span class="stat-label">{t('Lessons Done', 'သင်ခန်းစာများ')}</span>
			</div>
			<div class="stat-card card">
				<span class="stat-value">{problemsSolved}</span>
				<span class="stat-label">{t('Problems Solved', 'ပြဿနာများ ဖြေ')}</span>
			</div>
			<div class="stat-card card">
				<span class="stat-value">{successRate}%</span>
				<span class="stat-label">{t('Success Rate', 'အောင်မြင်မှုနှုန်း')}</span>
			</div>
			<div class="stat-card card">
				<span class="stat-value">{totalMinutes}</span>
				<span class="stat-label">{t('Minutes', 'မိနစ်')}</span>
			</div>
		</div>

		<!-- Activity chart (simple bar chart) -->
		{#if activity.length > 0}
			<section class="section">
				<h2 class="section-title">{t('Daily Activity (last 30 days)', 'နေ့စဉ် လုပ်ဆောင်မှု')}</h2>
				<div class="activity-bars">
					{#each activity.slice(0, 14).reverse() as day}
						{@const height = Math.max(4, Math.min(60, day.problems_solved * 10 + 4))}
						<div class="bar-wrap" title="{day.activity_date}: {day.problems_solved} solved">
							<div class="bar" style="height: {height}px"></div>
							<span class="bar-date">{day.activity_date.slice(5)}</span>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Lesson progress table -->
		<section class="section">
			<h2 class="section-title">{t('Lesson Progress', 'သင်ခန်းစာ တိုးတက်မှု')}</h2>
			{#if progress.length === 0}
				<p class="empty">{t('No lesson data yet.', 'သင်ခန်းစာ ဒေတာ မရှိသေးပါ')}</p>
			{:else}
				<div class="progress-list">
					{#each progress as p}
						<div class="progress-row card">
							<span class="lesson-id">{p.lesson_id}</span>
							<span class="status-badge" class:completed={p.status === 'completed'}>
								{p.status === 'completed' ? t('✓ Done', '✓ ပြီး') : t('In progress', 'လုပ်ဆဲ')}
							</span>
							<span class="time">{Math.round(p.time_spent_seconds / 60)} {t('min', 'မိ')}</span>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Recent attempts -->
		<section class="section">
			<h2 class="section-title">{t('Recent Attempts', 'မကြာသေးမီ ကြိုးစားမှုများ')}</h2>
			{#if attempts.length === 0}
				<p class="empty">{t('No attempts yet.', 'ကြိုးစားမှု မရှိသေးပါ')}</p>
			{:else}
				<div class="attempts-list">
					{#each attempts.slice(0, 20) as a}
						<div class="attempt-row card" class:passed={a.passed}>
							<span class="problem-id">{a.problem_id}</span>
							<span class="pass-badge">{a.passed ? '✓' : '✗'}</span>
							<span class="attempt-date">{new Date(a.attempted_at).toLocaleDateString()}</span>
						</div>
					{/each}
				</div>
			{/if}
		</section>
	{/if}
</div>

<style>
	.back-link {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
		text-decoration: none;
		display: inline-block;
		margin-bottom: 1rem;
	}

	.page-title {
		font-size: 1.4rem;
		font-weight: 700;
		margin-bottom: 1.25rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.stat-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		gap: 0.25rem;
		text-align: center;
	}

	.stat-value {
		font-size: 1.75rem;
		font-weight: 800;
		color: var(--color-primary);
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.section {
		margin-bottom: 1.75rem;
	}

	.section-title {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-secondary);
		margin-bottom: 0.75rem;
	}

	.activity-bars {
		display: flex;
		align-items: flex-end;
		gap: 4px;
		height: 80px;
		padding-bottom: 1.5rem;
		position: relative;
	}

	.bar-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		flex: 1;
	}

	.bar {
		width: 100%;
		background: var(--color-primary);
		border-radius: 3px 3px 0 0;
		min-height: 4px;
	}

	.bar-date {
		font-size: 0.6rem;
		color: var(--color-text-secondary);
		transform: rotate(-45deg);
		white-space: nowrap;
	}

	.progress-list, .attempts-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.progress-row, .attempt-row {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.6rem 1rem;
		font-size: 0.85rem;
	}

	.lesson-id, .problem-id {
		flex: 1;
		font-family: monospace;
		font-size: 0.8rem;
	}

	.status-badge {
		font-size: 0.75rem;
		padding: 0.15rem 0.5rem;
		border-radius: 4px;
		background: var(--color-border);
		color: var(--color-text-secondary);
	}

	.status-badge.completed {
		background: #d1fae5;
		color: #065f46;
	}

	.pass-badge {
		font-weight: 700;
	}

	.attempt-row.passed .pass-badge {
		color: #059669;
	}

	.attempt-row:not(.passed) .pass-badge {
		color: #dc2626;
	}

	.time, .attempt-date {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}

	.empty, .loading {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}
</style>
