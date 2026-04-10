<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, logout } from '$lib/stores/auth';
	import { locale } from '$lib/stores/locale';

	let { children } = $props();

	$effect(() => {
		if ($currentUser === null) {
			goto('/');
		} else if ($currentUser.role !== 'teacher') {
			goto('/student');
		}
	});

	function handleLogout() {
		logout();
		goto('/');
	}
</script>

<header class="teacher-header">
	<div class="container header-inner">
		<a href="/teacher" class="brand">
			<span class="brand-icon">🐍</span>
			<span class="brand-text">{$locale === 'en' ? 'Teacher Portal' : 'ဆရာ Portal'}</span>
		</a>
		<nav class="teacher-nav">
			<a href="/teacher" class="nav-link">
				{$locale === 'en' ? 'Dashboard' : 'Dashboard'}
			</a>
			<a href="/teacher/assignments" class="nav-link">
				{$locale === 'en' ? 'Assignments' : 'လေ့ကျင့်ခန်းများ'}
			</a>
		</nav>
		<div class="header-actions">
			<span class="teacher-name">{$currentUser?.displayName ?? ''}</span>
			{#if $currentUser?.teacherCode}
				<span class="class-code">
					{$locale === 'en' ? 'Code:' : 'ကုဒ်:'}
					<strong>{$currentUser.teacherCode}</strong>
				</span>
			{/if}
			<button class="btn-outline btn-sm" onclick={handleLogout}>
				{$locale === 'en' ? 'Log out' : 'ထွက်မည်'}
			</button>
		</div>
	</div>
</header>

<main class="teacher-main container">
	{@render children()}
</main>

<style>
	.teacher-header {
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 100;
		padding: 0.75rem 0;
	}

	.header-inner {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		font-size: 1rem;
		text-decoration: none;
		color: var(--color-text);
	}

	.teacher-nav {
		display: flex;
		gap: 1rem;
		flex: 1;
	}

	.nav-link {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		text-decoration: none;
		padding: 0.25rem 0;
		border-bottom: 2px solid transparent;
		transition: color 0.15s, border-color 0.15s;
	}

	.nav-link:hover {
		color: var(--color-primary);
		border-bottom-color: var(--color-primary);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-left: auto;
	}

	.teacher-name {
		font-weight: 600;
		font-size: 0.9rem;
	}

	.class-code {
		font-size: 0.85rem;
		background: var(--color-primary-light, #e8f0fe);
		color: var(--color-primary);
		padding: 0.2rem 0.6rem;
		border-radius: 6px;
	}

	.btn-sm {
		padding: 0.3rem 0.75rem;
		font-size: 0.85rem;
	}

	.teacher-main {
		padding-top: 1.5rem;
		padding-bottom: 3rem;
	}

	@media (max-width: 600px) {
		.teacher-nav {
			display: none;
		}
		.teacher-name {
			display: none;
		}
	}
</style>
