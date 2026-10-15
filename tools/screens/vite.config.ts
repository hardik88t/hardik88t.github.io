import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev-only harness config. Serves on 127.0.0.1 only.
export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1' },
});
