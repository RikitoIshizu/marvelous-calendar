const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'media', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				teal: colors.teal,
				hobby: {
					100: '#001871',
					200: '#ff585d',
					300: '#ffb549',
					400: '#41b6e6',
				},
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
