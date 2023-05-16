/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/frontend/index.html", "./src/frontend/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "business"],
  },
}
