<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { db, type LocalProblem } from '$lib/db/schema';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';
	import { initPyodide, runPython, pyodideStatus } from '$lib/pyodide/bridge';
	import { offlineHint } from '$lib/ai/fallback';
	import CodeEditor from '$lib/components/editor/CodeEditor.svelte';
	import OutputPanel from '$lib/components/editor/OutputPanel.svelte';

	const lessonId = $derived(page.params.lessonId as string);

	let problems = $state<LocalProblem[]>([]);
	let currentIdx = $state(0);
	let editors: Record<number, any> = {};
	let output = $state<{ stdout: string; error: string | null } | null>(null);
	let isRunning = $state(false);
	let testResults = $state<{ passed: boolean; expectedOutput: string; actualOutput: string }[]>([]);
	let allPassed = $state(false);
	let hintIndex = $state(0);
	let showHint = $state(false);
	let attemptStart = Date.now();

	// AI hint
	let aiHint = $state<string | null>(null);
	let aiLoading = $state(false);

	async function askAI() {
		if (!currentProblem) return;
		aiLoading = true;
		aiHint = null;
		const code = editors[currentIdx]?.getCode() ?? currentProblem.starterCode;
		const desc = $locale === 'en' ? currentProblem.descriptionEn : currentProblem.descriptionMm;
		const errorMsg = output?.error ?? null;

		try {
			const res = await fetch('/api/ai/hint', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code, errorMsg, problemDesc: desc, language: $locale })
			});
			if (res.ok) {
				const data = await res.json();
				aiHint = data.hint ?? offlineHint(code, errorMsg, $locale);
			} else {
				aiHint = offlineHint(code, errorMsg, $locale);
			}
		} catch {
			aiHint = offlineHint(code, errorMsg, $locale);
		}
		aiLoading = false;
	}

	onMount(async () => {
		problems = await db.problems.where('lessonId').equals(lessonId).sortBy('orderIndex');
	});

	const currentProblem = $derived(problems[currentIdx]);

	function getTitle(p: LocalProblem) { return $locale === 'en' ? p.titleEn : p.titleMm; }
	function getDesc(p: LocalProblem) { return $locale === 'en' ? p.descriptionEn : p.descriptionMm; }
	function getHint(p: LocalProblem) {
		const hints = $locale === 'en' ? p.hintsEn : p.hintsMm;
		return hints[hintIndex] ?? hints[0] ?? '';
	}

	async function handleSubmit() {
		if (!currentProblem) return;

		if ($pyodideStatus !== 'ready') {
			await initPyodide();
		}

		isRunning = true;
		output = null;
		testResults = [];
		allPassed = false;

		const code = editors[currentIdx]?.getCode() ?? currentProblem.starterCode;
		const timeSpent = Math.round((Date.now() - attemptStart) / 1000);

		const results: typeof testResults = [];
		let passedAll = true;

		for (const tc of currentProblem.testCases) {
			// Pass inputs to the worker — it stubs input() automatically
			const result = await runPython(code, tc.input || '');
			const actual = (result.stdout || '').trim();
			const expected = tc.expectedOutput.trim();
			const passed = actual === expected || tc.expectedOutput === '';
			if (!passed) passedAll = false;
			if (!tc.hidden) {
				results.push({ passed, expectedOutput: expected, actualOutput: actual });
			}
			output = { stdout: result.stdout, error: result.error };
		}

		testResults = results;
		allPassed = passedAll;

		// Record attempt
		await db.attempts.add({
			id: crypto.randomUUID(),
			problemId: currentProblem.id,
			code,
			passed: passedAll,
			testsPassed: results.filter((r) => r.passed).length,
			testsTotal: currentProblem.testCases.length,
			errorMessage: output?.error ?? undefined,
			timeSpentSeconds: timeSpent,
			attemptedAt: Date.now(),
			synced: false
		});

		isRunning = false;
	}

	function nextProblem() {
		if (currentIdx < problems.length - 1) {
			currentIdx++;
			output = null;
			testResults = [];
			allPassed = false;
			hintIndex = 0;
			showHint = false;
			attemptStart = Date.now();
		}
	}
</script>

