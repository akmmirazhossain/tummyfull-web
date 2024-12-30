/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    fontFamily: {
      budge: ["Budge"],
      bebas: ["bebas"],
      poppins: ["poppins"],
      niljannati: ["nil-jannati"],
    },
  },
  darkMode: "class",
  daisyui: {
    themes: [
      {
        mycustomtheme: {
          primary: "#004225", // Your custom primary color
          secondary: "#f5f5dc", // Your custom secondary color
          accent: "#ffb000", // Accent color
          neutral: "#ffcf9d", // Neutral color
          "base-100": "#FFFFFF", // Background color
        },
      },
    ],
  },

  plugins: [nextui(), require("daisyui")],
};
