/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#070809",
          800: "#0c0e11",
          700: "#13161b",
          600: "#1b1f26",
          500: "#262b34",
        },
        acid: {
          DEFAULT: "#c6f73a",
          400: "#d4ff5a",
          600: "#9fd313",
        },
        ember: "#ff5a3c",
      },
      fontFamily: {
        display: ['"Archivo"', "system-ui", "sans-serif"],
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        ultra: "0.35em",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%,100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "93%": { opacity: "0.4" },
          "94%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        bob: {
          "0%,100%": { transform: "translateY(0) rotate(var(--tilt, 0deg))" },
          "50%": { transform: "translateY(-12px) rotate(var(--tilt, 0deg))" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        scan: "scan 6s linear infinite",
        flicker: "flicker 5s linear infinite",
        marquee: "marquee 28s linear infinite",
        bob: "bob 5s ease-in-out infinite",
        "spin-slow": "spin-slow 16s linear infinite",
      },
    },
  },
  plugins: [],
};
