import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true, // Jest のようなグローバルなテスト API を使いたいので
		environment: 'jsdom',
	},
});
