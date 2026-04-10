<script lang="ts">
	import LanguageToggle from './LanguageToggle.svelte';
	import { locale } from '$lib/stores/locale';
	import { currentUser } from '$lib/stores/auth';
	import { t } from '$lib/i18n';

	let { showNav = true }: { showNav?: boolean } = $props();
</script>

<header class="header">
	<div class="header-inner">
		<a href="/student" class="logo">
			<span class="logo-icon">🐍</span>
			<span class="logo-text">{t($locale, 'app.name')}</span>
		</a>

		{#if showNav && $currentUser}
			<nav class="nav">
				<a href="/student" class="nav-link">{t($locale, 'nav.dashboard')}</a>
				<a href="/student/lessons" class="nav-link">{t($locale, 'nav.lessons')}</a>
				<a href="/student/editor" class="nav-link">{t($locale, 'nav.editor')}</a>
			</nav>
		{/if}

		<div class="header-actions">
			<LanguageToggle />
		</div>
	</div>
</header>

<style>
	.header {
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.header-inner {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 1rem;
		max-width: 1100px;
		margin: 0 auto;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--color-text);
		font-weight: 700;
		font-size: 1.1rem;
		flex-shrink: 0;
	}

	.logo-icon {
		font-size: 1.5rem;
	}

	.nav {
		display: flex;
		gap: 0.25rem;
		overflow-x: auto;
		flex: 1;
	}

	.nav-link {
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius);
		color: var(--color-text-secondary);
		font-size: 0.875rem;
		font-weight: 500;
		white-space: nowrap;
		text-decoration: none;
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.nav-link:hover {
		background: var(--color-hover);
		color: var(--color-text);
		text-decoration: none;
	}

	.header-actions {
		flex-shrink: 0;
		margin-left: auto;
	}

	@media (max-width: 600px) {
		.nav {
			display: none;
		}
	}
</style>
