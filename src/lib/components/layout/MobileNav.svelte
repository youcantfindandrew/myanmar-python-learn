<script lang="ts">
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';
	import { page } from '$app/state';
</script>

<nav class="mobile-nav">
	<a href="/student" class="mobile-nav-item" class:active={page.url.pathname === '/student'}>
		<span class="icon">📊</span>
		<span class="label">{t($locale, 'nav.dashboard')}</span>
	</a>
	<a href="/student/lessons" class="mobile-nav-item" class:active={page.url.pathname.startsWith('/student/lessons')}>
		<span class="icon">📖</span>
		<span class="label">{t($locale, 'nav.lessons')}</span>
	</a>
	<a href="/student/editor" class="mobile-nav-item" class:active={page.url.pathname === '/student/editor'}>
		<span class="icon">💻</span>
		<span class="label">{t($locale, 'nav.editor')}</span>
	</a>
	<a href="/student/progress" class="mobile-nav-item" class:active={page.url.pathname === '/student/progress'}>
		<span class="icon">📈</span>
		<span class="label">{t($locale, 'nav.progress')}</span>
	</a>
</nav>

<style>
	.mobile-nav {
		display: none;
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--color-surface);
		border-top: 1px solid var(--color-border);
		padding: 0.25rem 0;
		padding-bottom: env(safe-area-inset-bottom, 0);
		z-index: 100;
	}

	@media (max-width: 600px) {
		.mobile-nav {
			display: flex;
			justify-content: space-around;
		}
	}

	.mobile-nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.125rem;
		padding: 0.375rem 0.5rem;
		color: var(--color-text-secondary);
		text-decoration: none;
		font-size: 0.7rem;
		min-width: 64px;
		border-radius: var(--radius);
		min-height: 44px;
		justify-content: center;
	}

	.mobile-nav-item:hover {
		text-decoration: none;
	}

	.mobile-nav-item.active {
		color: var(--color-primary);
	}

	.icon {
		font-size: 1.25rem;
	}

	.label {
		font-weight: 500;
	}
</style>
