import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss';

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fademovein: {
          '0%': {
            transform: 'scale(0.75)',
            opacity: '0',
          },
          '60%': {
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1.0',
          },
        }
      },
      animation: {
        fademovein: 'fademovein 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;


