<script lang="ts">
	import { locale } from '$lib/stores/locale';
</script>

<button class="lang-toggle" onclick={() => locale.set($locale === 'en' ? 'mm' : 'en')} aria-label="Switch language">
	{#if $locale === 'en'}
		<span class="flag">🇲🇲</span> မြန်မာ
	{:else}
		<span class="flag">🇬🇧</span> English
	{/if}
</button>

<style>
	.lang-toggle {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-surface);
		color: var(--color-text);
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
		min-height: 44px;
	}

	.lang-toggle:hover {
		background: var(--color-hover);
	}

	.flag {
		font-size: 1.1rem;
	}
</style>
