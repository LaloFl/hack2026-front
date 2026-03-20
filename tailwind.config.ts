import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'light-teal': '#04A28F',
        'blue': '#0057F0',
        'dark-teal': '#334F68',
        'yellow': '#FDC86E',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(to right, #04A28F, #0057F0)',
      },
    },
  },
  plugins: [],
} satisfies Config;
