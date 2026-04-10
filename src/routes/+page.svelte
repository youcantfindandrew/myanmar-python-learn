<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser, createStudent, loginWithPin } from '$lib/stores/auth';
	import { locale } from '$lib/stores/locale';
	import { t } from '$lib/i18n';
	import { db } from '$lib/db/schema';
	import LanguageToggle from '$lib/components/layout/LanguageToggle.svelte';

	let students = $state<{ id: string; displayName: string }[]>([]);
	let mode = $state<'select' | 'login' | 'register'>('select');
	let selectedName = $state('');
	let pin = $state('');
	let error = $state('');
	let newName = $state('');
	let newPin = $state('');
	let newAge = $state('11-15');

	$effect(() => {
		if ($currentUser) {
			goto('/student');
		}
	});

	$effect(() => {
		loadStudents();
	});

	async function loadStudents() {
		const profiles = await db.profiles.where('role').equals('student').toArray();
		students = profiles.map((p) => ({ id: p.id, displayName: p.displayName }));
	}

	async function handleLogin() {
		error = '';
		const success = await loginWithPin(selectedName, pin);
		if (success) {
			goto('/student');
		} else {
			error = t($locale, 'auth.wrongPin');
		}
	}

	async function handleRegister() {
		if (!newName.trim() || !newPin.trim()) return;
		await createStudent(newName.trim(), newPin, newAge);
		goto('/student');
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

		{#if mode === 'select'}
			{#if students.length > 0}
				<div class="student-list">
					{#each students as student}
						<button
							class="student-btn"
							onclick={() => { selectedName = student.displayName; mode = 'login'; }}
						>
							<span class="avatar">👤</span>
							{student.displayName}
						</button>
					{/each}
				</div>
			{/if}
			<button class="btn btn-primary full-width" onclick={() => { mode = 'register'; }}>
				{students.length > 0 ? '+ New Student' : t($locale, 'auth.login')}
			</button>

		{:else if mode === 'login'}
			<div class="login-form">
				<p class="selected-name">👤 {selectedName}</p>
				<label class="field">
					<span>{t($locale, 'auth.enterPin')}</span>
					<input
						type="password"
						inputmode="numeric"
						maxlength="6"
						bind:value={pin}
						onkeydown={(e) => e.key === 'Enter' && handleLogin()}
						placeholder="••••"
					/>
				</label>
				{#if error}
					<p class="error">{error}</p>
				{/if}
				<button class="btn btn-primary full-width" onclick={handleLogin}>
					{t($locale, 'auth.login')}
				</button>
				<button class="btn btn-secondary full-width" onclick={() => { mode = 'select'; pin = ''; error = ''; }}>
					{t($locale, 'lesson.back')}
				</button>
			</div>

		{:else}
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
				<button class="btn btn-primary full-width" onclick={handleRegister}>
					{t($locale, 'auth.login')}
				</button>
				<button class="btn btn-secondary full-width" onclick={() => { mode = 'select'; }}>
					{t($locale, 'lesson.back')}
				</button>
			</div>
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
		max-width: 380px;
		padding: 2rem 1.5rem;
	}

	.login-header {
		text-align: center;
		margin-bottom: 1.5rem;
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
	}

	.student-btn:hover {
		background: var(--color-hover);
	}

	.avatar {
		font-size: 1.5rem;
	}

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

	.field input, .field select {
		padding: 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-size: 1rem;
		background: var(--color-surface);
	}

	.field input:focus, .field select:focus {
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
</style>
