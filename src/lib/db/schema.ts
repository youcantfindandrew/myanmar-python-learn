import Dexie, { type Table } from 'dexie';

export interface LocalLesson {
	id: string;
	titleEn: string;
	titleMm: string;
	category: string;
	difficulty: number;
	ageGroupMin: string;
	orderIndex: number;
	prerequisites: string[];
	estimatedMinutes: number;
	sections: LessonSection[];
	problemIds: string[];
	version: number;
	cachedAt: number;
}

export interface LessonSection {
	type: 'explanation' | 'code_example' | 'try_it' | 'quiz';
	content?: { en: string; mm: string };
	code?: string;
	expectedOutput?: string;
	explanation?: { en: string; mm: string };
	runnable?: boolean;
	prompt?: { en: string; mm: string };
	starterCode?: string;
	validation?: { mustContain?: string[]; mustOutputSomething?: boolean };
	question?: { en: string; mm: string };
	options?: { en: string[]; mm: string[] };
	correct?: number;
}

export interface LocalProblem {
	id: string;
	lessonId: string;
	titleEn: string;
	titleMm: string;
	descriptionEn: string;
	descriptionMm: string;
	starterCode: string;
	testCases: TestCase[];
	hintsEn: string[];
	hintsMm: string[];
	difficulty: number;
	orderIndex: number;
	version: number;
}

export interface TestCase {
	input: string;
	expectedOutput: string;
	hidden: boolean;
}

export interface LocalProgress {
	id: string; // lessonId
	status: 'not_started' | 'in_progress' | 'completed';
	timeSpentSeconds: number;
	scrollPosition: number;
	startedAt: number | null;
	completedAt: number | null;
	updatedAt: number;
	synced: boolean;
}

export interface LocalAttempt {
	id: string;
	problemId: string;
	code: string;
	passed: boolean;
	testsPassed: number;
	testsTotal: number;
	errorMessage?: string;
	timeSpentSeconds: number;
	attemptedAt: number;
	synced: boolean;
}

export interface SyncQueueItem {
	id?: number;
	table: string;
	operation: 'upsert' | 'insert';
	data: any;
	createdAt: number;
	retries: number;
}

export interface UserProfile {
	id: string;
	displayName: string;
	role: 'student' | 'teacher';
	ageGroup: string;
	preferredLanguage: 'en' | 'mm';
	pinHash: string;
	teacherCode?: string;
	teacherId?: string;
	currentDifficultyLevel: number;
}

export interface DailyActivity {
	date: string; // YYYY-MM-DD
	lessonsTouched: number;
	problemsAttempted: number;
	problemsSolved: number;
	totalSeconds: number;
	synced: boolean;
}

class AppDatabase extends Dexie {
	lessons!: Table<LocalLesson>;
	problems!: Table<LocalProblem>;
	progress!: Table<LocalProgress>;
	attempts!: Table<LocalAttempt>;
	syncQueue!: Table<SyncQueueItem>;
	profiles!: Table<UserProfile>;
	dailyActivity!: Table<DailyActivity>;

	constructor() {
		super('myanmar-python-learn');
		this.version(1).stores({
			lessons: 'id, category, difficulty, orderIndex',
			problems: 'id, lessonId, difficulty, orderIndex',
			progress: 'id, status, synced',
			attempts: 'id, problemId, attemptedAt, synced',
			syncQueue: '++id, table, createdAt',
			profiles: 'id, role',
			dailyActivity: 'date, synced'
		});
	}
}

export const db = new AppDatabase();
