<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { db, type LocalLesson, type LocalProblem } from '$lib/db/schema';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';
	import { startLesson, completeLesson, updateTimeSpent, progressMap } from '$lib/stores/progress';
	import { initPyodide, runPython, pyodideStatus } from '$lib/pyodide/bridge';
	import CodeEditor from '$lib/components/editor/CodeEditor.svelte';
	import OutputPanel from '$lib/components/editor/OutputPanel.svelte';

	let lesson = $state<LocalLesson | null>(null);
	let problems = $state<LocalProblem[]>([]);
	let currentSectionIndex = $state(0);
	let quizAnswered = $state<Record<number, number>>({});
	let tryItCode = $state<Record<number, string>>({});
	let runOutput = $state<Record<number, { stdout: string; error: string | null }>>({});
	let isRunning = $state<Record<number, boolean>>({});
	let editors: Record<number, any> = {};
	let timeStart = Date.now();
	let timeInterval: ReturnType<typeof setInterval>;

	const lessonId = $derived(page.params.lessonId as string);
	const progress = $derived($progressMap.get(lessonId));

	onMount(async () => {
		lesson = await db.lessons.get(lessonId) ?? null;
		if (!lesson) { goto('/student/lessons'); return; }

		problems = await db.problems.where('lessonId').equals(lessonId).sortBy('orderIndex');
		await startLesson(lessonId);

		timeInterval = setInterval(async () => {
			await updateTimeSpent(lessonId, 5);
		}, 5000);
	});

	onDestroy(() => {
		clearInterval(timeInterval);
	});

	async function handleRunCode(sectionIndex: number, code: string) {
		if ($pyodideStatus !== 'ready') {
			await initPyodide();
		}
		isRunning[sectionIndex] = true;
		try {
			const result = await runPython(code);
			runOutput[sectionIndex] = { stdout: result.stdout, error: result.error };
		} catch (e: any) {
			runOutput[sectionIndex] = { stdout: '', error: e.message };
		}
		isRunning[sectionIndex] = false;
	}

	async function handleComplete() {
		await completeLesson(lessonId);
		goto('/student/lessons');
	}

	function getTitle(l: LocalLesson) {
		return $locale === 'en' ? l.titleEn : l.titleMm;
	}

	function getContent(obj: { en: string; mm: string }) {
		return $locale === 'en' ? obj.en : obj.mm;
	}

	function escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}

	function renderMarkdown(text: string): string {
		// Escape first so lesson content can never inject raw HTML,
		// then apply safe markdown-to-HTML transforms on the escaped text.
		const safe = escapeHtml(text);
		return safe
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/`([^`]+)`/g, '<code>$1</code>')
			.replace(/\n/g, '<br>');
	}
</script>

{#if lesson}
	<div class="container lesson-page">
		<div class="lesson-header">
			<a href="/student/lessons" class="back-link">← {t($locale, 'lesson.back')}</a>
			<h1 class="lesson-title">{getTitle(lesson)}</h1>
			<div class="lesson-meta">
				<span>~{lesson.estimatedMinutes} {t($locale, 'dashboard.minutes')}</span>
				{#if progress?.status === 'completed'}
					<span class="badge-done">{t($locale, 'lesson.completed')}</span>
				{/if}
			</div>
		</div>

		<div class="sections">
			{#each lesson.sections as section, i}
				<div class="section">
					{#if section.type === 'explanation' && section.content}
						<div class="explanation">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html renderMarkdown(getContent(section.content))}
						</div>

					{:else if section.type === 'code_example' && section.code}
						<div class="code-block">
							<div class="code-block-header">
								<span class="code-label">Python</span>
								{#if section.runnable}
									<button
										class="btn btn-primary btn-sm"
										onclick={() => handleRunCode(i, section.code!)}
										disabled={isRunning[i]}
									>
										{isRunning[i] ? '...' : '▶ ' + t($locale, 'lesson.runCode')}
									</button>
								{/if}
							</div>
							<pre class="code-pre"><code>{section.code}</code></pre>
							{#if section.explanation}
								<p class="code-explanation">{getContent(section.explanation)}</p>
							{/if}
							{#if runOutput[i] !== undefined}
								<OutputPanel
									stdout={runOutput[i].stdout}
									error={runOutput[i].error}
									isRunning={isRunning[i]}
								/>
							{/if}
						</div>

					{:else if section.type === 'try_it' && section.prompt}
						<div class="try-it card">
							<p class="try-it-prompt">✏️ <strong>{t($locale, 'lesson.tryIt')}</strong><br>
								{getContent(section.prompt)}
							</p>
							<CodeEditor
								initialCode={tryItCode[i] ?? section.starterCode ?? ''}
								onchange={(code) => tryItCode[i] = code}
								bind:this={editors[i]}
							/>
							<div class="run-row">
								<button
									class="btn btn-primary"
									onclick={() => handleRunCode(i, editors[i]?.getCode() ?? tryItCode[i] ?? '')}
									disabled={isRunning[i]}
								>
									{isRunning[i] ? '...' : '▶ ' + t($locale, 'lesson.runCode')}
								</button>
							</div>
							{#if runOutput[i] !== undefined}
								<OutputPanel
									stdout={runOutput[i].stdout}
									error={runOutput[i].error}
									isRunning={isRunning[i]}
								/>
							{/if}
						</div>

					{:else if section.type === 'quiz' && section.question && section.options}
						<div class="quiz card">
							<p class="quiz-question">❓ {getContent(section.question)}</p>
							<div class="quiz-options">
								{#each ($locale === 'en' ? section.options.en : section.options.mm) as option, optIdx}
									<button
										class="quiz-option"
										class:correct={quizAnswered[i] !== undefined && optIdx === section.correct}
										class:wrong={quizAnswered[i] === optIdx && optIdx !== section.correct}
										disabled={quizAnswered[i] !== undefined}
										onclick={() => quizAnswered[i] = optIdx}
									>
										{option}
									</button>
								{/each}
							</div>
							{#if quizAnswered[i] !== undefined && section.explanation}
								<div class="quiz-explanation" class:correct={quizAnswered[i] === section.correct}>
									{quizAnswered[i] === section.correct ? '✅' : '❌'}
									{getContent(section.explanation)}
								</div>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		{#if problems.length > 0}
			<div class="practice-link card">
				<span>📝</span>
				<div>
					<strong>{t($locale, 'lesson.practice')}</strong>
					<p>{problems.length} {$locale === 'en' ? 'problems to practice' : 'လေ့ကျင့်ခန်းများ'}</p>
				</div>
				<a href="/student/lessons/{lessonId}/practice" class="btn btn-secondary">
					{$locale === 'en' ? 'Practice →' : 'လေ့ကျင့်မည် →'}
				</a>
			</div>
		{/if}

		{#if progress?.status !== 'completed'}
			<button class="btn btn-success complete-btn" onclick={handleComplete}>
				{t($locale, 'lesson.completed')} ✓
			</button>
		{:else}
			<a href="/student/lessons" class="btn btn-secondary complete-btn">
				← {t($locale, 'lesson.back')}
			</a>
		{/if}
	</div>
{/if}

<style>
	.lesson-page {
		padding-top: 1.25rem;
		padding-bottom: 3rem;
	}

	.back-link {
		font-size: 0.85rem;
		display: inline-block;
		margin-bottom: 0.5rem;
	}

	.lesson-title {
		font-size: 1.4rem;
		margin-bottom: 0.25rem;
	}

	.lesson-meta {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		font-size: 0.85rem;
		color: var(--color-text-secondary);
		margin-bottom: 1.5rem;
	}

	.badge-done {
		background: var(--color-success-light);
		color: #166534;
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.sections {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.explanation {
		line-height: 1.8;
		font-size: 0.95rem;
	}

	.explanation :global(strong) { font-weight: 700; }
	.explanation :global(code) {
		background: var(--color-bg);
		padding: 0.1em 0.35em;
		border-radius: 4px;
		font-family: var(--font-code);
		font-size: 0.9em;
	}

	.code-block {
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.code-block-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0.75rem;
		background: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
	}

	.code-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		text-transform: uppercase;
	}

	.code-pre {
		margin: 0;
		border-radius: 0;
	}

	.code-explanation {
		padding: 0.75rem;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		border-top: 1px solid var(--color-border);
		background: var(--color-surface);
	}

	.btn-sm {
		padding: 0.3rem 0.75rem;
		font-size: 0.8rem;
		min-height: 32px;
	}

	.try-it {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.try-it-prompt {
		font-size: 0.9rem;
		line-height: 1.7;
	}

	.run-row {
		display: flex;
		justify-content: flex-end;
	}

	.quiz {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.quiz-question {
		font-weight: 600;
		font-size: 0.95rem;
	}

	.quiz-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.quiz-option {
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-surface);
		text-align: left;
		font-size: 0.9rem;
		transition: background 0.15s;
		min-height: 48px;
	}

	.quiz-option:not(:disabled):hover {
		background: var(--color-hover);
	}

	.quiz-option.correct {
		background: var(--color-success-light);
		border-color: var(--color-success);
		color: #166534;
	}

	.quiz-option.wrong {
		background: var(--color-error-light);
		border-color: var(--color-error);
		color: #991b1b;
	}

	.quiz-explanation {
		padding: 0.75rem;
		border-radius: var(--radius);
		font-size: 0.875rem;
		background: var(--color-primary-light);
		color: var(--color-primary-dark);
	}

	.quiz-explanation.correct {
		background: var(--color-success-light);
		color: #166534;
	}

	.practice-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.practice-link > div {
		flex: 1;
	}

	.practice-link strong {
		display: block;
		font-size: 0.95rem;
	}

	.practice-link p {
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.complete-btn {
		width: 100%;
		justify-content: center;
		font-size: 1rem;
		padding: 0.875rem;
	}
</style>
