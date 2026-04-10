<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/auth';
	import { locale } from '$lib/stores/locale';
	import { getAssignments, createAssignment, getTeacherStudents } from '$lib/db/sync-engine';
	import { db } from '$lib/db/schema';

	interface Assignment {
		id: string;
		title: string;
		problem_ids: string[];
		assigned_to: string[] | null;
		due_date: string | null;
		created_at: string;
	}

	interface Student { id: string; display_name: string }
	interface Problem { id: string; titleEn: string; titleMm: string; lessonId: string }

	let assignments = $state<Assignment[]>([]);
	let students = $state<Student[]>([]);
	let problems = $state<Problem[]>([]);
	let loading = $state(true);
	let showForm = $state(false);
	let saving = $state(false);
	let error = $state('');

	// Form state
	let title = $state('');
	let selectedProblemIds = $state<string[]>([]);
	let assignedTo = $state<string[]>([]); // empty = whole class
	let dueDate = $state('');

	onMount(async () => {
		if (!$currentUser) return;
		const [a, s, p] = await Promise.all([
			getAssignments($currentUser.id),
			getTeacherStudents($currentUser.id),
			db.problems.orderBy('orderIndex').toArray()
		]);
		assignments = a as Assignment[];
		students = s as Student[];
		problems = p;
		loading = false;
	});

	async function handleCreate() {
		if (!title.trim() || selectedProblemIds.length === 0) {
			error = $locale === 'en' ? 'Title and at least one problem required.' : 'ခေါင်းစဉ်နှင့် ပြဿနာတစ်ခုလည်း လိုသည်';
			return;
		}
		saving = true;
		error = '';
		const result = await createAssignment({
			teacher_id: $currentUser!.id,
			title: title.trim(),
			problem_ids: selectedProblemIds,
			assigned_to: assignedTo.length > 0 ? assignedTo : null,
			due_date: dueDate || null
		});
		saving = false;
		if (result.error) {
			error = String(result.error.message ?? result.error);
		} else {
			assignments = [result.data as Assignment, ...assignments];
			title = '';
			selectedProblemIds = [];
			assignedTo = [];
			dueDate = '';
			showForm = false;
		}
	}

	function toggleProblem(id: string) {
		if (selectedProblemIds.includes(id)) {
			selectedProblemIds = selectedProblemIds.filter((p) => p !== id);
		} else {
			selectedProblemIds = [...selectedProblemIds, id];
		}
	}

	function toggleStudent(id: string) {
		if (assignedTo.includes(id)) {
			assignedTo = assignedTo.filter((s) => s !== id);
		} else {
			assignedTo = [...assignedTo, id];
		}
	}

	const t = (en: string, mm: string) => ($locale === 'en' ? en : mm);
</script>

<div class="assignments-page">
	<div class="page-header">
		<h1 class="page-title">{t('Assignments', 'လေ့ကျင့်ခန်းများ')}</h1>
		<button class="btn-primary" onclick={() => { showForm = !showForm; error = ''; }}>
			{showForm ? t('Cancel', 'မလုပ်တော့') : t('+ New Assignment', '+ လေ့ကျင့်ခန်း အသစ်')}
		</button>
	</div>

	<!-- Create form -->
	{#if showForm}
		<div class="create-form card">
			<h2 class="form-title">{t('Create Assignment', 'လေ့ကျင့်ခန်း ဖောက်')}</h2>

			{#if error}
				<p class="error-msg">{error}</p>
			{/if}

			<div class="form-group">
				<label>{t('Title', 'ခေါင်းစဉ်')}</label>
				<input type="text" bind:value={title} placeholder={t('e.g. Week 1 Practice', 'ဥပမာ - ပထမပတ် လေ့ကျင့်ခန်း')} />
			</div>

			<div class="form-group">
				<label>{t('Problems', 'ပြဿနာများ')} ({selectedProblemIds.length} {t('selected', 'ရွေး')})</label>
				<div class="checkbox-list">
					{#each problems as prob}
						<label class="checkbox-row">
							<input
								type="checkbox"
								checked={selectedProblemIds.includes(prob.id)}
								onchange={() => toggleProblem(prob.id)}
							/>
							<span>{$locale === 'en' ? prob.titleEn : prob.titleMm}</span>
						</label>
					{/each}
				</div>
			</div>

			<div class="form-group">
				<label>
					{t('Assign to', 'သတ်မှတ်')}&nbsp;
					<span class="hint">({t('leave empty = whole class', 'ရွေးချယ်မှမရှိ = အတန်းလုံး')})</span>
				</label>
				<div class="checkbox-list">
					{#each students as student}
						<label class="checkbox-row">
							<input
								type="checkbox"
								checked={assignedTo.includes(student.id)}
								onchange={() => toggleStudent(student.id)}
							/>
							<span>{student.display_name}</span>
						</label>
					{/each}
				</div>
			</div>

			<div class="form-group">
				<label>{t('Due date (optional)', 'နောက်ဆုံးရက် (မဖြစ်မနေ မဟုတ်)')}</label>
				<input type="date" bind:value={dueDate} />
			</div>

			<button class="btn-primary" onclick={handleCreate} disabled={saving}>
				{saving ? t('Saving...', 'သိမ်းနေသည်...') : t('Create', 'ဖောက်မည်')}
			</button>
		</div>
	{/if}

	<!-- List -->
	{#if loading}
		<p class="loading">{t('Loading...', 'ခဏစောင့်ပါ...')}</p>
	{:else if assignments.length === 0}
		<div class="empty-state card">
			<p>{t('No assignments yet. Create one above!', 'လေ့ကျင့်ခန်း မရှိသေးပါ')}</p>
		</div>
	{:else}
		<div class="assignments-list">
			{#each assignments as a}
				<div class="assignment-card card">
					<div class="assignment-info">
						<p class="assignment-title">{a.title}</p>
						<p class="assignment-meta">
							{a.problem_ids.length} {t('problems', 'ပြဿနာ')}
							{#if a.assigned_to}
								· {a.assigned_to.length} {t('students', 'ကျောင်းသား')}
							{:else}
								· {t('Whole class', 'အတန်းလုံး')}
							{/if}
							{#if a.due_date}
								· {t('Due', 'နောက်ဆုံးရက်')} {new Date(a.due_date).toLocaleDateString()}
							{/if}
						</p>
					</div>
					<span class="created-at">{new Date(a.created_at).toLocaleDateString()}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}

	.page-title {
		font-size: 1.4rem;
		font-weight: 700;
	}

	.create-form {
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.form-title {
		font-size: 1.1rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		font-size: 0.85rem;
		font-weight: 600;
		margin-bottom: 0.4rem;
		color: var(--color-text-secondary);
	}

	.form-group input[type="text"],
	.form-group input[type="date"] {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		font-size: 0.9rem;
		background: var(--color-bg);
		color: var(--color-text);
	}

	.checkbox-list {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		max-height: 200px;
		overflow-y: auto;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		padding: 0.5rem 0.75rem;
	}

	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.hint {
		font-weight: 400;
		font-size: 0.78rem;
		color: var(--color-text-secondary);
	}

	.error-msg {
		color: #dc2626;
		font-size: 0.85rem;
		margin-bottom: 0.75rem;
	}

	.assignments-list {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.assignment-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.85rem 1rem;
	}

	.assignment-title {
		font-weight: 600;
		margin-bottom: 0.2rem;
	}

	.assignment-meta {
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.created-at {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
		white-space: nowrap;
	}

	.empty-state {
		padding: 1.5rem;
		text-align: center;
		color: var(--color-text-secondary);
	}

	.loading {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}
</style>
