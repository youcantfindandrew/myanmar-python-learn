// Use adapter-node locally (Windows symlink restriction).
// On Vercel (Linux), swap this import to '@sveltejs/adapter-vercel' — or set VERCEL=1 to auto-switch.
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),
		serviceWorker: {
			register: false // We register manually via vite-pwa
		}
	}
};

export default config;
