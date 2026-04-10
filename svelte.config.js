// adapter-auto picks adapter-vercel on Vercel CI (Linux) and adapter-node locally.
// This avoids the Windows symlink restriction with adapter-vercel.
import adapter from '@sveltejs/adapter-auto';

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
