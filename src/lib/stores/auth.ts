import { writable, derived } from 'svelte/store';
import { db, type UserProfile } from '$lib/db/schema';

export const currentUser = writable<UserProfile | null>(null);
export const isLoggedIn = derived(currentUser, ($user) => $user !== null);
export const isTeacher = derived(currentUser, ($user) => $user?.role === 'teacher');

export async function loginWithPin(displayName: string, pin: string): Promise<boolean> {
	const profiles = await db.profiles.toArray();
	const user = profiles.find((p) => p.displayName === displayName);
	if (!user) return false;

	const hash = await hashPin(pin);
	if (user.pinHash !== hash) return false;

	currentUser.set(user);
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('currentUserId', user.id);
	}
	return true;
}

export async function createStudent(
	displayName: string,
	pin: string,
	ageGroup: string
): Promise<UserProfile> {
	const hash = await hashPin(pin);
	const profile: UserProfile = {
		id: crypto.randomUUID(),
		displayName,
		role: 'student',
		ageGroup,
		preferredLanguage: 'mm',
		pinHash: hash,
		currentDifficultyLevel: 1
	};
	await db.profiles.put(profile);
	currentUser.set(profile);
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('currentUserId', profile.id);
	}
	return profile;
}

export async function restoreSession(): Promise<void> {
	if (typeof localStorage === 'undefined') return;
	const userId = localStorage.getItem('currentUserId');
	if (!userId) return;
	const user = await db.profiles.get(userId);
	if (user) currentUser.set(user);
}

export function logout(): void {
	currentUser.set(null);
	if (typeof localStorage !== 'undefined') {
		localStorage.removeItem('currentUserId');
	}
}

async function hashPin(pin: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(pin + 'myanmar-python-learn-salt');
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
