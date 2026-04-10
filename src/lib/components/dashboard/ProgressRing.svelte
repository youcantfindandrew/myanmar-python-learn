<script lang="ts">
	let { percent = 0, size = 80, strokeWidth = 6 }: { percent?: number; size?: number; strokeWidth?: number } = $props();

	const radius = $derived((size - strokeWidth) / 2);
	const circumference = $derived(2 * Math.PI * radius);
	const offset = $derived(circumference - (percent / 100) * circumference);
</script>

<svg width={size} height={size} class="progress-ring">
	<circle
		cx={size / 2}
		cy={size / 2}
		r={radius}
		fill="none"
		stroke="var(--color-border)"
		stroke-width={strokeWidth}
	/>
	<circle
		cx={size / 2}
		cy={size / 2}
		r={radius}
		fill="none"
		stroke="var(--color-primary)"
		stroke-width={strokeWidth}
		stroke-dasharray={circumference}
		stroke-dashoffset={offset}
		stroke-linecap="round"
		transform="rotate(-90 {size / 2} {size / 2})"
	/>
	<text
		x={size / 2}
		y={size / 2}
		text-anchor="middle"
		dominant-baseline="central"
		font-size={size * 0.22}
		font-weight="700"
		fill="var(--color-text)"
	>
		{Math.round(percent)}%
	</text>
</svg>

<style>
	.progress-ring {
		display: block;
	}

	circle:last-of-type {
		transition: stroke-dashoffset 0.5s ease;
	}
</style>
