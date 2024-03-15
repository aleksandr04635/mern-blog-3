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
        "active-bg": "#f2faff",
        "dark-main-bg": "#10172a",
        "dark-additional-bg": "#1f2937",
        "secondary-border": "#6366F1",
        "light-additional-bg": "#ffffff",
        "main-border": "#078493",
        "layout-border": "#0a5b6b",
        "additional-text": "#374151",
        "dark-additional-text": "#E5E7EB",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
};
// "#151e37", "#e6ffff" #e6fdff   "#e6faff"  "#F0FDFA"  #ECFDF5 #e6ffff
//#efffff "secondary-border": "#a855f7", #8B5CF6  #cce4fd
//"layout-border": "#6B7280",
