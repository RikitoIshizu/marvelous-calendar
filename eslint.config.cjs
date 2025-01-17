module.exports = [
	{
		ignores: [
			'.next/**/*',
			'node_modules/**/*',
			'tailwind.config.js',
			'next.config.js',
			'postcss.config.js',
		],
		files: ['**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			parser: require('@typescript-eslint/parser'),
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 13,
			},
			globals: {},
		},

		plugins: {
			react: require('eslint-plugin-react'),
			'react-hooks': require('eslint-plugin-react-hooks'),
			'jsx-a11y': require('eslint-plugin-jsx-a11y'),
		},

		rules: {
			...require('eslint-plugin-react').configs.recommended.rules,
			...require('eslint-plugin-react-hooks').configs.recommended.rules,
			...require('eslint-plugin-jsx-a11y').configs.recommended.rules,
			'react/react-in-jsx-scope': 'off',
			'react/jsx-props-no-spreading': 'off',
			'no-undef': 'error',
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'error',
			'jsx-a11y/anchor-is-valid': 'off',
			'no-unused-vars': 'error',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
];
