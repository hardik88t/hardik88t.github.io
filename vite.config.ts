import { defineConfig } from 'vite';

// Relative base so the static build works from any nested sub-path.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',
    chunkSizeWarningLimit: 900,
  },
  server: {
    host: '127.0.0.1',
    port: 3004,
  },
});
