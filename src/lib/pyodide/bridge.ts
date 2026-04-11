import { writable } from 'svelte/store';

export type PyodideStatus = 'idle' | 'loading' | 'ready' | 'error';

export const pyodideStatus = writable<PyodideStatus>('idle');
export const pyodideLoadProgress = writable(0);

let worker: Worker | null = null;
let initPromise: Promise<void> | null = null;
let messageId = 0;
const pendingCallbacks = new Map<number, {
	resolve: (value: any) => void;
	reject: (reason: any) => void;
}>();

export async function initPyodide(): Promise<void> {
	// If already initialised or initialising, return the same promise so
	// multiple callers all wait for the same load rather than racing.
	if (initPromise) return initPromise;
	if (worker) return;

	pyodideStatus.set('loading');
	pyodideLoadProgress.set(10);

	worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

	worker.onmessage = (event: MessageEvent) => {
		const { type, id, ...data } = event.data;

		if (type === 'ready') {
			pyodideStatus.set('ready');
			pyodideLoadProgress.set(100);
			const cb = pendingCallbacks.get(id);
			if (cb) {
				cb.resolve(undefined);
				pendingCallbacks.delete(id);
			}
			return;
		}

		if (type === 'result' || type === 'error') {
			const cb = pendingCallbacks.get(id);
			if (cb) {
				if (type === 'error') {
					cb.reject(new Error(data.error));
				} else {
					cb.resolve(data);
				}
				pendingCallbacks.delete(id);
			}
		}
	};

	worker.onerror = (err) => {
		pyodideStatus.set('error');
		console.error('Pyodide worker error:', err);
	};

	const id = ++messageId;
	initPromise = new Promise((resolve, reject) => {
		pendingCallbacks.set(id, { resolve, reject });
		worker!.postMessage({ type: 'init', id });
		pyodideLoadProgress.set(30);
	});
	return initPromise;
}

export async function runPython(code: string): Promise<{ stdout: string; stderr: string; error: string | null }> {
	if (!worker) {
		throw new Error('Pyodide not initialized');
	}

	const id = ++messageId;
	return new Promise((resolve, reject) => {
		pendingCallbacks.set(id, { resolve, reject });
		worker!.postMessage({ type: 'run', code, id });
	});
}

export function terminatePyodide(): void {
	if (worker) {
		worker.terminate();
		worker = null;
		pyodideStatus.set('idle');
		pyodideLoadProgress.set(0);
		pendingCallbacks.clear();
	}
}
