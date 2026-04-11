<script lang="ts">
	import { onMount } from 'svelte';
	import { restoreSession, currentUser } from '$lib/stores/auth';
	import { detectsZawgyi } from '$lib/utils/zawgyi-detect';
	import { initOnlineListener, refreshPendingCount, isOnline } from '$lib/stores/sync';
	import { loadProgress } from '$lib/stores/progress';
	import { seedDatabase } from '$lib/db/seed';
	import { db } from '$lib/db/schema';
	import { syncToServer } from '$lib/db/sync-engine';
	import { get } from 'svelte/store';
	import OfflineBanner from '$lib/components/layout/OfflineBanner.svelte';
	import '../app.css';

	let { children } = $props();
	let ready = $state(false);
	let showZawgyiWarning = $state(false);

	onMount(async () => {
		initOnlineListener();
		await seedDatabase();
		await restoreSession();
		await loadProgress();

		// Clear any sync queue items queued without a student_id (anonymous browsing)
		const user = get(currentUser);
		if (!user || user.role !== 'student') {
			await db.syncQueue.clear();
		}

		await refreshPendingCount();
		ready = true;
		showZawgyiWarning = detectsZawgyi();

		// Kick off sync if online and logged in as student
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
	{#if showZawgyiWarning}
		<div class="zawgyi-banner">
			⚠️ မြန်မာစာ မမှန်ကန်ဘဲ ပြနေပါက၊ ဤ app သည် Unicode ကို သာ သုံးပါသည်။ Zawgyi font ကို Unicode font ဖြင့် ပြောင်းပါ။
			<button onclick={() => showZawgyiWarning = false}>✕</button>
		</div>
	{/if}
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

	.zawgyi-banner {
		background: #fef3c7;
		color: #92400e;
		font-size: 0.82rem;
		padding: 0.5rem 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.zawgyi-banner button {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		color: inherit;
		flex-shrink: 0;
	}
</style>
