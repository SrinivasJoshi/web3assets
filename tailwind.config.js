/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			colors: {
				purple: '#5524e7',
				yellow: '#fec231',
				black: '#010101',
			},
			fontFamily: {
				sans: ['Poppins, sans-serif'],
				serif: ['Raleway,serfif'],
			},
		},
	},
	plugins: [],
};
