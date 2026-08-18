import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './', // CRITICAL: Relative paths for Venus deployment
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2022', // Support top-level await for Venus SDK
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    minify: 'esbuild',
    sourcemap: false
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022' // Support top-level await in dev mode
    }
  },
  server: {
    port: 8081,
    open: true
  }
});
