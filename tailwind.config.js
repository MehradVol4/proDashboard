/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  // You already have global styles + styled-components resets.
  // Disabling preflight avoids Tailwind overriding them.
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

