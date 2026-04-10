<script lang="ts">
	import type { LocalLesson, LocalProgress } from '$lib/db/schema';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';

	let { lesson, progress, locked = false }: {
		lesson: LocalLesson;
		progress?: LocalProgress;
		locked?: boolean;
	} = $props();

	const title = $derived($locale === 'en' ? lesson.titleEn : lesson.titleMm);
	const status = $derived(progress?.status ?? 'not_started');
</script>

{#if locked}
	<div class="lesson-card card locked">
		<div class="lesson-icon">🔒</div>
		<div class="lesson-info">
			<h3 class="lesson-title">{title}</h3>
			<p class="lesson-meta">{t($locale, 'lesson.locked')}</p>
		</div>
	</div>
{:else}
	<a href="/student/lessons/{lesson.id}" class="lesson-card card">
		<div class="lesson-icon">
			{#if status === 'completed'}
				✅
			{:else if status === 'in_progress'}
				📝
			{:else}
				📘
			{/if}
		</div>
		<div class="lesson-info">
			<h3 class="lesson-title">{title}</h3>
			<p class="lesson-meta">
				{lesson.category} · ~{lesson.estimatedMinutes} {t($locale, 'dashboard.minutes')}
				{#if progress?.timeSpentSeconds}
					· {Math.round(progress.timeSpentSeconds / 60)} {t($locale, 'dashboard.minutes')}
				{/if}
			</p>
		</div>
		<div class="lesson-status">
			{#if status === 'completed'}
				<span class="badge completed">{t($locale, 'lesson.completed')}</span>
			{:else if status === 'in_progress'}
				<span class="badge in-progress">{t($locale, 'lesson.continue')}</span>
			{:else}
				<span class="badge">{t($locale, 'lesson.start')}</span>
			{/if}
		</div>
	</a>
{/if}

<style>
	.lesson-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		text-decoration: none;
		color: var(--color-text);
		transition: background 0.15s, box-shadow 0.15s;
	}

	.lesson-card:hover {
		text-decoration: none;
		background: var(--color-hover);
		box-shadow: var(--shadow);
	}

	.locked {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.lesson-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.lesson-info {
		flex: 1;
		min-width: 0;
	}

	.lesson-title {
		font-size: 0.95rem;
		font-weight: 600;
		margin-bottom: 0.125rem;
	}

	.lesson-meta {
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.lesson-status {
		flex-shrink: 0;
	}

	.badge {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.625rem;
		border-radius: 999px;
		background: var(--color-primary-light);
		color: var(--color-primary-dark);
		white-space: nowrap;
	}

	.badge.completed {
		background: var(--color-success-light);
		color: #166534;
	}

	.badge.in-progress {
		background: var(--color-warning-light);
		color: #92400e;
	}
</style>
