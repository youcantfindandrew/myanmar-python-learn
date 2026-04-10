<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, createStudent, loginWithPin, teacherLogin, teacherSignUp } from '$lib/stores/auth';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';
	import { db } from '$lib/db/schema';
	import LanguageToggle from '$lib/components/layout/LanguageToggle.svelte';

	// ── shared ───────────────────────────────────────────────────────────────────
	let tab = $state<'student' | 'teacher'>('student');
	let error = $state('');

	$effect(() => {
		if ($currentUser) {
			goto($currentUser.role === 'teacher' ? '/teacher' : '/student');
		}
	});

	// ── student state ─────────────────────────────────────────────────────────
	let students = $state<{ id: string; displayName: string }[]>([]);
	let studentMode = $state<'select' | 'login' | 'register'>('select');
	let selectedName = $state('');
	let pin = $state('');
	let newName = $state('');
	let newPin = $state('');
	let newAge = $state('9-11');
	let teacherCode = $state('');

	$effect(() => {
		loadStudents();
	});

	async function loadStudents() {
		const profiles = await db.profiles.where('role').equals('student').toArray();
		students = profiles.map((p) => ({ id: p.id, displayName: p.displayName }));
	}

	async function handleStudentLogin() {
		error = '';
		const success = await loginWithPin(selectedName, pin);
		if (!success) error = t($locale, 'auth.wrongPin');
	}

	async function handleStudentRegister() {
		if (!newName.trim() || !newPin.trim()) return;
		error = '';
		await createStudent(newName.trim(), newPin, newAge, teacherCode.trim() || undefined);
	}

	// ── teacher state ─────────────────────────────────────────────────────────
	let teacherMode = $state<'login' | 'signup'>('login');
	let tEmail = $state('');
	let tPassword = $state('');
	let tName = $state('');
	let tLoading = $state(false);

	async function handleTeacherLogin() {
		if (!tEmail.trim() || !tPassword.trim()) return;
		tLoading = true;
		error = '';
		const result = await teacherLogin(tEmail.trim(), tPassword.trim());
		tLoading = false;
		if (result.error) error = result.error;
	}

	async function handleTeacherSignUp() {
		if (!tName.trim() || !tEmail.trim() || !tPassword.trim()) return;
		tLoading = true;
		error = '';
		const result = await teacherSignUp(tEmail.trim(), tPassword.trim(), tName.trim());
		tLoading = false;
		if (result.error) error = result.error;
	}
</script>

