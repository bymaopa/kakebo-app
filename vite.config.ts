import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    target: 'esnext',
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: ['svelte', '@tauri-apps/api', '@tauri-apps/plugin-fs']
  }
});
