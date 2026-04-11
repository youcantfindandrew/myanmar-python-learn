<script lang="ts">
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';
	import { initPyodide, runPython, pyodideStatus, pyodideLoadProgress } from '$lib/pyodide/bridge';
	import CodeEditor from '$lib/components/editor/CodeEditor.svelte';
	import OutputPanel from '$lib/components/editor/OutputPanel.svelte';

	let editor: any;
	let output = $state<{ stdout: string; error: string | null } | null>(null);
	let isRunning = $state(false);
	let isInitializing = $state(false);

	const statusLabel = $derived(
		$pyodideStatus === 'ready' ? t($locale, 'editor.ready') :
		$pyodideStatus === 'loading' ? t($locale, 'editor.loading') + ' ' + $pyodideLoadProgress + '%' :
		''
	);

	async function handleRun() {
		if ($pyodideStatus === 'idle' || $pyodideStatus === 'error') {
			isInitializing = true;
			await initPyodide();
			isInitializing = false;
		}

		isRunning = true;
		const code = editor?.getCode() ?? '';
		try {
			const result = await runPython(code);
			output = { stdout: result.stdout, error: result.error };
		} catch (e: any) {
			output = { stdout: '', error: e.message };
		}
		isRunning = false;
	}

	function handleClear() {
		output = null;
	}

	const DEFAULT_CODE = `# ${t('en', 'editor.title')} 🐍
# Write your Python code here!

name = "Aung"
print(f"Hello, {name}!")
print("Let's code together!")
`;
</script>

<div class="container editor-page">
	<div class="editor-header">
		<h1>🐍 {t($locale, 'editor.title')}</h1>
		{#if $pyodideStatus === 'ready'}
			<span class="status-badge ready">● {t($locale, 'editor.ready')}</span>
		{:else if $pyodideStatus === 'loading'}
			<span class="status-badge loading">⟳ {t($locale, 'editor.loading')} {$pyodideLoadProgress}%</span>
		{/if}
	</div>

	{#if $pyodideStatus === 'loading'}
		<div class="loading-bar">
			<div class="loading-bar-fill" style="width: {$pyodideLoadProgress}%"></div>
		</div>
		<p class="loading-label">{t($locale, 'editor.loading')}</p>
	{/if}

	<CodeEditor initialCode={DEFAULT_CODE} bind:this={editor} />

	<div class="editor-actions">
		<button class="btn btn-secondary" onclick={handleClear}>{t($locale, 'editor.clear')}</button>
		<button
			class="btn btn-primary"
			onclick={handleRun}
			disabled={isRunning || isInitializing}
		>
			{isRunning || isInitializing ? '...' : '▶ ' + t($locale, 'editor.run')}
		</button>
	</div>

	{#if output !== null}
		<OutputPanel stdout={output.stdout} error={output.error} {isRunning} />
	{/if}
</div>

<style>
	.editor-page {
		padding-top: 1.25rem;
		padding-bottom: 3rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.editor-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.editor-header h1 {
		font-size: 1.25rem;
	}

	.status-badge {
		font-size: 0.8rem;
		font-weight: 600;
		padding: 0.25rem 0.625rem;
		border-radius: 999px;
	}

	.status-badge.ready {
		background: var(--color-success-light);
		color: #166534;
	}

	.status-badge.loading {
		background: var(--color-warning-light);
		color: #92400e;
	}

	.loading-bar {
		height: 6px;
		background: var(--color-border);
		border-radius: 3px;
		overflow: hidden;
	}

	.loading-bar-fill {
		height: 100%;
		background: var(--color-primary);
		border-radius: 3px;
		transition: width 0.3s ease;
	}

	.loading-label {
		font-size: 0.85rem;
		color: var(--color-text-secondary);
		text-align: center;
	}

	.editor-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
	}
</style>
