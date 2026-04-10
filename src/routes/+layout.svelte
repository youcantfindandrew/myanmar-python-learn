<script lang="ts">
	import { onMount } from 'svelte';
	import { restoreSession, currentUser } from '$lib/stores/auth';
	import { initOnlineListener, refreshPendingCount, isOnline } from '$lib/stores/sync';
	import { loadProgress } from '$lib/stores/progress';
	import { seedDatabase } from '$lib/db/seed';
	import { syncToServer } from '$lib/db/sync-engine';
	import { get } from 'svelte/store';
	import OfflineBanner from '$lib/components/layout/OfflineBanner.svelte';
	import '../app.css';

	let { children } = $props();
	let ready = $state(false);

	onMount(async () => {
		initOnlineListener();
		await seedDatabase();
		await restoreSession();
		await loadProgress();
		await refreshPendingCount();
		ready = true;

		// Kick off sync if online and logged in as student
		const user = get(currentUser);
		if (user && user.role === 'student' && get(isOnline)) {
			syncToServer(user.id).catch(() => {});
		}

		// Re-sync whenever we come back online
		window.addEventListener('online', () => {
			const u = get(currentUser);
			if (u && u.role === 'student') syncToServer(u.id).catch(() => {});
		});
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#2563eb" />
</svelte:head>

{#if ready}
	<OfflineBanner />
	{@render children()}
{:else}
	<div class="loading">
		<div class="loading-spinner"></div>
		<p>Loading...</p>
	</div>
{/if}

<style>
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100dvh;
		gap: 1rem;
		color: var(--color-text-secondary);
	}

	.loading-spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--color-border);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
