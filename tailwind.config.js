/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: '#39ff14',
        neonRed: '#ff073a',
        neonBlue: '#00f3ff',
        cyberBlack: '#050505',
        cyberGray: '#121212'
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'], // Cyberpunk feel
      },
      boxShadow: {
        'neon-green': '0 0 10px #39ff14, 0 0 20px #39ff14',
        'neon-red': '0 0 10px #ff073a, 0 0 20px #ff073a',
      }
    },
  },
  plugins: [],
}
