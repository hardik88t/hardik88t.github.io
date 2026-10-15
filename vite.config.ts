import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative asset URLs so the build works from any sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
