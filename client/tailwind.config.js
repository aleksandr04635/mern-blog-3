/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-active-bg": "#1c284a",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
};
// "#151e37",
