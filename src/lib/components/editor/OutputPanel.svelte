<script lang="ts">
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';

	let { stdout = '', error = null, isRunning = false }: {
		stdout?: string;
		error?: string | null;
		isRunning?: boolean;
	} = $props();
</script>

<div class="output-panel">
	<div class="output-header">
		<span class="output-title">
			{error ? t($locale, 'lesson.error') : t($locale, 'lesson.output')}
		</span>
		{#if isRunning}
			<span class="running-indicator">...</span>
		{/if}
	</div>
	<pre class="output-content" class:has-error={!!error}>
{#if isRunning}Running...{:else if error}{error}{:else if stdout}{stdout}{:else}<span class="placeholder">Output will appear here</span>{/if}
	</pre>
</div>

<style>
	.output-panel {
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		overflow: hidden;
	}

	.output-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0.75rem;
		background: var(--color-bg);
		border-bottom: 1px solid var(--color-border);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text-secondary);
	}

	.running-indicator {
		animation: dots 1.5s steps(4, end) infinite;
	}

	@keyframes dots {
		0%, 20% { content: ''; }
		40% { content: '.'; }
		60% { content: '..'; }
		80%, 100% { content: '...'; }
	}

	.output-content {
		margin: 0;
		padding: 0.75rem;
		min-height: 60px;
		max-height: 200px;
		overflow-y: auto;
		font-size: 0.85rem;
		background: #1e293b;
		color: #e2e8f0;
		white-space: pre-wrap;
		word-break: break-word;
		border-radius: 0;
	}

	.has-error {
		color: #fca5a5;
		background: #1e1215;
	}

	.placeholder {
		color: #64748b;
		font-style: italic;
	}
</style>
