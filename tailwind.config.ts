import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        panelBg: "#0a0f1e",
        panelCard: "#1e293b",
        panelAccent: "#f59e0b"
      }
    }
  },
  plugins: [forms]
};

export default config;
