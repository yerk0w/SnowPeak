import { defineConfig } from 'vite';
export default defineConfig({
  base: '/SnowPeak/',
  server: { proxy: { '/api': 'http://localhost:3001' } }
});
