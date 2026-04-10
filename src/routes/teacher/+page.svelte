<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/auth';
	import { locale } from '$lib/stores/locale';
	import { getTeacherStudents, getAssignments } from '$lib/db/sync-engine';

	interface Student {
		id: string;
		display_name: string;
		age_group: string;
		preferred_language: string;
		created_at: string;
	}

	interface Assignment {
		id: string;
		title: string;
		problem_ids: string[];
		assigned_to: string[] | null;
		due_date: string | null;
		created_at: string;
	}

	let students = $state<Student[]>([]);
	let assignments = $state<Assignment[]>([]);
	let loading = $state(true);

	onMount(async () => {
		if (!$currentUser) return;
		const [s, a] = await Promise.all([
			getTeacherStudents($currentUser.id),
			getAssignments($currentUser.id)
		]);
		students = s as Student[];
		assignments = a as Assignment[];
		loading = false;
	});

	const t = (en: string, mm: string) => ($locale === 'en' ? en : mm);
</script>

<div class="teacher-dashboard">
	<h1 class="page-title">{t('Class Dashboard', 'အတန်း Dashboard')}</h1>

	{#if $currentUser?.teacherCode}
		<div class="class-code-banner card">
			<div>
				<p class="code-label">{t('Share this code with your students to join your class:', 'ဤကုဒ်ကို ကျောင်းသားများနှင့် မျှဝေပါ')}</p>
				<p class="code-value">{$currentUser.teacherCode}</p>
			</div>
			<p class="code-hint">
				{t('Students enter this code when creating their account.', 'ကျောင်းသားများသည် အကောင့်ဖောက်သည့်အခါ ဤကုဒ်ကို ထည့်ရမည်')}
			</p>
		</div>
	{/if}

	<!-- Summary cards -->
	<div class="summary-grid">
		<div class="summary-card card">
			<span class="summary-icon">👩‍🎓</span>
			<span class="summary-value">{students.length}</span>
			<span class="summary-label">{t('Students', 'ကျောင်းသားများ')}</span>
		</div>
		<div class="summary-card card">
			<span class="summary-icon">📋</span>
			<span class="summary-value">{assignments.length}</span>
			<span class="summary-label">{t('Assignments', 'လေ့ကျင့်ခန်းများ')}</span>
		</div>
	</div>

	<!-- Students list -->
	<section class="section">
		<h2 class="section-title">{t('Students', 'ကျောင်းသားများ')}</h2>

		{#if loading}
			<p class="loading-text">{t('Loading...', 'ခဏစောင့်ပါ...')}</p>
		{:else if students.length === 0}
			<div class="empty-state card">
				<p>{t('No students yet. Share your class code!', 'ကျောင်းသား မရှိသေးပါ။ Class code ကို မျှဝေပါ!')}</p>
			</div>
		{:else}
			<div class="students-list">
				{#each students as student}
					<a href="/teacher/students/{student.id}" class="student-row card">
						<div class="student-info">
							<span class="student-name">{student.display_name}</span>
							<span class="student-meta">
								{t('Age group:', 'အသက်အုပ်စု:')} {student.age_group}
								· {student.preferred_language === 'mm' ? 'မြန်မာ' : 'English'}
							</span>
						</div>
						<span class="arrow">→</span>
					</a>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Recent assignments -->
	<section class="section">
		<div class="section-header">
			<h2 class="section-title">{t('Assignments', 'လေ့ကျင့်ခန်းများ')}</h2>
			<a href="/teacher/assignments" class="btn-primary btn-sm">
				{t('+ New', '+ အသစ်')}
			</a>
		</div>

		{#if !loading && assignments.length === 0}
			<div class="empty-state card">
				<p>{t('No assignments yet.', 'လေ့ကျင့်ခန်း မရှိသေးပါ။')}</p>
			</div>
		{:else}
			<div class="assignments-list">
				{#each assignments.slice(0, 5) as a}
					<div class="assignment-row card">
						<div>
							<p class="assignment-title">{a.title}</p>
							<p class="assignment-meta">
								{a.problem_ids.length} {t('problems', 'ပြဿနာများ')}
								{#if a.due_date}
									· {t('Due', 'နောက်ဆုံးရက်')} {new Date(a.due_date).toLocaleDateString()}
								{/if}
							</p>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.page-title {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1.25rem;
	}

	.class-code-banner {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1.25rem 1.5rem;
		margin-bottom: 1.5rem;
		border-radius: 12px;
	}

	.code-label {
		font-size: 0.85rem;
		opacity: 0.9;
		margin-bottom: 0.4rem;
	}

	.code-value {
		font-size: 2rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		font-family: monospace;
	}

	.code-hint {
		font-size: 0.8rem;
		opacity: 0.75;
		margin-top: 0.5rem;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.summary-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.25rem;
		gap: 0.25rem;
		text-align: center;
	}

	.summary-icon {
		font-size: 1.5rem;
	}

	.summary-value {
		font-size: 2rem;
		font-weight: 800;
		color: var(--color-primary);
	}

	.summary-label {
		font-size: 0.8rem;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.section {
		margin-bottom: 2rem;
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.75rem;
	}

	.section-title {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-secondary);
		margin-bottom: 0.75rem;
	}

	.section-header .section-title {
		margin-bottom: 0;
	}

	.students-list, .assignments-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.student-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.85rem 1rem;
		text-decoration: none;
		color: var(--color-text);
		transition: background 0.15s;
	}

	.student-row:hover {
		background: var(--color-surface-hover, #f5f5f5);
	}

	.student-name {
		font-weight: 600;
		display: block;
	}

	.student-meta {
		font-size: 0.8rem;
		color: var(--color-text-secondary);
	}

	.arrow {
		color: var(--color-text-secondary);
	}

	.assignment-row {
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

	.empty-state {
		padding: 1.5rem;
		text-align: center;
		color: var(--color-text-secondary);
	}

	.loading-text {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}

	.btn-sm {
		padding: 0.3rem 0.75rem;
		font-size: 0.85rem;
	}
</style>
