import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    include: ['test/unit/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules/**', 'test/e2e/**'],
    globals: true,
  },
});
