import type { Config } from "tailwindcss";
import { safelist } from "./utils/safelist";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  safelist,
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        deepBlue: {
          50: "#e5f0ff", // Very light blue (almost white with a subtle blue tint)
          100: "#cce1ff", // Light blue (soft and fresh for dark mode contrast)
          200: "#99c2ff", // Light sky blue (calming and fresh)
          300: "#66a2ff", // Sky blue (clear and vibrant)
          400: "#3383ff", // Bright blue (energetic and noticeable)
          500: "#006efe", // Deep blue (central color, vibrant and bold)
          600: "#0059cc", // Deeper blue (stronger and more intense)
          700: "#004499", // Dark blue (rich and professional)
          800: "#003366", // Very dark blue (bold and deep)
          900: "#001f4d", // Darker blue (great for dark mode accents)
          950: "#000f26", // Near-black blue (deep and subtle, perfect for dark mode)
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "10%": { transform: "scale(1.12)", opacity: "0.8" }, // Quick pulse (scale up)
          "20%": { transform: "scale(1.06)", opacity: "1" }, // Back to normal
          "30%": { transform: "scale(1.1)", opacity: "1" }, // Back to normal
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        heartbeat: "heartbeat 1.5s ease-in-out infinite", // Adjust duration to simulate heartbeat rhythm
        "fade-in": "fade-in 0.3s ease-out",
      },
      maxWidth: { "screen-lg": "1100px" },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
