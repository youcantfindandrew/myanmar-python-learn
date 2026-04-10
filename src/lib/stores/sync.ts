import { writable, derived } from 'svelte/store';
import { db } from '$lib/db/schema';

export const isOnline = writable(typeof navigator !== 'undefined' ? navigator.onLine : true);
export const pendingSyncCount = writable(0);
export const isSyncing = writable(false);

export const syncStatus = derived(
	[isOnline, pendingSyncCount, isSyncing],
	([$online, $pending, $syncing]) => {
		if ($syncing) return 'syncing' as const;
		if (!$online) return 'offline' as const;
		if ($pending > 0) return 'pending' as const;
		return 'synced' as const;
	}
);

export function initOnlineListener(): void {
	if (typeof window === 'undefined') return;
	window.addEventListener('online', () => isOnline.set(true));
	window.addEventListener('offline', () => isOnline.set(false));
}

export async function refreshPendingCount(): Promise<void> {
	const count = await db.syncQueue.count();
	pendingSyncCount.set(count);
}
