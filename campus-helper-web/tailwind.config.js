/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Naya Fade-Out Animation
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' }, // Upar jaate hue gayab hoga
        }
      },
      animation: {
        // 'forwards' lagana zaroori hai taaki animation khatam hone par text gayab hi rahe
        fadeIn: 'fadeIn 1s ease-out forwards',
        fadeInUp: 'fadeInUp 1s ease-out forwards',
        fadeOut: 'fadeOut 1s ease-in forwards',
      },
    },
  },
  plugins: [],
}