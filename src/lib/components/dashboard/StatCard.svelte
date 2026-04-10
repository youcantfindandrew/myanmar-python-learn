<script lang="ts">
	let { label, value, icon }: { label: string; value: string | number; icon: string } = $props();
</script>

<div class="stat-card card">
	<span class="stat-icon">{icon}</span>
	<div class="stat-content">
		<div class="stat-value">{value}</div>
		<div class="stat-label">{label}</div>
	</div>
</div>

<style>
	.stat-card {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
	}

	.stat-icon {
		font-size: 1.75rem;
		flex-shrink: 0;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text);
		line-height: 1.2;
	}

	.stat-label {
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		font-weight: 500;
	}
</style>