<div class="container practice-page">
	<div class="practice-header">
		<a href="/student/lessons/{lessonId}" class="back-link">← {t($locale, 'lesson.back')}</a>
		<h1>{t($locale, 'lesson.practice')}</h1>
		{#if problems.length > 0}
			<p class="problem-counter">{currentIdx + 1} / {problems.length}</p>
		{/if}
	</div>

	{#if currentProblem}
		<div class="problem-card card">
			<h2 class="problem-title">{getTitle(currentProblem)}</h2>
			<p class="problem-desc">{getDesc(currentProblem)}</p>
		</div>

		<CodeEditor
			initialCode={currentProblem.starterCode}
			bind:this={editors[currentIdx]}
		/>

		<div class="action-row">
			<button class="btn btn-secondary" onclick={() => { showHint = !showHint; aiHint = null; }}>
				💡 {t($locale, 'problem.hint')}
			</button>
			<button class="btn btn-secondary" onclick={askAI} disabled={aiLoading}>
				{aiLoading ? '⏳' : '🤖'} {$locale === 'en' ? 'AI Help' : 'AI အကူ'}
			</button>
			<button class="btn btn-primary" onclick={handleSubmit} disabled={isRunning}>
				{isRunning ? '...' : t($locale, 'problem.submit')}
			</button>
		</div>

		{#if showHint}
			<div class="hint-box card">
				<strong>💡 {$locale === 'en' ? 'Hint' : 'အကြံပေးချက်'}:</strong>
				<p>{getHint(currentProblem)}</p>
				{#if hintIndex < (($locale === 'en' ? currentProblem.hintsEn : currentProblem.hintsMm).length - 1)}
					<button class="btn btn-secondary btn-sm" onclick={() => hintIndex++}>
						{$locale === 'en' ? 'Next hint →' : 'နောက်အကြံပေးချက် →'}
					</button>
				{/if}
			</div>
		{/if}

		{#if aiHint}
			<div class="hint-box ai-hint card">
				<strong>🤖 {$locale === 'en' ? 'AI Hint' : 'AI အကြံပေး'}:</strong>
				<p>{aiHint}</p>
			</div>
		{/if}

		{#if output !== null}
			<OutputPanel stdout={output.stdout} error={output.error} {isRunning} />
		{/if}

		{#if testResults.length > 0}
			<div class="test-results card">
				<h3 class:passed={allPassed} class:failed={!allPassed}>
					{allPassed ? '🎉 ' + t($locale, 'problem.passed') : t($locale, 'problem.failed')}
				</h3>
				{#each testResults as result}
					<div class="test-case" class:pass={result.passed} class:fail={!result.passed}>
						<span class="test-icon">{result.passed ? '✅' : '❌'}</span>
						<div class="test-detail">
							<div>Expected: <code>{result.expectedOutput || '(any output)'}</code></div>
							{#if !result.passed}
								<div>Got: <code>{result.actualOutput || '(no output)'}</code></div>
							{/if}
						</div>
					</div>
				{/each}
				{#if allPassed && currentIdx < problems.length - 1}
					<button class="btn btn-success full-width" onclick={nextProblem}>
						{$locale === 'en' ? 'Next Problem →' : 'နောက်ပုစ္ဆာ →'}
					</button>
				{:else if allPassed}
					<a href="/student/lessons/{lessonId}" class="btn btn-success full-width">
						{$locale === 'en' ? '🎉 All done! Back to lesson' : '🎉 ပြီးပါပြီ! သင်ခန်းစာသို့ ပြန်သွားမည်'}
					</a>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="empty">
			{$locale === 'en' ? 'No practice problems yet.' : 'လေ့ကျင့်ခန်းမရှိသေးပါ။'}
		</div>
	{/if}
</div>

<style>
	.practice-page {
		padding-top: 1.25rem;
		padding-bottom: 3rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.back-link { font-size: 0.85rem; }

	.practice-header h1 { font-size: 1.25rem; }

	.problem-counter {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
	}

	.problem-title { font-size: 1rem; margin-bottom: 0.5rem; }
	.problem-desc {
		font-size: 0.9rem;
		white-space: pre-wrap;
		color: var(--color-text-secondary);
	}

	.action-row {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}

	.hint-box { font-size: 0.9rem; }
	.hint-box p { margin-top: 0.25rem; }
	.ai-hint { border-left: 3px solid var(--color-primary); }

	.btn-sm { padding: 0.3rem 0.75rem; font-size: 0.8rem; min-height: 32px; margin-top: 0.5rem; }

	.test-results {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.test-results h3 { font-size: 1rem; }
	.test-results h3.passed { color: var(--color-success); }
	.test-results h3.failed { color: var(--color-error); }

	.test-case {
		display: flex;
		gap: 0.5rem;
		align-items: flex-start;
		font-size: 0.85rem;
		padding: 0.5rem;
		border-radius: var(--radius);
	}

	.test-case.pass { background: var(--color-success-light); }
	.test-case.fail { background: var(--color-error-light); }

	.test-detail code {
		font-family: var(--font-code);
		background: rgba(0,0,0,0.06);
		padding: 0.1em 0.3em;
		border-radius: 3px;
	}

	.full-width { width: 100%; justify-content: center; }

	.empty {
		text-align: center;
		color: var(--color-text-secondary);
		padding: 2rem;
	}
</style>
