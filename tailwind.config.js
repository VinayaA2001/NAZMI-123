// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6D7E5F',
        secondary: '#92A079',
        background: '#E8E9E0',
        text: '#2C2C2C',
      },
    },
  },
  plugins: [],
}