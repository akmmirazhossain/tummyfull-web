/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
          primary: "#004225",
          secondary: "#f5f5dc",
          accent: "#ffb000",
          neutral: "#ffcf9d",
          "base-100": "#FFFFFF",
        },
      },
    ],
  },

  plugins: [],
};