<div class="login-page">
	<div class="login-card card">
		<div class="login-header">
			<span class="logo-icon">🐍</span>
			<h1>{t($locale, 'app.name')}</h1>
			<p class="tagline">{t($locale, 'app.tagline')}</p>
			<div class="lang-row"><LanguageToggle /></div>
		</div>

		<!-- Tab switcher -->
		<div class="tabs">
			<button class="tab-btn" class:active={tab === 'student'} onclick={() => { tab = 'student'; error = ''; }}>
				{$locale === 'en' ? '👩‍💻 Student' : '👩‍💻 ကျောင်းသား'}
			</button>
			<button class="tab-btn" class:active={tab === 'teacher'} onclick={() => { tab = 'teacher'; error = ''; }}>
				{$locale === 'en' ? '🧑‍🏫 Teacher' : '🧑‍🏫 ဆရာ/ဆရာမ'}
			</button>
		</div>

		<!-- ── STUDENT TAB ──────────────────────────────────────────────────── -->
		{#if tab === 'student'}
			{#if studentMode === 'select'}
				{#if students.length > 0}
					<div class="student-list">
						{#each students as student}
							<button
								class="student-btn"
								onclick={() => { selectedName = student.displayName; studentMode = 'login'; error = ''; pin = ''; }}
							>
								<span class="avatar">👤</span>
								{student.displayName}
							</button>
						{/each}
					</div>
				{/if}
				<button class="btn btn-primary full-width" onclick={() => { studentMode = 'register'; error = ''; }}>
					{students.length > 0
						? ($locale === 'en' ? '+ New Student' : '+ ကျောင်းသားသစ်')
						: t($locale, 'auth.login')}
				</button>

			{:else if studentMode === 'login'}
				<div class="login-form">
					<p class="selected-name">👤 {selectedName}</p>
					<label class="field">
						<span>{t($locale, 'auth.enterPin')}</span>
						<input
							type="password"
							inputmode="numeric"
							maxlength="6"
							bind:value={pin}
							onkeydown={(e) => e.key === 'Enter' && handleStudentLogin()}
							placeholder="••••"
						/>
					</label>
					{#if error}<p class="error">{error}</p>{/if}
					<button class="btn btn-primary full-width" onclick={handleStudentLogin}>
						{t($locale, 'auth.login')}
					</button>
					<button class="btn btn-secondary full-width" onclick={() => { studentMode = 'select'; pin = ''; error = ''; }}>
						{t($locale, 'lesson.back')}
					</button>
				</div>

			{:else}
				<!-- Register -->
				<div class="login-form">
					<label class="field">
						<span>{$locale === 'en' ? 'Your Name' : 'သင့်နာမည်'}</span>
						<input type="text" bind:value={newName} placeholder="Aung" />
					</label>
					<label class="field">
						<span>{$locale === 'en' ? 'Choose a PIN (4-6 digits)' : 'PIN ရွေးပါ (ဂဏန်း ၄-၆ လုံး)'}</span>
						<input type="password" inputmode="numeric" maxlength="6" bind:value={newPin} placeholder="••••" />
					</label>
					<label class="field">
						<span>{$locale === 'en' ? 'Age Group' : 'အသက်အုပ်စု'}</span>
						<select bind:value={newAge}>
							<option value="6-8">6-8</option>
							<option value="9-11">9-11</option>
							<option value="12-14">12-14</option>
							<option value="15-16">15-16</option>
							<option value="16+">16+</option>
						</select>
					</label>
					<label class="field">
						<span>{$locale === 'en' ? 'Class Code (optional)' : 'Class Code (မဖြစ်မနေ မဟုတ်)'}</span>
						<input type="text" bind:value={teacherCode} placeholder="PANDA-42" style="text-transform:uppercase" />
					</label>
					{#if error}<p class="error">{error}</p>{/if}
					<button class="btn btn-primary full-width" onclick={handleStudentRegister}>
						{$locale === 'en' ? 'Create Account' : 'အကောင့်ဖောက်မည်'}
					</button>
					<button class="btn btn-secondary full-width" onclick={() => { studentMode = 'select'; error = ''; }}>
						{t($locale, 'lesson.back')}
					</button>
				</div>
			{/if}

		<!-- ── TEACHER TAB ──────────────────────────────────────────────────── -->
		{:else}
			<div class="teacher-mode-tabs">
				<button class="mode-btn" class:active={teacherMode === 'login'} onclick={() => { teacherMode = 'login'; error = ''; }}>
					{$locale === 'en' ? 'Log In' : 'ဝင်မည်'}
				</button>
				<button class="mode-btn" class:active={teacherMode === 'signup'} onclick={() => { teacherMode = 'signup'; error = ''; }}>
					{$locale === 'en' ? 'Sign Up' : 'အကောင့်ဖောက်'}
				</button>
			</div>

			{#if teacherMode === 'login'}
				<div class="login-form">
					<label class="field">
						<span>{$locale === 'en' ? 'Email' : 'အီးမေးလ်'}</span>
						<input type="email" bind:value={tEmail} placeholder="teacher@school.edu" />
					</label>
					<label class="field">
						<span>{$locale === 'en' ? 'Password' : 'စကားဝှက်'}</span>
						<input type="password" bind:value={tPassword} onkeydown={(e) => e.key === 'Enter' && handleTeacherLogin()} placeholder="••••••••" />
					</label>
					{#if error}<p class="error">{error}</p>{/if}
					<button class="btn btn-primary full-width" onclick={handleTeacherLogin} disabled={tLoading}>
						{tLoading ? ($locale === 'en' ? 'Logging in...' : 'ဝင်နေသည်...') : ($locale === 'en' ? 'Log In' : 'ဝင်မည်')}
					</button>
				</div>

			{:else}
				<div class="login-form">
					<label class="field">
						<span>{$locale === 'en' ? 'Your Name' : 'သင့်နာမည်'}</span>
						<input type="text" bind:value={tName} placeholder="Daw Su" />
					</label>
					<label class="field">
						<span>{$locale === 'en' ? 'Email' : 'အီးမေးလ်'}</span>
						<input type="email" bind:value={tEmail} placeholder="teacher@school.edu" />
					</label>
					<label class="field">
						<span>{$locale === 'en' ? 'Password (min 6 chars)' : 'စကားဝှက် (အနည်းဆုံး ၆ လုံး)'}</span>
						<input type="password" bind:value={tPassword} placeholder="••••••••" />
					</label>
					{#if error}<p class="error">{error}</p>{/if}
					<button class="btn btn-primary full-width" onclick={handleTeacherSignUp} disabled={tLoading}>
						{tLoading
							? ($locale === 'en' ? 'Creating account...' : 'အကောင့်ဖောက်နေသည်...')
							: ($locale === 'en' ? 'Create Teacher Account' : 'ဆရာ/ဆရာမ အကောင့်ဖောက်မည်')}
					</button>
					<p class="signup-note">
						{$locale === 'en'
							? 'After signing up you\'ll get a class code to share with students.'
							: 'အကောင့်ဖောက်ပြီးနောက် ကျောင်းသားများနှင့် မျှဝေရန် class code ရပါမည်'}
					</p>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.login-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100dvh;
		padding: 1rem;
		background: var(--color-bg);
	}

	.login-card {
		width: 100%;
		max-width: 390px;
		padding: 2rem 1.5rem;
	}

	.login-header {
		text-align: center;
		margin-bottom: 1.25rem;
	}

	.logo-icon {
		font-size: 3rem;
		display: block;
		margin-bottom: 0.5rem;
	}

	h1 {
		font-size: 1.5rem;
		margin-bottom: 0.25rem;
	}

	.tagline {
		color: var(--color-text-secondary);
		font-size: 0.9rem;
	}

	.lang-row {
		margin-top: 0.75rem;
	}

	/* Role tabs */
	.tabs {
		display: flex;
		border: 1px solid var(--color-border);
		border-radius: 10px;
		overflow: hidden;
		margin-bottom: 1.25rem;
	}

	.tab-btn {
		flex: 1;
		padding: 0.6rem;
		font-size: 0.85rem;
		font-weight: 600;
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-text-secondary);
		transition: background 0.15s, color 0.15s;
	}

	.tab-btn.active {
		background: var(--color-primary);
		color: white;
	}

	/* Teacher login/signup mode sub-tabs */
	.teacher-mode-tabs {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.mode-btn {
		flex: 1;
		padding: 0.45rem;
		font-size: 0.82rem;
		font-weight: 600;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: 8px;
		cursor: pointer;
		color: var(--color-text-secondary);
		transition: background 0.15s, color 0.15s;
	}

	.mode-btn.active {
		background: var(--color-surface);
		color: var(--color-primary);
		border-color: var(--color-primary);
	}

	/* Student list */
	.student-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.student-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-surface);
		font-size: 1rem;
		font-weight: 500;
		text-align: left;
		transition: background 0.15s;
		cursor: pointer;
	}

	.student-btn:hover {
		background: var(--color-hover);
	}

	.avatar {
		font-size: 1.5rem;
	}

	/* Form */
	.login-form {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.selected-name {
		text-align: center;
		font-size: 1.2rem;
		font-weight: 600;
		padding: 0.5rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}

	.field input,
	.field select {
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-size: 1rem;
		background: var(--color-surface);
		color: var(--color-text);
	}

	.field input:focus,
	.field select:focus {
		outline: 2px solid var(--color-primary);
		outline-offset: -1px;
		border-color: var(--color-primary);
	}

	.error {
		color: var(--color-error);
		font-size: 0.85rem;
		text-align: center;
	}

	.full-width {
		width: 100%;
		justify-content: center;
	}

	.signup-note {
		font-size: 0.78rem;
		color: var(--color-text-secondary);
		text-align: center;
		line-height: 1.4;
	}
</style>
