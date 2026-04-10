<script lang="ts">
	import { onMount } from 'svelte';
	import { progressMap } from '$lib/stores/progress';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';
	import { db, type LocalLesson } from '$lib/db/schema';
	import LessonCard from '$lib/components/lesson/LessonCard.svelte';

	let lessons = $state<LocalLesson[]>([]);

	onMount(async () => {
		lessons = await db.lessons.orderBy('orderIndex').toArray();
	});

	function isLocked(lesson: LocalLesson): boolean {
		return lesson.prerequisites.some((prereq) => {
			const prog = $progressMap.get(prereq);
			return !prog || prog.status !== 'completed';
		});
	}
</script>

<div class="container">
	<h1 class="page-title">{t($locale, 'nav.lessons')}</h1>
	<div class="lessons-list">
		{#each lessons as lesson}
			<LessonCard
				{lesson}
				progress={$progressMap.get(lesson.id)}
				locked={isLocked(lesson)}
			/>
		{/each}
	</div>
</div>

<style>
	.page-title {
		font-size: 1.4rem;
		padding: 1.25rem 0 1rem;
	}

	.lessons-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-bottom: 2rem;
	}
</style>
