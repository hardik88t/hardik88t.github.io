import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: { host: '127.0.0.1', port: 3002, strictPort: true },
	preview: { host: '127.0.0.1', port: 3002, strictPort: true }
});
