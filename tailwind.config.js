/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        'custom-gradient': "linear-gradient(309deg, rgba(84,141,196,1) 0%, rgba(15,23,42,1) 100%)",
        'top-left': "linear-gradient(180deg, rgba(97,161,132,1) 0%, rgba(145,194,172,1) 100%);",
        'top-right': "linear-gradient(180deg, rgba(239,141,117,1) 0%, rgba(209,167,156,1) 100%);",
        'bottom-left': "linear-gradient(180deg, rgba(70,114,211,1) 0%, rgba(113,148,226,1) 100%);",
        'bottom-right': "linear-gradient(180deg, rgba(243,103,107,1) 0%, rgba(246,162,164,1) 100%);",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        'border-default': 'hsl(0deg 0% 18%;)'
      },
    },
  },
  plugins: [],
};
