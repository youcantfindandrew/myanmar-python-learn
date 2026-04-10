import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Myanmar Python Learn',
				short_name: 'PyLearn',
				description: 'Learn Python offline — built for Myanmar students',
				theme_color: '#2563eb',
				background_color: '#ffffff',
				display: 'standalone',
				scope: '/',
				start_url: '/',
				icons: [
					{
						src: '/icons/icon-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icons/icon-512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,woff2,json,svg,png}'],
				runtimeCaching: [
					{
						urlPattern: /\/api\//,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'api-cache',
							expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }
						}
					}
				],
				navigateFallback: null
			},
			devOptions: {
				enabled: false
			}
		})
	]
});
