import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F6EFDE",
        "cream-deep": "#EBDFC2",
        paper: "#FCFAF2",
        navy: "#122B52",
        "navy-deep": "#0A1B38",
        "navy-soft": "#1F3E6E",
        gold: "#B8872E",
        "gold-soft": "#D9AD52",
        "gold-mist": "#E7CE95",
        ink: "#211E1A",
        "ink-soft": "#5A5548",
        "ink-faint": "#8B8474",
        line: "rgba(33,30,26,0.16)",
        "line-soft": "rgba(33,30,26,0.09)",
        bank: "#2C57A0",
        "bank-deep": "#1E3E7B",
        "bank-bg": "#EAEFF7",
        cash: "#A9635C",
        "cash-deep": "#7E453F",
        "cash-bg": "#F3E4DF",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(15,14,10,0.07)",
        header: "0 6px 20px rgba(6,10,22,0.24)",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        sealPop: {
          "0%": { transform: "scale(0.4)", opacity: "0" },
          "70%": { transform: "scale(1.08)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn .4s cubic-bezier(.3,0,.2,1)",
        sealPop: "sealPop .5s cubic-bezier(.2,1.4,.4,1)",
      },
    },
  },
  plugins: [],
};

export default config;
