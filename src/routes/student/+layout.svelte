<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/auth';
	import Header from '$lib/components/layout/Header.svelte';
	import MobileNav from '$lib/components/layout/MobileNav.svelte';

	let { children } = $props();

	$effect(() => {
		if ($currentUser === null) {
			goto('/');
		}
	});
</script>

<Header />
<main class="main-content">
	{@render children()}
</main>
<MobileNav />

<style>
	.main-content {
		padding-bottom: 80px; /* room for mobile nav */
	}

	@media (min-width: 601px) {
		.main-content {
			padding-bottom: 0;
		}
	}
</style>
