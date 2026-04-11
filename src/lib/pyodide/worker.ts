/// <reference lib="webworker" />

let pyodide: any = null;

const EXECUTION_TIMEOUT_MS = 10_000;
const MAX_OUTPUT_LENGTH = 10_000;

self.onmessage = async (event: MessageEvent) => {
	const { type, code, id } = event.data;

	if (type === 'init') {
		try {
			// Use ESM dynamic import — importScripts is not available in module workers
			const pyodideModule = await import(
				// @ts-ignore — external URL import
				'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.mjs'
			);
			pyodide = await pyodideModule.loadPyodide();
			self.postMessage({ type: 'ready', id });
		} catch (err: any) {
			self.postMessage({ type: 'error', id, error: `Failed to load Python: ${err.message}` });
		}
		return;
	}

	if (type === 'run') {
		if (!pyodide) {
			self.postMessage({ type: 'error', id, error: 'Python is not loaded yet' });
			return;
		}

		try {
			const wrappedCode = `
import sys
from io import StringIO

class _LimitedOutput(StringIO):
    def __init__(self, max_len=${MAX_OUTPUT_LENGTH}):
        super().__init__()
        self.max_len = max_len
    def write(self, s):
        if self.tell() + len(s) > self.max_len:
            super().write(s[:self.max_len - self.tell()])
            raise RuntimeError("Output too long! You might have an infinite loop.")
        return super().write(s)

_stdout = _LimitedOutput()
_stderr = _LimitedOutput()
sys.stdout = _stdout
sys.stderr = _stderr

try:
${code.split('\n').map((line: string) => '    ' + line).join('\n')}
except Exception as _e:
    print(str(_e), file=sys.stderr)

_result_stdout = _stdout.getvalue()
_result_stderr = _stderr.getvalue()
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
(_result_stdout, _result_stderr)
`;

			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Code took too long (10 second limit)')), EXECUTION_TIMEOUT_MS)
			);

			const runPromise = pyodide.runPythonAsync(wrappedCode);
			const result = await Promise.race([runPromise, timeoutPromise]) as any;

			const stdout = result.get(0) || '';
			const stderr = result.get(1) || '';
			result.destroy();

			// Garbage collect
			pyodide.runPython('import gc; gc.collect()');

			self.postMessage({
				type: 'result',
				id,
				stdout,
				stderr,
				error: stderr || null
			});
		} catch (err: any) {
			self.postMessage({
				type: 'result',
				id,
				stdout: '',
				stderr: '',
				error: err.message || 'Unknown error'
			});
		}
	}
};
