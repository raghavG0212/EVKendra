/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      screens: {
        "880px": "880px",
        "1016px": "1016px",
        "1096.5px": "1096.5px",
        "450px": "450px",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
