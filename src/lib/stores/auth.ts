import { writable, derived } from 'svelte/store';
import { db, type UserProfile } from '$lib/db/schema';
import { supabase } from '$lib/db/supabase';
import { upsertProfile } from '$lib/db/sync-engine';

export const currentUser = writable<UserProfile | null>(null);
export const isLoggedIn = derived(currentUser, ($u) => $u !== null);
export const isTeacher = derived(currentUser, ($u) => $u?.role === 'teacher');

// ── Student auth (PIN-based, offline-capable) ────────────────────────────────

export async function loginWithPin(displayName: string, pin: string): Promise<boolean> {
	const profiles = await db.profiles.toArray();
	const user = profiles.find(
		(p) => p.displayName === displayName && p.role === 'student'
	);
	if (!user) return false;

	const hash = await hashPin(pin);
	if (user.pinHash !== hash) return false;

	currentUser.set(user);
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('currentUserId', user.id);
		localStorage.setItem('currentUserRole', 'student');
	}
	return true;
}

export async function createStudent(
	displayName: string,
	pin: string,
	ageGroup: string,
	teacherCode?: string
): Promise<UserProfile> {
	const hash = await hashPin(pin);

	// Resolve teacher from class code (online only)
	let teacherId: string | undefined;
	if (teacherCode) {
		const { data } = await supabase
			.from('profiles')
			.select('id')
			.eq('teacher_code', teacherCode.toUpperCase())
			.single();
		if (data) teacherId = data.id;
	}

	const profile: UserProfile = {
		id: crypto.randomUUID(),
		displayName,
		role: 'student',
		ageGroup,
		preferredLanguage: 'mm',
		pinHash: hash,
		currentDifficultyLevel: 1
	};
	if (teacherId) profile.teacherId = teacherId;

	await db.profiles.put(profile);
	currentUser.set(profile);

	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('currentUserId', profile.id);
		localStorage.setItem('currentUserRole', 'student');
	}

	// Sync to server if online
	await upsertProfile({
		id: profile.id,
		display_name: profile.displayName,
		role: 'student',
		age_group: profile.ageGroup,
		preferred_language: 'mm',
		teacher_id: teacherId
	}).catch(() => {});

	return profile;
}

// ── Teacher auth (Supabase email/password) ───────────────────────────────────

export async function teacherSignUp(email: string, password: string, name: string): Promise<{ error: string | null }> {
	const { data, error } = await supabase.auth.signUp({ email, password });
	if (error) return { error: error.message };

	const teacherCode = generateTeacherCode();
	const userId = data.user!.id;

	// Store in Supabase profiles
	await supabase.from('profiles').upsert({
		id: userId,
		display_name: name,
		role: 'teacher',
		age_group: '',
		preferred_language: 'en',
		teacher_code: teacherCode
	});

	// Store locally
	const localProfile: UserProfile = {
		id: userId,
		displayName: name,
		role: 'teacher',
		ageGroup: '',
		preferredLanguage: 'en',
		pinHash: '',
		teacherCode,
		currentDifficultyLevel: 0
	};
	await db.profiles.put(localProfile);
	currentUser.set(localProfile);

	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('currentUserId', userId);
		localStorage.setItem('currentUserRole', 'teacher');
	}
	return { error: null };
}

export async function teacherLogin(email: string, password: string): Promise<{ error: string | null }> {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) return { error: error.message };

	const userId = data.user!.id;

	// Fetch profile from Supabase
	const { data: profile } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single();

	if (!profile) return { error: 'Profile not found' };

	const localProfile: UserProfile = {
		id: userId,
		displayName: profile.display_name,
		role: 'teacher',
		ageGroup: profile.age_group ?? '',
		preferredLanguage: profile.preferred_language ?? 'en',
		pinHash: '',
		teacherCode: profile.teacher_code,
		currentDifficultyLevel: 0
	};
	await db.profiles.put(localProfile);
	currentUser.set(localProfile);

	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('currentUserId', userId);
		localStorage.setItem('currentUserRole', 'teacher');
	}
	return { error: null };
}

// ── Session restore ──────────────────────────────────────────────────────────

export async function restoreSession(): Promise<void> {
	if (typeof localStorage === 'undefined') return;
	const userId = localStorage.getItem('currentUserId');
	const role = localStorage.getItem('currentUserRole');
	if (!userId) return;

	// For teachers: also restore Supabase session
	if (role === 'teacher') {
		const { data } = await supabase.auth.getSession();
		if (data.session) {
			// Session valid — re-fetch profile
			const localProfile = await db.profiles.get(userId);
			if (localProfile) { currentUser.set(localProfile); return; }
		}
	}

	const user = await db.profiles.get(userId);
	if (user && user.id !== '__seed_meta__') currentUser.set(user);
}

export function logout(): void {
	currentUser.set(null);
	supabase.auth.signOut().catch(() => {});
	if (typeof localStorage !== 'undefined') {
		localStorage.removeItem('currentUserId');
		localStorage.removeItem('currentUserRole');
	}
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function hashPin(pin: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(pin + 'myanmar-python-learn-salt');
	const buf = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

function generateTeacherCode(): string {
	const words = ['PANDA', 'EAGLE', 'TIGER', 'COBRA', 'LOTUS', 'RIVER', 'MANGO', 'FLAME'];
	const word = words[Math.floor(Math.random() * words.length)];
	const num = Math.floor(10 + Math.random() * 90);
	return `${word}-${num}`;
}
