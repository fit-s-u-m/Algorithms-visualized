/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./main.ts"],
  theme: {
    extend: {
      colors: {
        'accent-red': '#fb4934',
        'accent-green': '#b8bb26',
        'accent-blue': '#83a598',
        'accent-purple': '#d3869b',
        'accent-aqua': '#8ec07c',
        'accent-orange': '#fe8019',
        'accent-light':'#f2e5bc',
        'primary-color': {
          50:  '#fbf1c7',
          100: '#f7e3a5',
          200: '#f2d88c',
          300: '#ead124', // example Gruvbox gold
          400: '#d69f21',
          500: '#af792c',
          600: '#926f34',
          700: '#7a6234',
          800: '#665c34',
          900: '#50402f',
          950: '#322b1f',
        },
        'background-color': {
          50:  '#fbf1c7',
          100: '#ebdbb2',
          200: '#d3c1a3',
          300: '#bdae96',
          400: '#a18f81',
          500: '#847464',
          600: '#6c6252',
          700: '#5c5045',
          800: '#3c3836',
          900: '#282828',
          950: '#1d2021',
        },
      },
    },
  },
	plugins: [require('daisyui')],
}

