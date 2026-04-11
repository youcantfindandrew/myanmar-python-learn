/// <reference lib="webworker" />

let pyodide: any = null;

const EXECUTION_TIMEOUT_MS = 10_000;
const MAX_OUTPUT_LENGTH = 10_000;

self.onmessage = async (event: MessageEvent) => {
	const { type, code, id } = event.data;

	if (type === 'init') {
		try {
			const pyodideModule = await import(
				// @ts-ignore — external URL import in module worker
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
			// Normalise: ensure code is never empty so the try: block always has a body.
			const safeCode = (code ?? '').trim() || 'pass';

			// Stub input() so examples that use it don't hang — return empty string.
			const inputStub = event.data.inputs
				? `import builtins as _bi\n_inputs = ${JSON.stringify(String(event.data.inputs).split('\n'))}\n_idx = 0\ndef _fake_input(prompt=''):\n    global _idx\n    val = _inputs[_idx] if _idx < len(_inputs) else ''\n    _idx += 1\n    return val\n_bi.input = _fake_input\n`
				: `import builtins as _bi\n_bi.input = lambda prompt='': ''\n`;

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

${inputStub}
_err_msg = ''
try:
    pass  # sentinel — ensures try block is never empty even if user code is blank
${safeCode.split('\n').map((line: string) => '    ' + line).join('\n')}
except Exception as _e:
    import traceback as _tb
    # Show only the last part of traceback (skip Pyodide internals)
    lines = _tb.format_exc().strip().split('\\n')
    # Find the first line that references '<exec>' (user code) or just take last 3 lines
    user_lines = [l for l in lines if '<exec>' in l or not l.startswith('  File "/lib/')]
    if not user_lines:
        user_lines = lines[-3:]
    _err_msg = '\\n'.join(user_lines)
    print(_err_msg, file=sys.stderr)

sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
(_stdout.getvalue(), _stderr.getvalue())
`;

			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Code took too long (10 second limit)')), EXECUTION_TIMEOUT_MS)
			);

			const runPromise = pyodide.runPythonAsync(wrappedCode);
			const result = await Promise.race([runPromise, timeoutPromise]) as any;

			const stdout = result.get(0) || '';
			const stderr = result.get(1) || '';
			result.destroy();

			pyodide.runPython('import gc; gc.collect()');

			self.postMessage({
				type: 'result',
				id,
				stdout,
				stderr,
				error: stderr || null
			});
		} catch (err: any) {
			// This catches wrapper-level errors (e.g. timeout, or a bug in our wrapper).
			// Try to strip Pyodide internal paths from the message.
			let msg = err.message || 'Unknown error';
			// Remove long pyodide internal tracebacks from JS-level errors
			const execIdx = msg.indexOf('File "<exec>"');
			if (execIdx !== -1) {
				msg = msg.slice(execIdx);
			}
			self.postMessage({
				type: 'result',
				id,
				stdout: '',
				stderr: '',
				error: msg
			});
		}
	}
};
