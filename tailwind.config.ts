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
        foreground: "var(--foreground)",
        primaryFg: "var(--primary-foreground)",
        primarBg: "(--primary-background)",
        redFg: "(--red-foreground)",
        redBg: "(--red-background)",
        greenFg: "(--green-foreground)",
        greenBg: "(--green-background)",
        yellowFg: "(--yellow-foreground)",
        yellowBg: "(--yellow-background)",
        whiteBg: "(--background-white)",
      },
    },
  },
  plugins: [],
} satisfies Config;
