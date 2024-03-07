/** @type {import('tailwindcss').Config} */
export default {
  //module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-active-bg": "#1c284a",
        "active-bg": "#e6faff",
        "secondary-border": "#a855f7",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
};
// "#151e37", "#e6ffff" #e6fdff
