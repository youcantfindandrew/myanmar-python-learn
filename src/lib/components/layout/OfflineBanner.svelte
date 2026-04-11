<script lang="ts">
	import { syncStatus, pendingSyncCount } from '$lib/stores/sync';
	import { currentUser } from '$lib/stores/auth';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';
</script>

{#if $syncStatus !== 'synced' && $currentUser !== null}
	<div class="offline-banner" class:offline={$syncStatus === 'offline'} class:pending={$syncStatus === 'pending'} class:syncing={$syncStatus === 'syncing'}>
		<span class="dot" class:pulse={$syncStatus === 'syncing'}></span>
		{#if $syncStatus === 'offline'}
			{t($locale, 'offline.banner')}
		{:else if $syncStatus === 'syncing'}
			{t($locale, 'offline.syncing')}
		{:else}
			{t($locale, 'offline.pending', { count: $pendingSyncCount })}
		{/if}
	</div>
{/if}

<style>
	.offline-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
		font-weight: 500;
		text-align: center;
		justify-content: center;
	}

	.offline {
		background: var(--color-warning-light);
		color: #92400e;
	}

	.pending {
		background: var(--color-warning-light);
		color: #92400e;
	}

	.syncing {
		background: var(--color-primary-light);
		color: var(--color-primary-dark);
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.offline .dot { background: var(--color-warning); }
	.pending .dot { background: var(--color-warning); }
	.syncing .dot { background: var(--color-primary); }

	.pulse {
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}
</style>
