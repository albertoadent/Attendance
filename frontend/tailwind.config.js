/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        secondaryBackground: "var(--secondary-background)",
        foreground: "var(--foreground)",
        secondaryForeground: "var(--secondary-foreground)",
        accent: "var(--accent)",
        card: "var(--card)",
      },
    },
  },
  plugins: [],
};
