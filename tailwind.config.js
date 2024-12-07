/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': {
          tea: '#dff6ca',       // (223,246,202)
          lime: '#d0e6a6',      // (208,230,166)
          sage: '#bfd37a',      // (191,211,122)
          teal: '#89b2ae',      // (137,178,174)
          steel: '#5b818e',     // (91,129,142)
          navy: '#234257',      // (35,66,87)
        }
      },
      fontFamily: {
        'sue-ellen': ['"Sue Ellen Francisco"', 'cursive'],
      },
    },
  },
  plugins: [],
};