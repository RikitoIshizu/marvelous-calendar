import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	// Vitest の設定はここに含めることができます
	test: {
		globals: true, // Jest のようなグローバルなテスト API を使いたい場合
		environment: 'jsdom', // DOM 操作のテストの場合は 'jsdom'、Node.js のテストなら 'node'
		// その他の Vitest 固有の設定を必要に応じて追加
	},
});
